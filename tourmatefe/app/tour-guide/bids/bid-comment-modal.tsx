import { FormEvent, useContext, useEffect, useState, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useQuery, useMutation } from "@tanstack/react-query";
import SafeImage from "@/components/safe-image";
import InfiniteScroll from "react-infinite-scroll-component";
import { TourBidCommentCreateModel, TourBidCommentListResult } from "@/types/tour-bid-comment";
import { getTourBidCommentsFrom, addTourBidComment, updateTourBidComment, deleteTourBidComment } from "@/app/api/tour-bid-comment";
import { FaRegPaperPlane } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import ClickAwayListener from "react-click-away-listener";
import { cn } from "@/lib/utils";
import dayjs from "dayjs";
import DeleteModal from "@/components/delete-modal";
import { TourGuideSiteContext, TourGuideSiteContextProps } from "../context";

type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tourBidId: number
};

const baseData: TourBidCommentCreateModel = {
    accountId: 0,
    tourBidId: 0,
    content: ""
}
const cacheInit: TourBidCommentListResult = {
    commentId: 0,
    accountId: 0,
    tourBidId: 0,
    content: "",
    createdAt: "",
    image: "",
    fullName: ""
}

const BidCommentModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBidId
}) => {
    const pageSize = 20
    const { accId } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
    const [page, setPage] = useState(1)
    const [comments, setComments] = useState<TourBidCommentListResult[]>([])
    const scrollableDivRef = useRef<HTMLDivElement>(null)
    const modalRef = useRef<HTMLDivElement>(null)
    const [changeDataFor, setChangeDataFor] = useState({
        id: -1,
        value: '',
        mode: 0, //0 = none, 1 = edit, 2 = delete
    })
    const [updateCache, setUpdateCache] = useState<TourBidCommentListResult>(cacheInit)


    // Calculate and handle scrollbar width
    useEffect(() => {
        if (isOpen) {
            // Calculate scrollbar width
            const width = window.innerWidth - document.documentElement.clientWidth

            // Apply styles to prevent shifting
            document.body.style.overflow = 'hidden'
            document.body.style.paddingRight = `${width}px`

            return () => {
                document.body.style.overflow = ''
                document.body.style.paddingRight = ''
            }
        }
    }, [isOpen])

    const commentData = useQuery({
        queryKey: ['comments-of', tourBidId, pageSize, page],
        queryFn: () => getTourBidCommentsFrom(tourBidId, page, pageSize),
        staleTime: 60 * 1000
    })

    const addCommentMutation = useMutation({
        mutationFn: (comment: TourBidCommentCreateModel) => addTourBidComment(comment),
        onSuccess: () => {
            setFormData({ ...baseData, accountId: accId, tourBidId: tourBidId })
            setPage(1)
            setComments([])
            commentData.refetch()
        }
    })
    const updateCommentMutation = useMutation({
        mutationFn: (comment: TourBidCommentListResult) => updateTourBidComment(comment),
        onSuccess: () => {
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.commentId === updateCache.commentId ? updateCache : comment
                )
            );
            setChangeDataFor({ id: -1, value: '', mode: 0 });
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => deleteTourBidComment(commentId),
        onSuccess: () => {
            setComments(prevComments =>
                prevComments.filter(comment => comment.commentId !== changeDataFor.id)
            );
            setChangeDataFor({ id: -1, value: '', mode: 0 });
        }
    });

    const handleUpdateComment = () => {
        if (changeDataFor.value.trim() && changeDataFor.id !== -1) {
            const originalComment = comments.find(c => c.commentId === changeDataFor.id);
            if (!originalComment) { return; }
            const updatedComment: TourBidCommentListResult = {
                ...originalComment,
                content: changeDataFor.value,
                // Include any other required fields from the original comment
            };
            setUpdateCache(updatedComment)
            updateCommentMutation.mutate(updatedComment);
        }
    };
    const handleClickAway = () => {
        if (changeDataFor.id !== -1) {
            setChangeDataFor({ id: -1, value: '', mode: 0 });
        }
    };

    const [formData, setFormData] = useState(baseData)

    useEffect(() => {
        setComments([])
        setFormData(p => ({ ...p, accountId: accId, tourBidId: tourBidId }))
        setPage(1)
    }, [accId, tourBidId])

    useEffect(() => {
        if (!commentData.data) { return; }
        if (page === 1) {
            setComments(commentData.data.result);
        } else {
            setComments(prev => [...prev, ...commentData.data.result]);
        }
    }, [commentData.data, page]);

    const totalPage = commentData.data?.totalPage ?? 0

    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        addCommentMutation.mutate(formData)
    }


    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
        >
            <div
                className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"}`}
                onClick={onClose}
            ></div>

            <div
                ref={modalRef}
                className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[91vh] overflow-y-auto"
            >
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Bình luận
                    </h3>
                    <button
                        type="button"
                        className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <svg
                            className="w-5 h-5"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                clipRule="evenodd"
                            ></path>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div
                    ref={scrollableDivRef}
                    className="max-h-[75vh] overflow-y-auto"
                    id="scrollableDiv"
                    onScroll={(e) => {
                        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
                        if (scrollHeight - scrollTop === clientHeight && totalPage !== 0 && page < totalPage) {
                            setPage(p => Math.min(p + 1, totalPage))
                        }
                    }}
                >
                    <InfiniteScroll
                        dataLength={comments.length}
                        next={() => { }}
                        hasMore={page < totalPage}
                        loader={
                            <div className="flex justify-center py-4">
                                <p>Loading more comments...</p>
                            </div>
                        }

                        scrollableTarget="scrollableDiv"
                        // Remove the style prop or change to:
                        style={{ overflow: 'visible' }}
                    >
                        {comments.map((v) => (
                            <div key={v.commentId} className="mb-4 overflow-x-hidden">
                                <div className="flex w-full gap-2 items-start"> {/* Changed to items-start for better alignment */}
                                    <SafeImage src={v.image} alt="pfp" className="w-[65px] h-[65px] rounded-full flex-shrink-0" />

                                    <div className="flex-1 min-w-0"> {/* Container for both comment and edit input */}
                                        {/* Comment text container - always present but conditionally shown */}
                                        <div
                                            className={cn(`bg-[#F8FAFC] p-2 rounded-sm`, (changeDataFor.id !== v.commentId || changeDataFor.mode !== 1) ? 'block' : 'hidden')}
                                        >
                                            <p className="text-lg font-semibold">
                                                {v.fullName}
                                            </p>
                                            <p className={cn("break-words overflow-wrap-anywhere whitespace-pre-wrap",

                                            )}>
                                                {v.content}
                                            </p>
                                        </div>
                                        <p className={cn(
                                            "text-sm ml-2",
                                            (changeDataFor.id !== v.commentId || changeDataFor.mode !== 1) ? 'block' : 'hidden'
                                        )}>{dayjs(v.createdAt).format('DD [tháng] MM, YYYY')}</p>
                                        {/* Edit input container - always present but conditionally shown */}
                                        {changeDataFor.id === v.commentId && changeDataFor.mode === 1 && (
                                            <ClickAwayListener onClickAway={handleClickAway}>
                                                <div className="rounded-sm p-2"> {/* Same styling as comment container */}
                                                    <div className="flex gap-2 w-full">
                                                        <input
                                                            autoFocus
                                                            className={cn(
                                                                "bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg",
                                                                "focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5",
                                                                "dark:bg-gray-700 dark:border-gray-600 dark:text-white",
                                                                "dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            )}
                                                            value={changeDataFor.value}
                                                            onChange={(e) => setChangeDataFor({ ...changeDataFor, value: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') {
                                                                    setChangeDataFor({ id: -1, value: '', mode: 0 });
                                                                }
                                                            }}
                                                        />
                                                        <button
                                                            onClick={handleUpdateComment}
                                                            disabled={!changeDataFor.value.trim()}
                                                            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-3 py-2 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500 flex-shrink-0"
                                                        >
                                                            <FaRegPaperPlane />
                                                        </button>
                                                    </div>
                                                </div>
                                            </ClickAwayListener>
                                        )}
                                    </div>

                                    {/* Dropdown menu (positioned absolutely) */}
                                    {v.accountId === accId && changeDataFor.id === -1 && (
                                        <div className="relative self-start mt-2"> {/* Adjusted positioning */}
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                        </svg>
                                                    </button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent
                                                    side="left"
                                                    align="end"
                                                    className="p-1 rounded-lg z-[100] border border-gray-200 bg-white w-[125px] shadow-lg absolute right-0"
                                                >
                                                    <DropdownMenuItem
                                                        className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer px-2"
                                                        onClick={() => {
                                                            setChangeDataFor(
                                                                {
                                                                    id: v.commentId,
                                                                    value: v.content,
                                                                    mode: 1
                                                                })
                                                        }}
                                                    >
                                                        Cập nhật
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem
                                                        onClick={() => {
                                                            setChangeDataFor({ ...changeDataFor, id: v.commentId, mode: 2 })
                                                        }}
                                                        className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer px-2"
                                                    >
                                                        Xóa
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
                {
                    comments.length === 0 && !commentData.isFetching &&
                    <p>Không có bình luận nào</p>
                }
                <form className="flex gap-4" onSubmit={handleSubmit}>
                    <input
                        value={formData.content}
                        placeholder="Nhập bình luận..."
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                    />
                    <button
                        type="submit"
                        disabled={!formData.content.trim()}
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                    >
                        <FaRegPaperPlane />
                    </button>
                </form>
                <DeleteModal
                    isOpen={changeDataFor.mode === 2}
                    message="Xóa bình luận này?"
                    onClose={() => {
                        setChangeDataFor(p => ({ ...p, id: -1, mode: 0 }))
                    }}
                    onConfirm={() => {
                        deleteCommentMutation.mutate(changeDataFor.id)
                    }}
                />
            </div >
        </div >
    );
};

export default BidCommentModal;

