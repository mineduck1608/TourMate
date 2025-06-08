import InfiniteScroll from 'react-infinite-scroll-component';
import { useQuery, useMutation } from '@tanstack/react-query';
import { useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TourBid, TourBidListResult } from '@/types/tour-bid';
import { getTourBids, addTourBid, updateTourBid, deleteTourBid, likeOrUnlike } from '@/app/api/tour-bid.api';
import { BidTaskContext, BidTaskContextProp } from './tour-bid-task-context';
import TourBidRender from './tour-bid-render';
import { CustomerSiteContext, CustomerSiteContextProp } from '../context';
import { baseData } from './tour-bid-task-context';

function BidList({ search }: { search: string }) {
  const pageSize = 3;
  const [page, setPage] = useState(1);
  const [tourBids, setTourBids] = useState<TourBidListResult[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [resetTrigger, setResetTrigger] = useState(false);

  const { setSignal, setTarget, signal, target, modalOpen, setModalOpen } =
    useContext(BidTaskContext) as BidTaskContextProp;
  const { accId } = useContext(CustomerSiteContext) as CustomerSiteContextProp;

  const tourBidQuery = useQuery({
    queryKey: ["tour-bids", pageSize, page, search, resetTrigger],
    queryFn: async () => {
      const response = await getTourBids(accId, page, pageSize, undefined, search);
      return response;
    },
  });

  const resetData = async () => {
    setPage(1);
    setTourBids([]);
    setHasMore(true);
    setResetTrigger(prev => !prev);
  };

  // Enhanced update function that handles all fields including placeRequested
  const updateLocalBid = (updatedBid: TourBidListResult) => {
    // const asSet = new Set(tourBids)
    setTourBids(prevBids =>
      prevBids.map(bid =>
        bid.tourBidId === updatedBid.tourBidId ? { 
          ...bid,
          ...updatedBid // This spreads all updated properties including placeRequested and placeRequestedName
        } : bid
      )
    );
  };

  const createTourBidMutation = useMutation({
    mutationFn: async (data: TourBid | TourBidListResult) => {
      return await addTourBid(data);
    },
    onSuccess: () => {
      toast.success("Tạo thành công");
      setSignal({ ...signal, create: false });
      setTarget({ ...baseData });
      setModalOpen({ ...modalOpen, create: false });
      resetData().then(() => {
        if (page === 1) window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    },
    onError: (error) => {
      toast.error("Tạo thất bại");
      console.error(error);
    },
  });

  const updateTourBidMutation = useMutation({
    mutationFn: async ({ data }: { data: TourBid | TourBidListResult }) => {
      return await updateTourBid(data);
    },
    onMutate: async (variables) => {
      // Optimistically update all fields including location
      updateLocalBid(variables.data as TourBidListResult);
    },
    onSuccess: (data) => {
      // Update with server response to ensure all fields are in sync
      if (data?.result) {
        updateLocalBid(data.result);
      }
      toast.success("Cập nhật thành công");
      setSignal({ ...signal, edit: false });
      setTarget({ ...baseData });
    },
    onError: (error) => {
      toast.error("Cập nhật thất bại");
      console.error(error);
      // Revert to previous state
      resetData();
    },
  });

  const deleteTourBidMutation = useMutation({
    mutationFn: async ({ data }: { data: number }) => {
      return await deleteTourBid(data);
    },
    onSuccess: () => {
      toast.success("Xóa thành công");
      resetData();
    },
    onError: (error) => {
      toast.error("Xóa thất bại");
      console.error(error);
    },
  });

  const likeOrUnlikeMutation = useMutation({
    mutationFn: async ({ tourBidId }: { tourBidId: number }) => {
      return await likeOrUnlike(accId, tourBidId);
    },
    onMutate: async (variables) => {
      const currentBid = tourBids.find(b => b.tourBidId === variables.tourBidId);
      if (currentBid) {
        updateLocalBid({
          ...currentBid,
          isLiked: !currentBid.isLiked,
          likeCount: currentBid.isLiked ? currentBid.likeCount - 1 : currentBid.likeCount + 1
        });
      }
    },
    onError: (error, variables) => {
      const currentBid = tourBids.find(b => b.tourBidId === variables.tourBidId);
      if (currentBid) {
        updateLocalBid({
          ...currentBid,
          isLiked: currentBid.isLiked,
          likeCount: currentBid.likeCount
        });
      }
      toast.error("Có lỗi xảy ra khi thực hiện thao tác");
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
  }, [tourBidQuery.data]);

  const loadMore = () => {
    if (!tourBidQuery.isFetching && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  useEffect(() => {
    if (signal.create) {
      createTourBidMutation.mutate(target);
      setSignal({ ...signal, create: false });
      setTarget({ ...baseData });
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

  useEffect(() => {
    if (signal.likeOrUnlike) {
      likeOrUnlikeMutation.mutate({ tourBidId: target.tourBidId });
      setSignal({ ...signal, likeOrUnlike: false });
      setTarget({ ...baseData });
    }
  }, [signal.likeOrUnlike]);

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