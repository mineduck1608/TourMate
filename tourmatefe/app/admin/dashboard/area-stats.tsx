"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star } from "lucide-react"
import type { AreaStats } from "@/types/admin-dashboard"

interface AreaStatsProps {
  areas: AreaStats[]
}

export function AreaStatsComponent({ areas }: AreaStatsProps) {
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
    <Card className="py-5 border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-500" />
          Thống Kê Theo Khu Vực
        </CardTitle>
        <CardDescription>Hiệu suất và thống kê chi tiết của từng vùng</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vùng</TableHead>
                <TableHead className="text-right">Tour Hoàn Thành</TableHead>
                <TableHead className="text-right">Tổng Request</TableHead>
                <TableHead className="text-right">Tỷ Lệ Thành Công</TableHead>
                <TableHead className="text-right">Đánh Giá TB</TableHead>
                <TableHead className="text-right">Doanh Thu</TableHead>
                <TableHead className="text-right">HDV Hoạt Động</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {areas.map((area) => (
                <TableRow key={area.areaId}>
                  <TableCell className="font-medium">{area.areaName}</TableCell>
                  <TableCell className="text-right">{formatNumber(area.completedTours)}</TableCell>
                  <TableCell className="text-right">{formatNumber(area.totalRequests)}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="text-green-600 border-green-200">
                      {((area.completedTours / area.totalRequests) * 100).toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      {area.averageRating}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{formatCurrency(area.totalRevenue)}</TableCell>
                  <TableCell className="text-right">{formatNumber(area.activeGuides)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
