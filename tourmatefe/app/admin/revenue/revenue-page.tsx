"use client"

import { useState, useMemo } from "react"
import { DollarSign, Calendar, AlertCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"

import {
  useDashboardStatsForAdmin,
  useUnpaidRevenuesForAdmin,
  usePaymentHistoryForAdmin,
  useProcessPaymentForAdmin,
} from "@/hooks/use-admin-revenue"
import type { RevenueAdmin, GroupedRevenue } from "@/types/revenue"
import { DashboardStats } from "./dashboard-status"
import { RevenueManagement } from "./revenue-management"
import { PaymentHistory } from "./payment-history"
import { PaymentDialog } from "./payment-dialog"

import { toast } from "react-toastify"

export default function RevenuePage() {
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
    data: dashboardStats,
    loading: statsLoading,
    error: statsError,
    refetch: refetchStats,
  } = useDashboardStatsForAdmin()

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
    refetch: refetchHistory,
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
      {} as Record<number, GroupedRevenue>,
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
    ? revenueData?.result.find((r) => r.tourGuideId === selectedTourGuideId)?.tourGuide || null
    : null

  // Check if selected tour guide has bank info
  const hasBankInfo = Boolean(selectedTourGuide?.bankAccountNumber && selectedTourGuide?.bankName)

  const handlePayment = async () => {
    if (!hasBankInfo) {
      toast("⚠️ Thiếu thông tin ngân hàng. Vui lòng liên hệ hướng dẫn viên.")
      return
    }

    try {
      const result = await processPaymentAsync({
        revenueIds: selectedRevenues,
        adminId: 1, // Replace with actual admin ID from auth context
      })

      toast.success(`Đánh dấu thanh toán thành công: ${result.message}`)

      // Close dialog and clear selections first
      setShowPaymentDialog(false)
      setSelectedRevenues([])

      // Then refresh data
      console.log("Refreshing data after payment...")
      await Promise.all([refetchRevenues(), refetchStats(), refetchHistory()])
      console.log("Data refresh completed")
    } catch (error) {
      console.error("Payment error:", error)
      toast.error(error instanceof Error ? `❌ ${error.message}` : "❌ Có lỗi xảy ra khi xử lý thanh toán")
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount)
  }

  if (revenueError || historyError || statsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
        <Alert className="max-w-md">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Có lỗi xảy ra khi tải dữ liệu: {revenueError || historyError || statsError}
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
      <div className="p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6 lg:mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Quản lý thanh toán hoa hồng
          </h1>
          <p className="text-gray-600 mt-2 text-sm lg:text-base">
            Đánh dấu thanh toán và theo dõi lịch sử chuyển khoản hoa hồng
          </p>
        </div>

        {/* Stats Cards */}
        <DashboardStats data={dashboardStats} loading={statsLoading} formatCurrency={formatCurrency} />

        {/* Main Content */}
        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardContent className="p-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <div className="border-b bg-gradient-to-r from-gray-50 to-gray-100">
                <TabsList className="grid w-full grid-cols-2 bg-transparent h-12 lg:h-14">
                  <TabsTrigger
                    value="revenue"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium text-sm lg:text-base"
                  >
                    <DollarSign className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Quản lý thanh toán</span>
                    <span className="sm:hidden">Thanh toán</span>
                  </TabsTrigger>
                  <TabsTrigger
                    value="history"
                    className="data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 font-medium text-sm lg:text-base"
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Lịch sử thanh toán</span>
                    <span className="sm:hidden">Lịch sử</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="revenue">
                <RevenueManagement
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  setCurrentPage={setCurrentPage}
                  selectedRevenues={selectedRevenues}
                  selectedTourGuide={selectedTourGuide}
                  hasBankInfo={hasBankInfo}
                  paymentLoading={paymentLoading}
                  onShowPaymentDialog={() => setShowPaymentDialog(true)}
                  revenueData={revenueData}
                  revenueLoading={revenueLoading}
                  currentPage={currentPage}
                  groupedRevenues={groupedRevenues}
                  onSelectRevenue={handleSelectRevenue}
                  onSelectAllForGuide={handleSelectAllForGuide}
                  formatCurrency={formatCurrency}
                  selectedTourGuideId={selectedTourGuideId}
                />
              </TabsContent>

              <TabsContent value="history">
                <PaymentHistory
                  historyData={historyData}
                  historyLoading={historyLoading}
                  historyPage={historyPage}
                  setHistoryPage={setHistoryPage}
                  formatCurrency={formatCurrency}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      {/* Payment Confirmation Dialog */}
      <PaymentDialog
        open={showPaymentDialog}
        onOpenChange={setShowPaymentDialog}
        selectedRevenues={selectedRevenues}
        selectedTourGuide={selectedTourGuide}
        selectedTotal={selectedTotal}
        revenueData={revenueData}
        hasBankInfo={hasBankInfo}
        paymentLoading={paymentLoading}
        onConfirm={handlePayment}
        formatCurrency={formatCurrency}
      />
    </div>
  )
}
