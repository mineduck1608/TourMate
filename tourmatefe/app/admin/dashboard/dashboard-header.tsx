"use client"

import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CalendarDays, Download, RefreshCw, Loader2 } from "lucide-react"
import { format, startOfMonth, endOfMonth } from "date-fns"
import type { DashboardFilters } from "@/types/admin-dashboard"
import { useEffect } from "react"
import { useMutation } from "@tanstack/react-query"
import { fetchAreaIdAndName } from "@/app/api/active-area.api"

interface DashboardHeaderProps {
  filters: DashboardFilters
  onFiltersChange: (filters: DashboardFilters) => void
  onRefresh: () => void
  onExport: () => void
  loading: boolean
}

export function DashboardHeader({ filters, onFiltersChange, onRefresh, onExport, loading }: DashboardHeaderProps) {
  const areasMutation = useMutation({
    mutationFn: fetchAreaIdAndName,
    onError: (error) => {
      console.error("Error fetching areas:", error)
    },
  })

  useEffect(() => {
    areasMutation.mutate()
  }, [])

  // Generate month options (current month and previous 11 months)
  const generateMonthOptions = () => {
    const options = []
    const currentDate = new Date()

    for (let i = 0; i < 12; i++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1)
      const value = format(date, "yyyy-MM")
      const label = format(date, "MM/yyyy")
      options.push({ value, label })
    }

    return options
  }

  const monthOptions = generateMonthOptions()


  // Get current selected month value from dateRange
  const getCurrentMonthValue = () => {
    if (filters.dateRange?.from) {
      return format(filters.dateRange.from, "yyyy-MM")
    }
    return format(new Date(), "yyyy-MM") // Default to current month
  }

  const handleMonthChange = (monthValue: string) => {
    const [year, month] = monthValue.split("-")
    const selectedDate = new Date(Number.parseInt(year), Number.parseInt(month) - 1, 1)

    // Convert month selection to dateRange (start and end of month)
    const dateRange = {
      from: startOfMonth(selectedDate),
      to: endOfMonth(selectedDate),
    }

    console.log(dateRange)


    onFiltersChange({
      ...filters,
      dateRange,
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
              {/* Month Picker */}
              <Select value={getCurrentMonthValue()} onValueChange={handleMonthChange}>
                <SelectTrigger className="min-w-[96px] sm:min-w-[120px] bg-white/20 border-white/30 text-white">
                  <CalendarDays className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Chọn tháng" />
                </SelectTrigger>
                <SelectContent>
                  {monthOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={filters.selectedArea} onValueChange={handleAreaChange}>
                <SelectTrigger className="w-40 bg-white/20 border-white/30 text-white">
                  <SelectValue placeholder="Chọn vùng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả vùng</SelectItem>
                  {areasMutation.data?.map((area) => (
                    <SelectItem key={area.areaId} value={area.areaName}>
                      {area.areaName}
                    </SelectItem>
                  ))}
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
