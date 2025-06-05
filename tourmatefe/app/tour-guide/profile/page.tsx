'use client'
import { changePicture as changeTourGuidePicture, getTourGuide, updateTourGuideClient } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useMutation, useQuery } from '@tanstack/react-query';
import React, { Suspense, useContext, useState } from 'react'
import ProfileForm from './profile-components/tour-guide-edit-modal';
import { TourGuide } from '@/types/tour-guide';
import { toast } from 'react-toastify';
import { FaCamera } from 'react-icons/fa';
import PictureView from './profile-components/picture-view';
import EditPic from './profile-components/edit-pic';
import { Button } from '@/components/ui/button';
import SafeImage from '@/components/safe-image';
import Detail from './profile-components/detail';
import ServiceEditModal from './profile-components/edit-service-modal';
import { ServiceEditContext } from './profile-components/service-edit-context';
import TourServices from './profile-components/services';
import { AuthProvider } from '@/components/authProvider';
import { TourGuideSiteContext, TourGuideSiteContextProps } from '../context';
import { targetType, baseService } from './constants';
import MegaMenu from '@/components/mega-menu';
import Footer from '@/components/Footer';


function TourGuideProfileEdit() {
    const [editFormOpen, setEditFormOpen] = useState(false)
    const { id } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
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
    const [target, setTarget] = useState(baseService)
    const [modalOpen, setModalOpen] = useState({ edit: false, delete: false, create: false })
    const [signal, setSignal] = useState({ edit: false, delete: false, create: false })

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
            setEditFormOpen(false)
            refetch()
        },
        onError: (error) => {
            toast.error("Cập nhật thất bại");
            console.error(error);
        },
    });

    const update = (newData: TourGuide) => {
        updateTourGuideMutation.mutate({ data: newData })
        setToggleMode({ ...toggleMode, edit: false })
    }
    const updatePfp = (fieldToChange: string, newValue: string) => {
        updateTourGuideMutation.mutate({ changePic: { fieldToChange, newValue } })
        setToggleMode({ ...toggleMode, edit: false })
    }
    const tourGuide = data?.data
    return (
        <>
        <MegaMenu/>
        <ServiceEditContext.Provider value={{ modalOpen, setModalOpen, target, setTarget, signal, setSignal }}>
            {toggleMode.edit &&
                <EditPic
                    onChange={(url) => updatePfp(toggleMode.targetType, url)}
                    isOpen
                    onClose={() => { setToggleMode({ ...toggleMode, edit: false }) }}
                    type={toggleMode.targetType}
                />
            }
            {(modalOpen.edit || modalOpen.create) && <ServiceEditModal
                isOpen
                onClose={() => { setModalOpen(p => ({ ...p, edit: false, create: false })) }}
            />}
            <PictureView isOpen={toggleMode.view} onClose={() => { setToggleMode({ ...toggleMode, view: false }) }} img={toggleMode.value} />

            <div className='my-10 relative'>
                {/* Banner */}
                <div className='relative'>

                    <div onClick={() => {
                        setToggleMode(p => ({ ...p, view: true, targetType: targetType.banner, value: tourGuide?.bannerImage ?? '' }))
                    }}>
                        <Banner imageUrl={tourGuide?.bannerImage} title='' />
                    </div>

                    <div
                        className='absolute right-[5%] bottom-[5%] rounded-full lg:rounded-lg bg-gray-200 hover:bg-gray-300 text-black shadow-lg px-2.5 py-2 pt-1 lg:pt-2'
                        onClick={() => {
                            setToggleMode(p => ({ ...p, edit: true, targetType: targetType.banner, value: tourGuide?.bannerImage ?? '' }))
                        }}>
                        <FaCamera className='inline'/> <span className='hidden lg:inline'>Chỉnh sửa ảnh bìa</span>
                    </div>
                </div>
                {/* Profile pic */}
                <div className='absolute top-[300px] left-1/2 transform -translate-x-1/2 lg:top-[250px] lg:left-[250px]'>
                    <div className='p-1 rounded-full flex justify-center'>
                        <div className='p-1 rounded-full *:hover:cursor-pointer relative'>
                            <SafeImage
                                src={tourGuide?.image}
                                alt={'shell'}
                                className="w-[125px] h-[125px] lg:w-[175px] lg:h-[175px] rounded-full aspect-square relative border-2"
                                onClick={() => {
                                    setToggleMode(p => ({ ...p, view: true, targetType: targetType.profilePic, value: tourGuide?.image ?? '' }))
                                }}
                            />
                            <div className='absolute right-0 bottom-0 lg:right-[20px] lg:bottom-[5px] border-[1] p-3 rounded-full bg-gray-200 hover:bg-gray-300' onClick={() => {
                                setToggleMode(p => ({ ...p, edit: true, targetType: targetType.profilePic }))
                            }}>
                                <FaCamera fill='#000000' />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='mx-[5%] lg:mx-[20%] mt-16 '>
                    <div className='flex justify-between mb-5'>
                        <h3 className='text-3xl font-bold'>Thông tin cá nhân</h3>
                        <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'
                            onClick={() => setToggleSection(p => ({ ...p, info: !p.info }))}
                        >
                            {toggleSection.info ? 'Ẩn' : 'Hiện'}
                        </Button>
                    </div>
                    <div className={`${toggleSection.info ? 'block' : 'hidden'} mb-1`}>
                        {tourGuide && <ProfileForm tourGuide={tourGuide} updateFn={(v) => update(v)} isOpen={editFormOpen} onClose={() => setEditFormOpen(false)} />}
                        {tourGuide && <Detail s={tourGuide} />}
                        <Button
                            onClick={() => setEditFormOpen(true)}
                            className='w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'>
                            Cập nhật thông tin
                        </Button>
                    </div>
                </div>
                <div className='my-10 mx-[5%] border-[1] border-b-gray-200' />
                <div className=''>
                    <div className='mx-[5%] lg:mx-[20%] flex justify-between '>
                        <h3 className='text-3xl font-bold'>Dịch vụ du lịch</h3>
                        <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'
                            onClick={() => setToggleSection(p => ({ ...p, services: !p.services }))}
                        >
                            {toggleSection.services ? 'Ẩn' : 'Hiện'}
                        </Button>

                    </div>
                    <div className={`${toggleSection.services ? 'block' : 'hidden'}`}>
                        <Button
                            onClick={() => {
                                setTarget(baseService)
                                setModalOpen({ edit: false, delete: false, create: true })
                            }}
                            className='mx-[5%] lg:mx-[20%] text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer my-6'>
                            Tạo dịch vụ
                        </Button>
                        <div className='mx-[5%] mt-4'>
                            <TourServices tourGuideId={id} />
                        </div>
                    </div>
                </div>
            </div>
        </ServiceEditContext.Provider >
        <Footer />
        </>
    )
}

export default function PageDriver() {
    return (
        <AuthProvider>
            <Suspense fallback={<p>...</p>}>
                <TourGuideProfileEdit />
            </Suspense>
        </AuthProvider>
    )
}