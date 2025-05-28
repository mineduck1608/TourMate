'use client'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { ActiveArea } from '@/types/active-area'
import { getRandomActiveArea } from '../api/active-area.api'
import Image from 'next/image'



const AreaCard: React.FC<{ item: ActiveArea }> = ({ item }) => {
    return (
        <Link href={`/services/active-area/detail?id=${item.areaId}`} passHref>
            <motion.div
                key={item.areaId}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="bg-white shadow hover:shadow-md transition overflow-hidden cursor-pointer"
            >
                <div className="h-60 overflow-hidden">
                    <Image
                        src={item.bannerImg} // Replace with real image
                        alt={item.areaName}
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                </div>
                <div className="p-4">
                    <h2 className="text-[#d7a800] text-lg font-semibold uppercase mb-2">
                        {item.areaName}
                    </h2>
                    <h2 className="text-black text-sm font-semibold uppercase mb-1 line-clamp-1">
                        {item.areaSubtitle}
                    </h2>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-4"
                        dangerouslySetInnerHTML={{
                            __html: item.areaContent,
                        }}
                    />
                    <span className="text-sm uppercase font-medium text-gray-800 hover:text-[#3e72b9] transition">
                        Liên hệ
                    </span>
                </div>
            </motion.div>
        </Link>
    );
};


const OtherAreas: React.FC = ({
}) => {
    const size = 4
    const { data } = useQuery({
        queryKey: ['random-active-area'],
        queryFn: () => getRandomActiveArea(size),
        staleTime: 24 * 3600 * 1000, // 1 day
    })

    return (
        <motion.div
            className="w-full mx-auto px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            <h1 className="italic text-4xl font-normal text-[#3e72b9] text-center mb-10">
                Các địa điểm khác
            </h1>
            <AnimatePresence mode="wait">
                {Array.isArray(data) && data.length === 0 ? (
                    <div className="text-center py-4">Không có địa điểm nào</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        {Array.isArray(data)
                            ? data.map((item) => (
                                <AreaCard key={item.areaId} item={item} />
                            ))
                            : null}
                    </div>
                )}
            </AnimatePresence>
            <div className="flex justify-center mt-8">
                <Link href={`/services/active-area`} passHref>
                    <button className="px-15 py-3 bg-[#DBE4F7] rounded text-black uppercase text-xs tracking-wide hover:bg-[#c2d3e8] transition">
                        Xem thêm các địa điểm khác
                    </button>
                </Link>
            </div>
        </motion.div>
    )
}

export default OtherAreas
