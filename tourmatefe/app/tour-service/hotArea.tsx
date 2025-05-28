'use client'
import { useQuery } from '@tanstack/react-query'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React from 'react'
import { ActiveArea } from '@/types/active-area'
import { getRandomActiveArea } from '../api/active-area.api'
import Image from 'next/image'

const HotAreaCard: React.FC<{ item: ActiveArea }> = ({ item }) => {
    return (
        <Link href={`/services/active-area/detail?id=${item.areaId}`} passHref>
            <motion.div
                key={item.areaId}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.15, ease: 'easeInOut' }}
                className="relative cursor-pointer overflow-hidden"
            >
                <Image
                    src={item.bannerImg}
                    alt={item.areaName}
                    className="w-full h-150 object-cover transition-transform duration-300 hover:scale-105"
                    loading="lazy"
                />
                <div className="space-y-5 absolute bottom-0 left-0 p-4 w-full bg-gradient-to-t from-black/60 to-transparent text-white text-left">
                    <h2 className="text-xl uppercase">{item.areaTitle}</h2>
                    <p className="text-sm uppercase">{item.areaSubtitle}</p>
                    <p className="text-sm uppercase underline">Xem thêm</p>
                </div>
            </motion.div>
        </Link>
    )

}

const HotAreas: React.FC = () => {
    const size = 2
    const { data } = useQuery({
        queryKey: ['hot-active-area'],
        queryFn: () => getRandomActiveArea(size),
        staleTime: 24 * 3600 * 1000,
    })

    return (
        <motion.div
            className="w-full mx-auto px-4"
            style={{ fontFamily: "'Playfair Display', serif" }}
        >
            <h1 className="italic text-3xl md:text-4xl font-normal text-[#3e72b9] text-center mb-10">
                Những chuyến đi nổi bật
            </h1>
            <AnimatePresence mode="wait">
                {Array.isArray(data) && data.length === 0 ? (
                    <div className="text-center py-4">Không có địa điểm nào</div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {(Array.isArray(data) ? data : []).map((item) => (
                            <HotAreaCard key={item.areaId} item={item} />
                        ))}
                    </div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export default HotAreas
