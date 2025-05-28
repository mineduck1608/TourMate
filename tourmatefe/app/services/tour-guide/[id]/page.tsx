'use client'
import { getTourGuide } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useQuery } from '@tanstack/react-query';
import React, { use, useState } from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock, FaRegMap, FaRegUser, FaSuitcaseRolling } from 'react-icons/fa';
import TourServices from './services';
import { TourGuide } from '@/types/tour-guide';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import Image from 'next/image';

export default function TourGuideDetail({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = use(params);

    const tourGuideData = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    });

    const tourGuide = tourGuideData.data?.data;
    const [displayDesc, setDisplayDesc] = useState(true);

    return (
        <div className='*:my-10'>
            <Banner imageUrl='/tour-guide-list-banner.png' title='THÔNG TIN HƯỚNG DẪN VIÊN' />
            <div className='shadow-lg w-[85%] rounded-lg place-self-center'>
                <div className='flex justify-between p-5'>
                    <Image
                        src={tourGuide?.image || "/fallback.jpg"}
                        alt={tourGuide?.fullName || "Tour guide image"}
                        className="w-[30%] h-60 object-cover border-2"
                    />
                    <div className='w-[65%]'>
                        <h4 className="font-bold text-4xl text-gray-800 p-2 mb-4">
                            {tourGuide?.fullName}
                        </h4>
                        {tourGuide && (
                            <table>
                                <tbody>
                                    {statToRender(tourGuide).map((v, i) => (
                                        <tr key={i}>
                                            <td className='p-2'>
                                                <span className='flex gap-5 font-semibold'>
                                                    {v.icon}
                                                    {v.name}:
                                                </span>
                                            </td>
                                            <td>{v.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>
                </div>
                <div className='pt-2 px-5'>
                    <div className='flex justify-between'>
                        <p className='text-2xl font-semibold'>Giới thiệu</p>
                        <Button
                            onClick={() => setDisplayDesc(p => !p)}
                            className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer mb-2.5'>
                            {displayDesc ? 'Ẩn' : 'Hiện'}
                        </Button>
                    </div>
                    <div
                        className={`text-justify ${displayDesc ? 'block pb-5' : 'hidden'}`}
                        dangerouslySetInnerHTML={{
                            __html: tourGuide?.tourGuideDescs?.[0]?.description
                                ? tourGuide?.tourGuideDescs?.[0]?.description.replace(
                                    /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                                    (match) => {
                                        return `<Image src="${match}" alt="Image" style="max-width: 100%; max-height: 100%; object-fit: contain;" />`;
                                    }
                                )
                                : "Không có mô tả",
                        }}
                    />
                </div>
            </div>
            <div className='flex justify-between p-5 shadow-lg w-[85%] rounded-lg place-self-center'>
                {id && <TourServices tourGuideId={id} />}
            </div>
        </div>
    );
}

const statToRender = (t: TourGuide) => [
    {
        icon: <FaRegMap size={25} />,
        value: t.tourGuideDescs?.[0]?.area?.areaName || 'Chưa có địa điểm',  // Kiểm tra areaName có tồn tại không
        name: 'Địa điểm hoạt động',
    },
    {
        icon: <FaRegClock size={25} />,
        value: dayjs(t.dateOfBirth).format('DD/MM/YYYY'),
        name: 'Ngày sinh',
    },
    {
        icon: <FaSuitcaseRolling size={25} />,
        value: t.tourGuideDescs?.[0]?.yearOfExperience ?? 'Chưa có kinh nghiệm',  // Kiểm tra yearOfExperience có tồn tại không
        name: 'Số năm kinh nghiệm',
    },
    {
        icon: <FaRegUser size={25} />,
        value: t.gender || 'Chưa rõ',  // Nếu gender không có, hiển thị "Chưa rõ"
        name: 'Giới tính',
    },
    {
        icon: <FaMapMarkerAlt size={25} />,
        value: t.address || 'Chưa có địa chỉ',  // Nếu address không có, hiển thị "Chưa có địa chỉ"
        name: 'Địa chỉ',
    },
    {
        icon: <FaPhoneAlt size={25} />,
        value: t.phone || 'Chưa có số điện thoại',  // Nếu phone không có, hiển thị "Chưa có số điện thoại"
        name: 'Số điện thoại',
    },
];
