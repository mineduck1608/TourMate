import SafeImage from '@/components/safe-image'
import { Customer } from '@/types/customer'
import Link from 'next/link'
import React, { JSX } from 'react'
import { FaRegUser, FaRegComment, FaRegMap, FaRegNewspaper } from 'react-icons/fa'
export default function Profile({ customer }: { customer?: Customer }) {
    const tags: { icon: JSX.Element, title: string, link: string }[] = [
        {
            icon: <FaRegUser />,
            title: 'Tìm Tour guide',
            link: '/services/tour-guide'
        },
        {
            icon: <FaRegComment />,
            title: 'Tin nhắn',
            link: '/chat'
        },
        {
            icon: <FaRegMap />,
            title: 'Địa điểm',
            link: '/services/active-area'
        },
        {
            icon: <FaRegNewspaper />,
            title: 'Tin tức',
            link: '/news'
        },
    ]
    return (
        <div className='rounded-md border shadow-lg'>
            <UserRender customer={customer} />
            <table className="mx-3 mb-5">
                <tbody>
                    {tags.map((tag) => (
                        <tr key={tag.title} className='*:px-3 *:p-1 hover:bg-gray-200 hover:font-semibold cursor-pointer transition-colors duration-200'>
                            <td>
                                {tag.icon}
                            </td>
                            <td className='w-full'>
                                <div className='py-1'>
                                    <Link href={tag.link}
                                        className={`text-md flex items-center 
                                            ${tag.link.length === 0 ? 'text-[#ff0000' : ''}
                                        `}
                                    >
                                        {tag.title}
                                    </Link>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

function UserRender({ customer }: { customer?: Customer }) {
    return (
        <div className='px-6 pt-5 pb-1'>
            <div className='lg:flex gap-5'>
                <SafeImage
                    src={customer?.image}
                    className='w-[75px] h-[75px] rounded-full aspect-square border-2'
                    alt={'profile'}
                />
                <div className='xl:ml-4 *:mb-2 w-full overflow-hidden'>
                    <h4 className="text-2xl font-medium leading-none">Cá nhân</h4>
                    <div className='break-words'>{customer?.fullName}</div>
                    <div className='break-words'>{customer?.account?.email}</div>
                </div>
            </div>
        </div>
    )
}