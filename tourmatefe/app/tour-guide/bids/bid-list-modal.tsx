import { useEffect, useState, useRef, useContext } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addBid, deleteBid, getBidsOfTourBid, updateBid } from "@/app/api/bid.api";
import { Bid, BidListResult } from "@/types/bid";
import SafeImage from "@/components/safe-image";
import { formatNumber } from "@/types/other";
import InfiniteScroll from "react-infinite-scroll-component";
import { TourBidListResult } from "@/types/tour-bid";
import { toast } from "react-toastify";
import ParticipateBidModal from "./participate-bid-modal";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { TourGuideSiteContext, TourGuideSiteContextProps } from "../context";
import Link from "next/link";
import dayjs from "dayjs";
import BidEditModal from "./bid-edit-modal";
import DeleteModal from "@/components/delete-modal";

type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tourBid: TourBidListResult,
    onCreateOrDelete: (id: number, state: boolean) => void
};
const baseData: BidListResult = {
    bidId: 0,
    tourBidId: 0,
    tourGuideId: 0,
    amount: 0,
    createdAt: "",
    status: "",
    fullName: "",
    image: ""
}
const BidListModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBid,
    onCreateOrDelete
}) => {
    const [innerTourBid, setInnerTourBid] = useState(tourBid)
    const isOnGoing = innerTourBid.status === 'Hoạt động' ? true : false;
    const pageSize = 5;
    const [page, setPage] = useState(1);
    const [bids, setBids] = useState<BidListResult[]>([]);
    const [hasMore, setHasMore] = useState(true);
    const [target, setTarget] = useState<BidListResult>(baseData)
    const [modalOpen, setModalOpen] = useState({
        create: false,
        edit: false,
        delete: false
    });
    const [cachedEdits, setCachedEdits] = useState<Record<number, BidListResult>>({});
    const scrollRef = useRef<HTMLDivElement>(null);
    const [dataVersion, setDataVersion] = useState(0);
    const { id, tourGuide } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps;
    const bidsRef = useRef<BidListResult[]>([]);
    const modalRef = useRef<HTMLDivElement>(null);
    // Calculate scrollbar width and lock body scroll

    useEffect(() => {
        if (isOpen) {
            // Calculate scrollbar width
            const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

            // Apply styles to body
            document.body.style.overflow = 'hidden';
            document.body.style.paddingRight = `${scrollbarWidth}px`;

            // Apply to modal wrapper if exists
            const modalWrapper = document.querySelector('.modal-wrapper');
            if (modalWrapper) {
                (modalWrapper as HTMLElement).style.paddingRight = `${scrollbarWidth}px`;
            }

            return () => {
                document.body.style.overflow = '';
                document.body.style.paddingRight = '';
                if (modalWrapper) {
                    (modalWrapper as HTMLElement).style.paddingRight = '';
                }
            };
        }
    }, [isOpen]);

    const bidData = useQuery({
        queryKey: ['bids-of', innerTourBid.tourBidId, pageSize, page, dataVersion],
        queryFn: () => getBidsOfTourBid(innerTourBid.tourBidId, page, pageSize),
        enabled: isOpen,
    });

    const resetData = () => {
        setPage(1);
        setHasMore(true);
        setDataVersion(v => v + 1);
    };

    useEffect(() => {
        if (isOpen) {
            resetData();
        }
    }, [isOpen]);

    const addBidMutation = useMutation({
        mutationFn: ({ data }: { data: Bid }) => addBid(data),
        onSuccess: (newBid) => {
            toast.success("Tạo thành công");
            newBid.image = tourGuide?.image
            newBid.fullName = tourGuide?.fullName
            console.log(newBid);
            
            setModalOpen(p => ({ ...p, create: false }));
            setInnerTourBid({ ...innerTourBid, isBid: true })
            setBids(prev => {
                const updated = [newBid, ...prev];
                bidsRef.current = updated;
                return updated;
            });
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                }
            }, 100);
        },
        onError: (error) => {
            toast.error("Tạo thất bại");
            console.error(error);
        },
    });
    const deleteBidMutation = useMutation({
        mutationFn: ({ id }: { id: number }) => deleteBid(id),
        onSuccess: (_, variables) => {
            toast.success("Xóa thành công");
            setModalOpen(p => ({ ...p, delete: false }));

            // Remove the deleted bid from local state
            setBids(prev => prev.filter(bid => bid.bidId !== variables.id));

            // Optional: Refetch data to ensure consistency
            setDataVersion(v => v + 1);
        },
        onError: (error) => {
            toast.error("Xóa thất bại");
            console.error(error);
        },
    });

    const updateBidMutation = useMutation({
        mutationFn: ({ data }: { data: Bid }) => updateBid(data),
        onSuccess: (_, variables) => {
            toast.success("Cập nhật thành công");
            setModalOpen(p => ({ ...p, edit: false }));

            // Use the cached edit data if available
            const cachedEdit = cachedEdits[variables.data.bidId];

            setBids(prev => {
                // If we have cached data, use it
                if (cachedEdit) {
                    return prev.map(bid =>
                        bid.bidId === variables.data.bidId ? cachedEdit : bid
                    );
                }

                // Fallback to optimistic update
                return prev.map(bid =>
                    bid.bidId === variables.data.bidId
                        ? { ...bid, ...variables.data }
                        : bid
                );
            });

            // Clean up the cache
            setCachedEdits(prev => {
                const newCache = { ...prev };
                delete newCache[variables.data.bidId];
                return newCache;
            });

            // Optional: Refetch data to ensure consistency
            setDataVersion(v => v + 1);
        },
        onError: (error, variables) => {
            toast.error("Cập nhật thất bại");
            console.error(error);

            // Clean up the cache on error
            setCachedEdits(prev => {
                const newCache = { ...prev };
                delete newCache[variables.data.bidId];
                return newCache;
            });
        },
    });

    useEffect(() => {
        if (!bidData.data) return;

        const newItems = bidData.data.result;
        const totalPages = bidData.data.totalPage ?? 0;

        if (page === 1) {
            setBids(newItems);
            bidsRef.current = newItems;
        } else {
            setBids(prev => {
                const existingIds = new Set(prev.map(b => b.bidId));
                const filteredNewItems = newItems.filter(b => !existingIds.has(b.bidId));
                const updated = [...prev, ...filteredNewItems];
                bidsRef.current = updated;
                return updated;
            });
        }

        setHasMore(page < totalPages);
    }, [bidData.data]);

    const loadMore = () => {
        if (!bidData.isFetching && hasMore) {
            setPage(prev => prev + 1);
        }
    };

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}>
            <div
                className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"}`}
                onClick={onClose}
            ></div>

            {/* Main modal container */}
            <div
                ref={modalRef}
                className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[90vh] overflow-y-auto modal-wrapper"
                style={{
                    //scrollbarGutter: 'stable',
                }}
            >
                <div className="flex justify-between items-center rounded-t border-b sm:mb-5 dark:border-gray-600 w-full">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Đấu giá
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
                    id="scrollableDiv"
                    className="max-h-[500px] overflow-y-auto"
                    ref={scrollRef}
                >
                    <InfiniteScroll
                        dataLength={bids.length}
                        next={loadMore}
                        hasMore={hasMore}
                        loader={
                            <div className="flex justify-center py-4">
                                {bidData.isFetching && bids.length > 0 ? (
                                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                                ) : null}
                            </div>
                        }
                        scrollableTarget="scrollableDiv"
                    >
                        {bids.map((v) => {
                            const displayBid = cachedEdits[v.bidId] || v;
                            return (
                                <div key={v.bidId} id={`bid-${v.bidId}`} className="bg-[#F8FAFC] p-3 my-2 rounded-sm items-center">
                                    <div className="flex justify-between">
                                        <div className="flex items-center">
                                            <Link href={'/services/tour-guide/' + displayBid.tourGuideId}>
                                                <SafeImage src={displayBid.image} alt="pfp" className="w-[65px] h-[65px] rounded-full" />
                                            </Link>
                                            <div className="ml-2">
                                                <p className="font-semibold">{displayBid.fullName}</p>
                                                <p>{dayjs(displayBid.createdAt).format('DD [tháng] MM, YYYY; HH:mm:ss')}</p>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-blue-700">{formatNumber(displayBid.amount)} VND</p>
                                            {v.tourGuideId === id &&
                                                <div className="flex justify-end relative">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <button
                                                                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
                                                            >
                                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                                </svg>
                                                            </button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent
                                                            side="left"
                                                            align="end"
                                                            className="p-1 rounded-lg z-[100] border border-gray-200 bg-white w-[125px] shadow-lg -translate-x-[75px]"
                                                            style={{
                                                                position: 'fixed',
                                                                //marginRight: '0.5rem' // Small margin to prevent touching edge
                                                            }}
                                                        >
                                                            <DropdownMenuItem
                                                                className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer px-2"
                                                                onClick={() => {
                                                                    setTarget(v)
                                                                    setModalOpen(p => ({ ...p, edit: true }))
                                                                }}
                                                            >
                                                                Cập nhật
                                                            </DropdownMenuItem>
                                                            <DropdownMenuItem
                                                                onClick={() => {
                                                                    setTarget(v)
                                                                    setModalOpen(p => ({ ...p, delete: true }))
                                                                }}
                                                                className="hover:bg-gray-100 p-1 rounded-sm cursor-pointer px-2"
                                                            >
                                                                Xóa
                                                            </DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>}
                                        </div>
                                    </div>
                                    <div className="wrap-break-word mt-4">
                                        {v.comment}
                                    </div>
                                </div>
                            )
                        })}
                    </InfiniteScroll>
                </div>
                {bids.length === 0 && !bidData.isFetching &&
                    <p className="text-center py-4 text-gray-500">Không có lượt đấu giá nào</p>
                }
                <div className="my-4 mt-0 border-t-[1px]" />
                <Button
                    onClick={() => setModalOpen(p => ({ ...p, create: true }))}
                    disabled={!isOnGoing || innerTourBid.isBid}
                    className="mt-4 w-full text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                >
                    Tham gia đấu giá
                </Button>
                {modalOpen.create && <ParticipateBidModal
                    isOpen
                    onClose={() => setModalOpen(p => ({ ...p, create: false }))}
                    tourBid={tourBid}
                    onSave={(b) => {
                        addBidMutation.mutate({ data: b })
                        onCreateOrDelete(tourBid.tourBidId, true)
                        setInnerTourBid({ ...innerTourBid, isBid: true })
                    }}
                />}
                {
                    modalOpen.edit && (
                        <BidEditModal
                            isOpen
                            onClose={() => setModalOpen(p => ({ ...p, edit: false }))}
                            onSave={(updatedBid) => {
                                // Cache the edited data immediately
                                setCachedEdits(prev => ({
                                    ...prev,
                                    [updatedBid.bidId]: {
                                        ...target,
                                        ...updatedBid,
                                        // Ensure all required BidListResult fields are included
                                        fullName: target.fullName,
                                        image: target.image,
                                        createdAt: target.createdAt
                                    }
                                }));
                                // Then trigger the mutation
                                updateBidMutation.mutate({ data: updatedBid });
                            }}
                            bid={target}
                            tourBid={tourBid}
                        />
                    )
                }
                {
                    modalOpen.delete && <DeleteModal
                        isOpen
                        message="Xóa đấu giá này?"
                        onClose={() => { setModalOpen(p => ({ ...p, delete: false })) }}
                        onConfirm={() => {
                            deleteBidMutation.mutate({ id: target.bidId });
                            onCreateOrDelete(tourBid.tourBidId, false)
                            setInnerTourBid({ ...innerTourBid, isBid: false })
                        }}
                    />
                }
            </div>
        </div>
    );
};

export default BidListModal;