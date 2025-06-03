import { addTourBid, getTourBids } from "@/app/api/tour-bid.api";
import { useQueryString } from "@/app/utils/utils";
import { TourBid } from "@/types/tour-bid";
import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useContext, useEffect, useRef, useState } from "react";
import TourBidRender from "./tour-bid-render";
import { toast } from "react-toastify";
import { BidCreateContext, BidCreateContextProps } from "./bid-create-context";
import { baseData } from "./bids-page";

function BidList() {
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
  const context = useContext(BidCreateContext) as BidCreateContextProps

  const updateTourBidMutation = useMutation({
    mutationFn: async (data: TourBid) => {
      return await addTourBid(data)
    },
    onSuccess: () => {
      toast.success("Tạo thành công");
      tourBidQuery.refetch()
    },
    onError: (error) => {
      toast.error("Tạo thất bại");
      console.error(error);
    },
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
  
  //Trigger mutation, the source is from outside
  useEffect(() => {
    if (context.fireUpdate) {
      updateTourBidMutation.mutate(context.formData)
      context.setFireUpdate(false)
      context.setFormData(baseData)
      setTourBids([])
    }
  }, [context.fireUpdate])

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
