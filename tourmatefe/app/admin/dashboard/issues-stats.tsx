"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle } from "lucide-react"
import type { AreaStats } from "@/types/admin-dashboard"

interface IssuesStatsProps {
  areas?: AreaStats[]
}

export function IssuesStatsComponent({ areas = [] }: IssuesStatsProps) {
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  console.log("IssuesStatsComponent areas:", areas)
  
  // Add null checks and default values
  const totalCancelled = areas?.reduce((sum, area) => sum + area.cancelledTours, 0) ?? 0
  const totalRequests = areas?.reduce((sum, area) => sum + area.totalRequests, 0) ?? 0
  const worstArea = areas?.length > 0 
    ? areas.reduce((max, area) =>
        area.cancelledTours / area.totalRequests > max.cancelledTours / max.totalRequests ? area : max
      )
    : null

  if (!areas?.length) {
    return (
      <Card className="py-5 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            Tour Bị Hủy Theo Vùng
          </CardTitle>
          <CardDescription>Không có dữ liệu</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="py-5 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-red-500" />
          Tour Bị Hủy Theo Vùng
        </CardTitle>
        <CardDescription>Thống kê và phân tích các tour bị hủy</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            {areas.map((area) => (
              <div key={area.areaId} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{area.areaName}</p>
                  <p className="text-sm text-gray-500">{formatNumber(area.cancelledTours)} tour bị hủy</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-red-600">{formatNumber(area.cancelledTours)}</p>
                  <p className="text-sm text-gray-500">
                    {((area.cancelledTours / area.totalRequests) * 100).toFixed(1)}% tỷ lệ hủy
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="bg-red-50 p-6 rounded-lg">
            <h3 className="font-semibold text-red-800 mb-4">Phân Tích Tổng Quan</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Tổng tour bị hủy:</span>
                <span className="font-semibold text-red-600">{formatNumber(totalCancelled)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tỷ lệ hủy trung bình:</span>
                <span className="font-semibold text-red-600">
                  {((totalCancelled / totalRequests) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between">
                <span>Vùng có tỷ lệ hủy cao nhất:</span>
                <span className="font-semibold text-red-600">{worstArea ? worstArea.areaName : "Không có dữ liệu"}</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
