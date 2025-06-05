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

const pageSize = 5 // Tuỳ chỉnh số phần tử mỗi trang

export default function TourSchedulePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedFilter, setSelectedFilter] = useState("Chờ xác nhận")
  const [currentPage, setCurrentPage] = useState(1)

  const token = useToken('accessToken')
  const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
  const accountId = Number(payLoad?.AccountId)
  const role = payLoad?.Role

  const { data, isLoading, isError } = useQuery({
    queryKey: ['tour-schedules', selectedFilter, searchTerm, currentPage],
    queryFn: () => {
      return fetchSchedules(selectedFilter, searchTerm, currentPage, pageSize, accountId, role as string);
    },
    retry: 1,
    refetchOnWindowFocus: false,
  });


  console.log("data", data)
  const schedules: TourSchedule[] = data?.result ?? []
  const totalPages = data?.totalPage ?? 1

  const handleFilterChange = (label: string) => {
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
      <hr className="border-gray-200 sm:mx-auto" />
      <div className="flex text-gray-900 bg-gray-50">
        <div className="p-10 flex flex-col sticky top-10 h-fit self-start">
          <TourGuideSidebar onNavItemClick={handleFilterChange} />
        </div>
        <main className="flex-1 py-10 pr-10 space-y-6">
          {/* Search box */}
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

          {/* Loading */}
          {isLoading && <p>Đang tải dữ liệu...</p>}
          {isError && <p className="text-red-500">Lỗi khi tải dữ liệu.</p>}

          {/* Schedule list */}
          {schedules.map((schedule) => (
            <ScheduleCard key={schedule.invoiceId} {...schedule} />
          ))}

          {/* Empty state */}
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
              <span>Trang {currentPage} / {totalPages}</span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="text-sm px-3 py-1 rounded border bg-white disabled:opacity-50"
              >
                Tiếp <ChevronRight className="inline w-4 h-4" />
              </button>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  )
}
