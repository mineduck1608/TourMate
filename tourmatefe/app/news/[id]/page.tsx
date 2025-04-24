import React from 'react'
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import RecentNews from './recent-news';
import NewsCategories from './categories';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FaFontAwesome } from 'react-icons/fa';

export default function NewsDetailPage({
    params,
}: {
    params: { id: string };
}) {
    return (<div className='admin-layout'>
        <Header />
        <div className='h-[100%]'>
            <Banner
                imageUrl="/news-banner.png"
                title="TIN TỨC"
            />
        </div>
        <div className='flex justify-between mt-10'>
            <div className='w-[65%] p-2'>A</div>
            <div className='w-[30%] p-2 *:mb-5'>
                <RecentNews />
                <NewsCategories />
                <ScrollArea className="h-80 rounded-md border shadow-md">
                    <div className="p-4">
                        <h4 className="mb-4 text-3xl leading-none">Bạn có câu hỏi nào không?</h4>
                        <p>Đừng ngần ngại gọi cho chúng tôi. Chúng tôi là một đội ngũ chuyên gia và rất vui được trò chuyện với bạn.</p>
                        
                    </div>
                </ScrollArea>
            </div>
        </div>
        <Footer />
    </div>)
}