'use client'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { TourGuide } from '@/types/tour-guide'
import { getOtherTourGuides } from '../api/tour-guide.api'
import Image from 'next/image'

interface OtherTourGuidesProps {
    tourGuideId: number
}


const TourGuidesCard: React.FC<{ item: TourGuide }> = ({ item }) => {
    return (
        <Link href={`/services/tour-guide/${item.tourGuideId}`} passHref>
            <motion.div
                key={item.tourGuideId}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
            >
                <div className="relative bg-[#F2F8FB] p-6 rounded-lg space-y-4 pt-15 mt-10">
                    <div className="absolute left-1/2 -top-10 -translate-x-1/2 w-20 h-20 rounded-full overflow-hidden border-4 border-white shadow-lg bg-white">
                        <Image
                            src={item.image || "/default-avatar.png"}
                            alt={item.fullName || "Tour Guide"}
                            className="w-full h-full object-cover"
                        />
                    </div>

                    <h2 className=" text-2xl text-gray-600 font-bold text-center">{item.fullName || "Tên không có"}</h2>
                    <p className="text-center">GIỚI THIỆU</p>
                    <p
                        className="text-sm text-gray-600 line-clamp-5"
                        dangerouslySetInnerHTML={{
                            __html: (item.tourGuideDescs && item.tourGuideDescs.length > 0)
                                ? item.tourGuideDescs[0].description
                                : "Không có mô tả",
                        }}
                    />
                    <span
                        className="p-2 mx-25 text-lg bg-[#DBE4F7] text-black rounded text-center hover:bg-gray-300 transition-colors duration-300 block text-sm"
                    >
                        CHI TIẾT
                    </span>

                </div>
            </motion.div>
        </Link>
    );
};


const OtherTourGuides: React.FC<OtherTourGuidesProps> = ({
    tourGuideId,
}) => {
    const pageSize = 3
    const { data } = useQuery({
        queryKey: ['other-tour-guide', tourGuideId, pageSize],
        queryFn: () => getOtherTourGuides(tourGuideId, pageSize),
        staleTime: 24 * 3600 * 1000, // 1 day
    })
    console.log(data)
    return (
        <motion.div
            className="w-full mx-auto px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            <h1 className="italic text-4xl font-normal text-[#3e72b9] text-center mb-10">
                Hướng dẫn viên khác
            </h1>
            <AnimatePresence mode="wait">
                {Array.isArray(data) && data.length === 0 ? (
                    <div className="text-center py-4">Không có dịch vụ nào</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {Array.isArray(data)
                            ? data.map((item) => (
                                <TourGuidesCard key={item.tourGuideId} item={item} />
                            ))
                            : null}
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default OtherTourGuides
