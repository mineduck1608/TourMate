"use client"

import { useState, useEffect } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import { getOtherActiveArea } from "@/app/api/active-area.api"
import DOMPurify from "dompurify";
import Link from "next/link"
import type { ActiveArea } from "@/types/active-area"
import SafeImage from "./safe-image"
interface EnhancedBannerProps {
    title: string
    imageUrl: string
    content?: string
}

function EnhancedBanner({ title, imageUrl, content }: EnhancedBannerProps) {
    const [isHovered, setIsHovered] = useState(false)
    const sanitizeContent = (html: string) => {
        // Only sanitize if window is available (client-side)
        if (typeof window !== 'undefined') {
            const clean = DOMPurify.sanitize(html, {
                ADD_TAGS: ["iframe"], // Allow iframes if needed
                ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"], // Allow certain attributes
            });

            // Replace image URLs with img tags
            return clean.replace(
                /(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                (match) => {
                    return `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain; margin-bottom: 10px;" />`;
                }
            );
        }
        return html; // Fallback for server-side rendering
    };
    return (
        <div
            className="relative h-64 rounded-lg overflow-hidden cursor-pointer group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Image with zoom effect */}
            <motion.div
                className="absolute inset-0"
                animate={{
                    scale: isHovered ? 1.1 : 1,
                }}
                transition={{
                    duration: 0.6,
                    ease: "easeOut",
                }}
            >
                <SafeImage
                    src={imageUrl}
                    alt={title}
                    className="w-full h-full object-cover"
                />
            </motion.div>

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-black/40" />

            {/* Content overlay */}
            <div className="absolute inset-0 flex items-center justify-center p-6">
                <motion.div
                    key={isHovered ? "content" : "title"}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="text-sm leading-relaxed max-h-48 w-full scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent text-white flex items-center justify-center"
                    style={{ overflow: "hidden" }}
                >
                    {isHovered && content ? (
                        <div
                            className="p-2 quill-content text-justify overflow-y-auto w-full h-full"
                            style={{ maxHeight: "12rem" }}
                            dangerouslySetInnerHTML={{
                                __html: sanitizeContent(content || ""),
                            }}
                        />
                    ) : (
                        <h2 className="text-3xl font-bold drop-shadow-lg">{title}</h2>
                    )}
                </motion.div>
            </div>
        </div>
    )
}

export default function RotatingActiveArea() {
    const [currentArea, setCurrentArea] = useState<ActiveArea | null>(null)

    // Use react-query to fetch a random area every 10 seconds
    const { data, isLoading } = useQuery({
        queryKey: ["random-active-area"],
        queryFn: async () => {
            const response = await getOtherActiveArea(-1, 1)
            return response && response.length > 0 ? response[0] : null
        },
        refetchInterval: 10000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    // Animate between areas
    useEffect(() => {
        if (data) setCurrentArea(data)
    }, [data])

    if (isLoading || !currentArea) {
        return (
            <div className="rounded-md border shadow-lg p-5 bg-white">
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-200 rounded mb-4 w-40"></div>
                    <div className="h-64 bg-gray-200 rounded mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-20 mx-auto"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-md border shadow-lg p-5 bg-white hover:shadow-xl transition-shadow duration-300">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-1 h-6 bg-orange-500 rounded-full"></div>
                <h4 className="text-xl font-medium leading-none text-gray-800">Địa điểm nổi tiếng</h4>
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={currentArea.areaId}
                    initial={{ opacity: 0, filter: "blur(10px)", y: 20 }}
                    animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                    exit={{ opacity: 0, filter: "blur(10px)", y: -20 }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    <div className="mb-6">
                        <EnhancedBanner
                            title={currentArea.areaName}
                            imageUrl={currentArea.bannerImg}
                            content={currentArea.areaContent}
                        />
                    </div>

                    <div className="flex justify-center">
                        <Link
                            href={`/services/active-area/detail?id=${currentArea.areaId}`}
                            className="group inline-flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-lg text-sm font-medium transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                        >
                            Chi tiết
                            <svg
                                className="w-4 h-4 transition-transform group-hover:translate-x-1"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
