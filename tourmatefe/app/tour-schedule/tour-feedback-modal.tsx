"use client"

import { useState, useEffect } from "react"
import { CheckCircle, MessageSquare, Send, Loader2, Edit, Trash2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { StarRating } from "../payment/pay-result/star-rating"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "react-toastify"
import { Feedback } from "@/types/feedback"
import { addTourFeedback, deleteTourFeedback, updateTourFeedback } from "../api/feedback.api"

interface TourFeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  invoiceId: string | number
  customerId: number
  tourGuideId: number
  tourName?: string
  tourGuideName?: string
  existingFeedback?: Feedback | null
}

type ModalMode = "create" | "view" | "edit"

export function TourFeedbackModal({
  isOpen,
  onClose,
  invoiceId,
  customerId,
  tourGuideId,
  tourName,
  tourGuideName,
  existingFeedback,
}: TourFeedbackModalProps) {
  const [mode, setMode] = useState<ModalMode>("create")
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  const queryClient = useQueryClient()

  // Initialize form with existing feedback if available
  useEffect(() => {
    if (existingFeedback) {
      setMode("view")
      setRating(existingFeedback.rating)
      setFeedback(existingFeedback.content)
    } else {
      setMode("create")
      setRating(0)
      setFeedback("")
    }
    setFeedbackSubmitted(false)
    setShowDeleteConfirm(false)
  }, [existingFeedback, isOpen])

  // Create feedback mutation
  const createMutation = useMutation({
    mutationFn: async (data: {
      customerId: number
      tourGuideId: number
      content: string
      rating: number
      invoiceId: number
    }) => {
      return addTourFeedback(data)
    },
    onSuccess: () => {
      toast.success("Đánh giá tour đã được gửi thành công!")
      setFeedbackSubmitted(true)
      queryClient.invalidateQueries({ queryKey: ["tour-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["tour-feedback", invoiceId] })

      // Auto close modal after 2 seconds
      setTimeout(() => {
        onClose()
      }, 2000)
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi gửi đánh giá!")
      console.error("Error creating feedback:", error)
    },
  })

  // Update feedback mutation
  const updateMutation = useMutation({
    mutationFn: async (data: { feedbackId: number; content: string; rating: number; customerId: number; tourGuideId: number }) => {
      return updateTourFeedback(data)
    },
    onSuccess: () => {
      toast.success("Đánh giá đã được cập nhật thành công!")
      setMode("view")
      queryClient.invalidateQueries({ queryKey: ["tour-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["tour-feedback", invoiceId] })
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi cập nhật đánh giá!")
      console.error("Error updating feedback:", error)
    },
  })

  // Delete feedback mutation
  const deleteMutation = useMutation({
    mutationFn: async (feedbackId: number) => {
      return deleteTourFeedback(feedbackId)
    },
    onSuccess: () => {
      toast.success("Đánh giá đã được xóa thành công!")
      queryClient.invalidateQueries({ queryKey: ["tour-schedules"] })
      queryClient.invalidateQueries({ queryKey: ["tour-feedback", invoiceId] })
      onClose()
    },
    onError: (error) => {
      toast.error("Có lỗi xảy ra khi xóa đánh giá!")
      console.error("Error deleting feedback:", error)
    },
  })

  const handleFeedbackSubmit = async () => {
    if (rating === 0) {
      toast.error("Vui lòng chọn số sao đánh giá!")
      return
    }

    if (mode === "create") {
      const createData = {
        customerId,
        tourGuideId,
        content: feedback,
        rating,
        invoiceId: Number(invoiceId),
      }
      createMutation.mutate(createData)
    } else if (mode === "edit" && existingFeedback) {
      const updateData = {
        feedbackId: existingFeedback.feedbackId,
        content: feedback,
        rating,
        customerId,
        tourGuideId,
      }
      updateMutation.mutate(updateData)
    }
  }

  const handleDelete = () => {
    if (existingFeedback) {
      deleteMutation.mutate(existingFeedback.feedbackId)
    }
  }

  const handleClose = () => {
    const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

    if (!isLoading) {
      onClose()
      // Reset form when modal closes
      setTimeout(() => {
        if (!existingFeedback) {
          setRating(0)
          setFeedback("")
        }
        setFeedbackSubmitted(false)
        setShowDeleteConfirm(false)
      }, 300)
    }
  }

  const isLoading = createMutation.isPending || updateMutation.isPending || deleteMutation.isPending

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5 text-orange-600" />
            {mode === "create" ? "Đánh giá chuyến tour" : mode === "edit" ? "Chỉnh sửa đánh giá" : "Đánh giá của bạn"}
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!feedbackSubmitted ? (
            <div className="space-y-6">
              {/* Tour Info */}
              <div className="bg-gray-50 rounded-lg p-3 text-sm">
                <p className="font-medium text-gray-800">Mã tour: #{invoiceId}</p>
                {tourName && <p className="text-gray-600">Tour: {tourName}</p>}
                {tourGuideName && <p className="text-gray-600">Hướng dẫn viên: {tourGuideName}</p>}
                {existingFeedback && (
                  <p className="text-gray-500 text-xs mt-1">
                    Đánh giá lúc: {new Date(existingFeedback.createdDate).toLocaleString("vi-VN")}
                  </p>
                )}
              </div>

              {/* Delete Confirmation */}
              {showDeleteConfirm ? (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 space-y-4">
                  <div className="text-center">
                    <Trash2 className="h-12 w-12 text-red-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-red-800 mb-2">Xóa đánh giá?</h3>
                    <p className="text-red-600 text-sm">
                      Bạn có chắc muốn xóa đánh giá này không? Hành động này không thể hoàn tác.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setShowDeleteConfirm(false)}
                      disabled={isLoading}
                      className="flex-1"
                    >
                      Hủy
                    </Button>
                    <Button onClick={handleDelete} disabled={isLoading} className="flex-1 bg-red-600 hover:bg-red-700">
                      {deleteMutation.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang xóa...
                        </>
                      ) : (
                        <>
                          <Trash2 className="mr-2 h-4 w-4" />
                          Xóa đánh giá
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      {mode === "create"
                        ? "Hãy đánh giá trải nghiệm tour của bạn"
                        : mode === "edit"
                          ? "Chỉnh sửa đánh giá của bạn"
                          : "Đánh giá của bạn"}
                    </p>
                    <StarRating
                      rating={rating}
                      hoveredRating={hoveredRating}
                      onRatingChange={mode !== "view" ? setRating : () => {}}
                      onHover={mode !== "view" ? setHoveredRating : () => {}}
                      onLeave={() => setHoveredRating(0)}
                    />
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tour-feedback" className="text-sm font-medium">
                        Chia sẻ về trải nghiệm tour của bạn
                      </Label>
                      <Textarea
                        id="tour-feedback"
                        placeholder="Hãy chia sẻ về chất lượng tour, hướng dẫn viên, địa điểm, dịch vụ..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[120px] resize-none"
                        maxLength={500}
                        disabled={mode === "view"}
                      />
                      <div className="text-right text-xs text-gray-500">{feedback.length}/500 ký tự</div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {mode === "view" ? (
                        <>
                          <Button variant="outline" onClick={handleClose} className="flex-1">
                            Đóng
                          </Button>
                          <Button onClick={() => setMode("edit")} className="flex-1 bg-blue-600 hover:bg-blue-700">
                            <Edit className="mr-2 h-4 w-4" />
                            Chỉnh sửa
                          </Button>
                          <Button
                            onClick={() => setShowDeleteConfirm(true)}
                            variant="outline"
                            className="border-red-300 text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            variant="outline"
                            onClick={mode === "edit" ? () => setMode("view") : handleClose}
                            disabled={isLoading}
                            className="flex-1"
                          >
                            {mode === "edit" ? "Hủy" : "Hủy"}
                          </Button>
                          <Button
                            onClick={handleFeedbackSubmit}
                            disabled={rating === 0 || isLoading}
                            className="flex-1 bg-orange-600 hover:bg-orange-700"
                          >
                            {isLoading ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                {mode === "create" ? "Đang gửi..." : "Đang cập nhật..."}
                              </>
                            ) : (
                              <>
                                <Send className="mr-2 h-4 w-4" />
                                {mode === "create" ? "Gửi đánh giá" : "Cập nhật"}
                              </>
                            )}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Cảm ơn bạn đã đánh giá!</h3>
                <p className="text-gray-600 text-sm">
                  Đánh giá của bạn giúp chúng tôi và hướng dẫn viên cải thiện chất lượng dịch vụ
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
