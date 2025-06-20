"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Star, User, Calendar, MessageSquare, ChevronLeft, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { Button } from "@/components/ui/button"
import SafeImage from "@/components/safe-image"
import { getTourGuideFeedbacks } from "@/app/api/feedback.api"

interface TourGuideFeedbackSectionProps {
  tourGuideId: number
}

interface FeedbackItem {
  feedbackId: number
  customerId: number
  tourGuideId: number
  createdDate: string
  content: string
  rating: number
  invoiceId: number
  customerName?: string
  customerAvatar?: string
  tourName?: string
}

export default function TourGuideFeedbackSection({ tourGuideId }: TourGuideFeedbackSectionProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 5

  const {
    data: feedbackData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["tour-guide-feedbacks", tourGuideId, currentPage],
    queryFn: () => getTourGuideFeedbacks(tourGuideId, currentPage, pageSize),
    enabled: !!tourGuideId,
  })

  const feedbacks: FeedbackItem[] = feedbackData?.result || []
  const totalPages = feedbackData?.totalPage || 1
  const totalFeedbacks = feedbackData?.totalCount || 0

  // Calculate statistics
  const averageRating =
    totalFeedbacks > 0
      ? (feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0) / feedbacks.length).toFixed(1)
      : "0"

  const ratingCounts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((f) => f.rating === rating).length,
  }))

  const getRatingText = (rating: number) => {
    switch (rating) {
      case 5:
        return "Xuất sắc"
      case 4:
        return "Tốt"
      case 3:
        return "Bình thường"
      case 2:
        return "Kém"
      case 1:
        return "Rất kém"
      default:
        return ""
    }
  }

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "text-green-600"
    if (rating >= 3) return "text-yellow-600"
    return "text-red-600"
  }

  if (isLoading) {
    return (
      <div className="w-full space-y-4">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Đánh giá từ khách hàng</h2>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
              <div className="animate-pulse space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                  </div>
                </div>
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Đánh giá từ khách hàng</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600">Có lỗi xảy ra khi tải đánh giá</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Đánh giá từ khách hàng</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MessageSquare className="h-4 w-4" />
          <span>{totalFeedbacks} đánh giá</span>
        </div>
      </div>

      {totalFeedbacks > 0 ? (
        <>
          {/* Statistics Overview */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Average Rating */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <span className="text-4xl font-bold text-blue-600">{averageRating}</span>
                  <Star className="h-8 w-8 fill-yellow-400 text-yellow-400" />
                </div>
                <p className="text-sm text-gray-600">Điểm trung bình</p>
                <p className="text-xs text-gray-500">({totalFeedbacks} đánh giá)</p>
              </div>

              {/* Rating Distribution */}
              <div className="md:col-span-2">
                <h4 className="font-medium text-gray-800 mb-3">Phân bố đánh giá</h4>
                <div className="space-y-2">
                  {ratingCounts.map(({ rating, count }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-medium">{rating}</span>
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      </div>
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${feedbacks.length > 0 ? (count / feedbacks.length) * 100 : 0}%`,
                          }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Feedback List */}
          <div className="space-y-4">
            {feedbacks.map((feedback) => (
              <div key={feedback.feedbackId} className="bg-white rounded-lg shadow-md border border-gray-100 p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <SafeImage
                        src={feedback.customerAvatar || "/default-avatar.png"}
                        alt={feedback.customerName || "Khách hàng"}
                        className="w-12 h-12 rounded-full object-cover border-2 border-gray-200"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{feedback.customerName || "Khách hàng"}</h4>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Calendar className="h-3 w-3" />
                        <span>{format(new Date(feedback.createdDate), "dd/MM/yyyy")}</span>
                        {feedback.tourName && (
                          <>
                            <span>•</span>
                            <span className="text-blue-600">Tour: {feedback.tourName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`h-4 w-4 ${
                            star <= feedback.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className={`text-sm font-semibold ${getRatingColor(feedback.rating)}`}>
                      {getRatingText(feedback.rating)}
                    </span>
                  </div>
                </div>

                {/* Content */}
                {feedback.content && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 leading-relaxed italic">"{feedback.content}"</p>
                  </div>
                )}

                {/* Footer */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-500">Mã tour: #{feedback.invoiceId}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <User className="h-3 w-3" />
                    <span>Đánh giá đã xác thực</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-4 mt-6">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Trước
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      variant={currentPage === pageNum ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(pageNum)}
                      className="w-8 h-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
                {totalPages > 5 && (
                  <>
                    <span className="text-gray-500">...</span>
                    <Button
                      variant={currentPage === totalPages ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(totalPages)}
                      className="w-8 h-8 p-0"
                    >
                      {totalPages}
                    </Button>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="flex items-center gap-2"
              >
                Tiếp
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="bg-white rounded-lg shadow-md border border-gray-100 p-12 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageSquare className="h-8 w-8 text-gray-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">Chưa có đánh giá nào</h3>
              <p className="text-gray-600">Hướng dẫn viên này chưa nhận được đánh giá từ khách hàng</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
