// Import API hooks thay vì mock data
import { useTourFeedbackStats, useTopTourGuides } from "@/hooks/use-feedback"
import { usePlatformFeedbackStats } from "@/hooks/use-platform-feedback"
import FeedbackStats from "./feedback-stats"
import RatingDistribution from "./rating-distribution"
import TopTourGuides from "./top-tour-guides"

export default function FeedbackOverview() {
  // Sử dụng API hooks
  const { data: tourStats, isLoading: tourStatsLoading } = useTourFeedbackStats()
  const { data: platformStats, isLoading: platformStatsLoading } = usePlatformFeedbackStats()
  const { data: topTourGuides, isLoading: topGuidesLoading } = useTopTourGuides(10)

  // Loading state
  if (tourStatsLoading || platformStatsLoading || topGuidesLoading) {
    return <div>Đang tải dữ liệu...</div>
  }

  // Default values if no data
  const defaultStats = {
    totalFeedbacks: 0,
    averageRating: 0,
    ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: 0,
      percentage: 0,
    })),
  }

  const tourStatsData = tourStats || defaultStats
  const platformStatsData = platformStats || defaultStats
  const topTourGuidesData = topTourGuides || []

  // Calculate recent count (this might need a separate API endpoint)
  const recentCount = 0 // TODO: Implement recent feedback count API

  console.log(topTourGuidesData)

  return (
    <div className="space-y-6">
      <FeedbackStats
        tourStats={{
          total: tourStatsData.totalFeedbacks,
          avgRating: tourStatsData.averageRating,
        }}
        platformStats={{
          total: platformStatsData.totalFeedbacks,
          avgRating: platformStatsData.averageRating,
        }}
        topTourGuide={topTourGuidesData[0] || null}
        recentCount={recentCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingDistribution
          title="Phân bố đánh giá Tour"
          description="Thống kê số sao đánh giá tour"
          ratingDistribution={tourStatsData.ratingDistribution}
        />
        <RatingDistribution
          title="Phân bố đánh giá Hệ thống"
          description="Thống kê số sao đánh giá hệ thống"
          ratingDistribution={platformStatsData.ratingDistribution}
        />
      </div>

      <TopTourGuides guides={topTourGuidesData} />
    </div>
  )
}
