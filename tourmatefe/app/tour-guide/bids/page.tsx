'use client'
import React, { Suspense, useContext, useState } from 'react'
import Profile from './profile'
import { getMostPopularAreas } from '@/app/api/active-area.api'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import Banner from '@/components/Banner'
import { TourGuideSiteContext, TourGuideSiteContextProps } from '../context'
import BidListMain from './bids-page'
import { getTourGuide } from '@/app/api/tour-guide.api'

function BidPage() {
    const { id } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
    const [content, setContent] = useState('')
    const tourGuideQueryData = useQuery({
        queryFn: () => getTourGuide(id),
        queryKey: ['tour-guide', id],
        staleTime: 24 * 3600 * 1000,
    })
    const tourGuide = tourGuideQueryData.data?.data
    const simplifiedAreaQuery = useQuery({
        queryKey: ['most-popular-area'],
        queryFn: () => getMostPopularAreas(),
        staleTime: 24 * 3600 * 1000
    })
    const areas = simplifiedAreaQuery.data?.data ?? []
    return (
        <div>
            <Banner title='Đấu giá' imageUrl='/travel.jpg' />
            <div className='lg:flex justify-between'>

                <div className='hidden lg:block lg:w-[30%] px-5 py-5'>
                    <Profile tourGuide={tourGuide} />
                </div>
                <div className='w-full lg:w-[35%] px-5 py-5'>
                    <BidListMain search={content} />
                </div>
                <div className='block lg:w-[30%] px-5 py-5'>
                    <div className='rounded-md border shadow-lg p-5'>
                        <input className='p-1 w-full mb-2 border-2 rounded-sm' placeholder='Tìm kiếm...' value={content} onChange={(e) => { setContent(e.target.value) }} />
                        <h4 className="text-xl font-medium leading-none">Địa điểm nổi tiếng</h4>
                        {
                            areas.map((v) =>
                                <div key={v.areaId} className='mt-2 grid grid-cols-2 w-full'>
                                    <Link href={'/services/active-area/detail?id=' + v.areaId} className='text-blue-500'>{v.areaName}</Link>
                                    <span className='text-end'>({v.tourBidCount} bài đăng)</span>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default function BidDriver() {
    return (
        <Suspense fallback={<p>Loading...</p>}>
            <BidPage />
        </Suspense>
    )
}