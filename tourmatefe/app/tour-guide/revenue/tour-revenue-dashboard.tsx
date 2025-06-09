"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import {
  CalendarDays,
  DollarSign,
  TrendingUp,
  Users,
  Download,
  Eye,
  Clock,
  Star,
  Wallet,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState, useEffect } from "react"
import { revenueApi } from "@/app/api/revenue.api"


// Types based on .NET API DTOs
interface RevenueDto {
  revenueId: number
  tourGuideId: number
  totalAmount: number
  actualReceived: number
  platformCommission: number
  createdAt: string
  paymentStatus: boolean
  tourGuideName: string
}

interface RevenueStatsDto {
  totalRevenue: number
  platformFee: number
  netRevenue: number
  totalRecords: number
  completedPayments: number
  pendingPayments: number
  monthlyGrowth: number
  revenueList: RevenueDto[]
}

export default function Component() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1)
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())
  const [tourGuideId] = useState(1) // Hardcoded for demo, should come from auth
  const [revenueStats, setRevenueStats] = useState<RevenueStatsDto | null>(null)
  const [loading, setLoading] = useState(false)


  // Cập nhật fetchRevenueStats function
  const fetchRevenueStats = async (month: number, year: number) => {
    setLoading(true)
    try {
      const data = await revenueApi.getStats(tourGuideId, month, year)
      setRevenueStats(data)
    } catch (error) {
      console.error("Error fetching revenue stats:", error)
      // Fallback to mock data for demo
      setRevenueStats({
        totalRevenue: 0,
        platformFee: 0,
        netRevenue: 0,
        totalRecords: 0,
        completedPayments: 0,
        pendingPayments:0,
        monthlyGrowth: 0,
        revenueList: [],
      })
    } finally {
      setLoading(false)
    }
  }

  // Cập nhật exportToExcel function
  const exportToExcel = async () => {
    try {
      await revenueApi.exportExcel(tourGuideId, selectedMonth, selectedYear)
    } catch (error) {
      console.error("Export error:", error)
    }
  }

  // Load data when month/year changes
  useEffect(() => {
    fetchRevenueStats(selectedMonth, selectedYear)
  }, [selectedMonth, selectedYear])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const getStatusColor = (paymentStatus: boolean) => {
    return paymentStatus
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-yellow-100 text-yellow-800 border-yellow-200"
  }

  const getStatusText = (paymentStatus: boolean) => {
    return paymentStatus ? "Đã thanh toán" : "Chờ thanh toán"
  }

  const getMonthName = (month: number) => {
    const months = [
      "Tháng 1",
      "Tháng 2",
      "Tháng 3",
      "Tháng 4",
      "Tháng 5",
      "Tháng 6",
      "Tháng 7",
      "Tháng 8",
      "Tháng 9",
      "Tháng 10",
      "Tháng 11",
      "Tháng 12",
    ]
    return months[month - 1]
  }

  const navigateMonth = (direction: "prev" | "next") => {
    if (direction === "prev") {
      if (selectedMonth === 1) {
        setSelectedMonth(12)
        setSelectedYear(selectedYear - 1)
      } else {
        setSelectedMonth(selectedMonth - 1)
      }
    } else {
      if (selectedMonth === 12) {
        setSelectedMonth(1)
        setSelectedYear(selectedYear + 1)
      } else {
        setSelectedMonth(selectedMonth + 1)
      }
    }
  }

  if (loading && !revenueStats) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span>Đang tải dữ liệu...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-5 md:p-10">
      <div className="mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">Báo Cáo Doanh Thu</h1>

              {/* Month/Year Selector */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={() => navigateMonth("prev")}
                    disabled={loading}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>

                  <div className="flex items-center gap-2">
                    <Select
                      value={selectedMonth.toString()}
                      onValueChange={(value) => setSelectedMonth(Number.parseInt(value))}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-32 bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 12 }, (_, i) => (
                          <SelectItem key={i + 1} value={(i + 1).toString()}>
                            Tháng {i + 1}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <Select
                      value={selectedYear.toString()}
                      onValueChange={(value) => setSelectedYear(Number.parseInt(value))}
                      disabled={loading}
                    >
                      <SelectTrigger className="w-24 bg-white/20 border-white/30 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 6 }, (_, i) => (
                          <SelectItem key={2022 + i} value={(2022 + i).toString()}>
                            {2022 + i}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 p-2"
                    onClick={() => navigateMonth("next")}
                    disabled={loading}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2 text-blue-100">
                  <CalendarDays className="w-4 h-4" />
                  <span className="text-sm">Cập nhật lúc {new Date().toLocaleString("vi-VN")}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="secondary"
                size="sm"
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                onClick={exportToExcel}
                disabled={loading}
              >
                <Download className="w-4 h-4 mr-2" />
                Xuất Excel
              </Button>
              <Button
                size="sm"
                className="bg-white text-blue-600 hover:bg-gray-100"
                onClick={() => fetchRevenueStats(selectedMonth, selectedYear)}
                disabled={loading}
              >
                {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Eye className="w-4 h-4 mr-2" />}
                Làm mới
              </Button>
            </div>
          </div>
        </div>

        {revenueStats && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-green-100">Tổng Doanh Thu</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <DollarSign className="w-5 h-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(revenueStats.totalRevenue)}</div>
                  <div className="flex items-center gap-1 mt-2">
                    <TrendingUp className="w-3 h-3" />
                    <p className="text-xs text-green-100">
                      {revenueStats.monthlyGrowth > 0 ? "+" : ""}
                      {revenueStats.monthlyGrowth.toFixed(1)}% so với tháng trước
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-red-500 to-pink-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-red-100">Phí Nền Tảng (15%)</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <CreditCard className="w-5 h-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">-{formatCurrency(revenueStats.platformFee)}</div>
                  <p className="text-xs text-red-100 mt-2">Đã trừ tự động từ hệ thống</p>
                </CardContent>
              </Card>

              <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-blue-100">Doanh Thu Thực Nhận</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Wallet className="w-5 h-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{formatCurrency(revenueStats.netRevenue)}</div>
                  <p className="text-xs text-blue-100 mt-2">Chuyển khoản trong 3-5 ngày</p>
                </CardContent>
              </Card>

              <Card className="py-5 border-0 shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-purple-100">Tổng Giao Dịch</CardTitle>
                  <div className="p-2 bg-white/20 rounded-lg">
                    <Users className="w-5 h-5" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{revenueStats.totalRecords}</div>
                  <p className="text-xs text-purple-100 mt-2">{revenueStats.completedPayments} đã thanh toán</p>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="py-5 lg:col-span-2 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    Tiến Độ Thanh Toán
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Đã Thanh Toán</span>
                      <span className="font-semibold text-green-600">
                        {revenueStats.completedPayments}/{revenueStats.totalRecords}
                      </span>
                    </div>
                    <Progress
                      value={
                        revenueStats.totalRecords > 0
                          ? (revenueStats.completedPayments / revenueStats.totalRecords) * 100
                          : 0
                      }
                      className="h-3"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{revenueStats.completedPayments}</div>
                      <div className="text-sm text-green-700">Đã thanh toán</div>
                    </div>
                    <div className="text-center p-4 bg-yellow-50 rounded-lg">
                      <div className="text-2xl font-bold text-yellow-600">{revenueStats.pendingPayments}</div>
                      <div className="text-sm text-yellow-700">Chờ thanh toán</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="py-5 border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-gray-800">
                    <Star className="w-5 h-5 text-yellow-500" />
                    Tỷ Lệ Tăng Trưởng
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="text-4xl font-bold text-blue-500 mb-2">
                    {revenueStats.monthlyGrowth > 0 ? "+" : ""}
                    {revenueStats.monthlyGrowth.toFixed(1)}%
                  </div>
                  <div className="flex justify-center gap-1 mb-4">
                    <TrendingUp
                      className={`w-6 h-6 ${revenueStats.monthlyGrowth >= 0 ? "text-green-500" : "text-red-500"}`}
                    />
                  </div>
                  <p className="text-sm text-gray-600">So với tháng trước</p>
                </CardContent>
              </Card>
            </div>

            {/* Revenue History Table */}
            <Card className="pt-5 border-0 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-gray-50 to-blue-50">
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <CalendarDays className="w-5 h-5 text-blue-600" />
                  Chi Tiết Doanh Thu - {getMonthName(selectedMonth)} {selectedYear}
                </CardTitle>
                <CardDescription>Danh sách các giao dịch doanh thu trong tháng</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead className="font-semibold">ID</TableHead>
                        <TableHead className="font-semibold">Ngày Tạo</TableHead>
                        <TableHead className="text-right font-semibold">Tổng Tiền</TableHead>
                        <TableHead className="text-right font-semibold">Phí Platform</TableHead>
                        <TableHead className="text-right font-semibold">Thực Nhận</TableHead>
                        <TableHead className="text-center font-semibold">Trạng Thái</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {revenueStats.revenueList.length > 0 ? (
                        revenueStats.revenueList.map((revenue) => (
                          <TableRow key={revenue.revenueId} className="hover:bg-gray-50 transition-colors">
                            <TableCell className="font-medium text-blue-600">#{revenue.revenueId}</TableCell>
                            <TableCell>{new Date(revenue.createdAt).toLocaleDateString("vi-VN")}</TableCell>
                            <TableCell className="text-right font-medium">
                              {formatCurrency(revenue.totalAmount)}
                            </TableCell>
                            <TableCell className="text-right text-red-600 font-medium">
                              -{formatCurrency(revenue.platformCommission)}
                            </TableCell>
                            <TableCell className="text-right font-bold text-green-600">
                              {formatCurrency(revenue.actualReceived)}
                            </TableCell>
                            <TableCell className="text-center">
                              <Badge className={`${getStatusColor(revenue.paymentStatus)} border`}>
                                {getStatusText(revenue.paymentStatus)}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            Không có dữ liệu trong tháng này
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            {/* Summary */}
            <Card className="py-5 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-800">
                  <Wallet className="w-5 h-5 text-blue-600" />
                  Tóm Tắt Thanh Toán
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tổng doanh thu:</span>
                      <span className="font-semibold text-lg">{formatCurrency(revenueStats.totalRevenue)}</span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Phí nền tảng:</span>
                      <span className="font-semibold text-lg text-red-600">
                        -{formatCurrency(revenueStats.platformFee)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thực nhận:</span>
                      <span className="font-bold text-xl text-green-600">
                        {formatCurrency(revenueStats.netRevenue)}
                      </span>
                    </div>
                  </div>
                </div>

                <Separator />

                <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-600 rounded-lg">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-900 mb-2">Thông Tin Thanh Toán</h4>
                      <p className="text-sm text-blue-800 leading-relaxed">
                        Số tiền thực nhận <strong>{formatCurrency(revenueStats.netRevenue)}</strong> sẽ được chuyển
                        khoản vào tài khoản đã đăng ký trong vòng <strong>3-5 ngày làm việc</strong>. Phí nền tảng 15%
                        đã được trừ tự động. Nếu có thắc mắc, vui lòng liên hệ bộ phận hỗ trợ qua hotline:{" "}
                        <strong>0977 300 916</strong>
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  )
}
