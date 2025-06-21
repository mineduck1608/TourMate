import { MessageSquare, Star, TrendingUp, Calendar } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface FeedbackStatsProps {
  tourStats: {
    total: number
    avgRating: number
  }
  platformStats: {
    total: number
    avgRating: number
  }
  topTourGuide: {
    name: string
    avgRating: number
    count: number
  } | null
  recentCount: number
}

export default function FeedbackStats({ tourStats, platformStats, topTourGuide, recentCount }: FeedbackStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="py-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng đánh giá Tour</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{tourStats.total}</div>
          <p className="text-xs text-muted-foreground">
            Trung bình: {typeof tourStats.avgRating === "number" ? tourStats.avgRating.toFixed(1) : "N/A"} ⭐
          </p>
        </CardContent>
      </Card>

      <Card className="py-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng đánh giá Hệ thống</CardTitle>
          <Star className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{platformStats.total}</div>
          <p className="text-xs text-muted-foreground">
            Trung bình: {typeof platformStats.avgRating === "number" ? platformStats.avgRating.toFixed(1) : "N/A"} ⭐
          </p>
        </CardContent>
      </Card>

      <Card className="py-5" >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Hướng dẫn viên tốt nhất</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold">{topTourGuide?.name || "N/A"}</div>
          <p className="text-xs text-muted-foreground">
            {topTourGuide && typeof topTourGuide.avgRating === "number"
              ? `${topTourGuide.avgRating.toFixed(1)} ⭐ (${topTourGuide.count} đánh giá)`
              : "Chưa có dữ liệu"}
          </p>
        </CardContent>
      </Card>

      <Card className="py-5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Đánh giá gần đây</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{recentCount}</div>
          <p className="text-xs text-muted-foreground">Trong 7 ngày qua</p>
        </CardContent>
      </Card>
    </div>
  )
}
