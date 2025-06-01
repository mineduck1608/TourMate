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
import { Customer, CustomerAdminUpdateModel } from "@/types/customer";
import {
  getCustomers,
  lockCustomer,
  unlockCustomer,
  updateCustomer,
} from "@/app/api/customer.api";
import UpdateCustomerModal from "./updateCustomerModal";
import CustomerDetailModal from "./customerDetailModal"; // hoặc đúng đường dẫn file bạn để modal chi tiết

interface CustomerActionsProps {
  data: Customer;
}

const CustomerActions: React.FC<CustomerActionsProps> = ({ data }) => {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;
  // Modal toggle functions
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const [isDetailModalOpen, setIsDetailModalOpen] = React.useState(false);

  const openDetailModal = () => setIsDetailModalOpen(true);
  const closeDetailModal = () => setIsDetailModalOpen(false);

  const { refetch } = useQuery({
    queryKey: ["customer", page], // Pass page and limit as part of the query key
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

  const handleSave = (data: CustomerAdminUpdateModel) => {
    updateCustomerMutation.mutate({ id: data.customerId, data: data });
  };

  // Mutation for updating customer
  const updateCustomerMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CustomerAdminUpdateModel }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      toast.success("Cập nhật khách hàng thành công");
      refetch(); // Refetch dữ liệu sau khi cập nhật thành công
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Cập nhật khách hàng thất bại"
      );
    },
  });

  const toggleStatusMutation = useMutation({
    mutationFn: async () => {
      if (data.account.status) {
        return lockCustomer(data.account.accountId);
      } else {
        return unlockCustomer(data.account.accountId);
      }
    },
    onSuccess: () => {
      toast.success(
        data.account.status
          ? "Khóa khách hàng thành công"
          : "Mở khóa khách hàng thành công"
      );
      refetch();
    },
    onError: () => {
      toast.error(
        data.account.status
          ? "Khóa khách hàng thất bại"
          : "Mở khóa khách hàng thất bại"
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
        <UpdateCustomerModal
          isOpen={isModalOpen}
          onClose={closeModal}
          currentCustomer={data}
          onSave={handleSave}
        />
      )}

      {isDetailModalOpen && (
        <CustomerDetailModal
          isOpen={isDetailModalOpen}
          onClose={closeDetailModal}
          currentCustomer={data}
        />
      )}
    </div>
  );
};

export default CustomerActions;
