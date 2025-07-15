"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useState, useCallback } from "react"
import { format } from "date-fns"
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
import type { AreaData, DashboardFilters as ComponentFilters, GuideData, MembershipPackageData, TourData } from "@/types/admin-dashboard"
import { toast } from "react-toastify"
import { startOfMonth, endOfMonth } from "date-fns"
import { createExcelWorkbook, addWorksheetToWorkbook, exportToExcel, formatCurrencyForExcel } from "@/lib/export-utils"


export default function AdminDashboard() {

  const now = new Date()

  const [filters, setFilters] = useState<ComponentFilters>({
    dateRange: {
      from: startOfMonth(now), // 👈 Lấy đầu tháng hiện tại
      to: endOfMonth(now),     // 👈 Lấy cuối tháng hiện tại
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
      toast.loading("Đang tạo báo cáo tổng hợp...")
      
      if (!dashboardData) {
        toast.dismiss()
        toast.error("Không có dữ liệu để xuất")
        return
      }

      const wb = createExcelWorkbook();
      
      // 1. Tổng quan tài chính
      if (dashboardData.financial) {
        const financialData = [
          {
            "Chỉ Số": "Tổng Doanh Thu",
            "Giá Trị (VND)": formatCurrencyForExcel(dashboardData.financial.totalRevenue),
            "Tăng Trưởng (%)": dashboardData.financial.revenueGrowth?.toFixed(1) || "0",
            "Ghi Chú": "Tổng doanh thu hệ thống"
          },
          {
            "Chỉ Số": "Doanh Thu Hoa Hồng Tour",
            "Giá Trị (VND)": formatCurrencyForExcel(dashboardData.financial.tourCommissionRevenue),
            "Tăng Trưởng (%)": dashboardData.financial.commissionGrowth?.toFixed(1) || "0",
            "Ghi Chú": "Hoa hồng từ tour"
          },
          {
            "Chỉ Số": "Doanh Thu Membership",
            "Giá Trị (VND)": formatCurrencyForExcel(dashboardData.financial.membershipRevenue),
            "Tăng Trưởng (%)": dashboardData.financial.membershipGrowth?.toFixed(1) || "0",
            "Ghi Chú": "Thu từ gói membership"
          },
          {
            "Chỉ Số": "Lợi Nhuận Ròng",
            "Giá Trị (VND)": formatCurrencyForExcel(dashboardData.financial.netProfit),
            "Tăng Trưởng (%)": "N/A",
            "Ghi Chú": `Biên lợi nhuận: ${dashboardData.financial.profitMargin?.toFixed(2) || 0}%`
          }
        ];
        addWorksheetToWorkbook(wb, financialData, "Tài Chính");
      }

      // 2. Thống kê người dùng
      if (dashboardData.users) {
        const userStatsData = [
          {
            "Loại Người Dùng": "Người dùng mới",
            "Số Lượng": dashboardData.users.newUsers || 0,
            "Tăng Trưởng (%)": dashboardData.users.userGrowthRate?.toFixed(1) || "0",
            "Mô Tả": "Người dùng đăng ký mới"
          },
          {
            "Loại Người Dùng": "Hướng dẫn viên mới",
            "Số Lượng": dashboardData.users.newGuides || 0,
            "Tăng Trưởng (%)": dashboardData.users.guideGrowthRate?.toFixed(1) || "0",
            "Mô Tả": "HDV đăng ký mới"
          },
          {
            "Loại Người Dùng": "Tổng người dùng hoạt động",
            "Số Lượng": dashboardData.users.totalActiveUsers || 0,
            "Tăng Trưởng (%)": "N/A",
            "Mô Tả": "Tổng người dùng đang hoạt động"
          },
          {
            "Loại Người Dùng": "Tổng HDV hoạt động",
            "Số Lượng": dashboardData.users.totalActiveGuides || 0,
            "Tăng Trưởng (%)": "N/A",
            "Mô Tả": "Tổng HDV đang hoạt động"
          }
        ];
        addWorksheetToWorkbook(wb, userStatsData, "Người Dùng");
      }

      // 3. Thống kê khu vực
      if (dashboardData.areas && dashboardData.areas.length > 0) {
        const areaStatsData = dashboardData.areas.map((area: AreaData, index: number) => ({
          "STT": index + 1,
          "Tên Khu Vực": area.areaName || "N/A",
          "Tour Hoàn Thành": area.completedTours || 0,
          "Tổng Yêu Cầu": area.totalRequests || 0,
          "Đánh Giá TB": area.averageRating?.toFixed(2) || "0",
          "Doanh Thu (VND)": formatCurrencyForExcel(area.totalRevenue || 0),
          "Tour Hủy": area.cancelledTours || 0,
          "HDV Hoạt Động": area.activeGuides || 0
        }));
        addWorksheetToWorkbook(wb, areaStatsData, "Khu Vực");
      }

      // 4. Hiệu suất tour
      if (dashboardData.topTours && dashboardData.topTours.length > 0) {
        const tourPerformanceData = dashboardData.topTours.map((tour: TourData, index: number) => ({
          "STT": index + 1,
          "Tên Tour": tour.tourTitle || "N/A",
          "Khu Vực": tour.areaName || "N/A",
          "Lợi Nhuận (VND)": formatCurrencyForExcel(tour.profit || 0),
          "Bid TB": tour.averageBids?.toFixed(0) || "0",
          "Đánh Giá": tour.averageRating?.toFixed(2) || "0",
          "Số Lần Hoàn Thành": tour.completedCount || 0
        }));
        addWorksheetToWorkbook(wb, tourPerformanceData, "Top Tour");
      }

      // 5. Hiệu suất HDV
      if (dashboardData.topGuides && dashboardData.topGuides.length > 0) {
        const guidePerformanceData = dashboardData.topGuides.map((guide: GuideData, index: number) => ({
          "STT": index + 1,
          "Tên HDV": guide.guideName || "N/A",
          "Khu Vực": guide.areaName || "N/A",
          "Đánh Giá TB": guide.averageRating?.toFixed(2) || "0",
          "Tổng Tour": guide.totalTours || 0,
          "Doanh Thu (VND)": formatCurrencyForExcel(guide.totalRevenue || 0)
        }));
        addWorksheetToWorkbook(wb, guidePerformanceData, "Top HDV");
      }

      // 6. Gói membership
      if (dashboardData.membershipPackages && dashboardData.membershipPackages.length > 0) {
        const membershipData = dashboardData.membershipPackages.map((pkg: MembershipPackageData, index: number) => ({
          "STT": index + 1,
          "Tên Gói": pkg.packageName || "N/A",
          "Giá (VND)": formatCurrencyForExcel(pkg.price || 0),
          "Thời Hạn": pkg.duration || "N/A",
          "Số Lượng Bán": pkg.totalSales || 0,
          "Doanh Thu (VND)": formatCurrencyForExcel(pkg.revenue || 0),
          "Tăng Trưởng (%)": pkg.growthRate?.toFixed(2) || "0"
        }));
        addWorksheetToWorkbook(wb, membershipData, "Membership");
      }

      // Xuất file
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      exportToExcel(wb, `BaoCaoTongHop_Dashboard_${dateStr}_${timeStr}`);
      
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
      <div className="mx-auto space-y-6">
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