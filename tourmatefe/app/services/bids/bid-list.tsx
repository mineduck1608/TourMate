import { useInView } from 'react-intersection-observer';
import { useEffect, useState, useRef, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { TourBid } from '@/types/tour-bid';
import { addTourBid, getTourBids, updateTourBid } from '@/app/api/tour-bid.api';
import { BidTaskContext, BidTaskContextProp } from './bid-task-context';
import TourBidRender from './tour-bid-render';

export default function BidList({ search }: { search: string }) {
  const pageSize = 3;
  const [page, setPage] = useState(1);
  const [tourBids, setTourBids] = useState<TourBid[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const topRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { signal, setSignal, target } = useContext(BidTaskContext) as BidTaskContextProp;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['tour-bids', page, pageSize, search],
    queryFn: () => getTourBids(page, pageSize, undefined, search),
    staleTime: 1000 * 60 * 5 // 5 minutes
  });

  // Handle data when it changes
  useEffect(() => {
    if (data) {
      if (page === 1) {
        setTourBids(data.result);
        setHasMore(page < (data.totalPage ?? 0));
      } else {
        setTourBids((prev) => [
          ...prev,
          ...data.result.filter(
            b => !prev.some(existing => existing.tourBidId === b.tourBidId)
          )
        ]);
        setHasMore(page < (data.totalPage ?? 0));
      }
    }
  }, [data]);

  // Reset when search changes
  useEffect(() => {
    setPage(1);
    setTourBids([]);
    setHasMore(true);
    queryClient.invalidateQueries({ queryKey: ['tour-bids'] });
  }, [search]);

  // Load more when scroll reaches bottom
  useEffect(() => {
    if (inView && !isLoading && hasMore) {
      setPage((prev) => prev + 1);
    }
  }, [inView]);

  // Create mutation
  const createTourBidMutation = useMutation({
    mutationFn: (data: TourBid) => addTourBid(data),
    onSuccess: () => {
      toast.success("Tạo thành công");
      setPage(1);
      setTourBids([]);
      setHasMore(true);
      queryClient.invalidateQueries({ queryKey: ['tour-bids'] });
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSignal({ ...signal, create: false });
    },
    onError: (error) => {
      toast.error("Tạo thất bại");
      console.error(error);
    }
  });

  const updateTourBidMutation = useMutation({
    mutationFn: (data: TourBid) => updateTourBid(data),
    onSuccess: () => {
      toast.success("Tạo thành công");
      setPage(1);
      setTourBids([]);
      setHasMore(true);
      queryClient.invalidateQueries({ queryKey: ['tour-bids'] });
      topRef.current?.scrollIntoView({ behavior: 'smooth' });
      setSignal({ ...signal, create: false });
    },
    onError: (error) => {
      toast.error("Tạo thất bại");
      console.error(error);
    }
  });

  // Handle create signal
  useEffect(() => {
    if (signal.create) {
      createTourBidMutation.mutate(target);
    }
  }, [signal.create]);
  useEffect(() => {
    if (signal.edit) {
      updateTourBidMutation.mutate(target);
    }
  }, [signal.edit]);

  return (
    <div className="relative">
      <div ref={topRef} /> {/* Anchor for scrolling to top */}

      {/* Bid List */}
      <div className="*:my-5">
        {tourBids.map((v) => (
          <TourBidRender tourBid={v} key={v.tourBidId} />
        ))}
      </div>

      {/* Loading state */}
      {isLoading && (
        <div className="flex justify-center py-4">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="text-center py-4 text-red-500">
          Error loading bids: {error instanceof Error ? error.message : 'Unknown error'}
        </div>
      )}

      {/* End of list */}
      {!hasMore && !isLoading && tourBids.length > 0 && (
        <div className="text-center py-4 text-gray-500">
          Bạn đã xem hết danh sách
        </div>
      )}

      {/* Empty state */}
      {!hasMore && !isLoading && tourBids.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          Không có bài viết nào
        </div>
      )}

      {/* Infinite scroll trigger */}
      <div ref={ref} className="h-1" />
    </div>
  );
}