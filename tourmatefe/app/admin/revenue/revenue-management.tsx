"use client"
import { Search, CreditCard, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { RevenueTable } from "./revenue-table"
import { Pagination } from "./panigation"
import type { GroupedRevenue, RevenueAdmin, TourGuideAdmin } from "@/types/revenue"
import { PagedResult } from "@/types/pagedResult"

interface RevenueManagementProps {
  searchTerm: string
  setSearchTerm: (term: string) => void
  setCurrentPage: (page: number) => void
  selectedRevenues: number[]
  selectedTourGuide: TourGuideAdmin | null | undefined
  hasBankInfo: boolean
  paymentLoading: boolean
  onShowPaymentDialog: () => void
  revenueData: PagedResult<RevenueAdmin> | null
  revenueLoading: boolean
  currentPage: number
  groupedRevenues: Record<number, GroupedRevenue>
  onSelectRevenue: (revenueId: number) => void
  onSelectAllForGuide: (revenues: RevenueAdmin[]) => void
  formatCurrency: (amount: number) => string
  selectedTourGuideId: number | null
}

export function RevenueManagement({
  searchTerm,
  setSearchTerm,
  setCurrentPage,
  selectedRevenues,
  selectedTourGuide,
  hasBankInfo,
  paymentLoading,
  onShowPaymentDialog,
  revenueData,
  revenueLoading,
  currentPage,
  groupedRevenues,
  onSelectRevenue,
  onSelectAllForGuide,
  formatCurrency,
  selectedTourGuideId,
}: RevenueManagementProps) {
  return (
    <div className="p-4 lg:p-6 space-y-4 lg:space-y-6">
      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Tìm kiếm theo tên HDV, tour, khách hàng..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value)
              setCurrentPage(1)
            }}
            className="pl-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        {selectedRevenues.length > 0 && (
          <Button
            onClick={onShowPaymentDialog}
            disabled={paymentLoading || !hasBankInfo}
            className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
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
            <p>
              Đang chọn thanh toán cho <span className="font-semibold">{selectedTourGuide?.name}</span>. Chỉ có thể
              thanh toán cho 1 hướng dẫn viên tại một thời điểm.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {/* Bank Info Warning */}
      {selectedRevenues.length > 0 && !hasBankInfo && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <p>
              <span className="font-semibold text-orange-800">Cảnh báo:</span> Hướng dẫn viên{" "}
              <span className="font-semibold">{selectedTourGuide?.name}</span> chưa cập nhật thông tin ngân hàng. Vui
              lòng liên hệ để cập nhật trước khi thanh toán.
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
          {/* Revenue Tables by Tour Guide */}
          <div className="space-y-4 lg:space-y-6">
            {Object.values(groupedRevenues).map((group) => (
              <RevenueTable
                key={group.tourGuideId}
                group={group}
                selectedRevenues={selectedRevenues}
                selectedTourGuideId={selectedTourGuideId}
                onSelectRevenue={onSelectRevenue}
                onSelectAllForGuide={onSelectAllForGuide}
                formatCurrency={formatCurrency}
              />
            ))}
          </div>

          {/* Pagination */}
          {revenueData && revenueData.totalPage > 1 && (
            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <Pagination currentPage={currentPage} totalPages={revenueData.totalPage} onPageChange={setCurrentPage} />
            </div>
          )}
        </>
      )}
    </div>
  )
}
