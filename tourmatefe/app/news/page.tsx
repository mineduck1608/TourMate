import React, { Suspense } from 'react'
import Header from '@/components/MegaMenu';
import Footer from '@/components/Footer';
import Banner from '@/components/Banner';
import NewsList from './NewsList';

function NewsListPage() {
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

export default function NewsListDriver(){
    return(
        <Suspense fallback={<p>Loading...</p>}>
            <NewsListPage />
        </Suspense>
    )
}