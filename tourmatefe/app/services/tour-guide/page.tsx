"use client"

import { getSimplifiedAreas } from "@/app/api/active-area.api"
import { getList } from "@/app/api/tour-guide.api"
import { useQueryString } from "@/app/utils/utils"
import Banner from "@/components/Banner"
import SafeImage from "@/components/safe-image"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import Link from "next/link"
import { useRouter } from "next/navigation"
import type React from "react"
import { Suspense, useState } from "react"
import { FaCheck } from "react-icons/fa"
import { Search, MapPin, ChevronLeft, ChevronRight, Filter, User, Calendar } from "lucide-react"

const LIMIT = 12

type SearchTerm = {
    name: string
    areaId?: number
    rating?: number
}

function TourGuideMain() {
    const queryString: { page?: string } = useQueryString()
    const router = useRouter()
    const page = Number(queryString.page) || 1
    const [searchTerm, setSearchTerm] = useState<SearchTerm>({
        name: "",
        areaId: 0,
    })

    const simplifiedAreaQuery = useQuery({
        queryKey: ["simplified-area"],
        queryFn: () => getSimplifiedAreas(),
        staleTime: 24 * 3600 * 1000,
    })
    const areas = simplifiedAreaQuery.data?.data ?? []

    const { data } = useQuery({
        queryKey: ["tour-guide", LIMIT, page, searchTerm],
        queryFn: () => {
            const controller = new AbortController()
            setTimeout(() => {
                controller.abort()
            }, 5000)
            return getList(searchTerm.name, searchTerm.areaId, page, LIMIT, controller.signal)
        },
        retry: 0,
        refetchOnWindowFocus: false,
        staleTime: 24 * 3600 * 1000,
    })

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = event.target
        setSearchTerm({ ...searchTerm, [name]: value })
    }

    const handlePageChange = (a: number) => {
        router.push(`/services/tour-guide?page=${page + a}`)
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            <div>
                <Banner imageUrl="/find-tour-guide.jpg" title="TÌM KIẾM HƯỚNG DẪN VIÊN" />
            </div>

            <div className="container max-w-full mx-auto p-15">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Filter Sidebar */}
                    <div data-aos="fade-right" className="w-full lg:w-80">
                        <div className="bg-white shadow-xl rounded-2xl p-6 lg:sticky lg:top-30 border border-gray-200">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Filter className="w-5 h-5 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Bộ lọc</h3>
                            </div>

                            <div className="space-y-6">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        value={searchTerm.name}
                                        name="name"
                                        onChange={handleSearchChange}
                                        placeholder="Tìm kiếm hướng dẫn viên..."
                                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white"
                                    />
                                </div>

                                <div>
                                    <label className="block mb-3 font-semibold text-gray-700 flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-green-600" />
                                        Khu vực:
                                    </label>
                                    <select
                                        id="areaId"
                                        name="areaId"
                                        title="area"
                                        className="w-full p-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white cursor-pointer"
                                        required
                                        onChange={handleSearchChange}
                                        value={searchTerm.areaId}
                                    >
                                        <option value={"0"}>Chọn khu vực</option>
                                        {areas.map((v, i) => (
                                            <option value={v.areaId} key={"area" + i}>
                                                {v.areaName}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* Results counter */}
                                <div className="pt-4 border-t border-gray-200">
                                    <div className="flex items-center gap-2 text-sm text-gray-600 bg-green-50 p-3 rounded-lg">
                                        <User className="w-4 h-4 text-green-600" />
                                        <span className="font-medium">Tìm thấy {data?.totalResult || 0} hướng dẫn viên</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div data-aos="fade-left" className="flex-1">
                        <div className="mb-8">
                            <h2 className="text-3xl font-bold text-gray-900 mb-3">Danh sách hướng dẫn viên</h2>
                            <p className="text-gray-600 text-lg">Tìm kiếm hướng dẫn viên chuyên nghiệp cho chuyến du lịch của bạn</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3 gap-8">
                            {data?.result?.map((v, index) => (
                                <Link key={index} href={`tour-guide/${v.tourGuideId}`} passHref>
                                    <div className="group bg-white shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition-all duration-500 ease-out transform hover:-translate-y-2 border border-gray-100">
                                        <div className="relative overflow-hidden">
                                            <SafeImage
                                                src={v.image}
                                                alt={v.fullName}
                                                className="w-full h-64 object-cover transition-transform duration-700 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                            {v.isVerified && (
                                                <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                                    <FaCheck className="w-3 h-3" />
                                                    Đối tác
                                                </div>
                                            )}
                                            <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium text-gray-700 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                                                Xem hồ sơ
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <div className="flex items-center gap-2 mb-3">
                                                <h4 className="font-bold text-xl text-gray-900 group-hover:text-green-600 transition-colors duration-300">
                                                    {v.fullName}
                                                </h4>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-500 text-sm mb-4">
                                                <Calendar className="w-4 h-4" />
                                                <span>Sinh năm: {dayjs(v.dateOfBirth).format("DD/MM/YYYY")}</span>
                                            </div>
                                            <div
                                                className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed"
                                                dangerouslySetInnerHTML={{
                                                    __html: v.tourGuideDescs?.[0]?.description || "Chưa có mô tả",
                                                }}
                                            />
                                            <button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 shadow-lg hover:shadow-xl">
                                                Xem hồ sơ
                                            </button>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        <div className="flex flex-col sm:flex-row items-center justify-between mt-12 pt-8 border-t border-gray-200 gap-6">
                            <div className="text-gray-600 font-medium">
                                Trang {page} / {data?.totalPage} • {data?.totalResult || 0} kết quả
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={() => handlePageChange(-1)}
                                    disabled={page === 1}
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
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
                                                onClick={() => router.push(`/services/tour-guide?page=${pageNum}`)}
                                                className={`w-12 h-12 rounded-xl font-semibold transition-all duration-200 ${pageNum === page
                                                        ? "bg-green-600 text-white shadow-lg"
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
                                    className="flex items-center gap-2 px-6 py-3 bg-white border-2 border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow-md"
                                >
                                    Trang sau
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </div>

                        {/* Empty state */}
                        {data?.result?.length === 0 && (
                            <div className="text-center py-12">
                                <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                                    <User className="w-12 h-12 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">Không tìm thấy hướng dẫn viên nào</h3>
                                <p className="text-gray-600 mb-4">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function TourGuideDriver() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mx-auto mb-4"></div>
                        <p className="text-gray-600 text-lg font-medium">Đang tải...</p>
                    </div>
                </div>
            }
        >
            <TourGuideMain />
        </Suspense>
    )
}
