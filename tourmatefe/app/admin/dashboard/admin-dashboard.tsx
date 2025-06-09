"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Users,
  MapPin,
  Star,
  AlertTriangle,
  Download,
  RefreshCw,
  Loader2,
  UserPlus,
  UserMinus,
  Trophy,
  Target,
  BarChart3,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { subMonths, format } from "date-fns"
import type { DateRange } from "react-day-picker"

// Types for Admin Dashboard
interface FinancialStats {
  totalRevenue: number
  totalExpenses: number
  netProfit: number
  profitMargin: number
  revenueGrowth: number
  expenseGrowth: number
}

interface RegionStats {
  regionId: number
  regionName: string
  completedTours: number
  totalRequests: number
  averageRating: number
  totalRevenue: number
  cancelledTours: number
  activeGuides: number
}

interface UserStats {
  newUsers: number
  leftUsers: number
  newGuides: number
  leftGuides: number
  totalActiveUsers: number
  totalActiveGuides: number
  userGrowthRate: number
  guideGrowthRate: number
}

interface TourPerformance {
  tourId: number
  tourTitle: string
  regionName: string
  profit: number
  averageBids: number
  averageRating: number
  completedCount: number
}

interface GuidePerformance {
  guideId: number
  guideName: string
  regionName: string
  averageRating: number
  totalTours: number
  totalRevenue: number
  completionRate: number
}

interface DashboardData {
  financial: FinancialStats
  regions: RegionStats[]
  users: UserStats
  topTours: TourPerformance[]
  topGuides: GuidePerformance[]
  cancelledToursByRegion: RegionStats[]
}

