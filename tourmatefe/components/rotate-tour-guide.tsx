"use client"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import SafeImage from "@/components/safe-image"
import Link from "next/link"
import { getOtherTourGuides } from "@/app/api/tour-guide.api"

interface RotatingTourGuideProps {
    excludeId?: number
}

export default function RotatingTourGuide({ excludeId = -1 }: RotatingTourGuideProps) {
    const { data, isLoading } = useQuery({
        queryKey: ['random-tour-guide', excludeId],
        queryFn: async () => {
            const response = await getOtherTourGuides(excludeId, 1)
            return response && response.length > 0 ? response[0] : null
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const currentGuide = data

    if (isLoading || !currentGuide) {
        return (
            <div className="rounded-md border shadow-lg p-5">
                <h4 className="text-xl font-medium leading-none mb-4">Hướng dẫn viên khác</h4>
                <div className="animate-pulse">
                    <div className="w-16 h-16 bg-gray-300 rounded-full mb-3"></div>
                    <div className="h-4 bg-gray-300 rounded mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded mb-2"></div>
                    <div className="h-20 bg-gray-300 rounded"></div>
                </div>
            </div>
        )
    }

    return (
        <div className="rounded-md border shadow-lg p-5">
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentGuide.tourGuideId}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex gap-3 mb-3">
                        <SafeImage
                            src={currentGuide.image}
                            className="w-16 h-16 rounded-full aspect-square border-2"
                            alt={currentGuide.fullName || "Tour guide"}
                        />
                        <div className="flex-1">
                            <div className="font-bold text-lg">{currentGuide.fullName}</div>
                            {currentGuide.tourGuideDescs &&
                                currentGuide.tourGuideDescs.length > 0 &&
                                currentGuide.tourGuideDescs[0]?.yearOfExperience && (
                                    <div className="text-sm text-gray-600">
                                        {currentGuide.tourGuideDescs[0].yearOfExperience} năm kinh nghiệm
                                    </div>
                                )}
                        </div>
                    </div>

                    {(currentGuide.tourGuideDescs &&
                        currentGuide.tourGuideDescs.length > 0 &&
                        currentGuide.tourGuideDescs[0]?.description) ? (
                        <div
                            className="text-sm text-gray-700 mb-4"
                            dangerouslySetInnerHTML={{
                                __html: currentGuide.tourGuideDescs[0].description,
                            }}
                        />
                    ) :
                        <p className="text-sm text-gray-700 mb-4">
                            Không có mô tả
                        </p>
                    }
                    <div className="flex justify-center">
                        <Link
                            href={`/services/tour-guide/${currentGuide.tourGuideId}`}
                            className="inline-block bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                        >
                            Chi tiết
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}