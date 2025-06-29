'use client'

import { useState } from "react"
import TourGuideSidebar from "./sidebar"
import ScheduleCard from "./schedule-card"
import { Search, ChevronLeft, ChevronRight } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { TourSchedule } from "@/types/tour-schedule"
import MegaMenu from "@/components/mega-menu"
import Footer from "@/components/Footer"
import { fetchSchedules } from "@/app/api/schedule.api"
import { MyJwtPayload } from "@/types/JwtPayload"
import { useToken } from "@/components/getToken"
import { jwtDecode } from "jwt-decode"
import { getFeedbacksByAccountId } from "@/app/api/feedback.api"
import FeedbackCard from "./feedback-card"
import { TourGuideFeedback } from "@/types/feedback"

const pageSize = 5

export default function TourSchedulePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Chờ xác nhận")
  const [currentPage, setCurrentPage] = useState(1)
  const [showFeedbacks, setShowFeedbacks] = useState(false)

  const token = useToken("accessToken")
  const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
  const accountId = Number(payLoad?.AccountId)
  const role = payLoad?.["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"]

  const { data, isLoading, isError } = useQuery({
    queryKey: ["tour-schedules", selectedFilter, searchTerm, currentPage],
    queryFn: () =>
      fetchSchedules(
        selectedFilter,
        searchTerm,
        currentPage,
        pageSize,
        accountId,
        role as string
      ),
    retry: 1,
    refetchOnWindowFocus: false,
    enabled: !showFeedbacks,
  })

  const feedbackQuery = useQuery({
    queryKey: ["tour-guide-feedbacks", accountId],
    queryFn: () => getFeedbacksByAccountId(accountId),
    enabled: showFeedbacks && !!accountId,
  })

  const schedules: TourSchedule[] = data?.result ?? []
  const totalPages = data?.totalPage ?? 1

  const handleFilterChange = (label: string) => {
    if (label === "Đánh giá nhận được") {
      setShowFeedbacks(true)
      return
    }

    setShowFeedbacks(false)
    setSelectedFilter(label)
    setSearchTerm("")
    setCurrentPage(1)
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
    setCurrentPage(1)
  }
  return (
    <>
      <MegaMenu />
      <div className="flex flex-col md:flex-row text-gray-900 bg-gray-50 min-h-screen">
        
        {/* Sidebar desktop */}
        <div className="hidden md:flex p-4 md:p-10 flex-col sticky top-20 h-fit self-start">
          <TourGuideSidebar onNavItemClick={handleFilterChange} />
        </div>
        {/* Sidebar mobile */}
        <div className="md:hidden p-2">
          <TourGuideSidebar onNavItemClick={handleFilterChange} />
        </div>
        <main className="flex-1 px-2 pt-4 md:pr-10 md:pt-10 space-y-6">
          {/* Search box (chỉ hiện khi không phải xem đánh giá) */}
          {!showFeedbacks && (
            <div className="w-full max-w-md bg-white rounded-2xl shadow-md border border-gray-100 p-4 flex items-center gap-3">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Tìm theo tên khách hoặc mã tour"
                className="flex-grow text-gray-900 text-base font-normal bg-transparent border-none outline-none placeholder:text-gray-400"
                value={searchTerm}
                onChange={handleSearchChange}
              />
            </div>
          )}

          {/* Lịch hẹn hoặc Đánh giá */}
          {showFeedbacks ? (
            <div className="mb-4 space-y-4">
              {feedbackQuery.isLoading && <p>Đang tải đánh giá...</p>}
              {feedbackQuery.isError && <p className="text-red-500">Lỗi khi tải đánh giá.</p>}
              {feedbackQuery.data?.length === 0 && (
                <p className="text-gray-500">Chưa có đánh giá nào.</p>
              )}
              {feedbackQuery.data?.map((fb: TourGuideFeedback) => (
                <FeedbackCard
                  key={fb.feedbackId}
                  customerName={fb.customerName}
                  rating={fb.rating}
                  content={fb.content}
                  createdAt={fb.createdAt}
                  customerAccountId={fb.customerAccountId}
                />
              ))}
            </div>
          ) : (
            <>
              {isLoading && <p>Đang tải dữ liệu...</p>}
              {isError && <p className="text-red-500">Lỗi khi tải dữ liệu.</p>}
              {schedules.map((schedule) => (
                <ScheduleCard key={schedule.invoiceId} {...schedule} />
              ))}
              {!isLoading && schedules.length === 0 && (
                <p className="text-gray-500">Không tìm thấy lịch hẹn nào phù hợp.</p>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 mt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="text-sm px-3 py-1 rounded border bg-white disabled:opacity-50"
                  >
                    <ChevronLeft className="inline w-4 h-4" /> Trước
                  </button>
                  <span>
                    Trang {currentPage} / {totalPages}
                  </span>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="text-sm px-3 py-1 rounded border bg-white disabled:opacity-50"
                  >
                    Tiếp <ChevronRight className="inline w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
