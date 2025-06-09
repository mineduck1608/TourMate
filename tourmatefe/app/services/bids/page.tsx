'use client'
import React, { Suspense, useContext, useEffect, useState } from 'react'
import Profile from './profile'
import TourBidPage from './tour-bids-page'
import { getMostPopularAreas } from '@/app/api/active-area.api'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getCustomer } from '@/app/api/customer.api'
import { CustomerSiteContext, CustomerSiteContextProp } from '../context'
import { AuthProvider } from '@/components/authProvider'
import { CustomerContent } from '../customer-content'
import Banner from '@/components/Banner'
import { TourBid, TourBidListResult } from '@/types/tour-bid'
import { baseData, BidTaskContext } from './tour-bid-task-context'


function TourBidPageMain() {
    const { id } = useContext(CustomerSiteContext) as CustomerSiteContextProp
    const customerQueryData = useQuery({
        queryFn: () => getCustomer(id),
        queryKey: ['customer', id],
        staleTime: 24 * 3600 * 1000,
    })
    const customer = customerQueryData.data
    const simplifiedAreaQuery = useQuery({
        queryKey: ['most-popular-area'],
        queryFn: () => getMostPopularAreas(),
    })
    const [content, setContent] = useState('')
    const areas = simplifiedAreaQuery.data?.data ?? []

    const [modalOpen, setModalOpen] = useState({
        changeStatus: false,
        edit: false,
        delete: false,
        create: false
    });
    const [signal, setSignal] = useState({
        edit: false,
        create: false,
        delete: false,
        likeOrUnlike: false
    });
    const [target, setTarget] = useState<TourBidListResult | TourBid>({ ...baseData });

    useEffect(() => {
        setTarget({ ...target, accountId: customer?.accountId ?? 0 });
    }, [customer?.accountId]);
    function refetch(){
        setTimeout(() => {
            simplifiedAreaQuery.refetch()
        }, 500);
    }
    useEffect(() => {
        if (signal.create) {
            refetch()
        }
    }, [signal.create])
    useEffect(() => {
        if (signal.edit) {
            refetch()
        }
    }, [signal.edit])
    useEffect(() => {
        if (signal.delete) {
            refetch()
        }
    }, [signal.delete])
    return (
        <BidTaskContext.Provider value={{ signal, setSignal, modalOpen, setModalOpen, setTarget, target }}>
            <div>
                <Banner title='Đấu giá' imageUrl='/travel.jpg' />
                <div className='lg:flex justify-between'>

                    <div className='hidden lg:block lg:w-[25%] px-5 py-5 sticky top-0 h-screen overflow-y-auto'>
                        <Profile customer={customer} />
                    </div>
                    <div className='w-full lg:w-[45%] px-5 py-5'>
                        <TourBidPage customer={customer} search={content} />
                    </div>
                    <div className='hidden lg:block lg:w-[20%] px-5 py-5 sticky top-0 h-screen overflow-y-auto'>
                        <div className='rounded-md border shadow-lg p-5'>
                            <input
                                className='p-1 w-full mb-2 border-2 rounded-sm'
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder='Tìm kiếm...'
                            />
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
        </BidTaskContext.Provider>
    )
}

export default function BidDriver() {
    return (
        <AuthProvider>
            <CustomerContent>
                <Suspense fallback={<p>Loading...</p>}>
                    <TourBidPageMain />
                </Suspense>
            </CustomerContent>
        </AuthProvider>
    )
}