import { FormEvent, useContext, useEffect, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
import { Bid } from "@/types/bid";
import { TourBid, TourBidListResult } from "@/types/tour-bid";
import { Button } from "@/components/ui/button";
import { TourGuideSiteContext, TourGuideSiteContextProps } from "../context";

type BidCommentModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (b: Bid) => void
    tourBid: TourBid | TourBidListResult
};
const baseBidData: Bid = {
    bidId: 0,
    tourBidId: 0,
    tourGuideId: 0,
    amount: 0,
    createdAt: "",
    status: ""
}

const BidCreateModal: React.FC<BidCommentModalProps> = ({
    isOpen,
    onClose,
    tourBid,
    onSave
}) => {
    const [formData, setFormData] = useState(baseBidData)
    const { id } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
    useEffect(() => {
        const t: Bid = {
            ...baseBidData,
            tourGuideId: id,
            tourBidId: tourBid.tourBidId,
        }
        setFormData(t)
    }, [])
    function handleSubmit(event: FormEvent<HTMLFormElement>): void {
        event.preventDefault()
        onSave(formData)
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
                        Tham gia đấu giá
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
                <div className="my-4 mt-0 border-t-[1px]" />
                <form onSubmit={handleSubmit}>
                    {<div className="grid">
                        <div className=" col-span-2 mb-4">
                            <label htmlFor="amount" className="block text-sm font-bold text-gray-700">
                                Số tiền
                            </label>
                            <input
                                type="number"
                                id="amount"
                                name="amount"
                                required
                                min="1"
                                max={tourBid?.maxPrice || undefined}
                                value={formData.amount.toString()}
                                onChange={(e) => {
                                    const v = parseInt(e.target.value) || 0
                                    setFormData({ ...formData, amount: v })
                                }}
                                className="flex-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            />
                        </div>
                        {/* Comment field */}
                        <div className="col-span-2">
                            <label htmlFor="comment" className="block text-sm font-bold text-gray-700">
                                Ghi chú
                            </label>
                            <textarea
                                id="comment"
                                name="comment"
                                rows={12}
                                value={formData.comment || ''}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                className="flex-1 w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            />
                        </div>

                    </div>}
                    <Button
                        type="submit"
                        className="mt-4 w-full text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                    >
                        Tham gia đấu giá
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default BidCreateModal;