"use client"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import SafeImage from "@/components/safe-image"
import Link from "next/link"
import { getOtherTourGuides } from "@/app/api/tour-guide.api"
import { TourGuide } from "@/types/tour-guide"
import { getTourServicesOf } from "@/app/api/tour-service.api"

export default function RotatingTourGuideHomePage() {
    const { data, isLoading } = useQuery({
        queryKey: ['random-tour-guide'],
        queryFn: async () => {
            const response = await getOtherTourGuides(47, 2)
            return response ?? []
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const tourGuides = data

    if (isLoading || !tourGuides) {
        return (
            <div className="rounded-md border shadow-lg p-5">
                <h4 className="text-xl font-medium leading-none mb-4">Hướng dẫn viên</h4>
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
        <>
            <h2 className="text-center text-4xl my-10 inter" data-aos="fade-up">Hướng dẫn viên</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 p-5">
                {tourGuides.map(currentGuide => {
                    return <TourGuideCard key={currentGuide.tourGuideId} currentGuide={currentGuide} />
                })}
            </div>
        </>
    )
}

function TourGuideCard({ currentGuide }: { currentGuide: TourGuide }) {
    const { data } = useQuery({
        queryKey: ['services-of', currentGuide.tourGuideId],
        queryFn: () => getTourServicesOf(currentGuide.tourGuideId, 1, 2),
    })
    const services = data?.result ?? []
    return (
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden transition-all hover:shadow-2xl h-min">
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="p-5 flex items-center gap-4">
                        <SafeImage
                            src={currentGuide.image}
                            className="w-16 h-16 rounded-full aspect-square border-2"
                            alt={currentGuide.fullName || "Tour guide"}
                        />
                        <div>
                            <div className="font-bold text-lg">{currentGuide.fullName}</div>
                            {currentGuide.tourGuideDescs && currentGuide.tourGuideDescs.length > 0 &&
                                currentGuide.tourGuideDescs[0]?.company &&
                                <div>
                                    <p className="text-sm text-gray-500">
                                        Hướng dẫn viên tại {currentGuide.tourGuideDescs[0].company}
                                    </p>
                                </div>
                            }
                            {currentGuide.tourGuideDescs && currentGuide.tourGuideDescs.length > 0 &&
                                currentGuide.tourGuideDescs[0]?.yearOfExperience &&
                                <div>
                                    <p className="text-sm text-gray-500">
                                        {currentGuide.tourGuideDescs[0].yearOfExperience} năm kinh nghiệm
                                    </p>
                                </div>
                            }
                        </div>
                    </div>
                    <SafeImage
                        src={currentGuide.bannerImage.trim()}
                        width={800}
                        height={400}
                        className="w-full object-cover aspect-[3/1]"
                        alt={'Tour guide banner'}
                    />
                    <div className="p-5">
                        {(currentGuide.tourGuideDescs &&
                            currentGuide.tourGuideDescs.length > 0 &&
                            currentGuide.tourGuideDescs[0]?.description) ? (
                            <div
                                className="text-sm text-gray-700 line-clamp-3"
                                dangerouslySetInnerHTML={{
                                    __html: currentGuide.tourGuideDescs[0].description,
                                }}
                            />
                        ) :
                            <p className="text-sm text-gray-700">
                                Không có mô tả
                            </p>
                        }
                    </div>
                    <div className="px-5 pb-5">
                        <Link
                            href={`/services/tour-guide/${currentGuide.tourGuideId}`}
                            className="inline-block text-blue-600 hover:underline text-sm font-medium"
                        >
                            XEM THÊM
                        </Link>
                    </div>
                    {services.length > 0 &&
                        <div className="p-5 pt-0 grid grid-cols-2 gap-3">
                            {
                                services.map(service => (
                                    <div key={service.serviceId} className="relative rounded-xl overflow-hidden group">
                                        <SafeImage
                                            src={service.image}
                                            alt={service.title}
                                            width={400}
                                            height={200}
                                            className="object-cover w-full h-32 group-hover:scale-105 transition-transform duration-300"
                                        />
                                        <div className="absolute bottom-0 bg-black/60 text-white text-xs p-2 w-full">
                                            <p className="font-semibold text-sm">{service.serviceName}</p>
                                            <p>{service.title}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>}
                </motion.div>
            </AnimatePresence>
        </div>)
}