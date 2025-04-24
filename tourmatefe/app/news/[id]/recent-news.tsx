import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import React from 'react'

export default function RecentNews() {
    const tags = Array.from({ length: 50 }).map(
        (_, i) => `Khám phá địa điểm đặc sắc tại Hải Phòng ${i}`
    )
    return (
        <div>
            <ScrollArea className="h-80 rounded-md border shadow-md">
                <div className="p-4">
                    <h4 className="mb-4 text-3xl font-medium leading-none">Bài viết gần đây</h4>
                    {tags.map((tag) => (
                        <div key={tag}>
                            <div className="text-md">
                                {tag}
                            </div>
                            <Separator className="my-2" />
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
