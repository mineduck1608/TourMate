import { News } from "@/types/news";
import Image from "next/image";
import { useState, useEffect } from "react";

type NewsDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentNews: News;
};

const NewsDetailModal: React.FC<NewsDetailsModalProps> = ({
  isOpen,
  onClose,
  currentNews,
}) => {
  const [formData, setFormData] = useState<News>(currentNews);

  useEffect(() => {
    setFormData(currentNews);
  }, [currentNews]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${isOpen ? "block" : "hidden"}`}
    >
      <div
        className={`absolute inset-0 bg-black opacity-50 ${isOpen ? "block" : "hidden"}`}
        onClick={onClose}
      ></div>

      <div className="relative p-4 w-full max-w-2xl bg-white rounded-lg shadow-md dark:bg-gray-800 z-10 max-h-[80vh] overflow-y-auto">
        <div className="flex justify-between items-center pb-4 mb-4 rounded-t border-b sm:mb-5 dark:border-gray-600">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tin tức
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
        <div className="flex flex-col gap-4 mb-4">
          {/* Title Field */}
          <div>
            <label
              htmlFor="title"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Tiêu đề
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={formData.title}
              readOnly
            />
          </div>

          {/* Category Field */}
          <div>
            <label
              htmlFor="category"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Danh mục
            </label>
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
              value={formData.category}
              readOnly
            />
          </div>

          {/* Banner Image Field */}
          <div>
            <label
              htmlFor="bannerImg"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Ảnh Banner
            </label>
            <div className="h-48 w-full overflow-hidden">
              {formData.bannerImg && (
                <Image
                  src={formData.bannerImg}
                  alt="Banner"
                  className="object-cover w-full h-full"
                />
              )}
            </div>
          </div>

          {/* Content Field */}
          <div>
            <label
              htmlFor="content"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nội dung
            </label>
            <div
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500 max-h-[300px] overflow-y-auto"
              style={{
                whiteSpace: 'normal',  // Cho phép xuống dòng
                wordWrap: 'break-word', // Cắt từ nếu quá dài
              }}
              dangerouslySetInnerHTML={{ __html: formData.content }}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="button"
            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
            onClick={onClose}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsDetailModal;
