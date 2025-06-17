"use client"

import Link from "next/link"
import { Home, RefreshCw, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ActionButtonsProps {
  isSuccess: boolean
  type: string | null
  id: string | null
  onOpenFeedback?: () => void
}

export function ActionButtons({ isSuccess, type, id, onOpenFeedback }: ActionButtonsProps) {
  return (
    <div className="w-full space-y-3">
      <Button
        asChild
        className={`w-full h-12 text-base font-semibold ${
          isSuccess ? "bg-green-600 hover:bg-green-700" : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        <Link href="/">
          <Home className="mr-2 h-5 w-5" />
          Về trang chủ
        </Link>
      </Button>

      {/* Nếu là Membership */}
      {type === "membership" ? (
        <>
          {isSuccess && onOpenFeedback && (
            <Button
              onClick={onOpenFeedback}
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Đánh giá dịch vụ
            </Button>
          )}
          {!isSuccess && (
            <Button variant="outline" asChild className="w-full h-12 text-base font-semibold border-2">
              <Link href="/payment/membership">
                <RefreshCw className="mr-2 h-5 w-5" />
                Thử thanh toán lại
              </Link>
            </Button>
          )}
        </>
      ) : (
        <>
          {isSuccess && (
            <Button variant="outline" asChild className="w-full h-12 text-base">
              <Link href={`/tour-schedule`}>Xem lịch trình của tôi</Link>
            </Button>
          )}
          {isSuccess && onOpenFeedback && (
            <Button
              onClick={onOpenFeedback}
              variant="outline"
              className="w-full h-12 text-base font-semibold border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50"
            >
              <MessageSquare className="mr-2 h-5 w-5" />
              Đánh giá dịch vụ
            </Button>
          )}
          {!isSuccess && (
            <Button variant="outline" asChild className="w-full h-12 text-base font-semibold border-2">
              <Link href={`/payment/tour/${id}`}>
                <RefreshCw className="mr-2 h-5 w-5" />
                Thử thanh toán lại
              </Link>
            </Button>
          )}
        </>
      )}
    </div>
  )
}
