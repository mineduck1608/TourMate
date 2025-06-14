'use client'
import { addTourService, deleteTourService, getTourServicesOf, updateTourService } from '@/app/api/tour-service.api'
import PaginateList from '@/app/news/paginate-list'
import SafeImage from '@/components/safe-image'
import { useMutation, useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import React, { useContext, useEffect, useState } from 'react'
import { ServiceEditContext, ServiceEditContextProp } from './service-edit-context'
import { TourService } from '@/types/tour-service'
import { toast } from 'react-toastify'
import { TourGuideSiteContext, TourGuideSiteContextProps } from '../../context'

export default function TourServices({ tourGuideId }: { tourGuideId: number | string }) {
    const [page, setPage] = useState(1)
    const pageSize = 6
    const { data, refetch } = useQuery({
        queryKey: ['tour-services-of', tourGuideId, pageSize, page],
        queryFn: () => getTourServicesOf(Number(tourGuideId), page, pageSize),
        staleTime: 24 * 3600 * 1000,
    })
    //Mutation here
    const updateServicesMutation = useMutation({
        mutationFn: async (data: TourService) => updateTourService(data),
        onSuccess: () => {
            toast.success("Cập nhật thành công");
            refetch()
        },
        onError: (error) => {
            toast.error("Cập nhật thất bại");
            console.error(error);
        },
    });
    const deleteServicesMutation = useMutation({
        mutationFn: async (id: number) => deleteTourService(id),
        onSuccess: () => {
            toast.success("Xóa thành công");
            refetch()
        },
        onError: (error) => {
            toast.error("Xóa thất bại");
            console.error(error);
        },
    });
    const addServicesMutation = useMutation({
        mutationFn: async (service: TourService) => addTourService(service),
        onSuccess: () => {
            toast.success("Tạo thành công");
            refetch()
        },
        onError: (error) => {
            toast.error("Tạo thất bại");
            console.error(error);
        },
    });
    const updateService = (newData: TourService) => {
        updateServicesMutation.mutate(newData)
        refetch()
        setSignal({ edit: false, delete: false, create: false })
    }
    const deleteService = (id: number) => {
        deleteServicesMutation.mutate(id)
        refetch()
        setSignal({ edit: false, delete: false, create: false })
    }
    const addService = (newData: TourService) => {
        addServicesMutation.mutate(newData)
        refetch()
        setSignal({ edit: false, delete: false, create: false })
    }
    const services = data?.result ?? []
    const maxPage = data?.totalPage ?? 0
    const { setTarget, setModalOpen, modalOpen, signal, setSignal, target } = useContext(ServiceEditContext) as ServiceEditContextProp
    const { id } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
    useEffect(() => {
        if (signal.edit) {
            updateService(target)
        }
        if (signal.delete) {
            deleteService(target.serviceId)
        }
        if (signal.create) {
            const t = target
            t.tourGuideId = id
            addService(t)
        }
        setModalOpen({ create: false, delete: false, edit: false })
    }, [signal.edit, signal.delete, signal.create])
    return (
        <motion.div className='w-full'>
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
                        <div key={item.serviceId}>
                            <motion.div
                                whileHover={{
                                }}
                                onClick={() => {
                                    setTarget(item)
                                    setTimeout(() => {
                                        setModalOpen({ ...modalOpen, edit: true })
                                    }, 50);
                                }}
                                transition={{ duration: 0.1, ease: "easeInOut" }}
                                className="bg-white rounded-xl shadow-sm overflow-hidden cursor-pointer transform transition-all relative"
                            >
                                <div className="relative">
                                    <SafeImage
                                        src={item.image}
                                        alt={item.serviceName}
                                        className="w-full h-70 object-cover"
                                    />
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        whileHover={{ opacity: 1 }}
                                        className="absolute inset-0 bg-[rgba(0,0,0,0.25)] bg-opacity-50 flex items-center justify-center"
                                    >
                                        <span className="text-white text-xl font-semibold">Cập nhật</span>
                                    </motion.div>
                                </div>
                                <div className="flex justify-between">
                                    <div className="p-6">
                                        <p className="text-sm text-gray-500 mb-1">{dayjs(item.createdDate).format('DD/MM/YYYY HH:mm:ss')}</p>
                                        <h3 className="font-semibold text-lg mb-2">{item.serviceName}</h3>
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
                        </div>
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
