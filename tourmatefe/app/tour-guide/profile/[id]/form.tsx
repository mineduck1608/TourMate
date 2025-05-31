'use client'
import { getSimplifiedAreas } from "@/app/api/active-area.api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { TourGuide, TourGuideDesc } from "@/types/tour-guide";
import { useQuery } from "@tanstack/react-query";
import dynamic from "next/dynamic";
import { FormEvent, useState } from "react";
import "react-quill-new/dist/quill.snow.css";
const ReactQuill = dynamic(() => import("react-quill-new"), {
    ssr: false,  // Disable SSR for this component
});
/**
 * This is used so that tourGuideDesc is not undefined
 */
const dummyDesc: TourGuideDesc = {
    tourGuideDescId: 0,
    tourGuideId: 0,
    description: "",
    areaId: 0,
    company: "",
    area: {
        areaId: 0,
        areaName: "",
        areaTitle: "",
        areaSubtitle: "",
        areaContent: "",
        bannerImg: "",
        areaType: "",
        createdAt: ""
    }
}
export default function ProfileForm({ tourGuide, updateFn }: { tourGuide: TourGuide, updateFn: (tourGuide: TourGuide) => void }) {
    const [formData, setFormData] = useState(tourGuide)
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };
    function handleDescChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>, isNumber?: boolean) {
        const { name, value } = e.target
        const t = formData.tourGuideDescs?.[0] ?? dummyDesc
        const added = ({ ...t, [name]: isNumber ? Number(value) : value })
        setFormData((prev) => ({ ...prev, tourGuideDescs: [added] }))
    }
    const simplifiedAreaQuery = useQuery({
        queryKey: ['simplified-area'],
        queryFn: () => getSimplifiedAreas(),
        staleTime: 24 * 3600 * 1000
    })
    function submit(e: FormEvent) {
        e.preventDefault()
        updateFn(formData)
    }
    function handleEditorChange(value: string) {
        const t = formData.tourGuideDescs?.[0] ?? dummyDesc
        const added = ({ ...t, description: value })
        setFormData((prev) => ({ ...prev, tourGuideDescs: [added] }))
    }
    const simplifiedAreas = simplifiedAreaQuery.data?.data ?? []
    return (
        <form className={cn("flex flex-col gap-6")} onSubmit={(e) => submit(e)}>
            <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="fullName">Họ và tên</Label>
                    <Input id="fullName" type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={(e) => handleChange(e)}
                        required />
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
                            value={formData.phone}
                            onChange={(e) => handleChange(e)}
                        />
                    </div>
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="address">Địa chỉ</Label>
                    <Input
                        id="address"
                        name="address"
                        type="text"
                        value={formData.address}
                        onChange={(e) => handleChange(e)}
                        required
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
                                value={formData.dateOfBirth}
                                onChange={(e) => handleChange(e)}
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="gender">Giới tính</Label>
                        <select
                            id="gender"
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                            required
                            defaultValue={formData.gender}
                            onChange={(e) => handleChange(e)}
                        >
                            <option value="" disabled>
                                Chọn giới tính
                            </option>
                            <option value="Nam" >Nam</option>
                            <option value="Nữ">Nữ</option>
                        </select>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div className="grid gap-2">
                    <Label htmlFor="company">Công ty</Label>
                    <Input id="company" type="text"
                        name="company"
                        value={formData.tourGuideDescs?.[0].company}
                        onChange={(e) => handleDescChange(e)}
                        required />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="yearOfExperience">Số năm kinh nghiệm</Label>
                    <Input id="yearOfExperience" type="number"
                        name="yearOfExperience"
                        value={formData.tourGuideDescs?.[0].yearOfExperience}
                        onChange={(e) => handleDescChange(e, true)}
                    />
                </div>
                <div className="grid gap-2">
                    <Label htmlFor="areaId">Khu vực hoạt động</Label>
                    <select
                        id="areaId"
                        name="areaId"
                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                        required
                        onChange={(e) => handleDescChange(e, true)
                            
                        }
                        value={formData.tourGuideDescs?.[0].areaId}
                    >
                        <option value="" disabled>
                            Chọn khu vực
                        </option>
                        {
                            simplifiedAreas.map((v, i) =>
                                <option value={v.areaId} key={'area' + i}>{v.areaName}</option>
                            )
                        }
                    </select>
                </div>
            </div>
            <div className="sm:col-span-2">
                <label
                    htmlFor="areaContent"
                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                    Mô tả
                </label>
                <ReactQuill
                    value={formData.tourGuideDescs?.[0].description}
                    onChange={handleEditorChange}
                    theme="snow"
                    modules={{
                        toolbar: [
                            [{ header: "1" }, { header: "2" }, { header: "3" }, { font: [] }],
                            [{ list: "ordered" }, { list: "bullet" }],
                            ["bold", "italic", "underline"],
                            [{ align: [] }],
                        ],
                    }}
                    placeholder="Nhập nội dung tin tức..."
                />
            </div>
            <Button className='text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 md:px-5 md:py-2.5 focus:outline-none cursor-pointer'>
                Cập nhật thông tin
            </Button>
        </form>
    )
}