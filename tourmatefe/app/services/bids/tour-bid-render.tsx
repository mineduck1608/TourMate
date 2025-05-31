import { getBidsOfTourBid } from "@/app/api/bid.api"
import SafeImage from "@/components/safe-image"
import { cn } from "@/lib/utils"
import { Bid } from "@/types/bid"
import { formatNumber } from "@/types/other"
import { TourBid } from "@/types/tour-bid"
import { useQuery } from "@tanstack/react-query"
import dayjs from "dayjs"
import { useState, useEffect } from "react"
import { FaMapMarkerAlt } from "react-icons/fa"
import InfiniteScroll from "react-infinite-scroll-component"

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
    const totalPage = bidData.data?.totalPage ?? 0
    return (
        <div className="shadow-lg p-5 rounded-lg">
            <div className="grid grid-cols-2">
                <div className="flex">
                    <SafeImage
                        src={tourBid.account?.customers?.[0]?.image}
                        className="w-[75px] rounded-full h-[75px]"
                        alt={"profile"}
                    />
                    <div className="ml-4 w-full">
                        <h3 className="font-bold text-xl">
                            {tourBid.account?.customers?.[0]?.fullName}
                        </h3>
                        <p>{dayjs(tourBid.createdAt).format("DD/MM/YYYY")}</p>
                        <p className=""><FaMapMarkerAlt className="inline" />{tourBid.placeRequestedNavigation?.areaName}</p>
                    </div>
                </div>
                <div className="text-end">
                    <span className={
                        cn("p-1 rounded-sm font-semibold",
                            isOnGoing ? 'text-[#22dd22] bg-green-100' : 'text-[#ff0000] bg-red-100'
                        )}>
                        {tourBid.status}
                    </span>
                </div>
            </div>
            <div className="my-5">{tourBid.content}</div>
            <div className="border-2" />
            <div className="mt-5">
                <h3 className="font-semibold text-lg">Bảng đấu giá</h3>
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
                            console.log('MORE');

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