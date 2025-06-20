import { Star } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"

interface FeedbackDetailModalProps {
  isOpen: boolean
  onClose: () => void
  feedback: any
  type: "tour" | "platform"
}

export default function FeedbackDetailModal({ isOpen, onClose, feedback, type }: FeedbackDetailModalProps) {
  if (!feedback) return null

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star key={star} className={`w-4 h-4 ${star <= rating ? "text-yellow-400 fill-current" : "text-gray-300"}`} />
        ))}
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá {type === "tour" ? "Tour" : "Hệ thống"}</DialogTitle>
          <DialogDescription>
            Đánh giá từ {type === "tour" ? feedback.customerName : feedback.accountName}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-medium">{type === "tour" ? "Khách hàng" : "Tài khoản"}</Label>
              <p className="text-sm">{type === "tour" ? feedback.customerName : feedback.accountName}</p>
            </div>
            {type === "tour" ? (
              <>
                <div>
                  <Label className="text-sm font-medium">Hướng dẫn viên</Label>
                  <p className="text-sm">{feedback.tourGuideName}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Tour</Label>
                  <p className="text-sm">{feedback.tourName}</p>
                </div>
              </>
            ) : (
              <div>
                <Label className="text-sm font-medium">Payment ID</Label>
                <p className="text-sm">#{feedback.paymentId}</p>
              </div>
            )}
            <div>
              <Label className="text-sm font-medium">Ngày tạo</Label>
              <p className="text-sm">{formatDate(type === "tour" ? feedback.createdDate : feedback.createdAt)}</p>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Đánh giá</Label>
            <div className="flex items-center space-x-2 mt-1">
              {renderStars(feedback.rating)}
              <span className="font-semibold">{feedback.rating}/5</span>
            </div>
          </div>
          <div>
            <Label className="text-sm font-medium">Nội dung đánh giá</Label>
            <p className="text-sm mt-1 p-3 bg-gray-50 rounded-lg">{feedback.content || "Không có nội dung đánh giá"}</p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
