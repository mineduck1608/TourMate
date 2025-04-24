import React from 'react'
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import HomeNews from '@/components/HomeNews';

export default function NewsListPage() {
    return (
        <div className='admin-layout'>
            <Header />
            <div className='w-[80%] place-self-center'>
                <Banner
                    imageUrl="/news-banner.png"
                    title="TIN TỨC"
                />
            </div>
            <div className='w-[85%] place-self-center'>
                <HomeNews />
            </div>
            <Footer />
        </div>
    )
}
