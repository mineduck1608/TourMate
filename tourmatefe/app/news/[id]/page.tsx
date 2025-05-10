"use client";
import React, { use } from 'react'
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import RecentNews from './recent-news';
import NewsCategories from './categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaEnvelope, FaPhoneAlt } from 'react-icons/fa';
import { useQuery } from '@tanstack/react-query';
import { getOneNews } from '@/app/api/news.api';

export default function NewsDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = use(params);

    const { data } = useQuery({
        queryKey: ['news', id],
        queryFn: () => getOneNews(id),
        staleTime: 24 * 3600 * 1000,
    })
    const news = data?.data

    return (<div className='admin-layout'>
        <Header />
        <div className='h-[100%]'>
            {
                news?.bannerImg && news?.title &&
                <Banner
                    imageUrl={news?.bannerImg}
                    title={news?.title}
                />
            }
        </div>
        <div className='flex justify-between py-10 px-10'>
            <div className='w-[65%] p-2'
                dangerouslySetInnerHTML={{ __html: data?.data?.content ?? '' }}
            />
            <div className='w-[30%] p-2 *:mb-10'>
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
            </div>
        </div>
        <Footer />
    </div>)
}