import { getTourBids } from "@/app/api/tour-bid.api";
import { useQueryString } from "@/app/utils/utils";
import { TourBid } from "@/types/tour-bid";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef, useState } from "react";
import TourBidRender from "./tour-bid-render";

function BidList({ signal, turnOff }: { signal: boolean, turnOff: () => void }) {
  const divRef = useRef<HTMLDivElement>(null);
  const pageSize = 5;
  const queryString: { areaId?: string } = useQueryString();
  const [page, setPage] = useState(1);
  const [tourBids, setTourBids] = useState<TourBid[]>([])
  const tourBidQuery = useQuery({
    queryKey: ["tour-bids", pageSize, page, queryString.areaId],
    queryFn: () => getTourBids(page, pageSize, undefined, queryString.areaId),
    staleTime: 24 * 3600 * 1000,
  });
  const maxPage = tourBidQuery.data?.totalPage ?? 0;
  useEffect(() => {
    setTourBids([])
  }, [queryString.areaId])
  useEffect(() => {
    if (tourBidQuery.data) {
      setTourBids(b => [...b, ...tourBidQuery.data.result])
    }
  }, [tourBidQuery.data])
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && maxPage !== 0 && page < maxPage) {
        setPage(p => Math.min(p + 1, maxPage))
      }
    }, { threshold: 1 });

    if (divRef.current) {
      observer.observe(divRef.current);
    }
    return () => observer.disconnect();
  }, [maxPage]);
  useEffect(() => {
    if(signal){
      console.log('On');      
    }
    turnOff()
  }, [signal])
  return (
    <div>
      <div className="*:my-5">
        {tourBids.map((v, i) => (
          <TourBidRender tourBid={v} key={i} />
        ))}
      </div>
      <div ref={divRef} style={{ visibility: 'hidden' }}>
        Hidden content
      </div>
    </div>
  );
}

export default BidList;
