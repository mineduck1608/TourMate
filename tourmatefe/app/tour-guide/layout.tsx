'use client'
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthProvider, useAuth } from '@/components/authProvider';
import { useToken } from '@/components/getToken';
import { MyJwtPayload } from '@/types/JwtPayload';
import { jwtDecode } from 'jwt-decode';
import { useQuery } from '@tanstack/react-query';
import { getAssociatedId } from '../api/account.api';
import { TourGuideSiteContext } from './context';
import { getTourGuide } from '../api/tour-guide.api';

function TourGuideContent({ children }: { children: ReactNode }) {
  const { role } = useAuth();
  const isLoading = role === null;
  const token = useToken('accessToken')
  const payLoad: MyJwtPayload | undefined = token ? jwtDecode<MyJwtPayload>(token) : undefined
  const accId = Number(payLoad?.AccountId)
  const query = useQuery({
    queryKey: ['id-of', accId],
    queryFn: () => getAssociatedId(accId, 'TourGuide'),
    staleTime: 24 * 3600 * 1000
  })
  const tourGuideId = query.data
  const tourGuideQueryData = useQuery({
    queryFn: () => getTourGuide(tourGuideId ?? -1),
    queryKey: ['tourGuide', tourGuideId],
    staleTime: 24 * 3600 * 1000,
    enabled: !Object.is(tourGuideId, undefined)
  })
  const tourGuide = tourGuideQueryData.data?.data
  const [, setTourGuideId] = useState<number | undefined>()
  useEffect(() => {
    if (tourGuideId) {
      setTourGuideId(tourGuideId)
    }
  }, [tourGuideId])

  if (isLoading) {
    return (
      null
    );
  }


  if (role !== 'TourGuide') {
    return <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500">404</h1>
          <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white">Something is missing.</p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can not find that page. You will find lots to explore on the home page.
          </p>
          <Link
            href="/"
            className="inline-flex text-white bg-primary-600 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-primary-900 my-4"
          >
            Back to Homepage
          </Link>
        </div>
      </div>
    </section>;
  }


  return <>
    {tourGuideId && <TourGuideSiteContext.Provider value={{ id: tourGuideId, accId, tourGuide }}>
      {children}
    </TourGuideSiteContext.Provider>}
  </>;
}
export default function TourGuideLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <TourGuideContent>{children}</TourGuideContent>
    </AuthProvider>
  );
}
