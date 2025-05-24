'use client'
import { getTourGuide } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react'
import ProfileForm from './form';
export default function TourGuideProfileEdit({
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
                </div>
                <div className='mt-10'>
                    {tourGuide && <ProfileForm tourGuide={tourGuide} />}
                </div>
            </div>


        </div>
    )
}