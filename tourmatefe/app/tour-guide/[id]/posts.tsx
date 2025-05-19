import { TourService } from '@/types/tour-service'
import dayjs from 'dayjs'
import React from 'react'

export default function TourServices({ services }: { services: TourService[] }) {
    return (
        <div>
            {
                services.map(v => <Service service={v} key={v.serviceId} />)
            }
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