'use client'

import React, { useState } from "react";
import { Star, MessageCircleIcon, FileTextIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Invoice } from "@/types/invoice";
import { getInvoiceById } from "@/app/api/invoice.api";

interface FeedbackCardProps {
  customerAccountId: number;
  customerName: string;
  rating: number;
  content: string;
  createdAt: string;
  invoiceId?: number; // Optional, in case you want to link to the invoice
}

async function fetchInvoice(invoiceId: number): Promise<Invoice> {
  return await getInvoiceById(invoiceId);
}

export default function FeedbackCard({
  customerName,
  rating,
  content,
  createdAt,
  customerAccountId,
  invoiceId, // Optional, can be used to link to the invoice if needed
}: FeedbackCardProps) {
  const router = useRouter();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [showInvoice, setShowInvoice] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleShowInvoice = async () => {
    if (!invoiceId) return;
    setLoading(true);
    try {
      const data = await fetchInvoice(invoiceId);
      setInvoice(data);
      setShowInvoice(true);
    } catch (e) {
      alert("Không tìm thấy hóa đơn")
      console.error("Error fetching invoice:", e);
    }
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{customerName}</h3>
          <span className="text-sm text-gray-500">{createdAt}</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              router.push(`/chat?userId=${customerAccountId}`);
            }}
            className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm transition flex items-center"
          >
            <MessageCircleIcon className="inline-block w-4 h-4 mr-1" />
            Nhắn tin
          </button>
          {invoiceId && (
            <button
              onClick={handleShowInvoice}
              className="bg-gray-100 hover:bg-gray-200 text-gray-800 text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm transition flex items-center"
              disabled={loading}
            >
              <FileTextIcon className="inline-block w-4 h-4 mr-1" />
              {loading ? "Đang tải..." : "Xem hóa đơn"}
            </button>
          )}
        </div>
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1 text-yellow-500">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${i < rating ? "fill-yellow-400" : "text-gray-300"}`}
          />
        ))}
      </div>

      {/* Content */}
      <p className="text-gray-700 text-base whitespace-pre-line">{content}</p>

      {/* Invoice Modal */}
      {showInvoice && invoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl p-8 w-full max-w-xl shadow-2xl relative animate-fadeIn max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500 text-2xl font-bold"
              onClick={() => setShowInvoice(false)}
              aria-label="Đóng"
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-6">
              <FileTextIcon className="w-7 h-7 text-blue-600" />
              <h2 className="text-2xl font-bold text-gray-800">Chi tiết hóa đơn</h2>
            </div>
            <div className="grid grid-cols-2 gap-4 text-gray-700 text-[15px]">
              <div>
                <span className="font-semibold text-gray-600">Mã hóa đơn:</span>
                <div className="text-blue-700 font-bold">{invoice.invoiceId}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Tên tour:</span>
                <div>{invoice.tourName}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Ngày bắt đầu:</span>
                <div>{new Date(invoice.startDate).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Ngày kết thúc:</span>
                <div>{new Date(invoice.endDate).toLocaleDateString()}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Người hướng dẫn:</span>
                <div>{invoice.tourGuideId}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Số lượng người:</span>
                <div>{invoice.peopleAmount}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Trạng thái:</span>
                <span className={`inline-block px-2 py-1 rounded text-xs font-semibold
                  ${invoice.status === "Đã thanh toán" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {invoice.status}
                </span>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Giá:</span>
                <div className="text-blue-700 font-bold">{invoice.price.toLocaleString()} VNĐ</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">SĐT khách:</span>
                <div>{invoice.customerPhone}</div>
              </div>
              <div>
                <span className="font-semibold text-gray-600">Ngày tạo:</span>
                <div>{new Date(invoice.createdDate).toLocaleString()}</div>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-600">Ghi chú:</span>
                <div className="bg-gray-50 rounded p-2 mt-1 min-h-[32px]">{invoice.note || "Không có"}</div>
              </div>
              <div className="col-span-2">
                <span className="font-semibold text-gray-600">Mô tả tour:</span>
                <div
                  className="bg-gray-50 rounded p-2 mt-1 min-h-[32px]"
                  dangerouslySetInnerHTML={{ __html: invoice.tourDesc || "Không có" }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
