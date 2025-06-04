import { FormEvent, useContext, useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { TourBid } from "@/types/tour-bid";
import { useMutation, useQuery } from "@tanstack/react-query";
import { addBid, getBidsOfTourBid } from "@/app/api/bid.api";
import { Bid } from "@/types/bid";
import SafeImage from "@/components/safe-image";
import { formatNumber } from "@/types/other";
import InfiniteScroll from "react-infinite-scroll-component";
import { FaRegPaperPlane } from "react-icons/fa";
import { TourGuideSiteContext, TourGuideSiteContextProps } from "../context";
import { toast } from "react-toastify";
import dayjs from "dayjs";

type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    tourBid: TourBid
};

const base: Bid = {
    bidId: 0,
    tourBidId: 0,
    tourGuideId: 0,
    amount: 0,
    createdAt: "",
    status: ""
}

const BidResultModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBid
}) => {
    const pageSize = 5
    const [page, setPage] = useState(1)
    const [bids, setBids] = useState<Bid[]>([])
    const { id } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
    const [formData, setFormData] = useState(base)
    const [isResetting, setIsResetting] = useState(false)

    const bidQuery = useQuery({
        queryKey: ['bids-of', tourBid.tourBidId, pageSize, page],
        queryFn: () => getBidsOfTourBid(tourBid.tourBidId, page, pageSize),
        staleTime: 60 * 1000
    })

    const createBidMutation = useMutation({
        mutationFn: async (data: Bid) => {
            return await addBid(data);
        },
        onSuccess: () => {
            toast.success("Tạo thành công");
            setIsResetting(true);
            setPage(1);
            setBids([]);
            bidQuery.refetch();
        },
        onError: (error) => {
            toast.error("Tạo thất bại");
            console.error(error);
        },
    });

    const totalPage = bidQuery.data?.totalPage ?? 0
    const isOnGoing = tourBid.status === 'Hoạt động' ? true : false

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        createBidMutation.mutate(formData)
        setFormData({ ...formData, amount: 0, comment: '' })
    }

    const fetchMoreData = () => {
        if (page < totalPage) {
            setPage(p => p + 1);
        }
    };

    useEffect(() => {
        setFormData({ ...formData, tourGuideId: id, tourBidId: tourBid.tourBidId })
        setBids([])
    }, [])

    useEffect(() => {
        if (!bidQuery.data) return;
        if (page === 1 || isResetting) {
            setBids(bidQuery.data.result);
            setIsResetting(false);
        } else {
            setBids(prev => {
                const existingIds = new Set(prev.map(b => b.bidId));
                const newItems = bidQuery.data.result.filter(b =>
                    !existingIds.has(b.bidId)
                );
                return [...prev, ...newItems];
            });
        }
    }, [bidQuery.data])

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

                <div id="scrollableDiv" className="max-h-[500px] overflow-y-auto">
                    <InfiniteScroll
                        dataLength={bids.length}
                        next={fetchMoreData}
                        hasMore={page < totalPage}
                        loader={<p>Loading...</p>}
                        scrollableTarget="scrollableDiv"
                    >
                        {bids.map((v) => (
                            <div key={v.bidId} className="bg-[#F8FAFC] p-3 my-2 rounded-sm w-full">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <SafeImage src={v.tourGuide?.image} alt="pfp" className="w-[50px] h-[50px] rounded-full" />
                                        <div className="ml-2 ">
                                            <p >
                                                <span className="font-semibold">{v.tourGuide?.fullName}</span>
                                                {id === v.tourGuideId ? ' (Bạn)' : ''}
                                            </p>
                                            <p>{dayjs(v.createdAt).format('DD [tháng] MM, YYYY')}</p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-blue-700">{formatNumber(v.amount)} VND</p>
                                </div>
                                <div className="mt-2 wrap-anywhere">{v.comment}</div>
                            </div>
                        ))}
                    </InfiniteScroll>
                </div>

                {bids.length === 0 && !bidQuery.isFetching &&
                    <p>Không có lượt đấu giá nào</p>
                }

                {isOnGoing &&
                    <form className="w-full flex justify-between mt-1" onSubmit={handleSubmit}>
                        <input
                            className="p-2 border-[1] rounded-sm w-[45%]"
                            name="comment"
                            value={formData.comment ?? ''}
                            placeholder="Nhập bình luận (tùy chọn)"
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            required
                        />
                        <input
                            className="p-2 border-[1] rounded-sm w-[35%]"
                            placeholder="Nhập giá"
                            name="amount"
                            type="number"
                            inputMode="numeric"
                            onChange={(e) => setFormData({ ...formData, amount: parseInt(e.target.value) })}
                            value={formData.amount}
                            required
                            min={1000}
                        />
                        <button
                            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                        >
                            <FaRegPaperPlane className="inline" />&nbsp;Gửi
                        </button>
                    </form>
                }
            </div>
        </div>
    );
};

export default BidResultModal;