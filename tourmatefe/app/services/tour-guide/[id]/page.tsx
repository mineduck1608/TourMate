'use client'
import { getTourGuide } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { TourGuide } from '@/types/tour-guide';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react'
import { FaClock, FaMapMarker, FaSuitcase } from 'react-icons/fa';
import TourServices from './services';
export default function TourGuideDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const tourGuideData = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    })
    const tourGuide = tourGuideData.data?.data

    return (
        <div className='*:my-10'>
            <Banner imageUrl='/tour-guide-list-banner.png' title='THÔNG TIN HƯỚNG DẪN VIÊN' />

            <div className='flex justify-between p-5 shadow-lg w-[85%] rounded-lg place-self-center'>
                <img src={tourGuide?.image || "/fallback.jpg"}
                    alt={tourGuide?.fullName}
                    className="w-[30%] h-60 object-cover border-2" />
                <div className='w-[65%]'>
                    <h4 className="font-semibold text-3xl text-gray-800 p-2 mb-4">
                        {tourGuide?.fullName}
                    </h4>
                    {tourGuide && <table>
                        <tbody>
                            {
                                statToRender(tourGuide).map((v, i) => (
                                    <tr key={i}>
                                        <td className='p-2'>{v.icon}</td>
                                        <td>{v.value}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>}
                    <p className='p-2'>
                        {tourGuide?.tourGuideDescs[0].description}
                    </p>
                </div>
            </div>
            <div className='flex justify-between p-5 shadow-lg w-[85%] rounded-lg place-self-center'>
                <TourServices services={tourGuide?.tourServices ?? []} />
            </div>
        </div>
    )
}

const statToRender = (t: TourGuide) => [
    {
        icon: <FaMapMarker />,
        value: t.tourGuideDescs[0].area.areaName
    },
    {
        icon: <FaClock />,
        value: t.dateOfBirth
    },
    {
        icon: <FaSuitcase />,
        value: t.tourGuideDescs[0].yearOfExperience + ' năm kinh nghiệm'
    }
]