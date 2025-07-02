"use client"

import { Clock, CheckCircle, Users, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DashboardStatsAdmin } from "@/types/revenue"

interface DashboardStatsProps {
  data: DashboardStatsAdmin | null
  loading: boolean
  formatCurrency: (amount: number) => string
}

export function DashboardStats({ data, loading, formatCurrency }: DashboardStatsProps) {
  const statsCards = [
    {
      title: "Chờ thanh toán",
      icon: Clock,
      gradient: "from-blue-500 to-blue-600",
      textColor: "text-blue-100",
      iconColor: "text-blue-200",
      amount: data?.totalUnpaidAmount || 0,
      count: data?.totalUnpaidCount || 0,
      countLabel: "giao dịch"
    },
    {
      title: "Đã thanh toán tháng này",
      icon: CheckCircle,
      gradient: "from-green-500 to-green-600",
      textColor: "text-green-100",
      iconColor: "text-green-200",
      amount: data?.totalPaidThisMonth || 0,
      count: data?.totalPaidCountThisMonth || 0,
      countLabel: "giao dịch"
    },
    {
      title: "Hướng dẫn viên",
      icon: Users,
      gradient: "from-purple-500 to-purple-600",
      textColor: "text-purple-100",
      iconColor: "text-purple-200",
      amount: data?.totalTourGuidesWithUnpaidRevenues || 0,
      count: null,
      countLabel: "Có hoa hồng chờ thanh toán"
    }
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6 mb-6 lg:mb-8">
      {statsCards.map((card, index) => {
        const Icon = card.icon
        return (
          <Card
            key={index}
            className={`bg-gradient-to-r ${card.gradient} text-white py-5 border-0 shadow-lg hover:shadow-xl transition-shadow`}
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className={`text-xs sm:text-sm font-medium ${card.textColor}`}>
                {card.title}
              </CardTitle>
              <Icon className={`h-4 w-4 ${card.iconColor}`} />
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span className="text-sm">Đang tải...</span>
                </div>
              ) : (
                <>
                  <div className="text-xl lg:text-2xl font-bold">
                    {card.count !== null ? formatCurrency(card.amount) : card.amount}
                  </div>
                  <p className={`text-xs ${card.textColor}`}>
                    {card.count !== null ? `${card.count} ${card.countLabel}` : card.countLabel}
                  </p>
                </>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
