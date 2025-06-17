interface PaymentData {
  completeDate?: string
  paymentType?: string
}

interface PaymentDetailsProps {
  paymentId: string | null
  paymentData?: PaymentData | null
}

export function PaymentDetails({ paymentId, paymentData }: PaymentDetailsProps) {
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    const pad = (n: number) => n.toString().padStart(2, "0")
    const day = pad(date.getDate())
    const month = pad(date.getMonth() + 1)
    const year = date.getFullYear()
    const hour = pad(date.getHours())
    const minute = pad(date.getMinutes())
    const second = pad(date.getSeconds())

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`
  }

  return (
    <div className="space-y-6">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-semibold text-green-800 mb-2">Chi tiết đơn hàng</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Mã đơn hàng:</span>
            <span className="font-mono font-semibold">#{paymentId || "N/A"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Thời gian:</span>
            <span>
              {paymentData?.completeDate
                ? formatDateTime(paymentData.completeDate)
                : formatDateTime(new Date().toISOString())}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Dịch vụ:</span>
            <span className="text-black font-semibold">{paymentData?.paymentType}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Trạng thái:</span>
            <span className="text-green-600 font-semibold">Đã thanh toán</span>
          </div>
        </div>
      </div>

      <div className="text-center space-y-2">
        <p className="text-gray-700">📧 Email xác nhận đã được gửi đến hộp thư của bạn</p>
        <p className="text-sm text-gray-500">Vui lòng kiểm tra cả thư mục spam nếu không thấy email</p>
      </div>
    </div>
  )
}
