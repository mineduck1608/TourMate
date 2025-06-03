"use client";

import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { FaMapMarkedAlt } from "react-icons/fa";
import type { Invoice } from "@/types/invoice";
import { fetchAreaIdAndName } from "@/app/api/active-area.api";
import { AreaIdAndName } from "@/types/active-area";
import { useToken } from "@/components/getToken";
import { MyJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { TourGuideIdAndName } from "@/types/tour-guide";
import { getTourGuideByAccountId } from "@/app/api/tour-guide.api";
import { getCustomerByPhone } from "@/app/api/customer.api";
import { Customer } from "@/types/customer";
import { addInvoice } from "@/app/api/invoice.api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });
import "react-quill-new/dist/quill.snow.css";
//import { ApiResponse } from "@/types/message";


async function fetchAreas(): Promise<AreaIdAndName[]> {
    return fetchAreaIdAndName();
}
async function fetchUsersByPhone(phone: string) {
    return getCustomerByPhone(phone)
}

async function fetchTourGuide(id: number): Promise<TourGuideIdAndName> {
    return getTourGuideByAccountId(id);
}

export default function CreateTourPage() {
    const [areas, setAreas] = useState<AreaIdAndName[]>([]);
    const [tourGuide, setTourGuide] = useState<TourGuideIdAndName>();
    const [userOptions, setUserOptions] = useState<Customer[]>([]);
    const [userLoading, setUserLoading] = useState(false);
    const [showUserOptions, setShowUserOptions] = useState(false);
    const customerPhoneRef = useRef<HTMLInputElement>(null);
    const [userError, setUserError] = useState<string | null>(null);

    const token = useToken("accessToken");
    const decoded: MyJwtPayload | null = token
        ? jwtDecode<MyJwtPayload>(token.toString())
        : null;
    const accountId = decoded?.AccountId;

    const [formData, setFormData] = useState<Omit<Invoice, "invoiceId">>({
        startDate: "",
        endDate: "",
        tourGuideId: tourGuide?.tourGuideId ?? 0,
        peopleAmount: "",
        status: "Chưa thanh toán",
        price: 0,
        note: "",
        customerId: 0,
        areaId: 0,
        tourDesc: "",
        createdDate: new Date().toISOString(),
        customerPhone: "",
    });

    useEffect(() => {
        fetchAreas().then(setAreas);
        if (accountId) {
            fetchTourGuide(accountId).then(setTourGuide);
        }
    }, [accountId]);

    // Cập nhật tourGuideId trong formData khi tourGuide thay đổi
    useEffect(() => {
        setFormData((prev) => ({
            ...prev,
            tourGuideId: tourGuide?.tourGuideId ?? 0,
        }));
    }, [tourGuide]);

    // Fetch user khi nhập số điện thoại
    // ...existing code...
    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (formData.customerPhone.length >= 8) {
                setUserLoading(true);
                fetchUsersByPhone(formData.customerPhone)
                    .then((users) => {
                        const result = Array.isArray(users) ? users : users ? [users] : [];
                        setUserOptions(result);
                        setUserLoading(false);
                        setShowUserOptions(true);
                        setUserError(result.length === 0 ? "Không tìm thấy khách hàng với số điện thoại này." : null);
                    })
                    .catch(() => {
                        setUserOptions([]);
                        setUserLoading(false);
                        setShowUserOptions(false);
                        setUserError("Không tìm thấy khách hàng với số điện thoại này.");
                    });
            } else {
                setUserOptions([]);
                setShowUserOptions(false);
                setUserError(null);
                setUserLoading(false);
            }
        }, 500); // debounce 500ms

        return () => clearTimeout(delayDebounce);
    }, [formData.customerPhone]);
    // ...existing code...


    // Đóng dropdown khi click ra ngoài
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (
                customerPhoneRef.current &&
                !customerPhoneRef.current.contains(event.target as Node)
            ) {
                setShowUserOptions(false);
            }
        }
        if (showUserOptions) {
            document.addEventListener("mousedown", handleClickOutside);
        }
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [showUserOptions]);

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
            createdDate: new Date().toISOString(),
            ...(name === "customerPhone" ? { customerId: 0 } : {}),
        }));
        if (name === "customerPhone") setShowUserOptions(true);
    };

    const handleUserSelect = (userId: number, phone: string) => {
        setFormData((prev) => ({
            ...prev,
            customerId: userId,
            customerPhone: phone,
        }));
        setShowUserOptions(false);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const submitData = { ...formData, createdDate: new Date().toISOString(), invoiceId: 0 };
        addInvoiceMutation.mutate(submitData);
        console.log("Submitted data:", submitData);
        setFormData({
            startDate: "",
            endDate: "",
            tourGuideId: tourGuide?.tourGuideId ?? 0,
            peopleAmount: "",
            status: "Chưa thanh toán",
            price: 0,
            note: "",
            customerId: 0,
            areaId: 0,
            tourDesc: "",
            createdDate: new Date().toISOString(),
            customerPhone: "",
        });
        setUserOptions([]);
        setShowUserOptions(false);
    };

    const addInvoiceMutation = useMutation({
        mutationFn: addInvoice,
        onSuccess: () => {
            toast.success('Tạo tour thành công.');
        },
        onError: (error) => {
            toast.error(
                (error as { response?: { data?: { msg?: string } } })?.response?.data
                    ?.msg || "Tạo tour thất bại, vui lòng thử lại sau!"
            );
        },
    });


    return (
        <section className="relative min-h-screen py-16 px-4 md:px-8 lg:px-16 bg-gray-100 overflow-hidden">
            <div className="relative z-20 w-full mx-auto rounded-3xl shadow-2xl p-4 md:p-10 border border-blue-200 bg-white">
                <div className="flex items-center gap-4 mb-10">
                    <FaMapMarkedAlt className=" text-5xl p-2 rounded-full border-2 border-blue-300 shadow bg-white" />
                    <h1 className="text-3xl md:text-4xl font-bold text-blue-700">Tạo Lịch Tour Mới</h1>
                </div>
                <form onSubmit={handleSubmit} className="grid gap-10 md:gap-14 lg:grid-cols-4">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Ngày bắt đầu <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startDate"
                                    value={formData.startDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border  rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Ngày kết thúc <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endDate"
                                    value={formData.endDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full border  rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
                            <div ref={customerPhoneRef} className="relative">
                                <label className="block text-sm font-medium text-black mb-1">
                                    Số điện thoại khách hàng <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="tel"
                                    pattern="[0-9]{3}[0-9]{3}[0-9]{4}"
                                    name="customerPhone"
                                    value={formData.customerPhone}
                                    onChange={handleChange}
                                    placeholder="Nhập số điện thoại"
                                    required
                                    autoComplete="off"
                                    className="w-full border  rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                    onFocus={() => {
                                        if (userOptions.length > 0) setShowUserOptions(true);
                                    }}
                                />
                                {userLoading && <div className="text-xs text-blue-500 mt-1">Đang tìm kiếm...</div>}
                                {userError && !userLoading && (
                                    <div className="text-xs text-red-500 mt-1">{userError}</div>
                                )}
                                {showUserOptions && userOptions.length > 0 && (
                                    <div className="absolute left-0 right-0 mt-2 bg-white border border-blue-200 rounded shadow z-30">
                                        {userOptions.map((user) => (
                                            <div
                                                key={user.customerId}
                                                className={`px-3 py-2 cursor-pointer hover:bg-blue-100 ${formData.customerId === user.customerId ? "bg-blue-50 font-bold" : ""}`}
                                                onClick={() => handleUserSelect(user.customerId, user.phone)}
                                            >
                                                {user.fullName} ({user.phone})
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Số lượng người <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="peopleAmount"
                                    value={formData.peopleAmount}
                                    onChange={handleChange}
                                    min={1}
                                    required
                                    placeholder="Nhập số lượng khách"
                                    className="w-full border  rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Giá tour (VND) <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    min={0}
                                    required
                                    placeholder="Nhập giá tour"
                                    className="w-full border  rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-black mb-1">
                                    Khu vực <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="areaId"
                                    value={formData.areaId}
                                    onChange={handleChange}
                                    required
                                    className="w-full border rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                                >
                                    <option value="">Chọn khu vực</option>
                                    {areas.map((area) => (
                                        <option key={area.areaId} value={area.areaId}>
                                            {area.areaName}
                                        </option>
                                    ))}
                                </select>
                            </div>

                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">
                                Mô tả Tour <span className="text-red-500">*</span>
                            </label>
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
                                className="min-h-[120px]"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-black mb-1">Ghi chú</label>
                            <textarea
                                name="note"
                                value={formData.note}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Ghi chú thêm"
                                className="w-full border  rounded-lg px-3 py-2 bg-white focus:ring-2 focus:ring-blue-400 focus:outline-none"
                            />
                        </div>

                        <div className="flex justify-end gap-4">
                            <Button
                                type="reset"
                                variant="outline"
                                className="border-blue-400 text-black hover:bg-blue-50"
                                onClick={() =>
                                    setFormData({
                                        startDate: "",
                                        endDate: "",
                                        tourGuideId: tourGuide?.tourGuideId ?? 0,
                                        peopleAmount: "",
                                        status: "Pending",
                                        price: 0,
                                        note: "",
                                        customerId: 0,
                                        areaId: 0,
                                        tourDesc: "",
                                        createdDate: new Date().toISOString(),
                                        customerPhone: "",
                                    })
                                }
                            >
                                Hủy
                            </Button>
                            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white font-bold">
                                Tạo lịch
                            </Button>
                        </div>
                    </div>

                    <div className="lg:col-span-2 bg-gray-50 border border-gray-200 rounded-2xl p-8 shadow-inner flex flex-col justify-center">
                        <h2 className="text-2xl font-bold text-blue-700 mb-10 text-center tracking-wide uppercase">Xác nhận thông tin</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-10 text-blue-900 text-lg">
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Ngày bắt đầu:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.startDate
                                        ? (() => {
                                            const d = new Date(formData.startDate);
                                            return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour12: false })}`;
                                        })()
                                        : <em className="text-blue-300">Chưa nhập</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Ngày kết thúc:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.endDate
                                        ? (() => {
                                            const d = new Date(formData.endDate);
                                            return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour12: false })}`;
                                        })()
                                        : <em className="text-blue-300">Chưa nhập</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Tour Guide:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {tourGuide?.fullName}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Số lượng người:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.peopleAmount || <em className="text-blue-300">Chưa nhập</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Trạng thái:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.status}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Giá tour (VND):</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.price
                                        ? new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(Number(formData.price))
                                        : <em className="text-blue-300">Chưa nhập</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Khu vực:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {areas.find(a => a.areaId == formData.areaId)?.areaName || <em className="text-blue-300">Chưa chọn</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Khách hàng:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {userOptions.find(u => u.customerId == formData.customerId)?.fullName || <em className="text-blue-300">Chưa chọn</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">SĐT khách hàng:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.customerPhone || <em className="text-blue-300">Chưa nhập</em>}
                                </div>
                            </div>
                            <div className="flex items-center">
                                <div className="font-semibold text-black w-44">Ngày tạo:</div>
                                <div className="ml-2 text-blue-800 break-words">
                                    {formData.createdDate
                                        ? (() => {
                                            const d = new Date(formData.createdDate);
                                            return `${d.toLocaleDateString("vi-VN")} ${d.toLocaleTimeString("vi-VN", { hour12: false })}`;
                                        })()
                                        : ""}
                                </div>
                            </div>
                            <div className="md:col-span-2 mt-2">
                                <div className="font-semibold text-black mb-1">Mô tả Tour:</div>
                                <div
                                    className="ml-2 whitespace-pre-wrap break-words text-blue-800"
                                    dangerouslySetInnerHTML={{
                                        __html: formData.tourDesc || '<em class="text-blue-300">Chưa nhập</em>'
                                    }}
                                />
                            </div>
                            <div className="md:col-span-2">
                                <div className="font-semibold text-black mb-1">Ghi chú:</div>
                                <div className="ml-2 whitespace-pre-wrap break-words text-blue-800">
                                    {formData.note || <em className="text-blue-300">Chưa nhập</em>}
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </section>
    );
}