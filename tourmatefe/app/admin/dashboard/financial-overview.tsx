"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { DollarSign, TrendingUp, TrendingDown, CreditCard, Users, BarChart3 } from "lucide-react"
import type { FinancialStats } from "@/types/admin-dashboard"

interface FinancialOverviewProps {
  data: FinancialStats
}

export function FinancialOverview({ data }: FinancialOverviewProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  return (
    <div className="space-y-6">
      {/* Revenue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-100">Tổng Doanh Thu</CardTitle>
            <DollarSign className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.totalRevenue)}</div>
            <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(data.revenueGrowth)}`}>
              {getGrowthIcon(data.revenueGrowth)}
              <p className="text-xs text-green-100">
                {data.revenueGrowth > 0 ? "+" : ""}
                {data.revenueGrowth.toFixed(1)}% so với kỳ trước
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-100">Hoa Hồng Tour</CardTitle>
            <CreditCard className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.tourCommissionRevenue)}</div>
            <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(data.commissionGrowth)}`}>
              {getGrowthIcon(data.commissionGrowth)}
              <p className="text-xs text-blue-100">
                {data.commissionGrowth > 0 ? "+" : ""}
                {data.commissionGrowth.toFixed(1)}% so với kỳ trước
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-purple-100">Doanh Thu Membership</CardTitle>
            <Users className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.membershipRevenue)}</div>
            <div className={`flex items-center gap-1 mt-2 ${getGrowthColor(data.membershipGrowth)}`}>
              {getGrowthIcon(data.membershipGrowth)}
              <p className="text-xs text-purple-100">
                {data.membershipGrowth > 0 ? "+" : ""}
                {data.membershipGrowth.toFixed(1)}% so với kỳ trước
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-orange-500 to-red-600 text-white">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-100">Lợi Nhuận Ròng</CardTitle>
            <TrendingUp className="w-5 h-5" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(data.netProfit)}</div>
            <p className="text-xs text-orange-100 mt-2">Tỷ suất: {data.profitMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Financial Analysis */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="py-5 lg:col-span-2 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-green-500" />
              Phân Tích Doanh Thu Chi Tiết
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Tổng doanh thu:</span>
                  <span className="font-semibold text-lg text-green-600">{formatCurrency(data.totalRevenue)}</span>
                </div>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Hoa hồng tour:</span>
                  <span className="font-semibold text-lg text-blue-600">
                    {formatCurrency(data.tourCommissionRevenue)}
                  </span>
                </div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Membership:</span>
                  <span className="font-semibold text-lg text-purple-600">
                    {formatCurrency(data.membershipRevenue)}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Tỷ suất lợi nhuận</span>
                <span className="font-semibold text-orange-600">{data.profitMargin.toFixed(1)}%</span>
              </div>
              <Progress value={data.profitMargin} className="h-3" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-lg font-bold text-blue-600">
                  {((data.tourCommissionRevenue / data.totalRevenue) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-blue-700">Tỷ trọng hoa hồng</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-lg font-bold text-purple-600">
                  {((data.membershipRevenue / data.totalRevenue) * 100).toFixed(1)}%
                </div>
                <div className="text-sm text-purple-700">Tỷ trọng membership</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="py-5 border-0 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-blue-500" />
              Tăng Trưởng
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-500 mb-2">+{data.revenueGrowth.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Tăng trưởng tổng doanh thu</p>
            </div>
            <Separator />
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-500 mb-2">+{data.commissionGrowth.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Tăng trưởng hoa hồng</p>
            </div>
            <Separator />
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-500 mb-2">+{data.membershipGrowth.toFixed(1)}%</div>
              <p className="text-sm text-gray-600">Tăng trưởng membership</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
