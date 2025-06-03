import { getBidsOfTourBid } from "@/app/api/bid.api"
import SafeImage from "@/components/safe-image"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"
import { formatNumber } from "@/types/other"
import { TourBid } from "@/types/tour-bid"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useState, useEffect, useContext } from "react"
import { FaMapMarkerAlt } from "react-icons/fa"
import InfiniteScroll from "react-infinite-scroll-component"
import DOMPurify from "dompurify";
import { CustomerSiteContext, CustomerSiteContextProp } from "../context"

export default function TourBidRender({ tourBid }: { tourBid: TourBid }) {
    const pageSize = 10
    const [page, setPage] = useState(1)
    const [bids, setBids] = useState<Bid[]>([])
    const isOnGoing = tourBid.status === 'Hoạt động' ? true : false
    const bidData = useQuery({
        queryKey: ['bids-of', tourBid.tourBidId, pageSize, page],
        queryFn: () => getBidsOfTourBid(tourBid.tourBidId, page, pageSize)
    })
    useEffect(() => {
        setBids([])
    }, [])
    useEffect(() => {
        if (bidData.data) {
            setBids(b => [...b, ...bidData.data.result])
        }
    }, [bidData.data])
    const { accId } = useContext(CustomerSiteContext) as CustomerSiteContextProp
    const totalPage = bidData.data?.totalPage ?? 0
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
                        className="w-[75px] rounded-full h-[75px]"
                        alt={"profile"}
                    />
                    <div className="lg:ml-4 mt-4 lg:mt-0 w-full ">
                        <h3 className="font-bold text-xl">
                            {tourBid.account?.customers?.[0]?.fullName}
                        </h3>
                        <p>{dayjs(tourBid.createdAt).format("DD/MM/YYYY")}</p>
                        <p className=""><FaMapMarkerAlt className="inline" />{tourBid.placeRequestedNavigation?.areaName}</p>
                    </div>
                </div>
                <div className="absolute right-0 top-0 lg:block text-end ">
                    <span className={
                        cn("p-1 rounded-sm font-semibold",
                            isOnGoing ? 'text-[#22dd22] bg-green-100' : 'text-[#ff0000] bg-red-100'
                        )}>
                        {tourBid.status}
                    </span>
                    {
                        tourBid.accountId === accId &&
                        <div className="flex flex-col *:mt-2 h-fit">
                            <button
                                type="submit"
                                className="p-2 text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Cập nhật
                            </button>
                            <button
                                type="submit"
                                className="p-2 text-white inline-flex items-center bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800"
                            >
                                Xóa
                            </button>
                        </div>
                    }
                </div>
            </div>
            <div
                className="my-5"
                dangerouslySetInnerHTML={{
                    __html: sanitizeContent(tourBid.content || ""),
                }}
            />
            <div className="border-2" />
            <div className="mt-5 w-full">
                <div className="font-semibold text-lg flex justify-between">
                    <span >Bảng đấu giá</span>
                    {tourBid.maxPrice && <span >Giá cao nhất: {formatNumber(tourBid.maxPrice)} VND</span>}
                </div>
                <div
                    id="scrollableDiv"
                    className="max-h-[500px] overflow-y-auto"
                    onScroll={(e) => {
                        const { scrollHeight, scrollTop, clientHeight } = e.currentTarget
                        if (scrollHeight - scrollTop === clientHeight && totalPage !== 0 && page < totalPage) {
                            setPage(p => Math.min(p + 1, totalPage))
                        }
                    }}
                >
                    <InfiniteScroll dataLength={bids.length}
                        next={() => {
                        }}
                        hasMore={page < totalPage} loader={<p>Loading...</p>}
                        scrollableTarget={'scrollableDiv'}
                    >
                        {
                            bids.map((v) => (
                                <div key={v.bidId} className="bg-[#F8FAFC] flex p-3 my-2 rounded-sm items-center justify-between">
                                    <div className="flex items-center">
                                        <SafeImage src={v.tourGuide?.image} alt="pfp" className="w-[75px] h-[75px] rounded-full" />
                                        <p className="ml-2 font-semibold">{v.tourGuide?.fullName}</p>

                                    </div>
                                    <p className="font-semibold text-blue-700">{formatNumber(v.amount)} VND</p>
                                </div>
                            ))
                        }
                    </InfiniteScroll>
                </div>
            </div>
        </div>
    );
}