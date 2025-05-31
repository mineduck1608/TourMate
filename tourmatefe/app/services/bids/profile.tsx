import SafeImage from '@/components/safe-image'
import { Customer } from '@/types/customer'
import Link from 'next/link'
import React, { JSX } from 'react'
import { FaBell, FaComment, FaPowerOff, FaUser } from 'react-icons/fa'
export default function Profile({ customer }: { customer?: Customer }) {
    const tags: { icon: JSX.Element, title: string, link: string }[] = [
        {
            icon: <FaUser />,
            title: 'Tìm Tour guide',
            link: 'tour-guide'
        },
        {
            icon: <FaComment />,
            title: 'Diễn đàn',
            link: ''
        },
        {
            icon: <FaBell />,
            title: 'Thông báo',
            link: ''
        },
        {
            icon: <FaComment />,
            title: 'Tin nhắn',
            link: '/chat'
        },
        {
            icon: <FaPowerOff />,
            title: 'Lịch sử giao dịch',
            link: ''
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
            <div className='xl:flex'>
                <SafeImage src={customer?.image}
                    className='w-[75px] h-[75px] rounded-full aspect-square border-2'
                    alt={'profile'}
                />
                <div className='xl:ml-4 *:mb-2 '>
                    <h4 className="text-2xl font-medium leading-none">Cá nhân</h4>
                    <p>{customer?.fullName}</p>
                    <p>{customer?.account?.email}</p>
                </div>
            </div>
        </div>
    )
}