"use client"

import { Building2, Hash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import type { GroupedRevenue, RevenueAdmin } from "@/types/revenue"

interface RevenueTableProps {
  group: GroupedRevenue
  selectedRevenues: number[]
  selectedTourGuideId: number | null
  onSelectRevenue: (revenueId: number) => void
  onSelectAllForGuide: (revenues: RevenueAdmin[]) => void
  formatCurrency: (amount: number) => string
}

export function RevenueTable({
  group,
  selectedRevenues,
  selectedTourGuideId,
  onSelectRevenue,
  onSelectAllForGuide,
  formatCurrency,
}: RevenueTableProps) {
  const isCurrentlySelected = selectedTourGuideId === group.tourGuideId
  const isDisabled = selectedRevenues.length > 0 && !isCurrentlySelected
  const hasGroupBankInfo = group.tourGuide.bankAccountNumber && group.tourGuide.bankName

  return (
    <Card
      className={`border py-5 shadow-md hover:shadow-lg transition-shadow ${
        isCurrentlySelected
          ? "border-blue-300 bg-blue-50/30"
          : isDisabled
            ? "border-gray-200 opacity-60"
            : "border-gray-200"
      }`}
    >
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
              <h3 className="text-lg font-semibold text-gray-900 truncate">{group.tourGuide.name}</h3>
              {!hasGroupBankInfo && (
                <Badge variant="destructive" className="text-xs w-fit">
                  Thiếu thông tin ngân hàng
                </Badge>
              )}
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p className="truncate">📧 {group.tourGuide.email}</p>
              <p>📱 {group.tourGuide.phone}</p>
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{group.tourGuide.bankName || "Chưa cập nhật"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 flex-shrink-0" />
                <span className="truncate">{group.tourGuide.bankAccountNumber || "Chưa cập nhật"}</span>
              </div>
              <p className="flex flex-wrap items-center gap-1">
                <span>{group.revenues.length} tour •</span>
                <span>Tổng hoa hồng:</span>
                <span className="font-semibold text-green-600">{formatCurrency(group.totalReceived)}</span>
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={() => onSelectAllForGuide(group.revenues)}
            disabled={isDisabled}
            className={`w-full sm:w-auto ${
              isCurrentlySelected
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
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50/50">
                <TableHead className="w-12"></TableHead>
                <TableHead className="font-semibold min-w-[150px]">Tên tour</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Khách hàng</TableHead>
                <TableHead className="font-semibold min-w-[100px]">Ngày tạo</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Tổng tiền</TableHead>
                <TableHead className="font-semibold min-w-[140px]">Hoa hồng nền tảng</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Hoa hồng HDV</TableHead>
                <TableHead className="font-semibold min-w-[120px]">Trạng thái</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.revenues.map((revenue: RevenueAdmin) => (
                <TableRow
                  key={revenue.revenueId}
                  className={`${selectedRevenues.includes(revenue.revenueId) ? "bg-blue-50" : "hover:bg-blue-50/50"}`}
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedRevenues.includes(revenue.revenueId)}
                      onCheckedChange={() => onSelectRevenue(revenue.revenueId)}
                      disabled={isDisabled}
                      className="border-gray-300"
                    />
                  </TableCell>
                  <TableCell className="font-medium text-gray-900">
                    <div className="truncate max-w-[150px]" title={revenue.invoice?.tourName || "N/A"}>
                      {revenue.invoice?.tourName || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">
                    <div className="truncate max-w-[120px]" title={revenue.invoice?.customerName || "N/A"}>
                      {revenue.invoice?.customerName || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {new Date(revenue.createdAt).toLocaleDateString("vi-VN")}
                  </TableCell>
                  <TableCell className="text-gray-900">{formatCurrency(revenue.totalAmount)}</TableCell>
                  <TableCell className="text-red-600">{formatCurrency(revenue.platformCommission)}</TableCell>
                  <TableCell className="font-semibold text-green-600">
                    {formatCurrency(revenue.actualReceived)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 border-yellow-200">
                      Chờ thanh toán
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
