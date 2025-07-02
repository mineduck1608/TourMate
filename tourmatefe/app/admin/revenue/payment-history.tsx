"use client"

import { Eye, Loader2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Pagination } from "./panigation"
import type { PaymentHistoryAdmin } from "@/types/revenue"
import { PagedResult } from '@/types/pagedResult'

interface PaymentHistoryProps {
  historyData: PagedResult<PaymentHistoryAdmin> | null
  historyLoading: boolean
  historyPage: number
  setHistoryPage: (page: number) => void
  formatCurrency: (amount: number) => string
}

export function PaymentHistory({
  historyData,
  historyLoading,
  historyPage,
  setHistoryPage,
  formatCurrency,
}: PaymentHistoryProps) {
  return (
    <div className="p-4 lg:p-6">
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
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50/50">
                    <TableHead className="font-semibold min-w-[150px]">Hướng dẫn viên</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Số tiền</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">Số tour</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Ngân hàng</TableHead>
                    <TableHead className="font-semibold min-w-[140px]">Số tài khoản</TableHead>
                    <TableHead className="font-semibold min-w-[120px]">Ngày tạo</TableHead>
                    <TableHead className="font-semibold min-w-[80px]">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {historyData?.result.map((payment) => (
                    <TableRow key={payment.id} className="hover:bg-green-50/50">
                      <TableCell className="font-medium text-gray-900">
                        <div className="truncate max-w-[150px]" title={payment.tourGuideName}>
                          {payment.tourGuideName}
                        </div>
                      </TableCell>
                      <TableCell className="font-semibold text-green-600">
                        {formatCurrency(payment.totalAmount)}
                      </TableCell>
                      <TableCell className="text-gray-600">{payment.toursCount} tour</TableCell>
                      <TableCell className="text-gray-700">
                        <div className="truncate max-w-[120px]" title={payment.bankName || "N/A"}>
                          {payment.bankName || "N/A"}
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-700 font-mono">
                        <div className="truncate max-w-[140px]" title={payment.accountNumber || "N/A"}>
                          {payment.accountNumber || "N/A"}
                        </div>
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
            </div>
          )}
        </CardContent>
      </Card>

      {/* History Pagination */}
      {historyData && historyData.totalPage > 1 && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <Pagination
            currentPage={historyPage}
            totalPages={historyData.totalPage}
            onPageChange={setHistoryPage}
          />
        </div>
      )}
    </div>
  )
}
