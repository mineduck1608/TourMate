"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { MapPin, Calendar, Users, DollarSign, FileText, Phone, User, Info } from "lucide-react"
import type { Invoice } from "@/types/invoice"
import { fetchAreaIdAndName } from "@/app/api/active-area.api"
import type { AreaIdAndName } from "@/types/active-area"
import { useToken } from "@/components/getToken"
import type { MyJwtPayload } from "@/types/JwtPayload"
import { jwtDecode } from "jwt-decode"
import type { TourGuideIdAndName } from "@/types/tour-guide"
import { getTourGuideByAccountId } from "@/app/api/tour-guide.api"
import { getCustomerByPhone } from "@/app/api/customer.api"
import type { Customer } from "@/types/customer"
import { addInvoice } from "@/app/api/invoice.api"
import { useMutation } from "@tanstack/react-query"
import { toast } from "react-toastify"
import dynamic from "next/dynamic"
import MegaMenu from "@/components/mega-menu"
import Footer from "@/components/Footer"

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false })
import "react-quill-new/dist/quill.snow.css"

async function fetchAreas(): Promise<AreaIdAndName[]> {
    return fetchAreaIdAndName()
}

async function fetchUsersByPhone(phone: string) {
    return getCustomerByPhone(phone)
}

async function fetchTourGuide(id: number): Promise<TourGuideIdAndName> {
    return getTourGuideByAccountId(id)
}

