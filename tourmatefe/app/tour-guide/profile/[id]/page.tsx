'use client'
import { changePicture as changeTourGuidePicture, getTourGuide, updateTourGuideClient } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react'
import ProfileForm from './form';
import { TourGuide } from '@/types/tour-guide';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';
import PictureView from './profile-pic';
import EditPic from './edit-pic';
import { Button } from '@/components/ui/button';
import TourServices from './services';

const targetType = {
    profilePic: 'Image',
    banner: 'BannerImage'
}
export default function TourGuideProfileEdit({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = use(params);
    const [toggleMode, setToggleMode] = useState({
        view: false,
        edit: false,
        targetType: targetType.profilePic,
        value: ''
    })
    const [toggleSection, setToggleSection] = useState({
        info: true,
        services: true
    })
    const { data, refetch } = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    })

    const updateTourGuideMutation = useMutation({
        mutationFn: async ({ data, changePic }: { data?: TourGuide, changePic?: { fieldToChange: string, newValue: string } }) => {
            if (data) return await updateTourGuideClient(data);
            if (changePic) return await changeTourGuidePicture(id, changePic.fieldToChange, changePic.newValue);
            return {
                data: undefined,
                changePic: {
                    fieldToChange: '',
                    newValue: ''
                }
            }
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

    const update = (newData: TourGuide) => {
        updateTourGuideMutation.mutate({ data: newData })
        refetch()
    }
    const updatePfp = (fieldToChange: string, newValue: string) => {
        updateTourGuideMutation.mutate({ changePic: { fieldToChange, newValue } })
        refetch()
        setToggleMode({ ...toggleMode, edit: false })
    }
    const tourGuide = data?.data
    return (
        <div className=''>
            <PictureView isOpen={toggleMode.view} onClose={() => { setToggleMode({ ...toggleMode, view: false }) }} img={toggleMode.value} />
            {toggleMode.edit &&
                <EditPic
                    onChange={(url) => updatePfp(toggleMode.targetType, url)}
                    isOpen
                    onClose={() => { setToggleMode({ ...toggleMode, edit: false }) }}
                    type={toggleMode.targetType}
                />
            }
            <div className='my-10 relative'>
                <div className='relative'>
                    {tourGuide?.bannerImage &&
                        <div onClick={() => {
                            setToggleMode(p => ({ ...p, view: true, targetType: targetType.banner, value: tourGuide?.bannerImage }))
                        }}>
                            <Banner imageUrl={tourGuide.bannerImage} title='' height='200px' />
                        </div>
                    }
                    <Button
                        className='absolute right-[5%] bottom-[5%] p-2 rounded-lg bg-white text-black hover:bg-gray-700 hover:text-white shadow-lg'
                        onClick={() => {
                            setToggleMode(p => ({ ...p, edit: true, targetType: targetType.banner, value: tourGuide?.bannerImage ?? '' }))
                        }}>
                        <FaCamera /> Chỉnh sửa ảnh bìa
                    </Button>
                </div>
                <div className='absolute top-[75px] md:left-[250px] transform -translate-x-1/2'>
                    <div className='p-1 rounded-full flex justify-center'>
                        <div className='p-1 rounded-full *:hover:cursor-pointer relative' >
                            {tourGuide?.image && <img
                                src={tourGuide.image}
                                // src={'/mountain.png'}
                                alt={'shell'}
                                className="w-[150px] rounded-full aspect-square relative border-2"
                                onClick={() => {
                                    setToggleMode(p => ({ ...p, view: true, targetType: targetType.profilePic, value: tourGuide?.image }))
                                }}
                            />}
                            <div className='absolute right-0 bottom-0 p-2 rounded-full bg-black hover:bg-gray-700' onClick={() => {
                                setToggleMode(p => ({ ...p, edit: true, targetType: targetType.profilePic }))
                            }}>
                                <FaCamera fill='#ffffff' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='xl:mx-[20%] mt-16 border-b-2 border-[#000000]'>
                    <div className='flex justify-between mb-5'>
                        <h3 className='text-3xl font-bold'>Thông tin cá nhân</h3>
                        <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'
                            onClick={() => setToggleSection(p => ({ ...p, info: !p.info }))}
                        >
                            {toggleSection.info ? 'Ẩn' : 'Hiện'}
                        </Button>
                    </div>
                    <div className={`${toggleSection.info ? 'block' : 'hidden'} mb-1`}>
                        {tourGuide && <ProfileForm tourGuide={tourGuide} updateFn={(v) => update(v)} />}
                    </div>
                </div>
                <div className='xl:mx-[20%] mt-8 border-b-2 border-[#000000]'>
                    <div className='flex justify-between mb-5'>
                        <h3 className='text-3xl font-bold'>Dịch vụ du lịch</h3>
                        <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'
                            onClick={() => setToggleSection(p => ({ ...p, services: !p.services }))}
                        >
                            {toggleSection.services ? 'Ẩn' : 'Hiện'}
                        </Button>
                    </div>
                    <div className={`${toggleSection.services ? 'block' : 'hidden'} mb-1`}>
                        <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer mb-2.5'>
                            Tạo dịch vụ
                        </Button>
                        <TourServices tourGuideId={id} />
                    </div>
                </div>
            </div>
        </div>
    )
}