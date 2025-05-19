'use client'
import { getTourServicesOf } from '@/app/api/tour-service.api'
import PaginateList from '@/app/news/paginate-list'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useState } from 'react'

export default function TourServices({ tourGuideId }: { tourGuideId: number | string }) {
    const [page, setPage] = useState(1)
    const pageSize = 6
    const { data } = useQuery({
        queryKey: ['tour-services-of', tourGuideId, pageSize, page],
        queryFn: () => getTourServicesOf(Number(tourGuideId), page, pageSize),
        staleTime: 24 * 3600 * 1000,
    })
    const services = data?.result ?? []
    const maxPage = data?.totalPage ?? 0
    return (
        <motion.div className='w-full'>
            <h2 className="text-blue-800 text-3xl inter mb-5">Dịch vụ du lịch</h2>
            <AnimatePresence mode="wait">
                <motion.div
                    key={page}
                    initial={{ opacity: 0, filter: "blur(10px)" }}
                    animate={{ opacity: 1, filter: "blur(0)" }}
                    exit={{ opacity: 0, filter: "blur(10px)" }}
                    transition={{ duration: 0.8 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {services.map((item) => (
                        <motion.div
                            key={item.serviceId}
                            whileHover={{
                                scale: 1.05,
                                //boxShadow: "0 16px 40px rgba(0,0,0,0.2)",
                            }}
                            transition={{ duration: 0.1, ease: "easeInOut" }}
                            className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transform transition-all"
                        >
                            <img
                                src={'/danang.jpg'}
                                alt={item.serviceName}
                                className="w-full h-70 object-cover"
                            />
                            <div className="flex justify-between">
                                <div className="p-6">
                                    <p className="text-sm text-gray-500 mb-1">{dayjs(item.createdDate).format('DD/MM/YYYY HH:mm:ss')}</p>
                                    <h3 className="font-semibold text-lg mb-2">{item.serviceName}</h3>
                                    {/* <p className="text-sm text-gray-700">{item.}</p> */}
                                </div>
                                <div className="relative content-center">
                                    <Link
                                        href={'/news/' + item.serviceId}
                                        className="text-nowrap text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                        Xem ngay
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </motion.div>
            </AnimatePresence>
            <div className="mt-10 place-self-center">
                <PaginateList current={page} maxPage={maxPage}
                    onClick={(p) => {
                        setPage(p)
                    }}
                />
            </div>
        </motion.div>
    )
}
