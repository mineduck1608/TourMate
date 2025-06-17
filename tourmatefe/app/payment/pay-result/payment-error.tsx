export function PaymentError() {
  return (
    <div className="space-y-6">
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <h3 className="font-semibold text-red-800 mb-2">Lý do có thể gây lỗi</h3>
        <ul className="text-sm text-red-700 space-y-1">
          <li>• Thông tin thẻ không chính xác</li>
          <li>• Số dư tài khoản không đủ</li>
          <li>• Thẻ đã hết hạn hoặc bị khóa</li>
          <li>• Lỗi kết nối mạng</li>
        </ul>
      </div>

      <div className="text-center">
        <p className="text-gray-700">💡 Vui lòng kiểm tra lại thông tin và thử lại</p>
        <p className="text-sm text-gray-500 mt-2">Hoặc liên hệ với chúng tôi nếu vấn đề vẫn tiếp tục</p>
      </div>
    </div>
  )
}
