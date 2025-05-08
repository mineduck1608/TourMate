import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import React from 'react'
import { FaArrowRight } from 'react-icons/fa'

export default function NewsCategories() {
    const tags = Array.from({ length: 6 }).map(
        (_, i) => `Khám phá địa điểm đặc sắc tại Hải Phòng ${i}`
    )
    return (
        <div>
            <ScrollArea className="h-52 rounded-md border shadow-md">
                <div className="p-4">
                    <h4 className="mb-4 text-3xl font-medium leading-none">Danh mục</h4>
                    <table>
                        <tbody>
                            {tags.map((tag) => (
                                <tr key={tag} className='*:p-1'>
                                    <td>
                                        <FaArrowRight />
                                    </td>
                                    <td className='w-full'>
                                        <div className='py-1'>
                                            <Link href={'#'} className="text-md flex items-center">
                                                {tag}
                                            </Link>
                                            <Separator />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </ScrollArea>
        </div>
    )
}
