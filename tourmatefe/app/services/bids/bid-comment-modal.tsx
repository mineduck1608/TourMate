import { FormEvent, useContext, useEffect, useState, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import SafeImage from "@/components/safe-image";
import InfiniteScroll from "react-infinite-scroll-component";
import { TourBidCommentCreateModel, TourBidCommentListResult } from "@/types/tour-bid-comment";
import { getTourBidCommentsFrom, addTourBidComment, updateTourBidComment, deleteTourBidComment } from "@/app/api/tour-bid-comment";
import { FaRegPaperPlane } from "react-icons/fa";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@radix-ui/react-dropdown-menu";
import ClickAwayListener from "react-click-away-listener";
import { cn } from "@/lib/utils";
import { CustomerSiteContext, CustomerSiteContextProp } from "../context";
import dayjs from "dayjs";
import DeleteModal from "@/components/delete-modal";

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
    const { accId, customer } = useContext(CustomerSiteContext) as CustomerSiteContextProp
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

    useEffect(() => {
        if (isOpen) {
            const width = window.innerWidth - document.documentElement.clientWidth
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

    const queryClient = useQueryClient();

    const addCommentMutation = useMutation({
        mutationFn: (comment: TourBidCommentCreateModel) => addTourBidComment(comment),
        onSuccess: (result) => {
            setFormData({ ...baseData, accountId: accId, tourBidId: tourBidId });
            setComments(prev => [
                {
                    ...result,
                    fullName: customer?.fullName || "",
                    image: customer?.image || "",
                },
                ...prev,
            ]);
            queryClient.invalidateQueries({ queryKey: ['comments-of', tourBidId] });
        }
    });

    const updateCommentMutation = useMutation({
        mutationFn: (comment: TourBidCommentListResult) => updateTourBidComment(comment),
        onSuccess: () => {
            setComments(prevComments =>
                prevComments.map(comment =>
                    comment.commentId === updateCache.commentId ? updateCache : comment
                )
            );
            setChangeDataFor({ id: -1, value: '', mode: 0 });
            queryClient.invalidateQueries({ queryKey: ['comments-of', tourBidId] });
        }
    });

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId: number) => deleteTourBidComment(commentId),
        onSuccess: () => {
            setComments(prevComments =>
                prevComments.filter(comment => comment.commentId !== changeDataFor.id)
            );
            setChangeDataFor({ id: -1, value: '', mode: 0 });
            queryClient.invalidateQueries({ queryKey: ['comments-of', tourBidId] });
        }
    });

    const handleUpdateComment = () => {
        if (changeDataFor.value.trim() && changeDataFor.id !== -1) {
            const originalComment = comments.find(c => c.commentId === changeDataFor.id);
            if (!originalComment) { return; }
            const updatedComment: TourBidCommentListResult = {
                ...originalComment,
                content: changeDataFor.value,
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

    if (!isOpen) return null;

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
                className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 max-h-[90vh] flex flex-col"
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
                    </button>
                </div>

                <div
                    ref={scrollableDivRef}
                    className="flex-1 overflow-y-auto mb-4 space-y-4"
                    id="scrollableDiv"
                    onScroll={(e) => {
                        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
                        if (scrollHeight - scrollTop <= clientHeight + 100 && totalPage !== 0 && page < totalPage) {
                            setPage(p => Math.min(p + 1, totalPage))
                        }
                    }}
                >
                    {comments.length === 0 && !commentData.isFetching ? (
                        <p className="text-gray-500 dark:text-gray-400 text-center py-4">Không có bình luận nào</p>
                    ) : (
                        <InfiniteScroll
                            dataLength={comments.length}
                            next={() => { }}
                            hasMore={page < totalPage}
                            loader={
                                <div className="flex justify-center py-4">
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
                                </div>
                            }
                            scrollableTarget="scrollableDiv"
                            style={{ overflow: 'visible' }}
                        >
                            {comments.map((v) => (
                                <div key={v.commentId} className="mb-4">
                                    <div className="flex gap-3 items-start">
                                        <SafeImage
                                            src={v.image}
                                            alt="avatar"
                                            className="w-10 h-10 rounded-full flex-shrink-0"
                                        />

                                        <div className="flex-1 min-w-0">
                                            {/* Comment display */}
                                            <div className={cn(
                                                `bg-[#F8FAFC] dark:bg-gray-700 p-3 rounded-sm`,
                                                (changeDataFor.id !== v.commentId || changeDataFor.mode !== 1) ? 'block' : 'hidden'
                                            )}>
                                                <p className="text-sm font-medium text-gray-900 dark:text-white">
                                                    {v.fullName}
                                                </p>
                                                <p className="mt-1 text-gray-800 dark:text-gray-200 whitespace-pre-wrap break-words">
                                                    {v.content}
                                                </p>
                                                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                                    {dayjs(v.createdAt).format('DD [tháng] MM, YYYY')}
                                                </p>
                                            </div>

                                            {/* Edit mode */}
                                            {changeDataFor.id === v.commentId && changeDataFor.mode === 1 && (
                                                <ClickAwayListener onClickAway={handleClickAway}>
                                                    <div className="space-y-2">
                                                        <input
                                                            autoFocus
                                                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                                            value={changeDataFor.value}
                                                            onChange={(e) => setChangeDataFor({ ...changeDataFor, value: e.target.value })}
                                                            onKeyDown={(e) => {
                                                                if (e.key === 'Escape') {
                                                                    setChangeDataFor({ id: -1, value: '', mode: 0 });
                                                                }
                                                            }}
                                                        />
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setChangeDataFor({ id: -1, value: '', mode: 0 })}
                                                                className="px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-600 rounded-lg"
                                                            >
                                                                Hủy
                                                            </button>
                                                            <button
                                                                onClick={handleUpdateComment}
                                                                disabled={!changeDataFor.value.trim()}
                                                                className="px-3 py-1.5 text-sm text-white bg-primary-600 rounded-lg hover:bg-primary-700 disabled:bg-gray-500"
                                                            >
                                                                Cập nhật
                                                            </button>
                                                        </div>
                                                    </div>
                                                </ClickAwayListener>
                                            )}
                                        </div>

                                        {/* Dropdown menu */}
                                        <div className="w-6 flex justify-end items-start flex-shrink-0">
                                            {v.accountId === accId && changeDataFor.id === -1 && (
                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 p-1">
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                            </svg>
                                                        </button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent
                                                        side="bottom"
                                                        align="end"
                                                        className="z-50 min-w-[120px] bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 overflow-hidden"
                                                    >
                                                        <DropdownMenuItem
                                                            className="px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                                            onClick={() => {
                                                                setChangeDataFor({
                                                                    id: v.commentId,
                                                                    value: v.content,
                                                                    mode: 1
                                                                });
                                                            }}
                                                        >
                                                            Chỉnh sửa
                                                        </DropdownMenuItem>
                                                        <DropdownMenuItem
                                                            onClick={() => {
                                                                setChangeDataFor({ ...changeDataFor, id: v.commentId, mode: 2 });
                                                            }}
                                                            className="px-3 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                                                        >
                                                            Xóa
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            )}
                                        </div>

                                    </div>
                                </div>
                            ))}
                        </InfiniteScroll>
                    )}
                </div>

                <form className="flex gap-2 mt-auto" onSubmit={handleSubmit}>
                    <input
                        value={formData.content}
                        placeholder="Nhập bình luận..."
                        onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                        className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
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
            </div>
        </div>
    );
};

export default BidCommentModal;