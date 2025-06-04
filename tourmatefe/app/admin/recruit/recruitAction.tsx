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
import CVDetailModal from "./recruitDetailModal";
import { Applications } from "@/types/applications";
import { getCVApplications } from "@/app/api/cv-application.api";
import { updateCVApplication } from "@/app/api/cv-application.api";
interface recruitActionsProps {
  data: Applications;
}

const RecruitActions: React.FC<recruitActionsProps> = ({ data }) => {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  // Modal toggle functions
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const { refetch } = useQuery({
    queryKey: ["applications", page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getCVApplications(page, limit, controller.signal);
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: Applications) => {
    updateCVMutation.mutate({ id: data.cvApplicationId, data: data });
  };

  // Mutation for updating
  const updateCVMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Applications }) =>
      updateCVApplication(id, data),
    onSuccess: () => {
      toast.success("Cập nhật CV thành công");
      refetch(); // Refetch dữ liệu sau khi cập nhật thành công
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Cập nhật CV thất bại"
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
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Render UpdateNewsModal only when needed */}

      {isDetailModalOpen && (
        <CVDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          currentCV={data} // data là object CV bạn truyền vào component này
        />
      )}
    </div>
  );
};

export default RecruitActions;
