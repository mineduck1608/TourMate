'use client'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { getOtherTourServicesOf } from '../api/tour-service.api'
import { TourService } from '@/types/tour-service'

interface OtherServicesProps {
    tourGuideId: number
    serviceId: number
}


const ServiceCard: React.FC<{ item: TourService }> = ({ item }) => {
    return (
        <Link href={`/tour-service?id=${item.serviceId}`} passHref>
            <motion.div
                key={item.serviceId}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="bg-white shadow hover:shadow-md transition overflow-hidden cursor-pointer"
            >
                <div className="h-60 overflow-hidden">
                    <img
                        src={'/danang.jpg'} // Replace with real image
                        alt={item.serviceName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-[#d7a800] text-md font-semibold uppercase mb-1">
                        {item.serviceName}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3">
                        {item.title}
                    </p>
                    <span className="text-sm uppercase font-medium text-gray-800 hover:text-[#3e72b9] transition">
                        Liên hệ
                    </span>
                </div>
            </motion.div>
        </Link>
    );
};


const OtherServices: React.FC<OtherServicesProps> = ({
    tourGuideId,
    serviceId,
}) => {
    const pageSize = 4
    const { data } = useQuery({
        queryKey: ['other-tour-services-of', tourGuideId, serviceId, pageSize],
        queryFn: () => getOtherTourServicesOf(tourGuideId, serviceId, pageSize),
        staleTime: 24 * 3600 * 1000, // 1 day
    })

    return (
        <motion.div
            className="w-full mx-auto px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            <h1 className="italic text-4xl font-normal text-[#3e72b9] text-center mb-10">
                Các chuyến đi khác
            </h1>
            <AnimatePresence mode="wait">
                {Array.isArray(data) && data.length === 0 ? (
                    <div className="text-center py-4">Không có dịch vụ nào</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {Array.isArray(data)
                            ? data.map((item) => (
                                <ServiceCard key={item.serviceId} item={item} />
                            ))
                            : null}
                    </div>
                )}
            </AnimatePresence>
            <div className="flex justify-center mt-8">
                <Link href={`/services/tour-guide/${tourGuideId}`} passHref>
                    <button className="px-15 py-3 bg-[#DBE4F7] rounded text-black uppercase text-xs tracking-wide hover:bg-[#c2d3e8] transition">
                        Xem thêm các tour
                    </button>
                </Link>
            </div>
        </motion.div>
    )
}

export default OtherServices
