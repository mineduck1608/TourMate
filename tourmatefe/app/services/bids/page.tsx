'use client'
import React, { Suspense } from 'react'
import Profile from './profile'
import Bids from './bids'

function BidPage() {
    return (
        <div className='flex justify-between'>
            <div className='w-[25%] px-5 py-5'>
                <Profile />
            </div>
            <div className='w-[40%] px-5 py-5'>
                <Bids />
            </div>
            <div className='w-[25%] bg-green-50'>
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