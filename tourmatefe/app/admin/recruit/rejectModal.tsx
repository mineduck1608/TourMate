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
import { first } from "lodash";

interface RejectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  isLoading?: boolean;
}

const RejectModal: React.FC<RejectModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  const [rejectReason, setRejectReason] = React.useState("");
  const firstFocusableElement = React.useRef<HTMLTextAreaElement>(null);

  // Handle close without preventing events
  const handleClose = () => {
    setRejectReason("");
    onClose();
  };

  // Handle confirm without preventing events
  const handleConfirm = () => {
    onConfirm(rejectReason);
  };

  React.useEffect(() => {
    if (isOpen && firstFocusableElement.current) {
      firstFocusableElement.current.focus();
    }
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Từ chối CV</DialogTitle>
          <DialogDescription>Vui lòng nhập lý do từ chối CV</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <Textarea
            ref={firstFocusableElement}
            placeholder="Nhập lý do từ chối..."
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
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

export default RejectModal;
