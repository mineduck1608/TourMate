"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { getOtherActiveArea } from "@/app/api/active-area.api"
import Banner from "@/components/Banner"
import Link from "next/link"
import type { ActiveArea } from "@/types/active-area"

export default function RotatingActiveArea() {
    const [currentArea, setCurrentArea] = useState<ActiveArea | null>(null)

    // Use react-query to fetch a random area every 5 seconds
    const { data, isLoading } = useQuery({
        queryKey: ['random-active-area'],
        queryFn: async () => {
            const response = await getOtherActiveArea(-1, 1)
            return response && response.length > 0 ? response[0] : null
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    // Animate between areas
    useEffect(() => {
        if (data) setCurrentArea(data)
    }, [data])

    if (isLoading || !currentArea) {
        return (
            <div className="rounded-md border shadow-lg p-5">
                <div className="animate-pulse">
                    <div className="h-32 bg-gray-300 rounded mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-md border shadow-lg p-5">
            <h4 className="text-xl font-medium leading-none mb-4">Địa điểm nổi tiếng</h4>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentArea.areaId}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="mb-4">
                        <Banner title={currentArea.areaName} imageUrl={currentArea.bannerImg} />
                    </div>

                    {currentArea.areaContent && (
                        <div
                            className="text-sm text-gray-700 mb-4 line-clamp-6"
                            dangerouslySetInnerHTML={{
                                __html: currentArea.areaContent,
                            }}
                        />
                    )}

                    <div className="flex justify-center">
                        <Link
                            href={`/services/active-area/detail?id=${currentArea.areaId}`}
                            className="inline-block bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Chi tiết
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}