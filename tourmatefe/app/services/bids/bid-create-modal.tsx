import { useState } from "react";

import "react-quill-new/dist/quill.snow.css";
import { TourBid } from "@/types/tour-bid";
import { getSimplifiedAreas } from "@/app/api/active-area.api";
import { useQuery } from "@tanstack/react-query";

const baseData: TourBid = {
    tourBidId: 0,
    accountId: 0,
    createdAt: "",
    isDeleted: false,
    placeRequestedId: 0,
    status: "",
    content: "",
    maxPrice: undefined
}
type BidCreateModalProps = {
    isOpen: boolean;
    onClose: () => void;
    onSave: (tourBidData: TourBid) => void;
};

const BidCreateModal: React.FC<BidCreateModalProps> = ({
    isOpen,
    onClose,
    onSave,
}) => {
    const [formData, setFormData] = useState<TourBid>(baseData);
    const [maxPrice, setMaxPrice] = useState('')

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave(formData);
        console.log(formData);
        setFormData(baseData);
        onClose();
    };
    const simplifiedAreaQuery = useQuery({
        queryKey: ['simplified-area'],
        queryFn: () => getSimplifiedAreas(),
        staleTime: 24 * 3600 * 1000
    })
    const areas = simplifiedAreaQuery.data?.data ?? []
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

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[600px] overflow-y-auto">
                <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        Tạo bài đăng
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
                <form onSubmit={handleSubmit}>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <label
                                htmlFor="placeRequestedId"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Địa điểm
                            </label>
                            <select
                                id="areaId"
                                name="areaId"
                                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                                required
                                onChange={(e) => { setFormData({ ...formData, placeRequestedId: Number(e.target.value) }) }}
                                value={formData.placeRequestedId}
                            >
                                <option value="" disabled>
                                    Chọn khu vực
                                </option>
                                {
                                    areas.map((v, i) =>
                                        <option value={v.areaId} key={'area' + i}>{v.areaName}</option>
                                    )
                                }
                            </select>
                        </div>
                        <div className="sm:col-span-1">
                            <label
                                htmlFor="areaType"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Giá cao nhất (tùy chọn)
                            </label>
                            <input
                                type="number"
                                name="maxPrice"
                                id="aremaxPriceaTitle"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={maxPrice}
                                onChange={(e) => {
                                    const v = Number(e.target.value)
                                    setFormData({ ...formData, maxPrice: v === 0 ? undefined : v })
                                    setMaxPrice(e.target.value)
                                }}
                            />
                        </div>
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-1">
                        <div className="sm:col-span-1">
                            <label
                                htmlFor="content"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Nội dung
                            </label>
                            <input
                                type="text"
                                name="content"
                                id="aremaxPriceaTitle"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={formData.content}
                                onChange={(e) => {
                                    setFormData({ ...formData, content: e.target.value })
                                }}
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                        >
                            Đăng bài viết
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default BidCreateModal;