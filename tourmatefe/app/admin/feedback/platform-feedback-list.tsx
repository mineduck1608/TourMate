"use client"

import { usePlatformFeedbacks } from "@/hooks/use-platform-feedback"
import { useState } from "react"
import { Eye, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FeedbackFilters from "./feedback-filters"
import FeedbackDetailModal from "./feedback-detail-modal"
import { formatFeedbackDate } from "./utils/date-utils"
import type { PlatformFeedbackDto } from "@/types/platform-feedback"

export default function PlatformFeedbackList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<PlatformFeedbackDto | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Sử dụng API hook với proper types
  const { data: feedbacksResponse, isLoading, error } = usePlatformFeedbacks()
  const feedbacks: PlatformFeedbackDto[] = feedbacksResponse || []

  // Loading state
  if (isLoading) {
    return <div>Đang tải dữ liệu...</div>
  }

  // Error state
  if (error) {
    return <div>Lỗi khi tải dữ liệu: {error.message}</div>
  }

  // Lọc feedback với proper types
  const filteredFeedbacks = feedbacks.filter((feedback: PlatformFeedbackDto) => {
    const matchesSearch =
      feedback.accountName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (feedback.content && feedback.content.toLowerCase().includes(searchTerm.toLowerCase()))
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

  const handleViewDetail = (feedback: PlatformFeedbackDto) => {
    setSelectedFeedback(feedback)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <FeedbackFilters
        title="Bộ lọc đánh giá Hệ thống"
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
          <CardTitle>Danh sách đánh giá Hệ thống</CardTitle>
          <CardDescription>Hiển thị {filteredFeedbacks.length} đánh giá</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Tài khoản</TableHead>
                  <TableHead>Payment ID</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback: PlatformFeedbackDto) => (
                  <TableRow key={feedback.feedbackId}>
                    <TableCell className="font-medium">{feedback.accountName}</TableCell>
                    <TableCell>#{feedback.paymentId}</TableCell>
                    <TableCell>{getRatingBadge(feedback.rating)}</TableCell>
                    <TableCell className="max-w-md truncate">{feedback.content || "Không có nội dung"}</TableCell>
                    <TableCell>{formatDate(feedback)}</TableCell>
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
        type="platform"
      />
    </div>
  )
}
