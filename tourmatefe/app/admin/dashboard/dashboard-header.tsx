"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Download, RefreshCw, Loader2 } from "lucide-react"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { format } from "date-fns"
import type { DashboardFilters } from "@/types/admin-dashboard"
import type { DateRange } from "react-day-picker"

interface DashboardHeaderProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  onRefresh: () => void
  onExport: () => void
  loading: boolean
}

export function DashboardHeader({ filters, onFiltersChange, onRefresh, onExport, loading }: DashboardHeaderProps) {
  const handleDateChange = (dateRange: DateRange | undefined) => {
    onFiltersChange({
      ...filters,
      dateRange: dateRange ? { from: dateRange.from!, to: dateRange.to! } : undefined,
    })
  }

  const handleAreaChange = (area: string) => {
    onFiltersChange({
      ...filters,
      selectedArea: area,
    })
  }

  return (
    <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-xl shadow-lg p-6 text-white">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-4">Dashboard Quản Trị</h1>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <DatePickerWithRange
                date={filters.dateRange}
                onDateChange={handleDateChange}
                className="bg-white/20 border-white/30 text-white"
                maxRange={180} // 6 months
              />

              <Select value={filters.selectedArea} onValueChange={handleAreaChange}>
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
            onClick={onExport}
            disabled={loading}
          >
            <Download className="w-4 h-4 mr-2" />
            Xuất báo cáo
          </Button>
          <Button
            size="sm"
            className="bg-white text-slate-800 hover:bg-gray-100"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
            Làm mới
          </Button>
        </div>
      </div>
    </div>
  )
}
