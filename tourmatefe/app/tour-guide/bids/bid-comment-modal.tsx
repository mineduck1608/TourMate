import { useEffect, useState, useRef } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addBid, getBidsOfTourBid } from "@/app/api/bid.api";
import { Bid } from "@/types/bid";
import SafeImage from "@/components/safe-image";
import { formatNumber } from "@/types/other";
import InfiniteScroll from "react-infinite-scroll-component";
import { TourBid, TourBidListResult } from "@/types/tour-bid";
import { toast } from "react-toastify";
import ParticipateBidModal from "./participate-bid-modal";
import { Button } from "@/components/ui/button";

type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tourBid: TourBid | TourBidListResult
};

const BidCommentModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBid
}) => {
    const isOnGoing = tourBid.status === 'Hoạt động' ? true : false
    const pageSize = 4
    const [page, setPage] = useState(1)
    const [bids, setBids] = useState<Bid[]>([])
    const [hasMore, setHasMore] = useState(true)
    const [open, setOpen] = useState(false)
    const scrollRef = useRef<HTMLDivElement>(null)
    const [dataVersion, setDataVersion] = useState(0)

    const bidData = useQuery({
        queryKey: ['bids-of', tourBid.tourBidId, pageSize, page, dataVersion],
        queryFn: () => getBidsOfTourBid(tourBid.tourBidId, page, pageSize),
        staleTime: 60 * 1000,
        keepPreviousData: true
    })

    const resetData = () => {
        setPage(1)
        setBids([])
        setHasMore(true)
        setDataVersion(v => v + 1)
    }

    const addBidMutation = useMutation({
        mutationFn: ({ data }: { data: Bid }) => addBid(data),
        onSuccess: () => {
            toast.success("Tạo thành công");
            setOpen(false)
            resetData()
            // Scroll to top when new bid is created
            setTimeout(() => {
                if (scrollRef.current) {
                    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' })
                }
            }, 100)
        },
        onError: (error) => {
            toast.error("Tạo thất bại");
            console.error(error);
        },
    })

    useEffect(() => {
        if (!isOpen) return
        resetData()
    }, [isOpen, tourBid.tourBidId])

    useEffect(() => {
        if (!bidData.data) return

        const newItems = bidData.data.result
        const totalPages = bidData.data.totalPage ?? 0

        if (page === 1) {
            setBids(newItems)
        } else {
            setBids(prev => {
                const existingIds = new Set(prev.map(b => b.bidId))
                const filteredNewItems = newItems.filter(b =>
                    !existingIds.has(b.bidId)
                )
                return [...prev, ...filteredNewItems]
            })
        }

        setHasMore(page < totalPages)
    }, [bidData.data])

    const loadMore = () => {
        if (!bidData.isFetching && hasMore) {
            setPage(prev => prev + 1)
        }
    }

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"
                }`}
        >
            <div
                className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"
                    }`}
                onClick={onClose}
            ></div>

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[900px] overflow-y-auto">
                <div className="flex justify-between items-center rounded-t border-b sm:mb-5 dark:border-gray-600">
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
                        endMessage={
                            bids.length > 0 ? (
                                <p className="text-center py-4 text-gray-500">
                                    {bidData.data?.result.length === 0
                                        ? "No results found"
                                        : "Bạn đã xem hết tất cả kết quả"}
                                </p>
                            ) : null
                        }
                        scrollableTarget="scrollableDiv"
                    >
                        {bids.map((v) => (
                            <div key={v.bidId} className="bg-[#F8FAFC] p-3 my-2 rounded-sm items-center ">
                                <div className="flex justify-between">
                                    <div className="flex items-center">
                                        <SafeImage src={v.tourGuide?.image} alt="pfp" className="w-[65px] h-[65px] rounded-full" />
                                        <p className="ml-2 font-semibold">{v.tourGuide?.fullName}</p>
                                    </div>
                                    <p className="font-semibold text-blue-700">{formatNumber(v.amount)} VND</p>
                                </div>
                                <div className="wrap-break-word mt-4">
                                    {v.comment}
                                </div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>
                {bids.length === 0 && !bidData.isFetching &&
                    <p className="text-center py-4 text-gray-500">Không có lượt đấu giá nào</p>
                }
                <div className="my-4 mt-0 border-t-[1px]" />
                <Button
                    onClick={() => setOpen(true)}
                    disabled={!isOnGoing}
                    className="mt-4 w-full text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                >
                    Tham gia đấu giá
                </Button>
                {open && <ParticipateBidModal 
                    isOpen
                    onClose={() => setOpen(false)}
                    tourBid={tourBid}
                    onSave={(b) => {
                        addBidMutation.mutate({ data: b })
                    }}
                />}
            </div>
        </div>
    );
};

export default BidCommentModal;