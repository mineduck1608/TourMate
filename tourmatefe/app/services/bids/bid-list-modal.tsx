import { useContext, useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { useMutation, useQuery } from "@tanstack/react-query";
import { acceptBid, getBidsOfTourBid } from "@/app/api/bid.api";
import { BidListResult } from "@/types/bid";
import SafeImage from "@/components/safe-image";
import { formatNumber } from "@/types/other";
import InfiniteScroll from "react-infinite-scroll-component";
import Link from "next/link";
import dayjs from "dayjs";
import { Button } from "@/components/ui/button";
import { FaCheckCircle, FaFacebookMessenger } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { TourBidListResult } from "@/types/tour-bid";
import { cn } from "@/lib/utils";
import { CustomerSiteContext, CustomerSiteContextProp } from "../context";
import { toast } from "react-toastify";
type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tourBid: TourBidListResult
};

const BidListModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBid
}) => {
    const pageSize = 5
    const router = useRouter();
    const { accId } = useContext(CustomerSiteContext) as CustomerSiteContextProp
    const isTourBidOwned = tourBid.accountId === accId
    const [page, setPage] = useState(1)
    const [bids, setBids] = useState<BidListResult[]>([])
    const [acceptedId, setAcceptedId] = useState({
        id: -1,
        initState: false
    });
    const bidData = useQuery({
        queryKey: ['bids-of', tourBid.tourBidId, pageSize, page],
        queryFn: () => getBidsOfTourBid(tourBid.tourBidId, page, pageSize),
        staleTime: 60 * 1000
    })
    const acceptBidMutation = useMutation({
        mutationFn: ({ data }: { data: number }) => acceptBid(data),
        onSuccess: () => {
            toast.success(acceptedId.initState ? 'Đã từ chối đấu giá' : 'Đã chấp nhận đấu giá')
            if (acceptedId !== null) {
                setBids(prev =>
                    prev.map(bid =>
                        bid.bidId === acceptedId.id
                            ? { ...bid, status: acceptedId.initState ? '1' : 'Chấp nhận' }
                            : { ...bid, status: '1' }
                    )
                );
            }
        },
        onError: () => {
            toast.error('Có lỗi trong quá trình cập nhật')
        }
    });
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

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[91vh] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-0 dark:border-gray-600">
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
                {bids.length !== 0 && !bidData.isFetching && isTourBidOwned && <p>Bấm vào một đấu giá để chọn/bỏ chọn</p>}
                <div
                    id="scrollableDiv"
                    className="max-h-[75vh] overflow-y-auto"
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
                            bids.map((v) => {
                                const isAccepted = v.status === 'Chấp nhận'
                                return (
                                    <div key={v.bidId}
                                        onClick={() => {
                                            if (!isTourBidOwned) return;
                                            setAcceptedId({
                                                id: v.bidId,
                                                initState: isAccepted
                                            });
                                            acceptBidMutation.mutate({ data: v.bidId });
                                        }}
                                        className={cn(
                                            "bg-[#F8FAFC] p-3 my-2 rounded-sm",
                                            isTourBidOwned && 'hover:bg-blue-100 cursor-pointer'
                                        )}>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-start">
                                                <Link href={'/services/tour-guide/' + v.tourGuideId}>
                                                    <SafeImage src={v.image} alt="pfp" className="w-15 h-15 rounded-full" />
                                                </Link>
                                                <div className="ml-2">
                                                    <p>
                                                        <span className="font-semibold">{v.fullName}</span>
                                                        {isAccepted && <FaCheckCircle size={20} className="fill-blue-500 inline ml-3" />}
                                                    </p>
                                                    <p>{dayjs(v.createdAt).format('DD [tháng] MM, YYYY; HH:mm:ss')}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-blue-700 text-end mb-4">{formatNumber(v.amount)} VND</p>
                                                <Button
                                                    className='z-10 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer mb-2.5'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        router.push(`/chat?userId=${v.tourGuideAccountId}`);
                                                    }}
                                                >
                                                    <FaFacebookMessenger size={20} />
                                                    Nhắn tin
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="wrap-break-word mt-4">{v.comment}</div>
                                    </div>
                                )
                            })
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

export default BidListModal;