"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Crown, Star, Zap, TrendingUp } from "lucide-react"
import { MembershipStatus } from "@/app/api/admin.api"

interface MembershipStatsProps {
  packages: MembershipStatus[]
}

export function MembershipStatsComponent({ packages }: MembershipStatsProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getPackageIcon = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case "basic":
        return <Star className="w-5 h-5 text-blue-500" />
      case "premium":
        return <Zap className="w-5 h-5 text-purple-500" />
      case "enterprise":
        return <Crown className="w-5 h-5 text-yellow-500" />
      default:
        return <Star className="w-5 h-5 text-gray-500" />
    }
  }

  const getPackageColor = (packageName: string) => {
    switch (packageName.toLowerCase()) {
      case "basic":
        return "from-blue-500 to-blue-600"
      case "premium":
        return "from-purple-500 to-purple-600"
      case "enterprise":
        return "from-yellow-500 to-yellow-600"
      default:
        return "from-gray-500 to-gray-600"
    }
  }

 // ...existing code...

  const totalSales = packages.reduce((sum, pkg) => sum + pkg.totalSales, 0)
  const totalRevenue = packages.reduce((sum, pkg) => sum + pkg.revenue, 0)

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <Card key={pkg.packageId} className="py-5 border-0 shadow-lg overflow-hidden">
            <div className={`h-2 bg-gradient-to-r ${getPackageColor(pkg.packageName)}`} />
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPackageIcon(pkg.packageName)}
                  <span className="capitalize">{pkg.packageName}</span>
                </div>
                <Badge variant="outline" className={`border-green-200 ${pkg.growthRate === 0 ? "text-gray-400 border-gray-200" : "text-green-600"}`}>
                  {pkg.growthRate === 0 ? "Không có dữ liệu tháng trước" : (pkg.growthRate > 0 ? "+" : "") + pkg.growthRate.toFixed(1) + "%"}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Số lượng bán</p>
                  <p className="text-xl font-bold">{pkg.totalSales ?? "Không có dữ liệu"}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Doanh thu</p>
                  <p className="text-xl font-bold text-green-600">{pkg.revenue == null ? "Không có dữ liệu" : formatCurrency(pkg.revenue)}</p>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Thị phần</span>
                  <span className="font-semibold">
                    {totalSales === 0 ? "Không có dữ liệu" : ((pkg.totalSales / totalSales) * 100).toFixed(1) + "%"}
                  </span>
                </div>
                <Progress value={totalSales === 0 ? 0 : (pkg.totalSales / totalSales) * 100} className="h-2" />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Giá: {pkg.price == null ? "Không có dữ liệu" : formatCurrency(pkg.price)}</p>
                <p className="text-sm text-gray-500">Thời hạn: {pkg.duration ?? "Không có dữ liệu"}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Detailed Analysis */}
      <Card className="py-5 border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            Phân Tích Chi Tiết Gói Membership
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Breakdown */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Phân Bổ Doanh Thu</h3>
              {packages.map((pkg) => (
                <div key={pkg.packageId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {getPackageIcon(pkg.packageName)}
                    <div>
                      <p className="font-medium capitalize">{pkg.packageName}</p>
                      <p className="text-sm text-gray-500">{pkg.totalSales ?? "Không có dữ liệu"} gói đã bán</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-green-600">{pkg.revenue == null ? "Không có dữ liệu" : formatCurrency(pkg.revenue)}</p>
                    <p className="text-sm text-gray-500">
                      {totalRevenue === 0 ? "Không có dữ liệu" : ((pkg.revenue / totalRevenue) * 100).toFixed(1) + "% tổng doanh thu"}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Growth Analysis */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-800">Phân Tích Tăng Trưởng</h3>
              {packages.map((pkg) => (
                <div key={pkg.packageId} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="capitalize font-medium">{pkg.packageName}</span>
                    <span className={`font-semibold ${pkg.growthRate > 0 ? "text-green-600" : pkg.growthRate < 0 ? "text-red-600" : "text-gray-400"}`}>
                      {pkg.growthRate === 0 ? "Không có dữ liệu tháng trước" : (pkg.growthRate > 0 ? "+" : "") + pkg.growthRate.toFixed(1) + "%"}
                    </span>
                  </div>
                  <Progress
                    value={pkg.growthRate === 0 ? 0 : Math.abs(pkg.growthRate)}
                    className={`h-2 ${pkg.growthRate > 0 ? "bg-green-100" : pkg.growthRate < 0 ? "bg-red-100" : "bg-gray-100"}`}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Summary Stats */}
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{totalSales || "Không có dữ liệu"}</div>
                <div className="text-sm text-blue-700">Tổng gói đã bán</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{totalRevenue == 0 ? "Không có dữ liệu" : formatCurrency(totalRevenue)}</div>
                <div className="text-sm text-green-700">Tổng doanh thu</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {totalSales === 0 ? "Không có dữ liệu" : formatCurrency(totalRevenue / totalSales)}
                </div>
                <div className="text-sm text-purple-700">Giá trung bình</div>
              </div>
              <div className="text-center p-4 bg-yellow-50 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {
                    totalSales === 0
                      ? "Không có dữ liệu"
                      : packages.find((p) => p.totalSales === Math.max(...packages.map((pkg) => pkg.totalSales)))?.packageName
                  }
                </div>
                <div className="text-sm text-yellow-700">Gói phổ biến nhất</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
