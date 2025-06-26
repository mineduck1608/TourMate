"use client"

import { useState } from "react"
import { CheckCircle, MessageSquare, Send, Loader2 } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { StarRating } from "./star-rating"
import { PlatformFeedback } from "@/types/platform-feedback"
import { useAccountIdFromToken } from "@/hooks/accountId-from-token"
import { useMutation } from "@tanstack/react-query"
import { addPlatformFeedback } from "@/app/api/platform-feedback"
import { toast } from "react-toastify"

interface FeedbackModalProps {
  isOpen: boolean
  onClose: () => void
  paymentId: number
}

export function FeedbackModal({ isOpen, onClose, paymentId }: FeedbackModalProps) {
  const accountId = useAccountIdFromToken()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false)

  const addFeedbackMutation = useMutation({
    mutationFn: addPlatformFeedback,
    onSuccess: () => {
      toast.success("Gửi đánh giá thành công!")
      setFeedbackSubmitted(true)
      setTimeout(() => {
        onClose()
        resetForm()
      }, 2000)
    },
    onError: () => {
      toast.error("Gửi đánh giá thất bại!")
    },
  })

  const resetForm = () => {
    setRating(0)
    setHoveredRating(0)
    setFeedback("")
    setFeedbackSubmitted(false)
  }

  const handleFeedbackSubmit = () => {
    if (!accountId || rating === 0) return

    const data: PlatformFeedback = {
      feedbackId: 0,
      accountId: accountId,
      paymentId: paymentId,
      rating: rating,
      content: feedback,
      createdAt: new Date().toISOString(),
    }
    addFeedbackMutation.mutate(data)
  }

  const handleClose = () => {
    if (!addFeedbackMutation.isPending) {
      onClose()
      resetForm()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center flex items-center justify-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-600" />
            Đánh giá trải nghiệm của bạn
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          {!feedbackSubmitted ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 mb-4">Hãy cho chúng tôi biết cảm nhận của bạn về dịch vụ</p>
                <StarRating
                  rating={rating}
                  hoveredRating={hoveredRating}
                  onRatingChange={setRating}
                  onHover={setHoveredRating}
                  onLeave={() => setHoveredRating(0)}
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="feedback" className="text-sm font-medium">
                    Chia sẻ thêm về trải nghiệm của bạn
                  </Label>
                  <Textarea
                    id="feedback"
                    placeholder="Hãy chia sẻ những gì bạn thích hoặc những điều cần cải thiện..."
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="min-h-[120px] resize-none"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-gray-500">{feedback.length}/500 ký tự</div>
                </div>

                <div className="flex gap-3">
                  <Button variant="outline" onClick={handleClose} disabled={addFeedbackMutation.isPending} className="flex-1">
                    Hủy
                  </Button>
                  <Button
                    onClick={handleFeedbackSubmit}
                    disabled={rating === 0 || !accountId || addFeedbackMutation.isPending}
                    className="flex-1 bg-blue-600 hover:bg-blue-700"
                  >
                    {addFeedbackMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang gửi...
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Gửi đánh giá
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-4 py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-green-800 mb-2">Cảm ơn bạn đã đánh giá!</h3>
                <p className="text-gray-600 text-sm">Phản hồi của bạn giúp chúng tôi cải thiện dịch vụ tốt hơn</p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
