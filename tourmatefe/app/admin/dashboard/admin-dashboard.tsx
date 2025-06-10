"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useCallback } from "react"
import { subMonths, format } from "date-fns"
import { Loader2 } from "lucide-react"

// Import components
import { DashboardHeader } from "./dashboard-header"
import { FinancialOverview } from "./financial-overview"
import { MembershipStatsComponent } from "./membership-stats"
import { AreaStatsComponent } from "./area-stats"
import { UserStatsComponent } from "./user-stats"
import { PerformanceStatsComponent } from "./performance-stats"
import { IssuesStatsComponent } from "./issues-stats"

// Import hooks and types
import { useAdminDashboard } from "@/hooks/userAdminDashboard"
import type { DashboardFilters as ComponentFilters } from "@/types/admin-dashboard"
import { toast } from "react-toastify"

export default function AdminDashboard() {
  const [filters, setFilters] = useState<ComponentFilters>({
    dateRange: {
      from: subMonths(new Date(), 3),
      to: new Date(),
    },
    selectedArea: "all",
  })

  // Tạo các giá trị primitive cho query key
   const fromDate = filters.dateRange?.from ? format(filters.dateRange.from, "yyyy-MM-dd") : undefined
  const toDate = filters.dateRange?.to ? format(filters.dateRange.to, "yyyy-MM-dd") : undefined
  const areaFilter = filters.selectedArea === "all" ? undefined : filters.selectedArea

  // Truyền mảng primitive vào hook
  const { data: dashboardData, isLoading, error, refetch } = useAdminDashboard(fromDate, toDate, areaFilter)

  const handleRefresh = useCallback(() => {
    toast.loading("Đang làm mới dữ liệu...")
    refetch()
      .then(() => {
        toast.dismiss()
        toast.success("Dữ liệu đã được cập nhật!")
      })
      .catch(() => {
        toast.dismiss()
        toast.error("Không thể làm mới dữ liệu")
      })
  }, [refetch])

  const handleExport = async () => {
    try {
      toast.loading("Đang tạo báo cáo...")
      await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate export
      toast.dismiss()
      toast.success("Xuất báo cáo thành công!")
    } catch (error) {
      toast.dismiss()
      console.error("Export error:", error)
      toast.error("Không thể xuất báo cáo")
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Đang tải dữ liệu dashboard...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 mb-4">Có lỗi xảy ra khi tải dữ liệu</div>
          <button onClick={handleRefresh} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <DashboardHeader
          filters={filters}
          onFiltersChange={setFilters}
          onRefresh={handleRefresh}
          onExport={handleExport}
          loading={isLoading}
        />

        {dashboardData && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="financial">Tài chính</TabsTrigger>
              <TabsTrigger value="areas">Khu vực</TabsTrigger>
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
              <TabsTrigger value="issues">Vấn đề</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <FinancialOverview data={dashboardData.financial} />
              <MembershipStatsComponent packages={dashboardData.membershipPackages} />
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6">
              <FinancialOverview data={dashboardData.financial} />
            </TabsContent>

            {/* Areas Tab */}
            <TabsContent value="areas" className="space-y-6">
              <AreaStatsComponent areas={dashboardData.areas} />
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <UserStatsComponent data={dashboardData.users} />
              <MembershipStatsComponent packages={dashboardData.membershipPackages} />
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
              <PerformanceStatsComponent topTours={dashboardData.topTours} topGuides={dashboardData.topGuides} />
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
              <IssuesStatsComponent areas={dashboardData.cancelledToursByArea} />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}