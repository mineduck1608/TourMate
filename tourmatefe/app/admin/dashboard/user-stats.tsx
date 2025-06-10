"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, UserPlus, Star } from "lucide-react"
import type { UserStats } from "@/types/admin-dashboard"

interface UserStatsProps {
  data: UserStats
}

export function UserStatsComponent({ data }: UserStatsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="py-5 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            Thống Kê Người Dùng
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <UserPlus className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{formatNumber(data.newUsers)}</div>
              <div className="text-sm text-green-700">User mới</div>
            </div>
          </div>
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-3xl font-bold text-blue-600 mb-2">+{data.userGrowthRate.toFixed(1)}%</div>
            <div className="text-sm text-blue-700">Tăng trưởng user</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 mb-2">{formatNumber(data.totalActiveUsers)}</div>
            <div className="text-sm text-gray-700">Tổng user hoạt động</div>
          </div>
        </CardContent>
      </Card>

      <Card className="py-5 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Thống Kê Hướng Dẫn Viên
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <UserPlus className="w-8 h-8 text-green-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">{formatNumber(data.newGuides)}</div>
              <div className="text-sm text-green-700">HDV mới</div>
            </div>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg">
            <div className="text-3xl font-bold text-yellow-600 mb-2">+{data.guideGrowthRate.toFixed(1)}%</div>
            <div className="text-sm text-yellow-700">Tăng trưởng HDV</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-gray-600 mb-2">{formatNumber(data.totalActiveGuides)}</div>
            <div className="text-sm text-gray-700">Tổng HDV hoạt động</div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