export default function CreateTourPage() {
    const [areas, setAreas] = useState<AreaIdAndName[]>([])
    const [tourGuide, setTourGuide] = useState<TourGuideIdAndName>()
    const [userOptions, setUserOptions] = useState<Customer[]>([])
    const [userLoading, setUserLoading] = useState(false)
    const [showUserOptions, setShowUserOptions] = useState(false)
    const customerPhoneRef = useRef<HTMLInputElement>(null)
    const [userError, setUserError] = useState<string | null>(null)
    const [priceError, setPriceError] = useState<string | null>(null);


    const token = useToken("accessToken")
    const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
    const accountId = decoded?.AccountId

    const [formData, setFormData] = useState<Omit<Invoice, "invoiceId">>({
        startDate: "",
        endDate: "",
        tourGuideId: tourGuide?.tourGuideId ?? 0,
        peopleAmount: "",
        status: "Chờ xác nhận",
        price: 0,
        note: "",
        customerId: 0,
        areaId: 0,
        tourDesc: "",
        createdDate: new Date().toISOString(),
        customerPhone: "",
        tourName: "",
    })

    useEffect(() => {
        fetchAreas().then(setAreas)
        if (accountId) {
            fetchTourGuide(accountId).then(setTourGuide)
        }
    }, [accountId])

    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            tourGuideId: tourGuide?.tourGuideId ?? 0,
        }))
    }, [tourGuide])

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (formData.customerPhone.length >= 8) {
                setUserLoading(true)
                fetchUsersByPhone(formData.customerPhone)
                    .then((users) => {
                        const result = Array.isArray(users) ? users : users ? [users] : []
                        setUserOptions(result)
                        setUserLoading(false)
                        setShowUserOptions(true)
                        setUserError(result.length === 0 ? "Không tìm thấy khách hàng với số điện thoại này." : null)
                    })
                    .catch(() => {
                        setUserOptions([])
                        setUserLoading(false)
                        setShowUserOptions(false)
                        setUserError("Không tìm thấy khách hàng với số điện thoại này.")
                    })
            } else {
                setUserOptions([])
                setShowUserOptions(false)
                setUserError(null)
                setUserLoading(false)
            }
        }, 500)

        return () => clearTimeout(delayDebounce)
    }, [formData.customerPhone])

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (customerPhoneRef.current && !customerPhoneRef.current.contains(event.target as Node)) {
                setShowUserOptions(false)
            }
        }
        if (showUserOptions) {
            document.addEventListener("mousedown", handleClickOutside)
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside)
        }
    }, [showUserOptions])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        // Validate price ngay khi nhập
        if (name === "price") {
            if (Number(value) < 2000) {
                setPriceError("Giá tour phải lớn hơn hoặc bằng 2.000 VND");
            } else {
                setPriceError(null);
            }
        }
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            createdDate: new Date().toISOString(),
            ...(name === "customerPhone" ? { customerId: 0 } : {}),
        }));
        if (name === "customerPhone") setShowUserOptions(true);
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    const handleUserSelect = (userId: number, phone: string) => {
        setFormData((prev) => ({
            ...prev,
            customerId: userId,
            customerPhone: phone,
        }))
        setShowUserOptions(false)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        const submitData = { ...formData, createdDate: new Date().toISOString(), invoiceId: 0 }
        addInvoiceMutation.mutate(submitData)
        console.log("Submitted data:", submitData)
        setFormData({
            startDate: "",
            endDate: "",
            tourGuideId: tourGuide?.tourGuideId ?? 0,
            peopleAmount: "",
            status: "Chờ xác nhận",
            price: 0,
            note: "",
            customerId: 0,
            areaId: 0,
            tourDesc: "",
            createdDate: new Date().toISOString(),
            customerPhone: "",
            tourName: "",
        })
        setUserOptions([])
        setShowUserOptions(false)
    }

    const addInvoiceMutation = useMutation({
        mutationFn: addInvoice,
        onSuccess: () => {
            toast.success("Tạo tour thành công.")
        },
        onError: (error) => {
            toast.error(
                (error as { response?: { data?: { msg?: string } } })?.response?.data?.msg ||
                "Tạo tour thất bại, vui lòng thử lại sau!",
            )
        },
    })

    return (
        <>
            <MegaMenu />
            <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
                <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="">
                        <div className="flex items-center space-x-4 mb-8">
                            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-teal-400 to-teal-600 flex items-center justify-center shadow-lg">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Tạo Lịch Tour Mới</h1>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <Card className="lg:col-span-2 border-none shadow-xl bg-white overflow-hidden">
                                <CardContent className="p-6">
                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-5 w-5 text-teal-600" />
                                                <h2 className="text-xl font-semibold text-slate-800">Thông tin cơ bản</h2>
                                            </div>
                                            <Separator className="bg-slate-200" />

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="tourName" className="text-slate-700">
                                                        Tên Tour <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="tourName"
                                                        name="tourName"
                                                        value={formData.tourName}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Nhập tên tour"
                                                        className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                    />
                                                </div>

                                                <div className="space-y-2 relative" ref={customerPhoneRef}>
                                                    <Label htmlFor="customerPhone" className="text-slate-700">
                                                        Số điện thoại khách hàng <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <Input
                                                        id="customerPhone"
                                                        type="tel"
                                                        pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                                                        name="customerPhone"
                                                        value={formData.customerPhone}
                                                        onChange={handleChange}
                                                        placeholder="Nhập số điện thoại"
                                                        required
                                                        autoComplete="off"
                                                        className="border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                        onFocus={() => {
                                                            if (userOptions.length > 0) setShowUserOptions(true)
                                                        }}
                                                    />
                                                    {userLoading && <div className="text-xs text-teal-600 mt-1">Đang tìm kiếm...</div>}
                                                    {userError && !userLoading && <div className="text-xs text-rose-500 mt-1">{userError}</div>}
                                                    {showUserOptions && userOptions.length > 0 && (
                                                        <div className="absolute left-0 right-0 mt-1 bg-white border border-slate-200 rounded-md shadow-lg z-30 max-h-48 overflow-y-auto">
                                                            {userOptions.map((user) => (
                                                                <div
                                                                    key={user.customerId}
                                                                    className={`px-4 py-2 cursor-pointer hover:bg-slate-50 transition-colors ${formData.customerId === user.customerId ? "bg-slate-100 font-medium" : ""
                                                                        }`}
                                                                    onClick={() => handleUserSelect(user.customerId, user.phone)}
                                                                >
                                                                    <div className="font-medium">{user.fullName}</div>
                                                                    <div className="text-sm text-slate-500">{user.phone}</div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="startDate" className="text-slate-700">
                                                        Ngày bắt đầu <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Calendar className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                                                        <Input
                                                            id="startDate"
                                                            type="datetime-local"
                                                            name="startDate"
                                                            value={formData.startDate}
                                                            onChange={handleChange}
                                                            required
                                                            className="pl-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="endDate" className="text-slate-700">
                                                        Ngày kết thúc <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Calendar className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                                                        <Input
                                                            id="endDate"
                                                            type="datetime-local"
                                                            name="endDate"
                                                            value={formData.endDate}
                                                            onChange={handleChange}
                                                            required
                                                            className="pl-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="peopleAmount" className="text-slate-700">
                                                        Số lượng người <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <Users className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                                                        <Input
                                                            id="peopleAmount"
                                                            type="text"
                                                            name="peopleAmount"
                                                            value={formData.peopleAmount}
                                                            onChange={handleChange}
                                                            min={1}
                                                            required
                                                            placeholder="Nhập số lượng khách"
                                                            className="pl-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="price" className="text-slate-700">
                                                        Giá tour (VND) <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <div className="relative">
                                                        <DollarSign className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                                                        <Input
                                                            id="price"
                                                            type="number"
                                                            name="price"
                                                            value={formData.price}
                                                            onChange={handleChange}
                                                            min={0}
                                                            required
                                                            placeholder="Nhập giá tour"
                                                            className="pl-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                    {priceError && (
                                                        <div className="text-xs text-rose-500 mt-1">{priceError}</div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <Label htmlFor="areaId" className="text-slate-700">
                                                        Khu vực <span className="text-rose-500">*</span>
                                                    </Label>
                                                    <Select
                                                        name="areaId"
                                                        value={formData.areaId.toString()}
                                                        onValueChange={(value) => handleSelectChange("areaId", value)}
                                                    >
                                                        <SelectTrigger className="border-slate-300 focus:ring-teal-500 w-full">
                                                            <SelectValue placeholder="Chọn khu vực" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {areas.map((area) => (
                                                                <SelectItem key={area.areaId} value={area.areaId.toString()}>
                                                                    {area.areaName}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                </div>

                                                <div className="space-y-2">
                                                    <Label htmlFor="note" className="text-slate-700">
                                                        Ghi chú
                                                    </Label>
                                                    <div className="relative">
                                                        <Info className="h-4 w-4 absolute left-3 top-3 text-slate-500" />
                                                        <Input
                                                            id="note"
                                                            type="text"
                                                            name="note"
                                                            value={formData.note}
                                                            onChange={handleChange}
                                                            placeholder="Ghi chú thêm"
                                                            className="pl-10 border-slate-300 focus:border-teal-500 focus:ring-teal-500"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-6">
                                            <div className="flex items-center space-x-2">
                                                <FileText className="h-5 w-5 text-teal-600" />
                                                <h2 className="text-xl font-semibold text-slate-800">Mô tả Tour</h2>
                                            </div>
                                            <Separator className="bg-slate-200" />

                                            <div>
                                                <Label htmlFor="tourDesc" className="text-slate-700 mb-2 block">
                                                    Chi tiết <span className="text-rose-500">*</span>
                                                </Label>
                                                <div className="rounded-md border border-slate-300 overflow-hidden">
                                                    <ReactQuill
                                                        theme="snow"
                                                        value={formData.tourDesc}
                                                        onChange={(value) =>
                                                            setFormData((prev) => ({
                                                                ...prev,
                                                                tourDesc: value,
                                                                createdDate: new Date().toISOString(),
                                                            }))
                                                        }
                                                        placeholder="Mô tả chi tiết về tour"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex justify-end space-x-4 pt-4">
                                            <Button
                                                type="reset"
                                                variant="outline"
                                                className="border-slate-300 text-slate-700 hover:bg-slate-50"
                                                onClick={() =>
                                                    setFormData({
                                                        startDate: "",
                                                        endDate: "",
                                                        tourGuideId: tourGuide?.tourGuideId ?? 0,
                                                        peopleAmount: "",
                                                        status: "Chờ xác nhận",
                                                        price: 0,
                                                        note: "",
                                                        customerId: 0,
                                                        areaId: 0,
                                                        tourDesc: "",
                                                        createdDate: new Date().toISOString(),
                                                        customerPhone: "",
                                                        tourName: "",
                                                    })
                                                }
                                            >
                                                Hủy
                                            </Button>
                                            <Button
                                                type="submit"
                                                className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white"
                                            >
                                                Tạo lịch
                                            </Button>
                                        </div>
                                    </form>
                                </CardContent>
                            </Card>

                            <Card className="border-none shadow-xl bg-gradient-to-b from-slate-50 to-white h-fit">
                                <CardContent className="p-6">
                                    <div className="flex items-center space-x-2 mb-6">
                                        <div className="h-8 w-8 rounded-full bg-teal-100 flex items-center justify-center">
                                            <FileText className="h-4 w-4 text-teal-600" />
                                        </div>
                                        <h2 className="text-xl font-semibold text-slate-800">Xác nhận thông tin</h2>
                                    </div>

                                    <div className="space-y-6">
                                        <div className="space-y-3">
                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <FileText className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Tên Tour</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {formData.tourName || <span className="text-slate-400 italic">Chưa nhập</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <User className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Khách hàng</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {userOptions.find((u) => u.customerId == formData.customerId)?.fullName || (
                                                            <span className="text-slate-400 italic">Chưa chọn</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <Calendar className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Ngày bắt đầu</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {formData.startDate ? (
                                                            (() => {
                                                                const d = new Date(formData.startDate)
                                                                return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour12: false })}`
                                                            })()
                                                        ) : (
                                                            <span className="text-slate-400 italic">Chưa nhập</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <Calendar className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Ngày kết thúc</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {formData.endDate ? (
                                                            (() => {
                                                                const d = new Date(formData.endDate)
                                                                return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour12: false })}`
                                                            })()
                                                        ) : (
                                                            <span className="text-slate-400 italic">Chưa nhập</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <User className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Tour Guide</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {tourGuide?.fullName || <span className="text-slate-400 italic">Chưa có</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <Phone className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">SĐT khách hàng</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {formData.customerPhone || <span className="text-slate-400 italic">Chưa nhập</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <Users className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Số lượng người</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {formData.peopleAmount || <span className="text-slate-400 italic">Chưa nhập</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <DollarSign className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Giá tour</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {formData.price ? (
                                                            new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                                                                Number(formData.price),
                                                            )
                                                        ) : (
                                                            <span className="text-slate-400 italic">Chưa nhập</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-center">
                                                <div className="w-8 flex-shrink-0">
                                                    <MapPin className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Khu vực</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all">
                                                        {areas.find((a) => a.areaId == formData.areaId)?.areaName || (
                                                            <span className="text-slate-400 italic">Chưa chọn</span>
                                                        )}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start">
                                                <div className="w-8 flex-shrink-0 pt-1">
                                                    <Info className="h-4 w-4 text-teal-600" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium text-slate-500">Ghi chú</p>
                                                    <p className="text-slate-800 font-medium break-words whitespace-pre-line break-all break-all">
                                                        {formData.note || <span className="text-slate-400 italic">Chưa nhập</span>}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="pt-2">
                                                <p className="text-sm font-medium text-slate-500 mb-2">Mô tả Tour</p>
                                                <div
                                                    className="prose break-words whitespace-pre-line break-all prose-sm max-w-none text-slate-800 bg-white p-3 rounded-md border border-slate-200"
                                                    dangerouslySetInnerHTML={{
                                                        __html: formData.tourDesc || '<span class="text-slate-400 italic">Chưa nhập</span>',
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    )
}
