import InfiniteScroll from 'react-infinite-scroll-component';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useContext, useState, useEffect, useRef } from 'react';
import { toast } from 'react-toastify';
import { TourBid } from '@/types/tour-bid';
import { getTourBids, addTourBid, updateTourBid, deleteTourBid } from '@/app/api/tour-bid.api';
import { BidTaskContext, BidTaskContextProp } from './bid-task-context';
import { baseData } from './bids-page';
import TourBidRender from './tour-bid-render';

// Estimated height of each tour bid item in pixels
const ITEM_HEIGHT_ESTIMATE = 200;

function BidList({ search }: { search: string }) {
  const pageSize = 3;
  const [page, setPage] = useState(1);
  const [tourBids, setTourBids] = useState<TourBid[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false);
  const scrollPositionRef = useRef<{ index: number; top: number } | null>(null);

  const { setSignal, setTarget, signal, target, modalOpen, setModalOpen } =
    useContext(BidTaskContext) as BidTaskContextProp;

  const saveScrollPosition = () => {
    if (tourBids.length === 0) return;

    const scrollTop = window.scrollY;
    const currentIndex = Math.floor(scrollTop / ITEM_HEIGHT_ESTIMATE);
    scrollPositionRef.current = {
      index: currentIndex,
      top: scrollTop - (currentIndex * ITEM_HEIGHT_ESTIMATE)
    };
  };

  const restoreScrollPosition = () => {
    if (!scrollPositionRef.current || tourBids.length === 0) return;

    const { index, top } = scrollPositionRef.current;
    const newIndex = Math.min(index, tourBids.length - 1);
    const newPosition = newIndex * ITEM_HEIGHT_ESTIMATE + top;

    window.scrollTo({
      top: newPosition,
      behavior: 'auto'
    });

    scrollPositionRef.current = null;
  };

  const tourBidQuery = useQuery({
    queryKey: ["tour-bids", pageSize, page, search, resetTrigger],
    queryFn: async () => {
      const response = await getTourBids(page, pageSize, undefined, search);
      return response;
    },
  });

  const resetData = async () => {
    saveScrollPosition();
    setPage(1);
    setTourBids([]);
    setHasMore(true);
    setResetTrigger(prev => !prev);
  };

  const handleMutationSuccess = async () => {
    await resetData();
    setTimeout(restoreScrollPosition, 100);
  };

  const createTourBidMutation = useMutation({
    mutationFn: async (data: TourBid) => {
      return await addTourBid(data);
    },
    onSuccess: () => {
      toast.success("Tạo thành công");
      setSignal({ ...signal, create: false });
      setTarget({ ...baseData });
      setModalOpen({ ...modalOpen, create: false })
      handleMutationSuccess().then(() => {
        if (page === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    onError: (error) => {
      toast.error("Tạo thất bại");
      console.error(error);
    },
  });

  const updateTourBidMutation = useMutation({
    mutationFn: async ({ data }: { data: TourBid }) => {
      return await updateTourBid(data);
    },
    onSuccess: () => {
      toast.success("Cập nhật thành công");
      handleMutationSuccess();
    },
    onError: (error) => {
      toast.error("Cập nhật thất bại");
      console.error(error);
    },
  });

  const deleteTourBidMutation = useMutation({
    mutationFn: async ({ data }: { data: number }) => {
      return await deleteTourBid(data);
    },
    onSuccess: () => {
      toast.success("Xóa thành công");
      handleMutationSuccess();
    },
    onError: (error) => {
      toast.error("Xóa thất bại");
      console.error(error);
    },
  });

  useEffect(() => {
    resetData();
  }, [search]);

  useEffect(() => {
    if (!tourBidQuery.data) return;

    const newItems = tourBidQuery.data.result;
    const totalPages = tourBidQuery.data.totalPage ?? 0;

    if (page === 1) {
      setTourBids(newItems);
    } else {
      setTourBids(prev => {
        const existingIds = new Set(prev.map(b => b.tourBidId));
        const filteredNewItems = newItems.filter(b =>
          !existingIds.has(b.tourBidId)
        );
        return [...prev, ...filteredNewItems];
      });
    }

    setHasMore(page < totalPages);

    // Restore scroll position after new data loads
    if (scrollPositionRef.current) {
      restoreScrollPosition();
    }
  }, [tourBidQuery.data]);

  const loadMore = () => {
    if (!tourBidQuery.isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (signal.create) {
      createTourBidMutation.mutate(target);
    }
  }, [signal.create]);

  useEffect(() => {
    if (signal.edit) {
      updateTourBidMutation.mutate({ data: target });
      setSignal({ ...signal, edit: false });
      setTarget({ ...baseData });
    }
  }, [signal.edit]);

  useEffect(() => {
    if (signal.delete) {
      deleteTourBidMutation.mutate({ data: target.tourBidId });
      setSignal({ ...signal, delete: false });
      setTarget({ ...baseData });
    }
  }, [signal.delete]);

  return (
    <div>
      <InfiniteScroll
        dataLength={tourBids.length}
        next={loadMore}
        hasMore={hasMore}
        loader={
          <div className="flex justify-center py-4">
            {tourBidQuery.isFetching ? (
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            ) : null}
          </div>
        }
        endMessage={
          tourBids.length > 0 ? (
            <p className="text-center py-4 text-gray-500">
              {tourBidQuery.data?.result.length === 0
                ? "No results found"
                : "Bạn đã xem hết tất cả kết quả"}
            </p>
          ) : null
        }
        pullDownToRefresh={false}
        className="overflow-hidden"
      >
        <div className="*:my-5">
          {tourBids.map((v) => (
            <TourBidRender tourBid={v} key={v.tourBidId} />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
}

export default BidList;