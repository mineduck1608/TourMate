import TourBidList from "./tour-bid-list"
import type { TourGuide } from "@/types/tour-guide"

export default function TourBidPage({ search }: { tourGuide?: TourGuide; search: string }) {
  return (
    <div className="rounded-md border shadow-lg p-4 md:p-5 bg-white">
      <TourBidList search={search} />
    </div>
  )
}
