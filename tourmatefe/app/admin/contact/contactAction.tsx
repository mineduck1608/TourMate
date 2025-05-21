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
import { Contact } from "@/types/contact";
import { confirmContact, getContacts } from "@/app/api/contact.api";
import ContactDetailModal from "./contactDetailModal";


interface ContactActionsProps {
  data: Contact;
}

const ContactActions: React.FC<ContactActionsProps> = ({ data }) => {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  // Modal toggle functions

  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const { refetch } = useQuery({
    queryKey: ["contact", page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getContacts(page, limit, controller.signal);
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      return await confirmContact(data.contactId);
    },
    onSuccess: () => {
      toast.success("Xác nhận liên hệ thành công");
      refetch();
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Xác nhận liên hệ thất bại, vui lòng thử lại sau"
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
          <DropdownMenuItem onClick={() => toggleStatusMutation.mutate()}>
            Xác nhận liên hệ
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {isDetailModalOpen && (
        <ContactDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          currentContact={data}
        />
      )}
    </div>
  );
};

export default ContactActions;
