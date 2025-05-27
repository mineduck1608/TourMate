'use client'
import { changePassword, getTourGuide } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { use } from 'react'
import { toast } from 'react-toastify';
import ProfileForm from './form';
export default function TourGuideProfileEdit({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = use(params);
    const { data, refetch } = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    })

    const updateTourGuideMutation = useMutation({
        mutationFn: async ({ password }: { password: string}) => {
            return changePassword(id, password)
        },
        onSuccess: () => {
            toast.success("Cập thành công");
            refetch()
        },
        onError: (error) => {
            toast.error("Cập nhật thất bại");
            console.error(error);
        },
    });

    const update = (password: string) => {
        updateTourGuideMutation.mutate({password: password})
        refetch()
    }
    const tourGuide = data?.data
    return (
        <div className=''>
            <div className='my-10 relative'>
                <div className='relative'>
                    {tourGuide?.bannerImage &&
                        <div>
                            <Banner imageUrl={tourGuide.bannerImage} title='' height='200px' />
                        </div>
                    }
                </div>
                <div className='absolute top-[75px] md:left-[50%] transform -translate-x-1/2'>
                    <div className='p-1 rounded-full flex justify-center'>
                        <div className='p-1 rounded-full relative' >
                            {tourGuide?.image && <img
                                src={tourGuide.image}
                                alt={'shell'}
                                className="w-[150px] rounded-full aspect-square relative border-2"
                            />}
                        </div>
                    </div>
                </div>
                <div className='xl:mx-[20%] mt-16'>
                    <div>
                        {tourGuide && <ProfileForm tourGuide={tourGuide} updateFn={(v) => update(v)} />}
                    </div>
                </div>
            </div>
        </div>
    )
}