import React from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

interface ApproveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (response: string) => void;
  isLoading?: boolean;
}

const ApproveModal: React.FC<ApproveModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [response, setResponse] = React.useState("");

  const handleClose = () => {
    setResponse("");
    onClose();
  };

  const handleConfirm = () => {
    onConfirm(response);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Chấp thuận CV</DialogTitle>
          <DialogDescription>
            Nhập phản hồi cho ứng viên (không bắt buộc)
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Nhập phản hồi..."
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? "Đang xử lý..." : "Xác nhận"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApproveModal;
