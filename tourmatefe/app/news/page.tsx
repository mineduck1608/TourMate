import React from 'react'
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import NewsList from './NewsList';

export default function NewsListPage() {
    return (
        <div className='admin-layout'>
            <Header />
            <div className=''>
                <Banner
                    imageUrl="/news-banner.png"
                    title="TIN TỨC"
                />
            </div>
            <div className='w-[85%] place-self-center'>
                <NewsList />
            </div>
            <Footer />
        </div>
    )
}
