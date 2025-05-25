'use client'
import { getTourGuide, updateTourGuideClient } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { use } from 'react'
import ProfileForm from './form';
import { TourGuide } from '@/types/tour-guide';
import { toast } from 'react-toastify';
export default function TourGuideProfileEdit({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { data, refetch } = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    })

    const updateTourGuideMutation = useMutation({
        mutationFn: ({ data }: { id: number; data: TourGuide }) =>
            updateTourGuideClient(data),
        onSuccess: () => {
            toast.success("Cập thành công");
            refetch()
        },
        onError: (error) => {
            toast.error("Cập nhật thất bại");
            console.error(error);
        },
    });
    const update = (newData: TourGuide) => {
        updateTourGuideMutation.mutate({ id: Number(id), data: newData })
    }
    const tourGuide = data?.data
    return (
        <div className='*:my-10 '>
            <div className='relative'>
                <Banner imageUrl={tourGuide?.bannerImage ?? '/mountain.png'} title='' height='200px' />
                <div className='absolute top-[75px] md:left-[250px] transform -translate-x-1/2'>
                    <div className='p-1 rounded-full flex justify-center'>
                        <div className='bg-white p-1 rounded-full'>
                            <img
                                src={tourGuide?.image}
                                alt={'shell'}
                                className="w-[150px] rounded-full aspect-square"
                            />
                        </div>
                    </div>
                </div>
                <div className='xl:mx-[20%] mt-10'>
                    {tourGuide && <ProfileForm tourGuide={tourGuide} updateFn={(v) => update(v)} />}
                </div>
            </div>
        </div>
    )
}