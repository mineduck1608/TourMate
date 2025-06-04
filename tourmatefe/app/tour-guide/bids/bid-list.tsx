import { getTourBids } from "@/app/api/tour-bid.api";
import { TourBid } from "@/types/tour-bid";
import { useQuery } from "@tanstack/react-query";
import React, {  useEffect, useRef, useState } from "react";
import TourBidRender from "./tour-bid-render";

function BidList({ search }: { search: string }) {
  // Refs and constants
  const divRef = useRef<HTMLDivElement>(null); // Reference to the intersection observer target
  const pageSize = 3; // Number of items per page
  // State management
  const [page, setPage] = useState(1); // Current page number
  const [tourBids, setTourBids] = useState<TourBid[]>([]); // List of loaded tour bids
  const [isResetting, setIsResetting] = useState(false); // Flag to track data reset operations

  // Data fetching with react-query
  const tourBidQuery = useQuery({
    queryKey: ["tour-bids", pageSize, page, search, isResetting],
    queryFn: async () => {
      // Fetch tour bids with current pagination and filters
      return await getTourBids(page, pageSize, undefined, search);
    },
    // Note: No staleTime to ensure fresh data after mutations
  });

  // Context for bid operations (create/edit)

  // Mutation for creating new tour bids

  // Calculate max pages from API response
  const maxPage = tourBidQuery.data?.totalPage ?? 0;

  // Effect: Reset data when area filter changes
  useEffect(() => {
    // When area changes, we need to completely reset the data
    setIsResetting(true);
    setPage(1); // Always start from page 1
    setTourBids([]); // Clear existing data
    // The query will automatically refetch because queryString.areaId changed
  }, [search]);

  // Effect: Handle incoming data from queries
  useEffect(() => {
    if (!tourBidQuery.data) return; // Ignore if no data

    if (page === 1 || isResetting) {
      // For first page or after reset, replace all data
      setTourBids(tourBidQuery.data.result);
      setIsResetting(false); // Reset complete
    } else {
      // For subsequent pages, merge new data while avoiding duplicates
      setTourBids(prev => {
        const existingIds = new Set(prev.map(b => b.tourBidId));
        const newItems = tourBidQuery.data.result.filter(b =>
          !existingIds.has(b.tourBidId)
        );
        return [...prev, ...newItems];
      });
    }
  }, [tourBidQuery.data]);

  // Effect: Intersection observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      // Only trigger when:
      // - Element is visible
      // - We know the max pages
      // - We're not on the last page
      // - We're not currently resetting data
      if (entry.isIntersecting && maxPage !== 0 && page < maxPage && !isResetting) {
        setPage(p => p + 1); // Load next page
      }
    }, { threshold: 1 }); // 100% visibility required

    const currentRef = divRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    // Cleanup: Remove observer when component unmounts
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [maxPage, isResetting]); // Recreate observer when these change


  // Render component
  return (
    <div>
      {/* List of tour bids */}
      <div className="*:my-5">
        {tourBids.map((v) => (
          // Use tourBidId as key for stable rendering
          <TourBidRender tourBid={v} key={v.tourBidId} />
        ))}
      </div>

      {/* Infinite scroll trigger - only visible when there are more pages */}
      {page < maxPage && !isResetting && (
        <div ref={divRef} style={{ visibility: 'hidden' }}>
          Hidden content (infinite scroll trigger)
        </div>
      )}
    </div>
  );
}

export default BidList;
