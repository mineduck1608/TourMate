import { ScrollArea } from '@/components/ui/scroll-area'
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
    const tags: { icon: JSX.Element, title: string }[] = [
        {
            icon: <FaUser />,
            title: 'Tìm Tour guide'
        },
        {
            icon: <FaComment />,
            title: 'Diễn đàn'
        },
        {
            icon: <FaBell />,
            title: 'Thông báo'
        },
        {
            icon: <FaComment />,
            title: 'Tin nhắn'
        },
        {
            icon: <FaPowerOff />,
            title: 'Lịch sử giao dịch'
        },
    ]
    return (
        <div className='rounded-md border shadow-lg'>
            <UserRender account={account} />
            <ScrollArea className="px-3 pb-10">
                <table>
                    <tbody>
                        {tags.map((tag) => (
                            <tr key={tag.title} className='*:px-3 *:p-1 hover:bg-gray-200 hover:font-semibold cursor-pointer transition-colors duration-200'>
                                <td>
                                    {tag.icon}
                                </td>
                                <td className='w-full'>
                                    <div className='py-1'>
                                        <Link href={'/news?category=' + tag}
                                            className="text-md flex items-center "
                                        >
                                            {tag.title}
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </ScrollArea>
        </div>
    )
}

function UserRender({ account }: { account: Account }) {
    return (
        <div className='px-6 pt-10 pb-1'>
            <div className='flex'>
                <img src={'/Anh1.jpg'}
                    className='w-[25%] rounded-full aspect-square'
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