"use client"

import { AlertTriangle, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { RevenueAdmin, TourGuideAdmin } from "@/types/revenue"
import { PagedResult } from "@/types/pagedResult"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  selectedRevenues: number[]
  selectedTourGuide: TourGuideAdmin | null
  selectedTotal: number
  revenueData: PagedResult<RevenueAdmin> | null
  hasBankInfo: boolean
  paymentLoading: boolean
  onConfirm: () => void
  formatCurrency: (amount: number) => string
}

export function PaymentDialog({
  open,
  onOpenChange,
  selectedRevenues,
  selectedTourGuide,
  selectedTotal,
  revenueData,
  hasBankInfo,
  paymentLoading,
  onConfirm,
  formatCurrency,
}: PaymentDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg lg:text-xl font-semibold text-gray-900">
            Xác nhận đánh dấu thanh toán
          </DialogTitle>
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
                <p className="break-words">
                  <strong>Tên người nhận:</strong> {selectedTourGuide.name}
                </p>
                <p className="break-words">
                  <strong>Ngân hàng:</strong> {selectedTourGuide.bankName || "Chưa cập nhật"}
                </p>
                <p className="break-words">
                  <strong>Số tài khoản:</strong> {selectedTourGuide.bankAccountNumber || "Chưa cập nhật"}
                </p>
                <p className="break-words">
                  <strong>Email:</strong> {selectedTourGuide.email}
                </p>
                <p className="break-words">
                  <strong>Điện thoại:</strong> {selectedTourGuide.phone}
                </p>
              </div>
            </div>
          )}

          {/* Payment Summary */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 lg:p-6 rounded-lg border border-green-200">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 mb-4">
              <span className="font-medium text-gray-700">Tổng số tiền cần chuyển:</span>
              <span className="text-xl lg:text-2xl font-bold text-green-600">{formatCurrency(selectedTotal)}</span>
            </div>
            <div className="text-sm text-gray-600 mb-3">{selectedRevenues.length} giao dịch được chọn</div>

            {/* Show selected tours details */}
            <div className="max-h-32 overflow-y-auto">
              <div className="text-sm text-gray-600 space-y-1">
                {selectedRevenues.map((id) => {
                  const revenue = revenueData?.result.find((r: RevenueAdmin) => r.revenueId === id)
                  return revenue ? (
                    <div key={id} className="flex justify-between gap-2">
                      <span className="truncate flex-1">{revenue.invoice?.tourName}</span>
                      <span className="font-medium flex-shrink-0">{formatCurrency(revenue.actualReceived)}</span>
                    </div>
                  ) : null
                })}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={paymentLoading}
            className="w-full sm:w-auto"
          >
            Hủy
          </Button>
          <Button
            onClick={onConfirm}
            disabled={paymentLoading || !hasBankInfo}
            className="w-full sm:w-auto bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
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
  )
}
