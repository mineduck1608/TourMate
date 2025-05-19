'use client'
import { getTourGuide } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useQuery } from '@tanstack/react-query';
import Link from 'next/link';
import React, { use } from 'react'
import TourServices from './posts';
export default function TourGuideProfileDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { data } = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    })
    const tourGuide = data?.data
    return (
        <div className='*:my-10 '>
            <div className='relative'>
                <Banner imageUrl='/mountain.png' title='' height='200px' />
                <div className='absolute top-[75px] md:left-[250px] transform -translate-x-1/2'>
                    <div className='p-1 rounded-full flex justify-center'>
                        <div className='bg-white p-1 rounded-full'>
                            <img
                                src={"/travel.jpg"}
                                alt={'shell'}
                                className="w-[150px] rounded-full aspect-square"
                            />
                        </div>
                    </div>
                    <h4 className="font-semibold text-3xl text-gray-800  text-center w-full">
                        {tourGuide?.fullName}
                    </h4>
                </div>
                <div className='xl:ml-[30%] mt-5'>
                    <Link href={'#'} className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'>
                        Tạo bài đăng
                    </Link>
                    <div className='mt-5'>
                        {tourGuide && <TourServices tourGuideId={tourGuide.tourGuideId} />}
                    </div>                    
                </div>
            </div>


        </div>
    )
}