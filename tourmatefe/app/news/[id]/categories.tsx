"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

const categories = [
    "Khám phá",
    "Tips",
    "Câu chuyện",
    "Điểm đến",
]

export default function NewsCategories() {
    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50">
            <CardHeader className="pb-3">
                <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <div className="w-1 h-6 bg-green-500 rounded-full"></div>
                    Danh mục
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 pb-5">
                {categories.map((category) => (
                    <Link
                        key={category}
                        href={'/news?category=' + category}
                        className="group flex items-center justify-between p-3 rounded-lg hover:bg-white hover:shadow-md transition-all duration-300 hover:translate-x-1 border-l-4 border-l-transparent hover:border-l-green-500"
                    >
                        <span className="font-medium text-gray-700 group-hover:text-green-600 transition-colors">
                            {category}
                        </span>
                        <div className="flex items-center gap-2">
                            {/* <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full group-hover:bg-green-100 group-hover:text-green-600 transition-colors">
                                {category.count}
                            </span> */}
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-green-500 transition-colors" />
                        </div>
                    </Link>
                ))}
            </CardContent>
        </Card>
    )
}
