import { useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useQuery } from "@tanstack/react-query";
import { getBidsOfTourBid } from "@/app/api/bid.api";
import { BidListResult } from "@/types/bid";
import SafeImage from "@/components/safe-image";
import { formatNumber } from "@/types/other";
import InfiniteScroll from "react-infinite-scroll-component";
type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tourBidId: number
};

const BidCommentModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBidId
}) => {
    const pageSize = 10
    const [page, setPage] = useState(1)
    const [bids, setBids] = useState<BidListResult[]>([])
    const bidData = useQuery({
        queryKey: ['bids-of', tourBidId, pageSize, page],
        queryFn: () => getBidsOfTourBid(tourBidId, page, pageSize),
        staleTime: 60 * 1000
    })
    useEffect(() => {
        setBids([])
    }, [])
    useEffect(() => {
        if (bidData.data) {
            setBids(b => [...b, ...bidData.data.result])
        }
    }, [bidData.data])
    const totalPage = bidData.data?.totalPage ?? 0
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

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[700px] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
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
                    onScroll={(e) => {
                        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
                        if (scrollHeight - scrollTop === clientHeight && totalPage !== 0 && page < totalPage) {
                            setPage(p => Math.min(p + 1, totalPage))
                        }
                    }}
                >
                    <InfiniteScroll dataLength={bids.length}
                        next={() => {
                        }}
                        hasMore={page < totalPage} loader={<p>Loading...</p>}
                        scrollableTarget={'scrollableDiv'}
                    >
                        {
                            bids.map((v) => (
                                <div key={v.bidId} className="bg-[#F8FAFC] p-3 my-2 rounded-sm">
                                    <div className=" flex   items-center justify-between">
                                        <div className="flex items-center">
                                            <SafeImage src={v.image} alt="pfp" className="w-[65px] h-[65px] rounded-full" />
                                            <p className="ml-2 font-semibold">{v.fullName}</p>

                                        </div>
                                        <p className="font-semibold text-blue-700">{formatNumber(v.amount)} VND</p>
                                    </div>
                                    <div className="wrap-break-word mt-4">{v.comment}</div>
                                </div>
                            ))
                        }
                    </InfiniteScroll>
                </div>
                {bids.length === 0 && !bidData.isFetching &&
                    <p>Không có lượt đấu giá nào</p>
                }
            </div>
        </div>
    );
};

export default BidCommentModal;