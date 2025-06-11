"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trophy, Star } from "lucide-react"
import type { TourPerformance, GuidePerformance } from "@/types/admin-dashboard"

interface PerformanceStatsProps {
  topTours: TourPerformance[]
  topGuides: GuidePerformance[]
}

export function PerformanceStatsComponent({ topTours, topGuides }: PerformanceStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="py-5 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-yellow-500" />
            Top Tour Có Lợi Nhuận Cao Nhất
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topTours.map((tour, index) => (
              <div key={tour.tourId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-600"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium truncate max-w-50">{tour.tourTitle}</p>
                    <p className="text-sm text-gray-500">{tour.areaName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">{formatCurrency(tour.profit)}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>{tour.averageBids} lượt đặt</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-yellow-500" />
                      <span>{tour.averageRating}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="py-5 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-blue-500" />
            Top Hướng Dẫn Viên Xuất Sắc
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topGuides.map((guide, index) => (
              <div key={guide.guideId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${index === 0 ? "bg-blue-500" : index === 1 ? "bg-blue-400" : "bg-blue-300"
                      }`}
                  >
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium">{guide.guideName}</p>
                    <p className="text-sm text-gray-500">{guide.areaName}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 mb-1">
                    <Star className="w-4 h-4 text-yellow-500" />
                    <span className="font-semibold">{guide.averageRating}</span>
                  </div>
                  <div className="text-sm text-gray-500">
                    <p>{formatNumber(guide.totalTours)} tour</p>
                    <p>{guide.completionRate.toFixed(1)}% hoàn thành</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
