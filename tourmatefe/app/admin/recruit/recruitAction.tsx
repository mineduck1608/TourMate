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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Applications,
  RejectCVRequest,
  ApprovedCVRequest,
} from "@/types/applications";
import {
  rejectCVApplication,
  approveCVApplication,
} from "@/app/api/account.api";
import CVDetailModal from "./recruitDetailModal";
import RejectModal from "./rejectModal";
import ApproveModal from "./approveModal";

interface RecruitActionsProps {
  data: Applications;
}

const RecruitActions: React.FC<RecruitActionsProps> = ({ data }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = React.useState(false);
  const queryClient = useQueryClient();

  // Simplified modal handlers with useCallback
  const handleViewDetail = React.useCallback(
    () => setIsDetailModalOpen(true),
    []
  );
  const handleCloseDetail = React.useCallback(
    () => setIsDetailModalOpen(false),
    []
  );

  const handleOpenReject = React.useCallback(
    () => setIsRejectModalOpen(true),
    []
  );
  const handleCloseReject = React.useCallback(() => {
    setIsRejectModalOpen(false);
  }, []);

  const handleOpenApprove = React.useCallback(
    () => setIsApproveModalOpen(true),
    []
  );
  const handleCloseApprove = React.useCallback(() => {
    setIsApproveModalOpen(false);
  }, []);

  // Mutation for approving CV
  const approveCVMutation = useMutation({
    mutationFn: (approveData: ApprovedCVRequest) =>
      approveCVApplication(approveData),
    onSuccess: () => {
      toast.success("Duyệt CV thành công");
      queryClient.invalidateQueries({ queryKey: ["cv-applications"] });
      handleCloseApprove();
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Duyệt CV thất bại"
      );
    },
  });

  const handleApprove = (response: string) => {
    if (!data) return;

    approveCVMutation.mutate({
      cvApplicationId: data.cvApplicationId,
      email: data.email,
      fullName: data.fullName,
      gender: data.gender,
      phone: data.phone,
      address: data.address,
      image: data.image,
      dateOfBirth: data.dateOfBirth,
      description: data.description,
      areaId: 1,
      response: response,
    });
  };

  // Mutation for rejecting CV
  const rejectCVMutation = useMutation({
    mutationFn: (rejectData: RejectCVRequest) =>
      rejectCVApplication(rejectData),
    onSuccess: () => {
      toast.success("Từ chối CV thành công");
      queryClient.invalidateQueries({ queryKey: ["cv-applications"] });
      handleCloseReject();
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Từ chối CV thất bại"
      );
    },
  });

  const handleReject = (reason: string) => {
    if (!reason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối CV");
      return;
    }

    rejectCVMutation.mutate({
      cvApplicationId: data.cvApplicationId,
      response: reason,
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Hành động</DropdownMenuLabel>
          <DropdownMenuItem onClick={handleViewDetail}>
            Xem chi tiết
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleOpenReject}
            disabled={
              data.status === "Đã từ chối" || data.status === "Đã xử lí"
            }
            className={
              data.status === "Đã từ chối" || data.status === "Đã xử lí"
                ? "cursor-not-allowed opacity-50"
                : ""
            }
          >
            Từ chối CV
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleOpenApprove}
            disabled={
              data.status === "Đã từ chối" || data.status === "Đã xử lí"
            }
            className={
              data.status === "Đã từ chối" || data.status === "Đã xử lí"
                ? "cursor-not-allowed opacity-50"
                : ""
            }
          >
            Duyệt CV
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDetailModalOpen && (
        <CVDetailModal
          isOpen={isDetailModalOpen}
          onClose={handleCloseDetail}
          currentCV={data}
        />
      )}

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={handleCloseReject}
        onConfirm={handleReject}
        isLoading={rejectCVMutation.isPending}
      />

      <ApproveModal
        isOpen={isApproveModalOpen}
        onClose={handleCloseApprove}
        onConfirm={handleApprove}
        isLoading={approveCVMutation.isPending}
      />
    </>
  );
};
export default RecruitActions;