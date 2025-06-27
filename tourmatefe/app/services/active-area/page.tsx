"use client"

import type React from "react"

import Banner from "@/components/Banner"
import { Suspense, useEffect, useState } from "react"
import "aos/dist/aos.css"
import AOS from "aos"
import { useQueryString } from "@/app/utils/utils"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { getFilteredActiveAreas } from "@/app/api/active-area.api"
import SafeImage from "@/components/safe-image"
import { Search, MapPin, ChevronLeft, ChevronRight, Filter } from "lucide-react"

const LIMIT = 9

function ActiveAreaList() {
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1
  const router = useRouter()

  // Giữ nguyên state logic
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedRegion, setSelectedRegion] = useState("")

  // Giữ nguyên các handler functions
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value)
  }

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value)
  }

  const handlePageChange = (a: number) => {
    router.push(`/services/active-area?page=${page + a}&search=${searchTerm}&region=${selectedRegion}`)
  }

  // Giữ nguyên useQuery logic
  const { data } = useQuery({
    queryKey: ["active-area", page, searchTerm, selectedRegion],
    queryFn: () => {
      const controller = new AbortController()
      setTimeout(() => {
        controller.abort()
      }, 5000)
      return getFilteredActiveAreas(page, LIMIT, searchTerm, selectedRegion, controller.signal, true)
    },
    retry: 0,
    refetchOnWindowFocus: false,
    staleTime: 24 * 3600 * 1000,
  })

  // Giữ nguyên useEffect logic
  useEffect(() => {
    AOS.init({
      offset: 0,
      delay: 200,
      duration: 1200,
      once: true,
    })
  }, [])

  useEffect(() => {
    router.replace(`/services/active-area?page=${page}&search=${searchTerm}&region=${selectedRegion}`)
  }, [page, searchTerm, selectedRegion, router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div>
        <Banner imageUrl="/bacthang.jpg" title="Khám Phá Các Địa Điểm Du Lịch Tại Việt Nam" />
      </div>

      <div className="container max-w-full mx-auto p-15">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filter Sidebar - Improved UI only */}
          <div data-aos="fade-right" className="w-full lg:w-80 order-1 lg:order-1">
            <div className="bg-white shadow-xl rounded-2xl p-6 sticky top-30 border border-gray-200">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Filter className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Bộ lọc</h3>
              </div>

              <div className="space-y-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Tìm kiếm thành phố..."
                    className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                  />
                </div>

                <div>
                  <label className="block mb-3 font-semibold text-gray-700 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    Vùng miền:
                  </label>
                  <select
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer"
                  >
                    <option value="">Tất cả</option>
                    <option value="Miền Bắc">Miền Bắc</option>
                    <option value="Miền Nam">Miền Nam</option>
                    <option value="Miền Trung">Miền Trung</option>
                    <option value="Miền Tây">Miền Tây</option>
                  </select>
                </div>

                {/* Results counter */}
                <div className="pt-4 border-t border-gray-200">
                  <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <MapPin className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">Tìm thấy {data?.totalResult || 0} địa điểm</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Improved UI only */}
          <div data-aos="fade-left" className="flex-1 order-2 lg:order-2">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-3">Danh sách thành phố</h2>
              <p className="text-gray-600 text-lg">Khám phá những điểm đến tuyệt vời trên khắp Việt Nam</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
              {data?.result?.map((area, index) => (
                <Link key={index} href={`active-area/detail?id=${area.areaId}`} passHref>
                  <div className="group bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-gray-100">
                    <div className="relative overflow-hidden">
                      <SafeImage
                        src={area.bannerImg}
                        alt={area.areaName}
                        className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                        Xem chi tiết
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-blue-600 transition-colors duration-300 line-clamp-2">
                        {area.areaTitle}
                      </h4>
                      <p className="text-gray-600 text-base mb-6 line-clamp-1 leading-relaxed">{area.areaSubtitle}</p>
                      <button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                        Xem ngay
                      </button>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination - Improved UI only */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t border-gray-200 gap-6">
              <div className="text-gray-600 font-medium">
                Trang {page} / {data?.totalPage} • {data?.totalResult || 0} kết quả
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handlePageChange(-1)}
                  disabled={page === 1}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Trang trước
                </button>

                <div className="hidden sm:flex items-center gap-2">
                  {Array.from({ length: Math.min(5, data?.totalPage || 1) }, (_, i) => {
                    const pageNum = Math.max(1, Math.min((data?.totalPage || 1) - 4, page - 2)) + i
                    if (pageNum > (data?.totalPage || 1)) return null

                    return (
                      <button
                        key={pageNum}
                        onClick={() =>
                          router.push(
                            `/services/active-area?page=${pageNum}&search=${searchTerm}&region=${selectedRegion}`,
                          )
                        }
                        className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${pageNum === page
                            ? "bg-blue-600 text-white shadow-lg"
                            : "bg-white border-2 border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                          }`}
                      >
                        {pageNum}
                      </button>
                    )
                  })}
                </div>

                <button
                  onClick={() => handlePageChange(1)}
                  disabled={page === data?.totalPage || data?.totalPage === 0 || data?.totalPage === undefined}
                  className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                >
                  Trang sau
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ActiveAreaDriver() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Đang tải...</p>
          </div>
        </div>
      }
    >
      <ActiveAreaList />
    </Suspense>
  )
}
