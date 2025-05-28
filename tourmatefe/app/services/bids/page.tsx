'use client'
import React, { Suspense } from 'react'
import Profile from './profile'
import Bids from './bids'
import { getSimplifiedArea } from '@/app/api/active-area.api'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

function BidPage() {
    const simplifiedAreaQuery = useQuery({
        queryKey: ['simplified-area'],
        queryFn: () => getSimplifiedArea(),
        staleTime: 24 * 3600 * 1000
    })
    const areas = simplifiedAreaQuery.data?.data ?? []
    return (
        <div className='flex justify-between'>
            <div className='w-[25%] px-5 py-5'>
                <Profile />
            </div>
            <div className='w-[45%] px-5 py-5'>
                <Bids />
            </div>
            <div className='w-[20%] px-5 py-5'>
                <div className='rounded-md border shadow-lg p-5'>
                    <input className='p-1 w-full mb-2 border-2' placeholder='Tìm kiếm...' />
                    <h4 className="text-xl font-medium leading-none">Địa điểm nổi tiếng</h4>
                    {
                        areas.slice(0, 5).map((v) => 
                        <Link href={'#'} key={v.areaId} className='block text-blue-500 my-1'>{v.areaName}</Link>
                        )
                    }
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