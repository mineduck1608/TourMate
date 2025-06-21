
"use client"

import { useQuery } from "@tanstack/react-query"
import Link from "next/link"
import dayjs from "dayjs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock, ExternalLink } from "lucide-react"
import { getRecentNews } from "@/app/api/news.api"

// Mock SafeImage component - replace with your actual component
const SafeImage = ({ src, className }: { src: string; className?: string }) => (
    <img src={src || "/placeholder.svg?height=80&width=120"} alt="News thumbnail" className={className} />
)

export default function RecentNews(params: { currentId?: number | string }) {
    const size = 5
    const { data } = useQuery({
        queryKey: ["news", size, 1],
        queryFn: () => {
            const controller = new AbortController()
            setTimeout(() => {
                controller.abort()
            }, 5000)
            return getRecentNews(size, Number(params.currentId))
        },
    })

    const current = params.currentId
        ? typeof params.currentId === "string"
            ? Number.parseInt(params.currentId)
            : params.currentId
        : -1

    const news = data ?? [
        // Mock data for demonstration
        {
            newsId: 1,
            title: "Tips ăn uống lành mạnh khi đi du lịch",
            bannerImg: "/placeholder.svg?height=80&width=120",
            createdAt: "2025-06-05T15:51:06Z",
        },
        {
            newsId: 2,
            title: "Làm thế nào để du lịch thoải mái mà không mệt mỏi?",
            bannerImg: "/placeholder.svg?height=80&width=120",
            createdAt: "2025-06-05T15:43:51Z",
        },
        {
            newsId: 3,
            title: "Bí kíp du lịch tiết kiệm nhưng vẫn 'sang chảnh'",
            bannerImg: "/placeholder.svg?height=80&width=120",
            createdAt: "2025-06-05T15:36:59Z",
        },
    ]

    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-blue-500 rounded-full"></div>
                    Bài viết gần đây
                </CardTitle>
            </CardHeader>
            <Separator className="mx-6" />
            <CardContent className="p-0">
                <ScrollArea className="h-96">
                    <div className="space-y-1 p-4">
                        {news.map((article) => {
                            const isCurrent = article.newsId === current

                            return (
                                <div
                                    key={article.newsId}
                                    className={`
                    group relative p-4 rounded-lg transition-all duration-300 ease-in-out
                    hover:shadow-md hover:bg-white hover:border-l-4 hover:border-l-blue-500
                    ${isCurrent ? "bg-blue-50 border-l-4 border-l-blue-500" : "hover:translate-x-1"}
                  `}
                                >
                                    <div className="flex gap-4 items-start">
                                        {/* Image Container */}
                                        <div className="flex-shrink-0 relative overflow-hidden rounded-lg">
                                            <SafeImage
                                                src={article.bannerImg}
                                                className="w-24 h-16 object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300 rounded-lg"></div>
                                        </div>

                                        {/* Content Container */}
                                        <div className="flex-1 min-w-0 space-y-2">
                                            {/* Title */}
                                            <div className="flex items-start justify-between gap-2">
                                                {isCurrent ? (
                                                    <h3 className="font-semibold text-gray-900 leading-tight line-clamp-2">{article.title}</h3>
                                                ) : (
                                                    <Link
                                                        href={`/news/${article.newsId}`}
                                                        className="font-medium text-gray-700 hover:text-blue-600 leading-tight line-clamp-2 transition-colors duration-200 group-hover:text-blue-600"
                                                    >
                                                        {article.title}
                                                    </Link>
                                                )}

                                                {/* Current badge or external link icon */}
                                                {isCurrent ? (
                                                    <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 border-blue-200">
                                                        Hiện tại
                                                    </Badge>
                                                ) : (
                                                    <ExternalLink className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex-shrink-0" />
                                                )}
                                            </div>

                                            {/* Date */}
                                            <div className="flex items-center gap-1 text-sm text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                <time dateTime={article.createdAt}>{dayjs(article.createdAt).format("DD/MM/YYYY HH:mm")}</time>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Hover border effect */}
                                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-blue-200 rounded-lg transition-colors duration-300 pointer-events-none"></div>
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
        </Card>
    )
}
