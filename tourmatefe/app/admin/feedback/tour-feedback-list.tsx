"use client"

import { useTourFeedbacks } from "@/hooks/use-feedback"
import { useState } from "react"
import { Eye, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FeedbackFilters from "./feedback-filters"
import FeedbackDetailModal from "./feedback-detail-modal"
import { formatFeedbackDate } from "./utils/date-utils"
import type { TourFeedback } from "@/types/feedback"

export default function TourFeedbackList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<TourFeedback | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sử dụng API hook với proper types
  const { data: feedbacksResponse, isLoading, error } = useTourFeedbacks()
  const feedbacks: TourFeedback[] = feedbacksResponse || []

  // Loading state
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>
  }

  // Error state
  if (error) {
    return <div>Lỗi khi tải dữ liệu: {error.message}</div>
  }

  // Lọc feedback với proper types
  const filteredFeedbacks = feedbacks.filter((feedback: TourFeedback) => {
    const matchesSearch =
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.tourGuideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = selectedRating === "all" || feedback.rating === Number.parseInt(selectedRating)
    return matchesSearch && matchesRating
  })

  const formatDate = formatFeedbackDate

  const getRatingBadge = (rating: number) => {
    const colors = {
      5: "bg-green-100 text-green-800",
      4: "bg-blue-100 text-blue-800",
      3: "bg-yellow-100 text-yellow-800",
      2: "bg-orange-100 text-orange-800",
      1: "bg-red-100 text-red-800",
    }
    return (
      <Badge className={colors[rating as keyof typeof colors]}>
        <Star className="w-3 h-3 mr-1 fill-current" />
        {rating}
      </Badge>
    )
  }

  const handleViewDetail = (feedback: TourFeedback) => {
    setSelectedFeedback(feedback)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <FeedbackFilters
        title="Bộ lọc đánh giá Tour"
        searchTerm={searchTerm}
        selectedRating={selectedRating}
        onSearchChange={setSearchTerm}
        onRatingChange={setSelectedRating}
        onClearFilters={() => {
          setSearchTerm("")
          setSelectedRating("all")
        }}
      />

      <Card className="py-5">
        <CardHeader>
          <CardTitle>Danh sách đánh giá Tour</CardTitle>
          <CardDescription>Hiển thị {filteredFeedbacks.length} đánh giá</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Khách hàng</TableHead>
                  <TableHead className="hidden md:table-cell">Hướng dẫn viên</TableHead>
                  {/* <TableHead className="hidden lg:table-cell">Tour</TableHead> */}
                  <TableHead>Đánh giá</TableHead>
                  <TableHead className="hidden xl:table-cell">Nội dung</TableHead>
                  <TableHead className="hidden lg:table-cell">Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback: TourFeedback) => (
                  <TableRow key={feedback.feedbackId}>
                    <TableCell className="font-medium">{feedback.customerName}</TableCell>
                    <TableCell className="hidden md:table-cell">{feedback.tourGuideName}</TableCell>
                    {/* <TableCell className="hidden lg:table-cell max-w-xs truncate">{feedback.tourName}</TableCell> */}
                    <TableCell>{getRatingBadge(feedback.rating)}</TableCell>
                    <TableCell className="hidden xl:table-cell max-w-md truncate">{feedback.content}</TableCell>
                    <TableCell className="hidden lg:table-cell">{formatDate(feedback)}</TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" onClick={() => handleViewDetail(feedback)}>
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <FeedbackDetailModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        feedback={selectedFeedback}
        type="tour"
      />
    </div>
  )
}
