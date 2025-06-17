import { CheckCircle, XCircle } from "lucide-react"

interface PaymentResultHeaderProps {
  isSuccess: boolean
}

export function PaymentResultHeader({ isSuccess }: PaymentResultHeaderProps) {
  return (
    <div className="text-center mb-8">
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          isSuccess ? "bg-green-100 animate-pulse" : "bg-red-100 animate-pulse"
        }`}
      >
        {isSuccess ? (
          <CheckCircle className="h-12 w-12 text-green-600" />
        ) : (
          <XCircle className="h-12 w-12 text-red-600" />
        )}
      </div>
      <h1 className={`text-3xl font-bold mb-2 ${isSuccess ? "text-green-800" : "text-red-600"}`}>
        {isSuccess ? "Thanh toán thành công!" : "Thanh toán thất bại!"}
      </h1>
      <p className="text-black text-lg">
        {isSuccess
          ? "Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi"
          : "Đừng lo lắng, bạn có thể thử lại ngay bây giờ"}
      </p>
    </div>
  )
}