export default function AdminDashboard() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subMonths(new Date(), 3),
    to: new Date(),
  })
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(false)

  // Mock data - replace with actual API calls
  const mockData: DashboardData = {
    financial: {
      totalRevenue: 2450000000,
      totalExpenses: 1680000000,
      netProfit: 770000000,
      profitMargin: 31.4,
      revenueGrowth: 15.2,
      expenseGrowth: 8.7,
    },
    regions: [
      {
        regionId: 1,
        regionName: "Hà Nội",
        completedTours: 1250,
        totalRequests: 1890,
        averageRating: 4.7,
        totalRevenue: 890000000,
        cancelledTours: 45,
        activeGuides: 156,
      },
      {
        regionId: 2,
        regionName: "TP.HCM",
        completedTours: 1180,
        totalRequests: 1750,
        averageRating: 4.6,
        totalRevenue: 820000000,
        cancelledTours: 38,
        activeGuides: 142,
      },
      {
        regionId: 3,
        regionName: "Đà Nẵng",
        completedTours: 890,
        totalRequests: 1320,
        averageRating: 4.8,
        totalRevenue: 650000000,
        cancelledTours: 28,
        activeGuides: 98,
      },
      {
        regionId: 4,
        regionName: "Nha Trang",
        completedTours: 720,
        totalRequests: 1100,
        averageRating: 4.5,
        totalRevenue: 520000000,
        cancelledTours: 32,
        activeGuides: 87,
      },
      {
        regionId: 5,
        regionName: "Hạ Long",
        completedTours: 650,
        totalRequests: 980,
        averageRating: 4.9,
        totalRevenue: 480000000,
        cancelledTours: 18,
        activeGuides: 76,
      },
    ],
    users: {
      newUsers: 2340,
      leftUsers: 180,
      newGuides: 89,
      leftGuides: 12,
      totalActiveUsers: 45600,
      totalActiveGuides: 1250,
      userGrowthRate: 12.8,
      guideGrowthRate: 8.9,
    },
    topTours: [
      {
        tourId: 1,
        tourTitle: "Khám phá Hà Nội cổ kính",
        regionName: "Hà Nội",
        profit: 15600000,
        averageBids: 8.5,
        averageRating: 4.9,
        completedCount: 45,
      },
      {
        tourId: 2,
        tourTitle: "Sài Gòn về đêm",
        regionName: "TP.HCM",
        profit: 14200000,
        averageBids: 7.8,
        averageRating: 4.7,
        completedCount: 38,
      },
      {
        tourId: 3,
        tourTitle: "Bà Nà Hills Adventure",
        regionName: "Đà Nẵng",
        profit: 13800000,
        averageBids: 9.2,
        averageRating: 4.8,
        completedCount: 42,
      },
    ],
    topGuides: [
      {
        guideId: 1,
        guideName: "Nguyễn Văn An",
        regionName: "Hà Nội",
        averageRating: 4.95,
        totalTours: 156,
        totalRevenue: 89000000,
        completionRate: 98.5,
      },
      {
        guideId: 2,
        guideName: "Trần Thị Bình",
        regionName: "TP.HCM",
        averageRating: 4.92,
        totalTours: 142,
        totalRevenue: 82000000,
        completionRate: 97.8,
      },
      {
        guideId: 3,
        guideName: "Lê Minh Cường",
        regionName: "Đà Nẵng",
        averageRating: 4.89,
        totalTours: 134,
        totalRevenue: 76000000,
        completionRate: 96.9,
      },
    ],
    cancelledToursByRegion: [
      {
        regionId: 1,
        regionName: "Hà Nội",
        cancelledTours: 45,
        completedTours: 1250,
        totalRequests: 1890,
        averageRating: 4.7,
        totalRevenue: 890000000,
        activeGuides: 156,
      },
      {
        regionId: 2,
        regionName: "TP.HCM",
        cancelledTours: 38,
        completedTours: 1180,
        totalRequests: 1750,
        averageRating: 4.6,
        totalRevenue: 820000000,
        activeGuides: 142,
      },
    ],
  }

  const fetchDashboardData = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setDashboardData(mockData)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [dateRange, selectedRegion])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat("vi-VN").format(num)
  }

  const getGrowthColor = (growth: number) => {
    return growth >= 0 ? "text-green-600" : "text-red-600"
  }

  const getGrowthIcon = (growth: number) => {
    return growth >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />
  }

  if (loading && !dashboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Đang tải dữ liệu dashboard...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-slate-50 via-white to-blue-50 p-4 md:p-5">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">Dashboard Quản Trị</h1>

              {/* Filters */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <DatePickerWithRange
                    date={dateRange}
                    onDateChange={setDateRange}
                    className="bg-white/20 border-white/30 text-white"
                    maxRange={180} // 6 months
                  />

                  <Select value={selectedRegion} onValueChange={setSelectedRegion}>
                    <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                      <SelectValue placeholder="Chọn vùng" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tất cả vùng</SelectItem>
                      <SelectItem value="hanoi">Hà Nội</SelectItem>
                      <SelectItem value="hcm">TP.HCM</SelectItem>
                      <SelectItem value="danang">Đà Nẵng</SelectItem>
                      <SelectItem value="nhatrang">Nha Trang</SelectItem>
                      <SelectItem value="halong">Hạ Long</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 text-slate-200">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm">Cập nhật: {format(new Date(), "dd/MM/yyyy HH:mm")}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất báo cáo
              </Button>
              <Button
                size="sm"
                className="bg-white text-slate-800 hover:bg-gray-100"
                onClick={fetchDashboardData}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {dashboardData && (
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="overview">Tổng quan</TabsTrigger>
              <TabsTrigger value="financial">Tài chính</TabsTrigger>
              <TabsTrigger value="regions">Khu vực</TabsTrigger>
              <TabsTrigger value="users">Người dùng</TabsTrigger>
              <TabsTrigger value="performance">Hiệu suất</TabsTrigger>
              <TabsTrigger value="issues">Vấn đề</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {/* Financial Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-green-100">Tổng Thu Nhập</CardTitle>
                    <DollarSign className="w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.financial.totalRevenue)}</div>
                    <div
                      className={`flex items-center gap-1 mt-2 ${getGrowthColor(dashboardData.financial.revenueGrowth)}`}
                    >
                      {getGrowthIcon(dashboardData.financial.revenueGrowth)}
                      <p className="text-xs text-green-100">
                        {dashboardData.financial.revenueGrowth > 0 ? "+" : ""}
                        {dashboardData.financial.revenueGrowth.toFixed(1)}% so với kỳ trước
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-red-100">Tổng Chi Phí</CardTitle>
                    <TrendingDown className="w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.financial.totalExpenses)}</div>
                    <div
                      className={`flex items-center gap-1 mt-2 ${getGrowthColor(dashboardData.financial.expenseGrowth)}`}
                    >
                      {getGrowthIcon(dashboardData.financial.expenseGrowth)}
                      <p className="text-xs text-red-100">
                        {dashboardData.financial.expenseGrowth > 0 ? "+" : ""}
                        {dashboardData.financial.expenseGrowth.toFixed(1)}% so với kỳ trước
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-blue-100">Lợi Nhuận Ròng</CardTitle>
                    <TrendingUp className="w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatCurrency(dashboardData.financial.netProfit)}</div>
                    <p className="text-xs text-blue-100 mt-2">
                      Tỷ suất: {dashboardData.financial.profitMargin.toFixed(1)}%
                    </p>
                  </CardContent>
                </Card>

                <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium text-purple-100">Người Dùng Hoạt Động</CardTitle>
                    <Users className="w-5 h-5" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatNumber(dashboardData.users.totalActiveUsers)}</div>
                    <p className="text-xs text-purple-100 mt-2">
                      {formatNumber(dashboardData.users.totalActiveGuides)} hướng dẫn viên
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Top Regions */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="py-5 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      Top Vùng Có Nhiều Tour Nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.regions.slice(0, 5).map((region, index) => (
                        <div key={region.regionId} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0
                                  ? "bg-yellow-500"
                                  : index === 1
                                    ? "bg-gray-400"
                                    : index === 2
                                      ? "bg-amber-600"
                                      : "bg-gray-300"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{region.regionName}</p>
                              <p className="text-sm text-gray-500">{formatNumber(region.completedTours)} tour</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">{formatCurrency(region.totalRevenue)}</p>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500" />
                              <span className="text-sm">{region.averageRating}</span>
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
                      <Target className="w-5 h-5 text-blue-500" />
                      Top Vùng Có Nhiều Request Nhất
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {dashboardData.regions
                        .sort((a, b) => b.totalRequests - a.totalRequests)
                        .slice(0, 5)
                        .map((region, index) => (
                          <div key={region.regionId} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                  index === 0
                                    ? "bg-blue-500"
                                    : index === 1
                                      ? "bg-blue-400"
                                      : index === 2
                                        ? "bg-blue-300"
                                        : "bg-gray-300"
                                }`}
                              >
                                {index + 1}
                              </div>
                              <div>
                                <p className="font-medium">{region.regionName}</p>
                                <p className="text-sm text-gray-500">{formatNumber(region.totalRequests)} request</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold">
                                {((region.completedTours / region.totalRequests) * 100).toFixed(1)}%
                              </p>
                              <p className="text-sm text-gray-500">Tỷ lệ thành công</p>
                            </div>
                          </div>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Financial Tab */}
            <TabsContent value="financial" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card className="py-5 lg:col-span-2 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-green-500" />
                      Phân Tích Tài Chính Chi Tiết
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Thu nhập:</span>
                          <span className="font-semibold text-lg text-green-600">
                            {formatCurrency(dashboardData.financial.totalRevenue)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Chi phí:</span>
                          <span className="font-semibold text-lg text-red-600">
                            {formatCurrency(dashboardData.financial.totalExpenses)}
                          </span>
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                          <span className="text-gray-600">Lợi nhuận:</span>
                          <span className="font-bold text-xl text-blue-600">
                            {formatCurrency(dashboardData.financial.netProfit)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-gray-600">Tỷ suất lợi nhuận</span>
                        <span className="font-semibold text-blue-600">
                          {dashboardData.financial.profitMargin.toFixed(1)}%
                        </span>
                      </div>
                      <Progress value={dashboardData.financial.profitMargin} className="h-3" />
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
                      <div className="text-3xl font-bold text-green-500 mb-2">
                        +{dashboardData.financial.revenueGrowth.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Tăng trưởng doanh thu</p>
                    </div>
                    <Separator />
                    <div className="text-center">
                      <div className="text-3xl font-bold text-red-500 mb-2">
                        +{dashboardData.financial.expenseGrowth.toFixed(1)}%
                      </div>
                      <p className="text-sm text-gray-600">Tăng trưởng chi phí</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Regions Tab */}
            <TabsContent value="regions" className="space-y-6">
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
                        {dashboardData.regions.map((region) => (
                          <TableRow key={region.regionId}>
                            <TableCell className="font-medium">{region.regionName}</TableCell>
                            <TableCell className="text-right">{formatNumber(region.completedTours)}</TableCell>
                            <TableCell className="text-right">{formatNumber(region.totalRequests)}</TableCell>
                            <TableCell className="text-right">
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                {((region.completedTours / region.totalRequests) * 100).toFixed(1)}%
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-1">
                                <Star className="w-4 h-4 text-yellow-500" />
                                {region.averageRating}
                              </div>
                            </TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(region.totalRevenue)}
                            </TableCell>
                            <TableCell className="text-right">{formatNumber(region.activeGuides)}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="py-5 border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-500" />
                      Thống Kê Người Dùng
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <UserPlus className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(dashboardData.users.newUsers)}
                        </div>
                        <div className="text-sm text-green-700">User mới</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <UserMinus className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">
                          {formatNumber(dashboardData.users.leftUsers)}
                        </div>
                        <div className="text-sm text-red-700">User rời đi</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        +{dashboardData.users.userGrowthRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-blue-700">Tăng trưởng user</div>
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
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <UserPlus className="w-8 h-8 text-green-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-green-600">
                          {formatNumber(dashboardData.users.newGuides)}
                        </div>
                        <div className="text-sm text-green-700">HDV mới</div>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg text-center">
                        <UserMinus className="w-8 h-8 text-red-500 mx-auto mb-2" />
                        <div className="text-2xl font-bold text-red-600">
                          {formatNumber(dashboardData.users.leftGuides)}
                        </div>
                        <div className="text-sm text-red-700">HDV rời đi</div>
                      </div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">
                        +{dashboardData.users.guideGrowthRate.toFixed(1)}%
                      </div>
                      <div className="text-sm text-yellow-700">Tăng trưởng HDV</div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Performance Tab */}
            <TabsContent value="performance" className="space-y-6">
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
                      {dashboardData.topTours.map((tour, index) => (
                        <div key={tour.tourId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? "bg-yellow-500" : index === 1 ? "bg-gray-400" : "bg-amber-600"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{tour.tourTitle}</p>
                              <p className="text-sm text-gray-500">{tour.regionName}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-green-600">{formatCurrency(tour.profit)}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              <span>{tour.averageBids} đấu giá TB</span>
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
                      {dashboardData.topGuides.map((guide, index) => (
                        <div
                          key={guide.guideId}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                                index === 0 ? "bg-blue-500" : index === 1 ? "bg-blue-400" : "bg-blue-300"
                              }`}
                            >
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium">{guide.guideName}</p>
                              <p className="text-sm text-gray-500">{guide.regionName}</p>
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
            </TabsContent>

            {/* Issues Tab */}
            <TabsContent value="issues" className="space-y-6">
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
                      {dashboardData.regions.map((region) => (
                        <div key={region.regionId} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <p className="font-medium">{region.regionName}</p>
                            <p className="text-sm text-gray-500">{formatNumber(region.cancelledTours)} tour bị hủy</p>
                          </div>
                          <div className="text-right">
                            <p className="text-2xl font-bold text-red-600">{formatNumber(region.cancelledTours)}</p>
                            <p className="text-sm text-gray-500">
                              {((region.cancelledTours / region.totalRequests) * 100).toFixed(1)}% tỷ lệ hủy
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
                          <span className="font-semibold text-red-600">
                            {formatNumber(
                              dashboardData.regions.reduce((sum, region) => sum + region.cancelledTours, 0),
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tỷ lệ hủy trung bình:</span>
                          <span className="font-semibold text-red-600">
                            {(
                              (dashboardData.regions.reduce((sum, region) => sum + region.cancelledTours, 0) /
                                dashboardData.regions.reduce((sum, region) => sum + region.totalRequests, 0)) *
                              100
                            ).toFixed(1)}
                            %
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vùng có tỷ lệ hủy cao nhất:</span>
                          <span className="font-semibold text-red-600">
                            {
                              dashboardData.regions.reduce((max, region) =>
                                region.cancelledTours / region.totalRequests > max.cancelledTours / max.totalRequests
                                  ? region
                                  : max,
                              ).regionName
                            }
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
