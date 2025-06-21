import { BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FeedbackHeader() {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Phân tích Đánh giá</h1>
            <p className="text-gray-600">Theo dõi và phân tích feedback từ khách hàng</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="bg-white text-gray-700">
              <BarChart3 className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
