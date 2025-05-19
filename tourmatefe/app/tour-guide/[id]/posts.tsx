'use client'
import { getTourServicesOf } from '@/app/api/tour-service.api'
import PaginateList from '@/app/news/paginate-list'
import { TourService } from '@/types/tour-service'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import React, { useState } from 'react'

export default function TourServices({ tourGuideId }: { tourGuideId: number }) {
    const [page, setPage] = useState(1)
    const pageSize = 3
    const { data } = useQuery({
        queryKey: ['tour-services-of', tourGuideId, pageSize, page],
        queryFn: () => getTourServicesOf(tourGuideId, page, pageSize),
        staleTime: 24 * 3600 * 1000,
    })
    const services = data?.result ?? []
    const maxPage = data?.totalPage ?? 0
    return (
        <div>
            {
                services.map(v => <Service service={v} key={v.serviceId} />)
            }
            <div className="mt-10 place-self-center">
                <PaginateList current={page} maxPage={maxPage}
                    onClick={(p) => {
                        setPage(p)
                    }}
                />
            </div>
        </div>
    )
}

function Service({ service }: { service: TourService }) {
    return (
        <div className='rounded-lg p-5 mb-5 shadow-sm'>
            <h4 className="text-lg text-gray-800 ">
                {dayjs(service.createdDate).format('DD/MM/YYYY HH:mm:ss')}
            </h4>
            <h4 className="font-bold text-4xl text-gray-800 ">
                {service.title}
            </h4>
            <div
                className="w-[65%] p-2"
                dangerouslySetInnerHTML={{
                    __html: service.content
                        ? service.content.replace(
                            /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                            (match) => {
                                return `<img src="${match}" alt="Image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`;
                            }
                        )
                        : "",
                }}
            />
        </div>
    )
}