import ImageUpload from '@/components/image-upload'
import React, { useContext } from 'react'
import { ServiceEditContext, ServiceEditContextProp } from './service-edit-context'
import dynamic from 'next/dynamic';
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,  // Disable SSR for this component
});
interface Props {
    isOpen: boolean,
    onClose: () => void
}

function ServiceEditModal({ isOpen, onClose }: Props) {
    const { target, setTarget, setSignal } = useContext(ServiceEditContext) as ServiceEditContextProp

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        const updated = { ...target, [name]: value }
        setTarget(updated);
    };
    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
        >
            <div
                className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"}`}
                onClick={onClose}
            ></div>

            <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[900px] overflow-y-auto">
                <div className="relative justify-between items-center">
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
                <h3 className='text-center font-bold text-2xl mb-5'>Cập nhật dịch vụ</h3>
                <form onSubmit={() => { }}>
                    <div className="sm:col-span-1">
                        <label
                            htmlFor="serviceName"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Tên dịch vụ
                        </label>
                        <input
                            type="text"
                            name="serviceName"
                            id="serviceName"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            placeholder="Nhập địa điểm"
                            value={target.serviceName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="grid gap-4 mb-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                            <label
                                htmlFor="price"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Giá
                            </label>
                            <input
                                type="number"
                                name="price"
                                id="price"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                placeholder="Nhập tiêu đề"
                                value={target.price}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="sm:col-span-1">
                            <label
                                htmlFor="duration"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                            >
                                Thời lượng
                            </label>
                            <input
                                type="text"
                                name="duration"
                                id="duration"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                                value={target.duration}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-1">
                        <label
                            htmlFor="tourDesc"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Mô tả
                        </label>
                        <input
                            type="text"
                            name="tourDesc"
                            id="duration"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                            value={target.tourDesc}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="sm:col-span-2">
                        <label
                            htmlFor="bannerImg"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Ảnh dịch vụ
                        </label>
                        <ImageUpload
                            onImageUpload={(url: string) => {
                                setTarget({ ...target, image: url })
                            }}
                        />
                    </div>

                    <div className="sm:col-span-2">
                        <label
                            htmlFor="areaContent"
                            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                        >
                            Nội dung
                        </label>
                        {isOpen && <ReactQuill
                            value={target.content || ""}
                            onChange={(txt: string) => {
                                setTarget({ ...target, content: txt })
                            }}
                            theme="snow"
                            modules={{
                                toolbar: [
                                    [{ header: "1" }, { header: "2" }, { font: [] }],
                                    [{ list: "ordered" }, { list: "bullet" }],
                                    ["bold", "italic", "underline"],
                                    [{ align: [] }]
                                ],
                            }}
                            className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                        />}
                    </div>
                </form>
                <div className="flex justify-evenly mt-5">
                    <button
                        onClick={() => {
                            setSignal({ edit: true, delete: false })
                        }}
                        type="submit"
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-700 disabled:hover:bg-gray-600"
                    >
                        Cập nhật
                    </button>
                    <button
                        onClick={() => {
                            setSignal({ edit: false, delete: true })
                        }}
                        type="submit"
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-700 disabled:hover:bg-gray-600"
                    >
                        Xóa
                    </button>
                </div>
            </div>
        </div>
    )
}

export default ServiceEditModal
