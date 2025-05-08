'use client'
import { getActiveArea } from '@/app/api/active-area.api';
import Banner from '@/components/Banner';
import { useQuery } from '@tanstack/react-query';
import React, { use } from 'react'

export default function ServiceDetail({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { data } = useQuery({
        queryKey: ['news', id],
        queryFn: () => getActiveArea(id),
        staleTime: 24 * 3600 * 1000,
    })
    const area = data?.data
    return (<div className='admin-layout'>
        <div className='h-[100%]'>
            {
                area?.bannerImg && area?.areaTitle &&
                <Banner
                    imageUrl={area?.bannerImg}
                    title={area?.areaTitle}
                />}
        </div>
        <div className='flex justify-between py-10 px-5'>
            <div className='w-[70%] p-2'>
                {area?.areaContent}
            </div>
            {/* <div className='w-[25%] p-2 *:mb-10'>
                <RecentNews currentId={id} />
                <NewsCategories />
                <ScrollArea className="h-60 rounded-md border shadow-md bg-black">
                    <div className="p-4 text-white">
                        <h4 className="mb-4 text-3xl leading-none">Bạn có câu hỏi nào không?</h4>
                        <p>Đừng ngần ngại gọi cho chúng tôi. Chúng tôi là một đội ngũ chuyên gia và rất vui được trò chuyện với bạn.</p>
                        <table className='mt-5'>
                            <tbody>
                                <tr className='*:p-2'>
                                    <td>
                                        <FaPhoneAlt fill='#ffffff' size={20} />
                                    </td>
                                    <td>
                                        0974581366
                                    </td>
                                </tr>
                                <tr className='*:p-1'>
                                    <td>
                                        <FaEnvelope fill='#ffffff' size={20} />
                                    </td>
                                    <td>
                                        TourMatebooking@gmail.com
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </ScrollArea>
            </div> */}
        </div>
    </div>)
}
