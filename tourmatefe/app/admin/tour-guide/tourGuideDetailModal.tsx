import { TourGuide } from "@/types/tour-guide";
import React, { useState, useEffect } from "react";

type TourGuideDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  currentTourGuide: TourGuide;
};

const TourGuideDetailModal: React.FC<TourGuideDetailModalProps> = ({
  isOpen,
  onClose,
  currentTourGuide,
}) => {
  const [formData, setFormData] = useState<TourGuide>(currentTourGuide);

  useEffect(() => {
    setFormData(currentTourGuide);
  }, [currentTourGuide]);

  // Hàm format ngày dd/mm/yyyy
  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isOpen ? "block" : "hidden"
      }`}
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      {/* Overlay */}
      <div
        className={`absolute inset-0 bg-black opacity-50 ${
          isOpen ? "block" : "hidden"
        }`}
        onClick={onClose}
      ></div>

      {/* Modal container */}
      <div className="relative z-10 w-full max-w-2xl mx-4 p-6 bg-white bg-opacity-90 rounded-lg shadow-lg max-h-[80vh] overflow-y-auto backdrop-blur-sm">
        {/* Header */}
        <header className="flex items-center justify-between mb-6 border-b border-gray-200 pb-2">
          <h2 id="modal-title" className="text-xl font-semibold text-gray-900">
            Chi tiết hướng dẫn viên
          </h2>
          <button
            onClick={onClose}
            aria-label="Đóng modal"
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </header>

        {/* Ảnh đại diện */}
        {formData.image && (
          <div className="mb-6 flex justify-center">
            <img
              src={formData.image}
              alt="Ảnh hướng dẫn viên"
              className="w-32 h-32 rounded-full object-cover border border-gray-300"
            />
          </div>
        )}

        {/* Nội dung chi tiết */}
        <section id="modal-description" className="space-y-5 text-gray-800">
          <div>
            <label className="block mb-1 font-medium">Họ và tên</label>
            <input
              type="text"
              value={formData.fullName}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>
          <div>
            <label className="block mb-1 font-medium">Ngày sinh</label>
            <input
              type="text"
              value={formatDate(formData.dateOfBirth)}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Giới tính</label>
            <input
              type="text"
              value={formData.gender}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              value={formData.account?.email || ""}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Số điện thoại</label>
            <input
              type="tel"
              value={formData.phone}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Địa chỉ</label>
            <input
              type="text"
              value={formData.address}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Ngày tạo tài khoản</label>
            <input
              type="text"
              value={formatDate(formData.account?.createdDate || "")}
              readOnly
              className="w-full rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-gray-900"
            />
          </div>
        </section>

        {/* Footer button */}
        <footer className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-md bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition"
          >
            Đóng
          </button>
        </footer>
      </div>
    </div>
  );
};

export default TourGuideDetailModal;
