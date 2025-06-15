import React from "react";
import TourBidList from "./tour-bid-list";
import { TourGuide } from "@/types/tour-guide";

export default function TourBidPage({ search }: { tourGuide?: TourGuide, search: string }) {
  return (
    <div className="rounded-md border shadow-lg p-5">
      <TourBidList search={search} />
    </div>
  );
}