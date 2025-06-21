import { useTourFeedbackStats, useTourFeedbacks } from "@/hooks/use-feedback"
import { usePlatformFeedbackStats, usePlatformFeedbacks } from "@/hooks/use-platform-feedback"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"
import { formatFeedbackDate, sortFeedbacksByDate } from "./utils/date-utils"
import type { FeedbackStats, TourFeedback } from "@/types/feedback"
import { PlatformFeedbackDto } from "@/types/platform-feedback"

export default function FeedbackAnalytics() {
  // Sử dụng API hooks với proper types
  const { data: tourStatsResponse, isLoading: tourStatsLoading } = useTourFeedbackStats()
  const { data: platformStatsResponse, isLoading: platformStatsLoading } = usePlatformFeedbackStats()
  const { data: tourFeedbacksResponse, isLoading: tourFeedbacksLoading } = useTourFeedbacks()
  const { data: platformFeedbacksResponse, isLoading: platformFeedbacksLoading } = usePlatformFeedbacks()

  // Loading state
  if (tourStatsLoading || platformStatsLoading || tourFeedbacksLoading || platformFeedbacksLoading) {
    return <div>Đang tải dữ liệu...</div>
  }

  // Extract data with proper types
  const tourStats: FeedbackStats = tourStatsResponse || {
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: [],
  }

  const platformStats: FeedbackStats = platformStatsResponse || {
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: [],
  }

  const tourFeedbacks: TourFeedback[] = tourFeedbacksResponse || []
  const platformFeedbacks: PlatformFeedbackDto[] = platformFeedbacksResponse || []


  const formatDate = formatFeedbackDate

  const getRatingBadge = (rating: number) => {
    const colors = {
      5: "bg-green-100 text-green-800",
      4: "bg-blue-100 text-blue-800",
      3: "bg-yellow-100 text-yellow-800",
      2: "bg-orange-100 text-orange-800",
      1: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={colors[rating as keyof typeof colors]}>
        <Star className="w-3 h-3 mr-1 fill-current" />
        {rating}
      </Badge>
    )
  }

  // Combine feedbacks for recent display with proper typing
  const combinedFeedbacks: (TourFeedback | PlatformFeedbackDto)[] = [
    ...tourFeedbacks.slice(0, 3),
    ...platformFeedbacks.slice(0, 2),
  ]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Xu hướng đánh giá */}
        <Card className="py-5">
          <CardHeader>
            <CardTitle>Xu hướng đánh giá</CardTitle>
            <CardDescription>So sánh đánh giá Tour vs Hệ thống</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-blue-900">Đánh giá Tour</h4>
                  <p className="text-sm text-blue-700">
                    Trung bình: {typeof tourStats.averageRating === 'number' ? tourStats.averageRating.toFixed(1) : 'N/A'}/5
                  </p>

                </div>
                <div className="text-2xl font-bold text-blue-600">{tourStats?.totalFeedbacks ?? 0}</div>
              </div>
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div>
                  <h4 className="font-semibold text-green-900">Đánh giá Hệ thống</h4>
                  <p className="text-sm text-green-700">
                    Trung bình: {typeof platformStats.averageRating === 'number' ? platformStats.averageRating.toFixed(1) : 'N/A'}/5
                  </p>
                </div>
                <div className="text-2xl font-bold text-green-600">{platformStats?.totalFeedbacks ?? 0}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Phân tích sentiment */}
        <Card className="py-5">
          <CardHeader>
            <CardTitle>Phân tích Sentiment</CardTitle>
            <CardDescription>Phân loại đánh giá theo mức độ hài lòng</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Rất hài lòng (5⭐)</span>
                <span className="text-sm text-green-600 font-semibold">
                  {tourStats.ratingDistribution.find((r) => r.rating === 5)?.count || 0} +{" "}
                  {platformStats.ratingDistribution.find((r) => r.rating === 5)?.count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Hài lòng (4⭐)</span>
                <span className="text-sm text-blue-600 font-semibold">
                  {tourStats.ratingDistribution.find((r) => r.rating === 4)?.count || 0} +{" "}
                  {platformStats.ratingDistribution.find((r) => r.rating === 4)?.count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Bình thường (3⭐)</span>
                <span className="text-sm text-yellow-600 font-semibold">
                  {tourStats.ratingDistribution.find((r) => r.rating === 3)?.count || 0} +{" "}
                  {platformStats.ratingDistribution.find((r) => r.rating === 3)?.count || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Không hài lòng (1-2⭐)</span>
                <span className="text-sm text-red-600 font-semibold">
                  {(tourStats.ratingDistribution.find((r) => r.rating === 1)?.count || 0) +
                    (tourStats.ratingDistribution.find((r) => r.rating === 2)?.count || 0) +
                    (platformStats.ratingDistribution.find((r) => r.rating === 1)?.count || 0) +
                    (platformStats.ratingDistribution.find((r) => r.rating === 2)?.count || 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Feedback gần đây */}
      <Card className="py-5">
        <CardHeader>
          <CardTitle>Feedback gần đây</CardTitle>
          <CardDescription>Các đánh giá mới nhất từ khách hàng</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortFeedbacksByDate(combinedFeedbacks)
              .slice(0, 5)
              .map((feedback, index) => (
                <div key={index} className="flex space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getRatingBadge(feedback.rating)}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-semibold">
                          {"customerName" in feedback ? feedback.customerName : feedback.accountName}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          {"tourName" in feedback ? `Tour: ${feedback.tourName}` : "Đánh giá hệ thống"}
                        </p>
                      </div>
                      <span className="text-xs text-muted-foreground">{formatDate(feedback)}</span>
                    </div>
                    <p className="text-sm mt-2">{feedback.content}</p>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
