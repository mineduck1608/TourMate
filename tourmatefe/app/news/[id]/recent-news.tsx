import { getNews } from '@/app/api/news.api'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@radix-ui/react-dropdown-menu'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import Link from 'next/link'
import React from 'react'

export default function RecentNews(params: { currentId?: number | string }) {
    const size = 5
    const { data } = useQuery({
        queryKey: ['news', size, 1],
        queryFn: () => {
            const controller = new AbortController()
            setTimeout(() => {
                controller.abort()
            }, 5000);
            return getNews(1, size, '')
        }
    })
    const current = params.currentId
        ? (typeof params.currentId === 'string'
            ? Number.parseInt(params.currentId)
            : params.currentId
        )
        : -1
    const news = data?.result ?? []
    return (
        <div className='rounded-md border shadow-lg bg-gray-100'>
            <h4 className="px-6 py-3 text-3xl font-medium leading-none">Bài viết gần đây</h4>
            <Separator />
            <ScrollArea className="h-96 px-6 pb-3 ">
                <table>
                    <tbody>
                        {
                            news.map((v) => (
                                <tr key={v.newsId} className='border-b-2 h-max '>
                                    <td className=''>
                                        <img src={v.bannerImg} className='max-w-[150px]' />
                                    </td>
                                    <td className='p-2 h-[105px] flex flex-col justify-between'>
                                        {v.newsId !== current
                                            ? <Link href={'/news/' + v.newsId} className=''>{v.title}</Link>
                                            : <p className='font-semibold'>{v.title}</p>
                                        }
                                        <p className='font-light'>{dayjs(v.createdAt).format('DD/MM/YYYY HH:mm:ss')}</p>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </ScrollArea>
        </div>
    )
}
