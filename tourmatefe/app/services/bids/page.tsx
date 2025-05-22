'use client'
import React, { Suspense } from 'react'
import Profile from './profile'

function BidPage() {
    return (
        <div className='flex justify-between'>
            <div className='w-[20%] px-5 py-5'>
                <Profile />
            </div>
            <div className='w-[55%] bg-blue-50'>
                B
            </div>
            <div className='w-[20%] bg-green-50'>
                C
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