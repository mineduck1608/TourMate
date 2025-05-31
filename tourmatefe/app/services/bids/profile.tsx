import SafeImage from '@/components/safe-image'
import { Account } from '@/types/account'
import Link from 'next/link'
import React, { JSX } from 'react'
import { FaBell, FaComment, FaPowerOff, FaUser } from 'react-icons/fa'
const account: Account = {
    accountId: 0,
    email: 'abcef@gmail.com',
    password: '',
    createdDate: '',
    roleId: 0,
    status: false
}
export default function Profile() {
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
            <UserRender account={account} />
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

function UserRender({ account }: { account: Account }) {
    return (
        <div className='px-6 pt-10 pb-1'>
            <div className='flex'>
                <SafeImage src={'/Anh1.jpg'}
                    className='w-[25%] h-[25%] rounded-full aspect-square'
                    alt={'profile'}
                />
                <div className='ml-4 *:mb-2'>
                    <h4 className="text-2xl font-medium leading-none">Cá nhân</h4>
                    <p>{account.email}</p>
                </div>
            </div>
        </div>
    )
}