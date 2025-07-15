import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTourFeedbacks } from "@/hooks/use-feedback"
import { usePlatformFeedbacks } from "@/hooks/use-platform-feedback"
import { createExcelWorkbook, addWorksheetToWorkbook, exportToExcel, cleanHtmlText, formatDateForExcel, formatCurrencyForExcel } from "@/lib/export-utils"
import { toast } from "react-toastify"
import { PlatformFeedbackData, TourFeedbackData } from "@/types/admin-dashboard"


export default function FeedbackHeader() {
  // Fetch all feedback data
  const { data: tourFeedbacks } = useTourFeedbacks()
  const { data: platformFeedbacks } = usePlatformFeedbacks()

  const handleExportAllFeedback = async () => {
    try {
      toast.loading("Đang tạo báo cáo feedback tổng hợp...")
      
      const wb = createExcelWorkbook();
      
      // 1. Tour Feedback
      if (tourFeedbacks && tourFeedbacks.length > 0) {
        const tourFeedbackData = tourFeedbacks.map((feedback: TourFeedbackData, index: number) => ({
          "STT": index + 1,
          "Loại": "Tour Feedback",
          "Khách hàng": feedback.customerName || "N/A",
          "Hướng dẫn viên": feedback.tourGuideName || "N/A",
          "Đánh giá": `${feedback.rating}/5`,
          "Nội dung": cleanHtmlText(feedback.content || ""),
          "Ngày tạo": formatDateForExcel(feedback.createdDate || ""),
          "Doanh thu tour (VND)": feedback.tourRevenue ? formatCurrencyForExcel(feedback.tourRevenue) : "N/A",
          "Trạng thái": feedback.rating >= 4 ? "Tích cực" : feedback.rating >= 3 ? "Trung bình" : "Tiêu cực"
        }));
        addWorksheetToWorkbook(wb, tourFeedbackData, "Tour Feedback");
      }

      // 2. Platform Feedback
      if (platformFeedbacks && platformFeedbacks.length > 0) {
        const platformFeedbackData = platformFeedbacks.map((feedback: PlatformFeedbackData, index: number) => ({
          "STT": index + 1,
          "Loại": "Platform Feedback",
          "Người dùng": feedback.accountName || "N/A",
          "Đánh giá": `${feedback.rating}/5`,
          "Nội dung": cleanHtmlText(feedback.content || ""),
          "Ngày tạo": formatDateForExcel(feedback.createdAt || ""),
          "Trạng thái": feedback.rating >= 4 ? "Tích cực" : feedback.rating >= 3 ? "Trung bình" : "Tiêu cực"
        }));
        addWorksheetToWorkbook(wb, platformFeedbackData, "Platform Feedback");
      }

      // 3. Thống kê tổng hợp
      const tourCount = tourFeedbacks?.length || 0;
      const platformCount = platformFeedbacks?.length || 0;
      const tourPositive = tourFeedbacks?.filter((f: TourFeedbackData) => f.rating >= 4).length || 0;
      const platformPositive = platformFeedbacks?.filter((f: PlatformFeedbackData) => f.rating >= 4).length || 0;
      
      // Tính tổng doanh thu từ tour feedback
      const totalTourRevenue = tourFeedbacks?.reduce((sum: number, f: TourFeedbackData) => sum + (f.tourRevenue || 0), 0) || 0;
      
      const summaryData = [
        {
          "Loại Feedback": "Tour",
          "Tổng số": tourCount,
          "Tích cực (4-5 sao)": tourPositive,
          "Tỷ lệ tích cực (%)": tourCount > 0 ? ((tourPositive / tourCount) * 100).toFixed(2) : "0",
          "Điểm TB": tourCount > 0 ? (tourFeedbacks?.reduce((sum: number, f: TourFeedbackData) => sum + f.rating, 0) / tourCount).toFixed(2) : "0",
          "Tổng doanh thu (VND)": formatCurrencyForExcel(totalTourRevenue)
        },
        {
          "Loại Feedback": "Platform",
          "Tổng số": platformCount,
          "Tích cực (4-5 sao)": platformPositive,
          "Tỷ lệ tích cực (%)": platformCount > 0 ? ((platformPositive / platformCount) * 100).toFixed(2) : "0",
          "Điểm TB": platformCount > 0 ? (platformFeedbacks?.reduce((sum: number, f: PlatformFeedbackData) => sum + f.rating, 0) / platformCount).toFixed(2) : "0",
          "Tổng doanh thu (VND)": "N/A"
        },
        {
          "Loại Feedback": "Tổng cộng",
          "Tổng số": tourCount + platformCount,
          "Tích cực (4-5 sao)": tourPositive + platformPositive,
          "Tỷ lệ tích cực (%)": (tourCount + platformCount) > 0 ? (((tourPositive + platformPositive) / (tourCount + platformCount)) * 100).toFixed(2) : "0",
          "Điểm TB": "N/A",
          "Tổng doanh thu (VND)": formatCurrencyForExcel(totalTourRevenue)
        }
      ];
      
      addWorksheetToWorkbook(wb, summaryData, "Thống Kê Tổng Hợp");

      // Xuất file
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0];
      const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '-');
      exportToExcel(wb, `BaoCaoFeedback_TongHop_${dateStr}_${timeStr}`);
      
      toast.dismiss()
      toast.success("Xuất báo cáo feedback thành công!")
    } catch (error) {
      toast.dismiss()
      console.error("Export error:", error)
      toast.error("Không thể xuất báo cáo feedback")
    }
  }

  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Phân tích Đánh giá</h1>
            <p className="text-gray-600">Theo dõi và phân tích feedback từ khách hàng</p>
          </div>
          <div className="flex gap-3">
            <Button 
              onClick={handleExportAllFeedback}
              variant="outline" 
              className="bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Xuất báo cáo
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
