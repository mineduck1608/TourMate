import SafeImage from "@/components/safe-image"
import { cn } from "@/lib/utils"
import { TourBid } from "@/types/tour-bid"
import dayjs from "dayjs"
import { useState } from "react"
import { FaMapMarkerAlt, FaRegCommentDots } from "react-icons/fa"
import DOMPurify from "dompurify";
import BidResultModal from "./bid-comment-modal"

export default function TourBidRender({ tourBid }: { tourBid: TourBid }) {
    const isOnGoing = tourBid.status === 'Hoạt động' ? true : false
    const [open, setOpen] = useState(false)
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
                        src={tourBid.account?.customers?.[0]?.image}
                        className="w-[65px] rounded-full h-[65px]"
                        alt={"profile"}
                    />
                    <div className="lg:ml-4 mt-4 lg:mt-0 w-full ">
                        <h3 className="font-bold text-xl">
                            {tourBid.account?.customers?.[0]?.fullName}
                        </h3>
                        <p className="lg:inline">{dayjs(tourBid.createdAt).format('DD [tháng] MM, YYYY')}&nbsp;</p>
                        <p className="lg:inline"><FaMapMarkerAlt className="inline" />{tourBid.placeRequestedNavigation?.areaName}</p>
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
            <div className="mt-2">
                <button onClick={() => setOpen(true)} className="">
                    <FaRegCommentDots className="inline" /> Bình luận
                </button>
            </div>
            <div className="border-2" />
            <div className="mt-5 w-full">
                <div className="font-semibold text-lg flex justify-between">
                    <span >Bảng đấu giá</span>
                    {
                        isOnGoing && <button
                            type="submit"
                            onClick={() => setOpen(true)}
                            className="text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:bg-gray-500"
                        >
                            Đấu giá
                        </button>
                    }
                </div>
            </div>
            <BidResultModal isOpen={open} onClose={() => setOpen(false)} tourBid={tourBid} />
        </div>
    );
}