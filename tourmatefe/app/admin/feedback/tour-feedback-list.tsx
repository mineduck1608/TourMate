"use client"

import { useState } from "react"
import { Eye, Star } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import FeedbackFilters from "./feedback-filters"
import FeedbackDetailModal from "./feedback-detail-modal"
import { tourFeedbacks } from "./data/feedback-data"
// Import utility function
import { formatFeedbackDate } from "./utils/date-utils"

export default function TourFeedbackList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRating, setSelectedRating] = useState("all")
  const [selectedFeedback, setSelectedFeedback] = useState<any>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  // Lọc feedback
  const filteredFeedbacks = tourFeedbacks.filter((feedback) => {
    const matchesSearch =
      feedback.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.tourGuideName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRating = selectedRating === "all" || feedback.rating === Number.parseInt(selectedRating)
    return matchesSearch && matchesRating
  })

  // Update the formatDate function
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

  const handleViewDetail = (feedback: any) => {
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
                  <TableHead>Hướng dẫn viên</TableHead>
                  <TableHead>Tour</TableHead>
                  <TableHead>Đánh giá</TableHead>
                  <TableHead>Nội dung</TableHead>
                  <TableHead>Ngày tạo</TableHead>
                  <TableHead>Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFeedbacks.map((feedback) => (
                  <TableRow key={feedback.feedbackId}>
                    <TableCell className="font-medium">{feedback.customerName}</TableCell>
                    <TableCell>{feedback.tourGuideName}</TableCell>
                    <TableCell className="max-w-xs truncate">{feedback.tourName}</TableCell>
                    <TableCell>{getRatingBadge(feedback.rating)}</TableCell>
                    <TableCell className="max-w-md truncate">{feedback.content}</TableCell>
                    {/* Update the table cell */}
                    <TableCell>{formatDate(feedback.createdDate)}</TableCell>
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
