"use client"

import { useState, useMemo } from "react"
import {
  Search,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  Building2,
  Hash,
  Loader2,
  AlertTriangle,
  AlertCircle,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"

import {
  useUnpaidRevenuesForAdmin,
  usePaymentHistoryForAdmin,
  useProcessPaymentForAdmin,
} from "@/hooks/use-admin-revenue"
import type { RevenueAdmin } from "@/types/revenue"
import { toast } from "react-toastify"

export default function AdminDashboard() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRevenues, setSelectedRevenues] = useState<number[]>([])
  const [showPaymentDialog, setShowPaymentDialog] = useState(false)
  const [activeTab, setActiveTab] = useState("revenue")

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1)
  const [historyPage, setHistoryPage] = useState(1)
  const itemsPerPage = 10

  // API hooks
  const {
    data: revenueData,
    loading: revenueLoading,
    error: revenueError,
    refetch: refetchRevenues,
  } = useUnpaidRevenuesForAdmin(currentPage, itemsPerPage, searchTerm)

  const {
    data: historyData,
    loading: historyLoading,
    error: historyError,
  } = usePaymentHistoryForAdmin(historyPage, itemsPerPage)

  const { processPaymentAsync, loading: paymentLoading } = useProcessPaymentForAdmin()

  // Group revenues by tour guide
  const groupedRevenues = useMemo(() => {
    if (!revenueData?.result) return {}

    return revenueData.result.reduce(
      (acc, revenue) => {
        const key = revenue.tourGuideId
        if (!acc[key]) {
          acc[key] = {
            tourGuideId: revenue.tourGuideId,
            tourGuide: revenue.tourGuide,
            revenues: [],
            totalAmount: 0,
            totalReceived: 0,
          }
        }
        acc[key].revenues.push(revenue)
        acc[key].totalAmount += revenue.totalAmount
        acc[key].totalReceived += revenue.actualReceived
        return acc
      },
      {} as Record<number, any>,
    )
  }, [revenueData])

  // Get the tour guide ID of currently selected revenues
  const getSelectedTourGuideId = (): number | null => {
    if (selectedRevenues.length === 0) return null
    const firstRevenue = revenueData?.result.find((r) => r.revenueId === selectedRevenues[0])
    return firstRevenue?.tourGuideId || null
  }

  const selectedTourGuideId = getSelectedTourGuideId()

  const handleSelectRevenue = (revenueId: number) => {
    const revenue = revenueData?.result.find((r) => r.revenueId === revenueId)
    if (!revenue) return

    // If no revenues selected yet, or selecting from same tour guide, allow selection
    if (selectedRevenues.length === 0 || selectedTourGuideId === revenue.tourGuideId) {
      setSelectedRevenues((prev) =>
        prev.includes(revenueId) ? prev.filter((id) => id !== revenueId) : [...prev, revenueId],
      )
    }
    // If trying to select from different tour guide, clear previous selections and select new one
    else {
      setSelectedRevenues([revenueId])
    }
  }

  const handleSelectAllForGuide = (guideRevenues: RevenueAdmin[]) => {
    const revenueIds = guideRevenues.map((r) => r.revenueId)
    const allSelected = revenueIds.every((id) => selectedRevenues.includes(id))

    if (allSelected) {
      setSelectedRevenues([])
    } else {
      // Clear any previous selections and select all for this guide
      setSelectedRevenues(revenueIds)
    }
  }

  const selectedTotal = selectedRevenues.reduce((total, id) => {
    const revenue = revenueData?.result.find((r) => r.revenueId === id)
    return total + (revenue?.actualReceived || 0)
  }, 0)

  const selectedTourGuide = selectedTourGuideId
    ? revenueData?.result.find((r) => r.tourGuideId === selectedTourGuideId)?.tourGuide
    : null

  // Check if selected tour guide has bank info
  const hasBankInfo = selectedTourGuide?.bankAccountNumber && selectedTourGuide?.bankName

  const handlePayment = async () => {
    if (!hasBankInfo) {
      toast("⚠️ Thiếu thông tin ngân hàng. Vui lòng liên hệ hướng dẫn viên.");

      return
    }

    try {
      const result = await processPaymentAsync({
        revenueIds: selectedRevenues,
        adminId: 1, // Replace with actual admin ID from auth context
      })

      toast.success(`Đánh dấu thanh toán thành công: ${result.message}`);

      setShowPaymentDialog(false)
      setSelectedRevenues([])
      refetchRevenues() // Refresh the data
    } catch (error) {
      toast.error(
        error instanceof Error
          ? `❌ ${error.message}`
          : '❌ Có lỗi xảy ra khi xử lý thanh toán'
      );
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  const totalUnpaidAmount = revenueData?.result.reduce((sum, r) => sum + r.actualReceived, 0) || 0
  const totalPaidThisMonth = historyData?.result.reduce((sum, p) => sum + p.totalAmount, 0) || 0

  const PaginationComponent = ({
    currentPage,
    totalPages,
    onPageChange,
  }: {
    currentPage: number
    totalPages: number
    onPageChange: (page: number) => void
  }) => (
    <div className="flex items-center justify-between px-2">
      <div className="text-sm text-gray-700">
        Trang {currentPage} / {totalPages}
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="h-8 w-8 p-0"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        {/* Page numbers */}
        {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
          const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
          if (pageNum > totalPages) return null

          return (
            <Button
              key={pageNum}
              variant={pageNum === currentPage ? "default" : "outline"}
              size="sm"
              onClick={() => onPageChange(pageNum)}
              className="h-8 w-8 p-0"
            >
              {pageNum}
            </Button>
          )
        })}

        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="h-8 w-8 p-0"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )

  if (revenueError || historyError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Có lỗi xảy ra khi tải dữ liệu: {revenueError || historyError}
            <Button variant="outline" size="sm" onClick={() => window.location.reload()} className="ml-2">
              Thử lại
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý thanh toán hoa hồng
          </h1>
          <p className="text-gray-600 mt-2">Đánh dấu thanh toán và theo dõi lịch sử chuyển khoản hoa hồng</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="py-5 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Chờ thanh toán</CardTitle>
              <Clock className="h-4 w-4 text-blue-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalUnpaidAmount)}</div>
              <p className="text-xs text-blue-200">{revenueData?.totalResult || 0} giao dịch</p>
            </CardContent>
          </Card>

          <Card className="py-5 bg-gradient-to-r from-green-500 to-green-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Đã thanh toán tháng này</CardTitle>
              <CheckCircle className="h-4 w-4 text-green-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalPaidThisMonth)}</div>
              <p className="text-xs text-green-200">{historyData?.totalResult || 0} giao dịch</p>
            </CardContent>
          </Card>

          <Card className="py-5 bg-gradient-to-r from-purple-500 to-purple-600 text-white border-0 shadow-lg hover:shadow-xl transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-purple-100">Hướng dẫn viên</CardTitle>
              <Users className="h-4 w-4 text-purple-200" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{Object.keys(groupedRevenues).length}</div>
              <p className="text-xs text-purple-200">Có hoa hồng chờ thanh toán</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="py-5 shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-14">
                  <TabsTrigger
                    value="revenue"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    Quản lý thanh toán
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    Lịch sử thanh toán
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revenue" className="p-6 space-y-6">
                {/* Action Bar */}
                <div className="flex justify-between items-center">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Tìm kiếm theo tên HDV, tour, khách hàng..."
                      value={searchTerm}
                      onChange={(e) => {
                        setSearchTerm(e.target.value)
                        setCurrentPage(1) // Reset to first page when searching
                      }}
                      className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  {selectedRevenues.length > 0 && (
                    <Button
                      onClick={() => setShowPaymentDialog(true)}
                      disabled={paymentLoading || !hasBankInfo}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
                    >
                      {paymentLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                      )}
                      Đánh dấu đã thanh toán ({selectedRevenues.length})
                    </Button>
                  )}
                </div>

                {/* Payment Restriction Alert */}
                {selectedRevenues.length > 0 && (
                  <Alert className="border-blue-200 bg-blue-50">
                    <CreditCard className="h-4 w-4 mt-1" />
                    <AlertDescription>
                      <p className="inline">
                        Đang chọn thanh toán cho <span className="font-semibold">{selectedTourGuide?.name}</span>. Chỉ có thể thanh toán cho 1 hướng dẫn viên tại một thời điểm.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}

                {/* Bank Info Warning */}
                {selectedRevenues.length > 0 && !hasBankInfo && (
                  <Alert className="border-orange-200 bg-orange-50">
                    <AlertTriangle className="h-4 w-4 text-orange-600" />
                    <AlertDescription className="text-orange-800">
                      <p className="inline">
                        <span className="font-semibold text-orange-800">Cảnh báo:</span> Hướng dẫn viên <span className="font-semibold">{selectedTourGuide?.name}</span> chưa cập nhật thông tin ngân hàng. Vui lòng liên hệ để cập nhật trước khi thanh toán.
                      </p>
                    </AlertDescription>
                  </Alert>
                )}


                {/* Loading State */}
                {revenueLoading ? (
                  <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <span className="ml-2">Đang tải dữ liệu...</span>
                  </div>
                ) : (
                  <>
                    {/* Revenue Table by Tour Guide */}
                    <div className="space-y-6">
                      {Object.values(groupedRevenues).map((group: any) => {
                        const isCurrentlySelected = selectedTourGuideId === group.tourGuideId
                        const isDisabled = selectedRevenues.length > 0 && !isCurrentlySelected
                        const hasGroupBankInfo = group.tourGuide.bankAccountNumber && group.tourGuide.bankName

                        return (
                          <Card
                            key={group.tourGuideId}
                            className={`py-5 border shadow-md hover:shadow-lg transition-shadow ${isCurrentlySelected
                              ? "border-blue-300 bg-blue-50/30"
                              : isDisabled
                                ? "border-gray-200 opacity-60"
                                : "border-gray-200"
                              }`}
                          >
                            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <h3 className="text-lg font-semibold text-gray-900">{group.tourGuide.name}</h3>
                                    {!hasGroupBankInfo && (
                                      <Badge variant="destructive" className="text-xs">
                                        Thiếu thông tin ngân hàng
                                      </Badge>
                                    )}
                                  </div>
                                  <div className="text-sm text-gray-600 space-y-1">
                                    <p>📧 {group.tourGuide.email}</p>
                                    <p>📱 {group.tourGuide.phone}</p>
                                    <p className="flex items-center gap-2">
                                      <Building2 className="h-4 w-4" />
                                      {group.tourGuide.bankName || "Chưa cập nhật"}
                                    </p>
                                    <p className="flex items-center gap-2">
                                      <Hash className="h-4 w-4" />
                                      {group.tourGuide.bankAccountNumber || "Chưa cập nhật"}
                                    </p>
                                    <p>
                                      {group.revenues.length} tour • Tổng hoa hồng:
                                      <span className="font-semibold text-green-600 ml-1">
                                        {formatCurrency(group.totalReceived)}
                                      </span>
                                    </p>
                                  </div>
                                </div>
                                <Button
                                  variant="outline"
                                  onClick={() => handleSelectAllForGuide(group.revenues)}
                                  disabled={isDisabled}
                                  className={`${isCurrentlySelected
                                    ? "border-blue-300 text-blue-700 bg-blue-100"
                                    : "border-blue-200 text-blue-600 hover:bg-blue-50"
                                    }`}
                                >
                                  {group.revenues.every((r: RevenueAdmin) => selectedRevenues.includes(r.revenueId))
                                    ? "Bỏ chọn tất cả"
                                    : "Chọn tất cả"}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent className="p-0">
                              <Table>
                                <TableHeader>
                                  <TableRow className="bg-gray-50/50">
                                    <TableHead className="w-12"></TableHead>
                                    <TableHead className="font-semibold">Tên tour</TableHead>
                                    <TableHead className="font-semibold">Khách hàng</TableHead>
                                    <TableHead className="font-semibold">Ngày tạo</TableHead>
                                    <TableHead className="font-semibold">Tổng tiền</TableHead>
                                    <TableHead className="font-semibold">Hoa hồng nền tảng</TableHead>
                                    <TableHead className="font-semibold">Hoa hồng HDV</TableHead>
                                    <TableHead className="font-semibold">Trạng thái</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {group.revenues.map((revenue: RevenueAdmin) => (
                                    <TableRow
                                      key={revenue.revenueId}
                                      className={`${selectedRevenues.includes(revenue.revenueId)
                                        ? "bg-blue-50"
                                        : "hover:bg-blue-50/50"
                                        }`}
                                    >
                                      <TableCell>
                                        <Checkbox
                                          checked={selectedRevenues.includes(revenue.revenueId)}
                                          onCheckedChange={() => handleSelectRevenue(revenue.revenueId)}
                                          disabled={isDisabled}
                                          className="border-gray-300"
                                        />
                                      </TableCell>
                                      <TableCell className="font-medium text-gray-900">
                                        {revenue.invoice?.tourName || "N/A"}
                                      </TableCell>
                                      <TableCell className="text-gray-700">
                                        {revenue.invoice?.customerName || "N/A"}
                                      </TableCell>
                                      <TableCell className="text-gray-600">
                                        {new Date(revenue.createdAt).toLocaleDateString("vi-VN")}
                                      </TableCell>
                                      <TableCell className="text-gray-900">
                                        {formatCurrency(revenue.totalAmount)}
                                      </TableCell>
                                      <TableCell className="text-red-600">
                                        {formatCurrency(revenue.platformCommission)}
                                      </TableCell>
                                      <TableCell className="font-semibold text-green-600">
                                        {formatCurrency(revenue.actualReceived)}
                                      </TableCell>
                                      <TableCell>
                                        <Badge
                                          variant="secondary"
                                          className="bg-yellow-100 text-yellow-800 border-yellow-200"
                                        >
                                          Chờ thanh toán
                                        </Badge>
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    {/* Pagination */}
                    {revenueData && revenueData.totalPage > 1 && (
                      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <PaginationComponent
                          currentPage={currentPage}
                          totalPages={revenueData.totalPage}
                          onPageChange={setCurrentPage}
                        />
                      </div>
                    )}
                  </>
                )}
              </TabsContent>

              <TabsContent value="history" className="p-6">
                <Card className="py-5 border border-gray-200 shadow-md">
                  <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
                    <CardTitle className="text-gray-900">Lịch sử thanh toán hoa hồng</CardTitle>
                    <CardDescription className="text-gray-600">
                      Xem lại các giao dịch thanh toán hoa hồng đã hoàn thành
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-0">
                    {historyLoading ? (
                      <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin" />
                        <span className="ml-2">Đang tải lịch sử...</span>
                      </div>
                    ) : (
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gray-50/50">
                            <TableHead className="font-semibold">Hướng dẫn viên</TableHead>
                            <TableHead className="font-semibold">Số tiền</TableHead>
                            <TableHead className="font-semibold">Số tour</TableHead>
                            <TableHead className="font-semibold">Ngân hàng</TableHead>
                            <TableHead className="font-semibold">Số tài khoản</TableHead>
                            <TableHead className="font-semibold">Ngày thanh toán</TableHead>
                            <TableHead className="font-semibold">Thao tác</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {historyData?.result.map((payment) => (
                            <TableRow key={payment.id} className="hover:bg-green-50/50">
                              <TableCell className="font-medium text-gray-900">{payment.tourGuideName}</TableCell>
                              <TableCell className="font-semibold text-green-600">
                                {formatCurrency(payment.totalAmount)}
                              </TableCell>
                              <TableCell className="text-gray-600">{payment.toursCount} tour</TableCell>
                              <TableCell className="text-gray-700">{payment.bankName || "N/A"}</TableCell>
                              <TableCell className="text-gray-700 font-mono">
                                {payment.accountNumber || "N/A"}
                              </TableCell>
                              <TableCell className="text-gray-600">
                                {new Date(payment.paymentDate).toLocaleDateString("vi-VN")}
                              </TableCell>
                              <TableCell>
                                <Button variant="ghost" size="sm" className="hover:bg-blue-50 text-blue-600">
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    )}
                  </CardContent>
                </Card>

                {/* History Pagination */}
                {historyData && historyData.totalPage > 1 && (
                  <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <PaginationComponent
                      currentPage={historyPage}
                      totalPages={historyData.totalPage}
                      onPageChange={setHistoryPage}
                    />
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Payment Confirmation Dialog */}
      <Dialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">Xác nhận đánh dấu thanh toán</DialogTitle>
            <DialogDescription className="text-gray-600">
              Xác nhận đánh dấu đã thanh toán hoa hồng cho {selectedRevenues.length} giao dịch của hướng dẫn viên
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            {/* Important Notice */}
            <Alert className="border-orange-200 bg-orange-50">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800">
                <strong>Lưu ý:</strong> Hệ thống chỉ đánh dấu trạng thái đã thanh toán. Bạn cần thực hiện chuyển khoản
                thực tế theo thông tin ngân hàng bên dưới.
              </AlertDescription>
            </Alert>

            {/* Bank Info Missing Warning */}
            {!hasBankInfo && (
              <Alert className="border-red-200 bg-red-50">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-800">
                  <strong>Không thể thanh toán:</strong> Hướng dẫn viên chưa cập nhật đầy đủ thông tin ngân hàng.
                </AlertDescription>
              </Alert>
            )}

            {/* Tour Guide Info */}
            {selectedTourGuide && (
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-2">Thông tin chuyển khoản</h4>
                <div className="space-y-1 text-sm text-gray-700">
                  <p>
                    <strong>Tên người nhận:</strong> {selectedTourGuide.name}
                  </p>
                  <p>
                    <strong>Ngân hàng:</strong> {selectedTourGuide.bankName || "Chưa cập nhật"}
                  </p>
                  <p>
                    <strong>Số tài khoản:</strong> {selectedTourGuide.bankAccountNumber || "Chưa cập nhật"}
                  </p>
                  <p>
                    <strong>Email:</strong> {selectedTourGuide.email}
                  </p>
                  <p>
                    <strong>Điện thoại:</strong> {selectedTourGuide.phone}
                  </p>
                </div>
              </div>
            )}

            {/* Payment Summary */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-lg border border-green-200">
              <div className="flex justify-between items-center mb-4">
                <span className="font-medium text-gray-700">Tổng số tiền cần chuyển:</span>
                <span className="text-2xl font-bold text-green-600">{formatCurrency(selectedTotal)}</span>
              </div>
              <div className="text-sm text-gray-600 mb-3">{selectedRevenues.length} giao dịch được chọn</div>

              {/* Show selected tours details */}
              <div className="max-h-32 overflow-y-auto">
                <div className="text-sm text-gray-600 space-y-1">
                  {selectedRevenues.map((id) => {
                    const revenue = revenueData?.result.find((r) => r.revenueId === id)
                    return revenue ? (
                      <div key={id} className="flex justify-between">
                        <span>{revenue.invoice?.tourName}</span>
                        <span className="font-medium">{formatCurrency(revenue.actualReceived)}</span>
                      </div>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setShowPaymentDialog(false)} disabled={paymentLoading}>
              Hủy
            </Button>
            <Button
              onClick={handlePayment}
              disabled={paymentLoading || !hasBankInfo}
              className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
            >
              {paymentLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Xác nhận đã chuyển khoản"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
