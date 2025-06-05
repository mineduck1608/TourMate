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
import CVDetailModal from "./recruitDetailModal";
import { Applications } from "@/types/applications";
import { rejectCVApplication } from "@/app/api/cv-application.api";
import { RejectCVRequest } from "@/types/applications";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

interface RecruitActionsProps {
  data: Applications;
}

const RecruitActions: React.FC<RecruitActionsProps> = ({ data }) => {
  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = React.useState(false);
  const [rejectReason, setRejectReason] = React.useState("");
  const queryClient = useQueryClient();

  // Mutation for rejecting CV
  const rejectCVMutation = useMutation({
    mutationFn: (rejectData: RejectCVRequest) =>
      rejectCVApplication(rejectData),
    onSuccess: () => {
      toast.success("Từ chối CV thành công");
      // Sửa cách invalidate query
      queryClient.invalidateQueries({ queryKey: ["cv-applications"] });
      setIsRejectModalOpen(false);
      setRejectReason("");
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Từ chối CV thất bại"
      );
    },
  });

  const handleViewDetail = () => setIsDetailModalOpen(true);
  const handleCloseDetail = () => setIsDetailModalOpen(false);

  const handleOpenReject = () => setIsRejectModalOpen(true);
  const handleCloseReject = () => {
    setIsRejectModalOpen(false);
    setRejectReason("");
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error("Vui lòng nhập lý do từ chối");
      return;
    }

    rejectCVMutation.mutate({
      cvApplicationId: data.cvApplicationId,
      response: rejectReason,
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
          <DropdownMenuItem onClick={handleOpenReject}>
            Từ chối CV
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

      <Dialog open={isRejectModalOpen} onOpenChange={setIsRejectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Từ chối CV</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Nhập lý do từ chối..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={handleCloseReject}>
              Hủy
            </Button>
            <Button onClick={handleReject}>Xác nhận</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecruitActions;
