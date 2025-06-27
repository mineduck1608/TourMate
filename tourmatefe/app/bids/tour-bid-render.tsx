"use client"

import SafeImage from "@/components/safe-image"
import { cn } from "@/lib/utils"
import type { TourBidListResult } from "@/types/tour-bid"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { FaHeart, FaMapMarkerAlt, FaRegCommentDots } from "react-icons/fa"
import DOMPurify from "dompurify"
import BidListModal from "./bid-list-modal"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { BidTaskContext, type BidTaskContextProp } from "./tour-bid-task-context"
import { CustomerSiteContext, type CustomerSiteContextProp } from "../services/context"
import { formatNumber } from "@/types/other"
import BidCommentModal from "./bid-comment-modal"
import Link from "next/link"

export default function TourBidRender({ tourBid }: { tourBid: TourBidListResult }) {
    const isOnGoing = tourBid.status === "Hoạt động" ? true : false
    const [open, setOpen] = useState({ bid: false, comment: false })
    const { setModalOpen, modalOpen, setTarget, signal, setSignal } = useContext(BidTaskContext) as BidTaskContextProp
    const { accId } = useContext(CustomerSiteContext) as CustomerSiteContextProp

    const sanitizeContent = (html: string) => {
        if (typeof window !== "undefined") {
            const clean = DOMPurify.sanitize(html, {
                ADD_TAGS: ["iframe"],
                ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
            })

            return clean.replace(/(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi, (match) => {
                return `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain; margin-bottom: 10px;" />`
            })
        }
        return html
    }

    return (
        <div className="shadow-lg p-4 md:p-5 rounded-lg bg-white">
            <div className="relative">
                <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                    <div className="flex-shrink-0">
                        <SafeImage
                            src={tourBid.customerImg}
                            className="w-16 h-16 md:w-[75px] md:h-[75px] rounded-full object-cover aspect-square"
                            alt={"profile"}
                        />
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                            <div className="min-w-0">
                                <h3 className="text-lg md:text-xl font-bold break-words">
                                    {tourBid.customerName}
                                    {tourBid.accountId === accId && (
                                        <span className="text-sm font-normal text-gray-600">&nbsp;(Bạn)</span>
                                    )}
                                </h3>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 text-sm md:text-base text-gray-600">
                                    <p>{dayjs(tourBid.createdAt).format("DD [tháng] MM, YYYY")}</p>
                                    <Link
                                        href={"/services/active-area/detail?id=" + tourBid.placeRequested}
                                        className="flex items-center gap-1 text-blue-600 hover:text-blue-800 break-words"
                                    >
                                        <FaMapMarkerAlt className="flex-shrink-0" />
                                        <span className="break-words">{tourBid.placeRequestedName}</span>
                                    </Link>
                                </div>
                                {tourBid.maxPrice && (
                                    <p className="text-sm md:text-base text-gray-700 mt-1">
                                        Giá mong đợi: {formatNumber(tourBid.maxPrice)} VND
                                    </p>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                                <span
                                    className={cn(
                                        "px-2 py-1 rounded-sm font-semibold text-xs md:text-sm",
                                        isOnGoing ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100",
                                    )}
                                >
                                    {tourBid.status}
                                </span>

                                {tourBid.accountId === accId && (
                                    <DropdownMenu>
                                        <DropdownMenuTrigger asChild>
                                            <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors">
                                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                                </svg>
                                            </button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end" className="w-32">
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setTarget({ ...tourBid })
                                                    setModalOpen({ ...modalOpen, edit: true })
                                                }}
                                                className="cursor-pointer"
                                            >
                                                Cập nhật
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => {
                                                    setTarget({ ...tourBid })
                                                    setModalOpen({ ...modalOpen, delete: true })
                                                }}
                                                className="cursor-pointer text-red-600"
                                            >
                                                Xóa
                                            </DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div
                className="my-4 text-sm md:text-base prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                    __html: sanitizeContent(tourBid.content || ""),
                }}
            />

            <div className="flex flex-wrap items-center gap-4 text-sm md:text-base mb-4">
                <div className="flex items-center gap-2">
                    <button
                        onClick={() => {
                            setTarget(tourBid)
                            setSignal({ ...signal, likeOrUnlike: true })
                        }}
                        className="flex items-center gap-1 hover:bg-gray-100 p-1 rounded transition-colors"
                    >
                        <FaHeart
                            className={cn("text-lg", tourBid.isLiked ? "fill-red-500 text-red-500" : "fill-gray-400 text-gray-400")}
                        />
                        <span className="text-gray-700">{tourBid.likeCount}</span>
                    </button>
                </div>
                <button
                    className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 p-2 rounded transition-colors text-gray-700"
                    onClick={() => setOpen((p) => ({ ...p, comment: true }))}
                >
                    <FaRegCommentDots />
                    <span>Bình luận</span>
                </button>
            </div>

            <div className="border-t border-gray-200 mb-4" />

            <div className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <span className="font-semibold text-base md:text-lg">Bảng đấu giá</span>
                    <button
                        onClick={() => setOpen((p) => ({ ...p, bid: true }))}
                        className="w-full sm:w-auto text-white inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2.5 transition-colors"
                    >
                        Xem
                    </button>
                </div>

                <BidListModal isOpen={open.bid} onClose={() => setOpen((p) => ({ ...p, bid: false }))} tourBid={tourBid} />
                {open.comment && (
                    <BidCommentModal
                        isOpen
                        onClose={() => setOpen((p) => ({ ...p, comment: false }))}
                        tourBidId={tourBid.tourBidId}
                    />
                )}
            </div>
        </div>
    )
}
