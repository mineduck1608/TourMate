"use client"
import { useQuery } from "@tanstack/react-query"
import { motion, AnimatePresence } from "framer-motion"
import SafeImage from "@/components/safe-image"
import Link from "next/link"
import { getOtherTourGuides } from "@/app/api/tour-guide.api"
import { TourGuide } from "@/types/tour-guide"
import { getTourServicesOf } from "@/app/api/tour-service.api"
import AOS from "aos"
import { useEffect } from "react"
import { Star, MapPin, Calendar } from 'lucide-react'

export default function RotatingTourGuideHomePage() {
    useEffect(() => {
        AOS.init({
            offset: 0,
            delay: 200,
            duration: 1200,
            once: true,
        });
    }, []);

    const { data, isLoading } = useQuery({
        queryKey: ['random-tour-guide'],
        queryFn: async () => {
            const response = await getOtherTourGuides(-1, 4)
            return response ?? []
        },
        refetchInterval: 5000,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    })

    const tourGuides = data

    if (isLoading || !tourGuides) {
        return (
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <div className="h-12 bg-gray-200 rounded-2xl w-80 mx-auto mb-6 animate-pulse"></div>
                        <div className="h-6 bg-gray-200 rounded-xl w-96 mx-auto animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[...Array(4)].map((_, i) => (
                            <div key={i} className="bg-white rounded-3xl shadow-xl overflow-hidden animate-pulse">
                                <div className="p-6">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
                                        <div className="flex-1">
                                            <div className="h-4 bg-gray-200 rounded mb-2"></div>
                                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                                        </div>
                                    </div>
                                </div>
                                <div className="h-48 bg-gray-200"></div>
                                <div className="p-6">
                                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                                    <div className="h-10 bg-gray-200 rounded"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        )
    }

    return (
        <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
            {/* Background decorative elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>

            <div className="mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Header */}
                <div className="text-center mb-16" data-aos="fade-up">
                    <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
                        <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Hướng dẫn viên
                        </span>{" "}
                        nổi bật
                    </h2>
                    <p className="text-xl lg:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                        Kết nối với những hướng dẫn viên chuyên nghiệp, am hiểu địa phương và đam mê chia sẻ
                    </p>
                </div>

                {/* Tour Guides Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-aos="fade-up" data-aos-delay="200">
                    {tourGuides.map((currentGuide, index) => {
                        const key = (currentGuide.tourGuideId + new Date().getTime()).toString()
                        return (
                            <TourGuideCard key={key} currentGuide={currentGuide} index={index} />
                        )
                    })}
                </div>

                {/* View All Button */}
                <div className="text-center mt-16" data-aos="fade-up" data-aos-delay="400">
                    <Link
                        href="/services/tour-guide"
                        className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg rounded-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-105 group"
                    >
                        Xem tất cả hướng dẫn viên
                        <svg className="w-5 h-5 ml-3 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                </div>
            </div>
        </section>
    )
}

function TourGuideCard({ currentGuide, index }: { currentGuide: TourGuide; index: number }) {
    const { data } = useQuery({
        queryKey: ['services-of', currentGuide.tourGuideId],
        queryFn: () => getTourServicesOf(currentGuide.tourGuideId, 1, 2),
    })
    const services = data?.result ?? []

    return (
        <div
            className="bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-105 group h-fit"
            data-aos="fade-up"
            data-aos-delay={300 + index * 100}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header with avatar and info */}
                    <div className="p-6 pb-0">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-full blur-md opacity-30 group-hover:opacity-50 transition-opacity"></div>
                                <SafeImage
                                    src={currentGuide.image}
                                    className="relative w-16 h-16 rounded-full aspect-square object-cover object-center border-3 border-white shadow-lg"
                                    alt={currentGuide.fullName || "Tour guide"}
                                />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-lg text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                                    {currentGuide.fullName}
                                </h3>
                                {currentGuide.tourGuideDescs && currentGuide.tourGuideDescs.length > 0 &&
                                    currentGuide.tourGuideDescs[0]?.company && (
                                        <p className="text-sm text-gray-600 truncate mb-1">
                                            {currentGuide.tourGuideDescs[0].company}
                                        </p>
                                    )}
                                <div className="flex items-center gap-3 text-xs">
                                    {currentGuide.tourGuideDescs && currentGuide.tourGuideDescs.length > 0 &&
                                        currentGuide.tourGuideDescs[0]?.yearOfExperience && (
                                            <div className="flex items-center gap-1 text-blue-600">
                                                <Calendar className="h-3 w-3" />
                                                <span className="font-medium">{currentGuide.tourGuideDescs[0].yearOfExperience} năm</span>
                                            </div>
                                        )}
                                    <div className="flex items-center gap-1 text-yellow-500">
                                        <Star className="h-3 w-3 fill-current" />
                                        <span className="font-medium">5.0</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Banner Image */}
                    <div className="relative h-48 overflow-hidden mx-6 rounded-2xl">
                        <SafeImage
                            src={currentGuide.bannerImage.trim()}
                            width={800}
                            height={400}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            alt={'Tour guide banner'}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Location badge */}
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                            <MapPin className="h-3 w-3 text-blue-600" />
                            <span className="text-xs font-semibold text-gray-900">Việt Nam</span>
                        </div>

                        {/* Rating badge */}
                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1.5 flex items-center gap-1.5 shadow-lg">
                            <Star className="h-3 w-3 text-yellow-500 fill-current" />
                            <span className="text-xs font-semibold text-gray-900">5.0</span>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="p-6">
                        {(currentGuide.tourGuideDescs &&
                            currentGuide.tourGuideDescs.length > 0 &&
                            currentGuide.tourGuideDescs[0]?.description) ? (
                            <div
                                className="text-sm text-gray-700 line-clamp-3 leading-relaxed mb-4"
                                dangerouslySetInnerHTML={{
                                    __html: currentGuide.tourGuideDescs[0].description,
                                }}
                            />
                        ) : (
                            <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                                Hướng dẫn viên chuyên nghiệp với nhiều năm kinh nghiệm trong lĩnh vực du lịch
                            </p>
                        )}

                        {/* Services */}
                        {services.length > 0 && (
                            <div className="grid grid-cols-2 gap-3 mb-6">
                                {services.map(service => (
                                    <div key={service.serviceId} className="relative rounded-xl overflow-hidden group/service shadow-md">
                                        <SafeImage
                                            src={service.image}
                                            alt={service.title}
                                            width={400}
                                            height={200}
                                            className="object-cover w-full h-24 group-hover/service:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                                        <div className="absolute bottom-2 left-2 right-2">
                                            <p className="text-white text-xs font-semibold truncate">{service.serviceName}</p>
                                            <p className="text-white/80 text-xs truncate">{service.title}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Action Button */}
                        <Link
                            href={`/services/tour-guide/${currentGuide.tourGuideId}`}
                            className="block w-full text-center py-3 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl group/btn"
                        >
                            <span className="flex items-center justify-center gap-2">
                                Xem chi tiết
                                <svg className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </span>
                        </Link>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
