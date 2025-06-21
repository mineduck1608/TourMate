'use client'
import { getTourGuide } from '@/app/api/tour-guide.api';
import Banner from '@/components/Banner';
import { useQuery } from '@tanstack/react-query';
import React, { use, useEffect, useState } from 'react'
import { FaMapMarkerAlt, FaPhoneAlt, FaRegClock, FaFacebookMessenger, FaRegMap, FaRegUser, FaSuitcaseRolling, FaCheckCircle } from 'react-icons/fa';
import TourServices from './services';
import { TourGuide } from '@/types/tour-guide';
import { Button } from '@/components/ui/button';
import dayjs from 'dayjs';
import SafeImage from '@/components/safe-image';
import "@/styles/globals.css";
import AOS from "aos";
import "aos/dist/aos.css";
import { useRouter } from 'next/navigation';
import TourGuideFeedbackSection from './feedback';

export default function TourGuideDetail({
    params,
}: {
    params: Promise<{ id: number }>;
}) {
    const { id } = use(params);
    const router = useRouter();

    const tourGuideData = useQuery({
        queryKey: ['tour-guide', id],
        queryFn: () => getTourGuide(id),
        staleTime: 24 * 3600 * 1000,
    });

    const tourGuide = tourGuideData.data?.data;
    const [displayDesc, setDisplayDesc] = useState(true);

    useEffect(() => {
        AOS.init({
            offset: 0,
            delay: 200,
            duration: 1200,
            once: true,
        });
    }, []);

    const token = sessionStorage.getItem("accessToken");

    return (
        <div className="space-y-10" data-aos="fade-in" data-aos-delay="300">
            <Banner imageUrl="/tour-guide-list-banner.png" title="THÔNG TIN HƯỚNG DẪN VIÊN" />

            <div className="w-[85%] mx-auto bg-white shadow-xl rounded-xl p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    <SafeImage
                        src={tourGuide?.image}
                        alt={tourGuide?.fullName}
                        className="w-full h-60 object-cover border-2 rounded-md"
                    />

                    <div className="md:col-span-2 space-y-4">
                        <h4 className="text-3xl font-bold text-gray-800">
                            {tourGuide?.fullName}{' '}
                            {tourGuide?.isVerified && <FaCheckCircle className="text-blue-500 inline ml-1" />}
                        </h4>

                        {tourGuide && (
                            <table className="table-auto w-full text-left">
                                <tbody>
                                    {statToRender(tourGuide).map((v, i) => (
                                        <tr key={i} className="border-b border-gray-200">
                                            <td className="py-2 pr-4 whitespace-nowrap font-medium flex items-center gap-3 text-gray-700">
                                                {v.icon} {v.name}
                                            </td>
                                            <td className="py-2 text-gray-600">{v.value}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </div>

                    <div className="flex justify-end md:col-span-3">
                        <Button
                            className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
                            onClick={() => {
                                if (!token) {
                                    alert('Vui lòng đăng nhập để sử dụng dịch vụ này');
                                    return;
                                }
                                router.push(`/chat?userId=${tourGuide?.accountId}`);
                            }}
                        >
                            <FaFacebookMessenger size={20} className="mr-2" />
                            Nhắn tin
                        </Button>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-semibold text-gray-800">Giới thiệu</h2>
                        <Button
                            onClick={() => setDisplayDesc((p) => !p)}
                            className="bg-blue-700 hover:bg-blue-800 text-white font-medium rounded-lg text-sm px-5 py-2.5"
                        >
                            {displayDesc ? 'Ẩn' : 'Hiện'}
                        </Button>
                    </div>

                    <div
                        className={`text-justify text-gray-700 ${displayDesc ? 'block pb-5' : 'hidden'}`}
                        dangerouslySetInnerHTML={{
                            __html: tourGuide?.tourGuideDescs?.[0]?.description
                                ? tourGuide?.tourGuideDescs?.[0]?.description.replace(
                                    /(https?:\/\/.*\.(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                                    (match) =>
                                        `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain;" />`
                                )
                                : 'Không có mô tả',
                        }}
                    />
                </div>
            </div>

            <div className="w-[85%] mx-auto shadow-xl rounded-xl p-6 bg-white">
                {id && <TourServices tourGuideId={id} />}
            </div>

            <div className="w-[85%] mx-auto shadow-xl rounded-xl p-6 bg-white mb-5">
                {id && <TourGuideFeedbackSection tourGuideId={id as number} />}
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
