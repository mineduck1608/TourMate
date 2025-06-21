import SafeImage from "@/components/safe-image"
import { cn } from "@/lib/utils"
import { TourBidListResult } from "@/types/tour-bid"
import dayjs from "dayjs"
import { useContext, useState } from "react"
import { FaHeart, FaMapMarkerAlt, FaRegCommentDots } from "react-icons/fa"
import DOMPurify from "dompurify";
import BidListModal from "./bid-list-modal"
import { BidTaskContext, BidTaskContextProp } from "./tour-bid-task-context"
import { TourGuideSiteContext, TourGuideSiteContextProps } from "../context"
import { formatNumber } from "@/types/other"
import BidCommentModal from "./bid-comment-modal"
import Link from "next/link"
export default function TourBidRender({ tourBid, onCreateOrDelete }: { tourBid: TourBidListResult, onCreateOrDelete: (id: number, state: boolean) => void }) {
    const isOnGoing = tourBid.status === 'Hoạt động' ? true : false
    const [open, setOpen] = useState({
        bid: false,
        comment: false
    })
    const { setTarget, signal, setSignal } = useContext(BidTaskContext) as BidTaskContextProp
    const { accId } = useContext(TourGuideSiteContext) as TourGuideSiteContextProps
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
        <div className="shadow-lg p-5 rounded-lg">
            <div className="relative lg:flex grid-cols-2">
                <div className="lg:flex w-full">                    
                    <SafeImage
                        src={tourBid.customerImg}
                        className="w-[75px] rounded-full h-[75px]"
                        alt={"profile"}
                    />
                    <div className="lg:ml-4 mt-4 lg:mt-0 w-full ">
                        <h3>
                            <span className="font-bold text-xl">{tourBid.customerName}</span>
                            {tourBid.accountId === accId && <span>&nbsp;(Bạn)</span>}
                        </h3>
                        <p className="lg:inline">{dayjs(tourBid.createdAt).format('DD [tháng] MM, YYYY')}&nbsp;</p>
                        <Link href={'/services/active-area/detail?id=' + tourBid.placeRequested} className="lg:inline lg:ml-2"><FaMapMarkerAlt className="inline" />{tourBid.placeRequestedName}</Link>
                        {
                            tourBid.maxPrice && <p>Giá mong đợi: {formatNumber(tourBid.maxPrice)} VND</p>
                        }
                    </div>
                </div>
                <div className="absolute right-0 top-0 lg:block text-end ">
                    <span className={
                        cn("p-1 rounded-sm font-semibold",
                            isOnGoing ? 'text-[#22dd22] bg-green-100' : 'text-[#ff0000] bg-red-100'
                        )}>
                        {tourBid.status}
                    </span>
                </div>
            </div>
            <div
                className="my-5"
                dangerouslySetInnerHTML={{
                    __html: sanitizeContent(tourBid.content || ""),
                }}
            />
            <div className="flex *:mr-4">
                <div className="flex *:mr-1">
                    <button onClick={() => {
                        setTarget(tourBid)
                        setSignal({ ...signal, likeOrUnlike: true })
                    }}>
                        <FaHeart className={cn("hover:fill-red-500", tourBid.isLiked ? 'fill-[#ff0000]' : ' fill-[#888888]')} />
                    </button>
                    <p>{tourBid.likeCount}</p>
                </div>
                <button className="cursor-pointer" onClick={() => { setOpen(p => ({ ...p, comment: true })) }}>
                    <FaRegCommentDots className="inline" /> Bình luận
                </button>
            </div>
            <div className="border-2" />
            <div className="mt-5 w-full">
                <div className="font-semibold text-lg flex justify-between">
                    <span >Bảng đấu giá</span>
                    {/* {tourBid.maxPrice && <span >Giá mong đợi: {formatNumber(tourBid.maxPrice)} VND</span>} */}
                    <button
                        onClick={() => setOpen(p => ({ ...p, bid: true }))}
                        className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                    >
                        Xem
                    </button>
                </div>

                {open.bid && <BidListModal isOpen onClose={() => setOpen(p => ({ ...p, bid: false }))} tourBid={tourBid} onCreateOrDelete={onCreateOrDelete} />}
                {open.comment && <BidCommentModal isOpen onClose={() => setOpen(p => ({ ...p, comment: false }))} tourBidId={tourBid.tourBidId} />}
            </div>
        </div>
    );
}