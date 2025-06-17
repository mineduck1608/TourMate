import { Loader2 } from "lucide-react"

export function PaymentResultLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto" />
        <p className="text-lg text-gray-600">Đang tải thông tin thanh toán...</p>
      </div>
    </div>
  )
}
