'use client'

import { Star,  MessageCircleIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface FeedbackCardProps {
  customerAccountId: number;
  customerName: string;
  rating: number;
  content: string;
  createdAt: string;
}

export default function FeedbackCard({
  customerName,
  rating,
  content,
  createdAt,
  customerAccountId,
}: FeedbackCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white p-6 rounded-xl shadow-md border border-gray-200 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">{customerName}</h3>
          <span className="text-sm text-gray-500">{createdAt}</span>
        </div>

        <button
          onClick={() => {
            router.push(`/chat?userId=${customerAccountId}`);
          }}
          className="bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg shadow-sm transition flex items-center"
        >
          <MessageCircleIcon className="inline-block w-4 h-4 mr-1" />
          Nhắn tin
        </button>
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
    </div>
  );
}
