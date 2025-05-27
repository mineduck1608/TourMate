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
            <div className='w-[45%] px-5 py-5'>
                <Bids />
            </div>
            <div className='w-[20%]'>
                
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