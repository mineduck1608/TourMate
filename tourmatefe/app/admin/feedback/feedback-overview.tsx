import FeedbackStats from "./feedback-stats"
import RatingDistribution from "./rating-distribution"
import TopTourGuides from "./top-tour-guides"
import { tourFeedbacks, platformFeedbacks } from "./data/feedback-data"
// Import utility functions
import { isRecentFeedback } from "./utils/date-utils"

export default function FeedbackOverview() {
  // Tính toán thống kê
  const tourStats = {
    total: tourFeedbacks.length,
    avgRating: tourFeedbacks.reduce((sum, f) => sum + f.rating, 0) / tourFeedbacks.length,
    ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: tourFeedbacks.filter((f) => f.rating === rating).length,
      percentage: (tourFeedbacks.filter((f) => f.rating === rating).length / tourFeedbacks.length) * 100,
    })),
  }

  const platformStats = {
    total: platformFeedbacks.length,
    avgRating: platformFeedbacks.reduce((sum, f) => sum + f.rating, 0) / platformFeedbacks.length,
    ratingDistribution: [1, 2, 3, 4, 5].map((rating) => ({
      rating,
      count: platformFeedbacks.filter((f) => f.rating === rating).length,
      percentage: (platformFeedbacks.filter((f) => f.rating === rating).length / platformFeedbacks.length) * 100,
    })),
  }

  // Top hướng dẫn viên
  const topTourGuides = Object.values(
    tourFeedbacks.reduce(
      (acc, feedback) => {
        if (!acc[feedback.tourGuideId]) {
          acc[feedback.tourGuideId] = {
            id: feedback.tourGuideId,
            name: feedback.tourGuideName,
            totalRating: 0,
            count: 0,
            avgRating: 0,
          }
        }
        acc[feedback.tourGuideId].totalRating += feedback.rating
        acc[feedback.tourGuideId].count += 1
        acc[feedback.tourGuideId].avgRating = acc[feedback.tourGuideId].totalRating / acc[feedback.tourGuideId].count
        return acc
      },
      {} as Record<number, any>,
    ),
  ).sort((a, b) => b.avgRating - a.avgRating)

  // Feedback gần đây
  // Update the recentCount calculation
  const recentCount = [...tourFeedbacks, ...platformFeedbacks].filter((f) => isRecentFeedback(f, 7)).length

  return (
    <div className="space-y-6">
      <FeedbackStats
        tourStats={tourStats}
        platformStats={platformStats}
        topTourGuide={topTourGuides[0] || null}
        recentCount={recentCount}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RatingDistribution
          title="Phân bố đánh giá Tour"
          description="Thống kê số sao đánh giá tour"
          ratingDistribution={tourStats.ratingDistribution}
        />
        <RatingDistribution
          title="Phân bố đánh giá Hệ thống"
          description="Thống kê số sao đánh giá hệ thống"
          ratingDistribution={platformStats.ratingDistribution}
        />
      </div>

      <TopTourGuides guides={topTourGuides} />
    </div>
  )
}
