"use client"
import { Suspense, useContext, useEffect, useState } from "react"
import Profile from "./profile"
import Bids from "./tour-bids-page"
import { getMostPopularAreas } from "@/app/api/active-area.api"
import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import { TourGuideSiteContext, type TourGuideSiteContextProps } from "../context"
import Banner from "@/components/Banner"
import type { TourBid, TourBidListResult } from "@/types/tour-bid"
import { baseData, BidTaskContext } from "./tour-bid-task-context"
import RotatingActiveArea from "@/components/rotating-active-area"
import RotatingTourGuide from "@/components/rotating-tour-guide"

function TourBidPageMain() {
    const { accId, tourGuide } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
    const simplifiedAreaQuery = useQuery({
        queryKey: ["most-popular-area"],
        queryFn: () => getMostPopularAreas(),
    })
    const [content, setContent] = useState("")
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const areas = simplifiedAreaQuery.data?.data ?? []

    const [modalOpen, setModalOpen] = useState({
        changeStatus: false,
        edit: false,
        delete: false,
        create: false,
    })
    const [signal, setSignal] = useState({
        edit: false,
        create: false,
        delete: false,
        likeOrUnlike: false,
    })
    const [target, setTarget] = useState<TourBidListResult | TourBid>({ ...baseData })

    useEffect(() => {
        setTarget({ ...target, accountId: accId })
    }, [accId])

    function refetch() {
        setTimeout(() => {
            simplifiedAreaQuery.refetch()
        }, 500)
    }

    useEffect(() => {
        if (signal.create) {
            refetch()
        }
    }, [signal.create])

    useEffect(() => {
        if (signal.edit) {
            refetch()
        }
    }, [signal.edit])

    useEffect(() => {
        if (signal.delete) {
            refetch()
        }
    }, [signal.delete])

    return (
        <BidTaskContext.Provider value={{ signal, setSignal, modalOpen, setModalOpen, setTarget, target }}>
            <div className="min-h-screen bg-gray-50">
                <Banner title="Đấu giá" imageUrl="/travel.jpg" />

                {/* Mobile Search Bar */}
                <div className="lg:hidden p-4 bg-white border-b">
                    <input
                        className="w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Tìm kiếm..."
                    />
                </div>

                {/* Mobile Toggle Button */}
                <div className="lg:hidden p-4 bg-white border-b">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="w-full p-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        {sidebarOpen ? "Ẩn menu" : "Hiện menu & địa điểm"}
                    </button>
                </div>

                <div className="container mx-auto px-4 py-6">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                        {/* Left Sidebar - Profile & Tour Guides */}
                        <div className={`lg:col-span-3 space-y-6 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
                            <div className="lg:sticky lg:top-6 space-y-6">
                                <Profile tourGuide={tourGuide} />
                                <div className="hidden lg:block">
                                    <RotatingTourGuide excludeId={tourGuide?.tourGuideId} />
                                </div>
                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-6">
                            <Bids tourGuide={tourGuide} search={content} />
                        </div>

                        {/* Right Sidebar - Search & Popular Areas */}
                        <div className={`lg:col-span-3 space-y-6 ${sidebarOpen ? "block" : "hidden lg:block"}`}>
                            <div className="lg:sticky lg:top-6 space-y-6">
                                {/* Desktop Search */}
                                <div className="hidden lg:block rounded-md border shadow-lg p-5 bg-white">
                                    <input
                                        className="w-full p-3 mb-4 border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Tìm kiếm..."
                                    />
                                    <h4 className="text-lg md:text-xl font-medium leading-none mb-4">Địa điểm nổi tiếng</h4>
                                    <div className="space-y-3">
                                        {areas.map((v) => (
                                            <div
                                                key={v.areaId}
                                                className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                                            >
                                                <Link
                                                    href={"/services/active-area/detail?id=" + v.areaId}
                                                    className="text-blue-600 hover:text-blue-800 font-medium flex-1 mr-2 break-words"
                                                >
                                                    {v.areaName}
                                                </Link>
                                                <span className="text-gray-500 text-sm flex-shrink-0">({v.tourBidCount} bài đăng)</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Mobile Popular Areas */}
                                <div className="lg:hidden rounded-md border shadow-lg p-5 bg-white">
                                    <h4 className="text-lg font-medium leading-none mb-4">Địa điểm nổi tiếng</h4>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {areas.map((v) => (
                                            <div key={v.areaId} className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                                                <Link
                                                    href={"/services/active-area/detail?id=" + v.areaId}
                                                    className="text-blue-600 hover:text-blue-800 font-medium block break-words"
                                                >
                                                    {v.areaName}
                                                </Link>
                                                <span className="text-gray-500 text-sm">{v.tourBidCount} bài đăng</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <RotatingActiveArea />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BidTaskContext.Provider>
    )
}

export default function BidDriver() {
    return (
        <Suspense
            fallback={
                <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            }
        >
            <TourBidPageMain />
        </Suspense>
    )
}
