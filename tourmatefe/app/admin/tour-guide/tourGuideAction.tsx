import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import React from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryString } from "@/app/utils/utils";
import { TourGuide } from "@/types/tourGuide";
import {
  getTourGuides,
  lockTourGuide,
  unlockTourGuide,
  updateTourGuide,
} from "@/app/api/tour-guide.api";
import UpdateTourGuideModal from "./updateTourGuideModal";
import TourGuideDetailModal from "./tourGuideDetailModal";

interface TourGuideActionsProps {
  data: TourGuide;
}

const TourGuideActions: React.FC<TourGuideActionsProps> = ({ data }) => {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  // Modal toggle functions
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const { refetch } = useQuery({
    queryKey: ["tour-guide", page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getTourGuides(page, limit, controller.signal);
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: TourGuide) => {
    data.account.roleId = 2; // Set default roleId to 2
    updateTourGuideMutation.mutate({ id: data.tourGuideId, data: data });
  };

  // Mutation for updating
  const updateTourGuideMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: TourGuide }) =>
      updateTourGuide(id, data),
    onSuccess: () => {
      toast.success("Cập nhật hướng dẫn viên thành công");
      refetch(); // Refetch dữ liệu sau khi cập nhật thành công
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Cập nhật hướng dẫn viên thất bại"
      );
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      if (data.account.status) {
        return lockTourGuide(data.account.accountId);
      } else {
        return unlockTourGuide(data.account.accountId);
      }
    },
    onSuccess: () => {
      toast.success(
        data.account.status
          ? "Khóa hướng dẫn viên thành công"
          : "Mở khóa hướng dẫn viên thành công"
      );
      refetch();
    },
    onError: () => {
      toast.error(
        data.account.status
          ? "Khóa hướng dẫn viên thất bại"
          : "Mở khóa hướng dẫn viên thất bại"
      );
    },
  });

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={openDetailModal}>
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={openModal}>Cập nhật</DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleStatusMutation.mutate()}>
            {data.account.status ? "Khóa" : "Mở khóa"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render UpdateNewsModal only when needed */}
      {isModalOpen && (
        <UpdateTourGuideModal
          isOpen={isModalOpen}
          onClose={closeModal}
          currentTourGuide={data}
          onSave={handleSave}
        />
      )}

      {isDetailModalOpen && (
        <TourGuideDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          currentTourGuide={data} // data là object TourGuide bạn truyền vào component này
        />
      )}
    </div>
  );
};

export default TourGuideActions;
