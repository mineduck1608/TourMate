import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

export default function NewsCategories() {
    const tags = [
        'Khám phá',
        'Tips',
        'Câu chuyện',
        'Điểm đến'
    ]
    return (
        <div className='rounded-md border shadow-lg'>
            <h4 className="px-6 py-3 text-3xl font-medium leading-none">Danh mục</h4>
            <ScrollArea className="h-44 px-3">
                <table>
                    <tbody>
                        {tags.map((tag) => (
                            <tr key={tag} className='*:px-3 *:p-1 hover:text-gray-600'>
                                <td>
                                    <FaArrowRight />
                                </td>
                                <td className='w-full'>
                                    <div className='py-1'>
                                        <Link href={'/news?category=' + tag} 
                                        className="text-md flex items-center "
                                        >
                                            {tag}
                                        </Link>
                                        <Separator />
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
