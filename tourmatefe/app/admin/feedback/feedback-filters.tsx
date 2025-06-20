"use client"

import { Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface FeedbackFiltersProps {
  title: string
  searchTerm: string
  selectedRating: string
  onSearchChange: (value: string) => void
  onRatingChange: (value: string) => void
  onClearFilters: () => void
}

export default function FeedbackFilters({
  title,
  searchTerm,
  selectedRating,
  onSearchChange,
  onRatingChange,
  onClearFilters,
}: FeedbackFiltersProps) {
  return (
    <Card className="py-5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="w-5 h-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <Label htmlFor="search" className="mb-2">Tìm kiếm</Label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="search"
                placeholder="Tên khách hàng, HDV, nội dung..."
                value={searchTerm}
                onChange={(e) => onSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="rating" className="mb-2">Số sao</Label>
            <Select value={selectedRating} onValueChange={onRatingChange}>
              <SelectTrigger>
                <SelectValue placeholder="Chọn số sao" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả</SelectItem>
                <SelectItem value="5">5 sao</SelectItem>
                <SelectItem value="4">4 sao</SelectItem>
                <SelectItem value="3">3 sao</SelectItem>
                <SelectItem value="2">2 sao</SelectItem>
                <SelectItem value="1">1 sao</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-end">
            <Button variant="outline" onClick={onClearFilters} className="w-full">
              Xóa bộ lọc
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
