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
import React, { useState } from "react";
import DeleteModal from "@/components/DeleteModal";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryString } from "@/app/utils/utils";
import { Customer } from "@/types/customer";
import { getCustomers, lockCustomer, updateCustomer } from "@/app/api/customer.api";
import UpdateCustomerModal from "./updateCustomerModal";

interface CustomerActionsProps {
  data: Customer;
}

const CustomerActions: React.FC<CustomerActionsProps> = ({ data }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<number | null>(null); // Store item to delete
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  // Modal toggle functions
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { refetch } = useQuery({
    queryKey: ['customer', page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getCustomers(page, limit, controller.signal);
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

   const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
    
      const handleSave = (data: Customer) => {
          updateCustomerMutation.mutate({ id: data.customerId, data: data });
      };

    // Mutation for updating customer
    const updateCustomerMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: Customer }) => updateCustomer(id, data),
        onSuccess: () => {
          toast.success('Cập nhật khách hàng thành công');
          refetch(); // Refetch dữ liệu sau khi cập nhật thành công
        },
        onError: (error) => {
          toast.error('Cập nhật khách hàng thất bại');
          console.error(error);
        },
      });

  // Handle delete confirmation (directly inside this component)
  const handleConfirmDelete = async () => {
    if (itemToDelete) {
        deleteMutation.mutate(itemToDelete)
    }
    closeDeleteModal();
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => lockCustomer(id),
    onSuccess: () => {
      toast.success(`Khóa khách hàng thành công`)
      refetch();
    }
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
          <DropdownMenuItem
            onClick={() => navigator.clipboard.writeText(data.customerId.toString())}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={openModal}>Cập nhật</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { setItemToDelete(data.customerId); openDeleteModal(); }}
          >
            Khóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        message="Bạn có chắc muốn tạm khóa khách hàng này?"
      />

      {/* Render UpdateNewsModal only when needed */}
      {isModalOpen && (
        <UpdateCustomerModal
          isOpen={isModalOpen}
          onClose={closeModal}
          currentCustomer={data}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default CustomerActions;
