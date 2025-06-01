import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { TourGuide } from '@/types/tour-guide'
import { Label } from '@radix-ui/react-label'
import React from 'react'
import DOMPurify from "dompurify";

function Detail({ s }: { s: TourGuide }) {
    const sanitizeContent = (html: string) => {
        // Only sanitize if window is available (client-side)
        if (typeof window !== 'undefined') {
            const clean = DOMPurify.sanitize(html, {
                ADD_TAGS: ["iframe"], // Allow iframes if needed
                ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"], // Allow certain attributes
            });

            // Replace image URLs with img tags
            return clean.replace(
                /(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi,
                (match) => {
                    return `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain; margin-bottom: 10px;" />`;
                }
            );
        }
        return html; // Fallback for server-side rendering
    };
    return (
        <div className={cn("flex flex-col gap-6")}>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" type="text"
                        name="fullName"
                        value={s.fullName}
                        readOnly />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="phone">Số điện thoại</Label>
                    <div className="relative">
                        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                            <svg
                                className="w-4 h-4 text-muted-foreground"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="currentColor"
                                viewBox="0 0 19 18"
                            >
                                <path d="M18 13.446a3.02 3.02 0 0 0-.946-1.985l-1.4-1.4a3.054 3.054 0 0 0-4.218 0l-.7.7a.983.983 0 0 1-1.39 0l-2.1-2.1a.983.983 0 0 1 0-1.389l.7-.7a2.98 2.98 0 0 0 0-4.217l-1.4-1.4a2.824 2.824 0 0 0-4.218 0c-3.619 3.619-3 8.229 1.752 12.979C6.785 16.639 9.45 18 11.912 18a7.175 7.175 0 0 0 5.139-2.325A2.9 2.9 0 0 0 18 13.446Z" />
                            </svg>
                        </div>
                        <Input
                            id="phone"
                            type="tel"
                            className="ps-10"
                            name="phone"
                            pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                            required
                            value={s.phone}
                            readOnly
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                        id="address"
                        name="address"
                        type="text"
                        value={s.address}
                        readOnly
                    />
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <div className="grid gap-2">
                        <Label htmlFor="dateOfBirth">Ngày sinh</Label>
                        <div className="relative">
                            <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
                                <svg
                                    className="w-4 h-4 text-muted-foreground"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M20 4a2 2 0 0 0-2-2h-2V1a1 1 0 0 0-2 0v1h-3V1a1 1 0 0 0-2 0v1H6V1a1 1 0 0 0-2 0v1H2a2 2 0 0 0-2 2v2h20V4ZM0 18a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8H0v10Zm5-8h10a1 1 0 0 1 0 2H5a1 1 0 0 1 0-2Z" />
                                </svg>
                            </div>
                            <Input name="dateOfBirth" type="date" className="ps-10" required
                                value={s.dateOfBirth}
                                readOnly
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <Input
                            id="address"
                            name="address"
                            type="text"
                            value={s.gender}
                            readOnly
                        />
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="company">Công ty</Label>
                    <Input id="company" type="text"
                        name="company"
                        value={s.tourGuideDescs?.[0].company}
                        readOnly />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="yearOfExperience">Số năm kinh nghiệm</Label>
                    <Input id="yearOfExperience" type="number"
                        name="yearOfExperience"
                        value={s.tourGuideDescs?.[0].yearOfExperience}
                        readOnly
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="areaId">Khu vực hoạt động</Label>
                    <Input id="yearOfExperience" type="text"
                        name="yearOfExperience"
                        value={s.tourGuideDescs?.[0].area.areaName}
                        readOnly
                    />
                </div>
            </div>
            <div className="sm:col-span-2">
                <label
                    htmlFor="areaContent"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Mô tả
                </label>
                <div
                    className="my-5"
                    dangerouslySetInnerHTML={{
                        __html: sanitizeContent(s.tourGuideDescs?.[0].description || ""),
                    }}
                />
            </div>
            
        </div>
    )
}

export default Detail
