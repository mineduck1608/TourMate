"use client"
import { CalendarIcon } from "lucide-react"
import { addDays, format } from "date-fns"
import { vi } from "date-fns/locale"
import type { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

interface DatePickerWithRangeProps {
  className?: string
  date?: DateRange
  onDateChange?: (date: DateRange | undefined) => void
  maxRange?: number // Maximum days allowed
}

export function DatePickerWithRange({ className, date, onDateChange, maxRange = 180 }: DatePickerWithRangeProps) {
  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn("w-[300px] justify-start text-left font-normal", !date && "text-muted-foreground", className)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "dd/MM/yyyy")} - {format(date.to, "dd/MM/yyyy")}
                </>
              ) : (
                format(date.from, "dd/MM/yyyy")
              )
            ) : (
              <span>Chọn khoảng thời gian</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(newDate) => {
              // Check if the range exceeds maxRange
              if (newDate?.from && newDate?.to) {
                const daysDiff = Math.abs((newDate.to.getTime() - newDate.from.getTime()) / (1000 * 60 * 60 * 24))
                if (daysDiff > maxRange) {
                  // Adjust the end date to maxRange
                  const adjustedTo = addDays(newDate.from, maxRange)
                  onDateChange?.({ from: newDate.from, to: adjustedTo })
                  return
                }
              }
              onDateChange?.(newDate)
            }}
            numberOfMonths={2}
            locale={vi}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
