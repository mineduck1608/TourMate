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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useQueryString } from "@/app/utils/utils";
import { ActiveArea } from "@/types/active-area";
import { deleteActiveArea, getActiveAreas, updateActiveArea } from "@/app/api/active-area.api";
import UpdateActiveAreaModal from "./updateActiveAreaModal";

interface ActiveAreaActionsProps {
  data: ActiveArea;
}

const ActiveAreaActions: React.FC<ActiveAreaActionsProps> = ({ data }) => {
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null); // Store item to delete
  const queryClient = useQueryClient()
  const queryString: { page?: string } = useQueryString()
  const page = Number(queryString.page) || 1

  // Modal toggle functions
  const openDeleteModal = () => setDeleteModalOpen(true);
  const closeDeleteModal = () => setDeleteModalOpen(false);
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const { refetch } = useQuery({
    queryKey: ['active-area', page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getActiveAreas(page, limit);
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

   const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
    
      const handleSave = (data: ActiveArea) => {
          updateActiveAreaMutation.mutate({ id: data.areaId, data: data});
      };

    const  updateActiveAreaMutation = useMutation({  
        mutationFn: ({ id, data }: { id: number; data: ActiveArea }) => updateActiveArea(id, data),
        onSuccess: () => {
          toast.success('Cập nhật địa điểm thành công');
          refetch(); // Refetch dữ liệu sau khi cập nhật thành công
        },
        onError: (error) => {
          toast.error('Cập nhật địa điểm thất bại');
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
    mutationFn: (id: number | string) => deleteActiveArea(id),
    onSuccess: () => {
      toast.success(`Xóa địa điểm thành công`)
      queryClient.invalidateQueries({ queryKey: ['active-area', page], exact: true })
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
            onClick={() => navigator.clipboard.writeText(data.areaId.toString())}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={openModal}>Cập nhật</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { setItemToDelete(data.areaId.toString()); openDeleteModal(); }}
          >
            Xóa
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Delete Confirmation Modal */}
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleConfirmDelete}
        message="Bạn có chắc muốn xóa địa điểm này?"
      />

      {/* Render UpdateAreaModal only when needed */}
      {isModalOpen && (
        <UpdateActiveAreaModal
          isOpen={isModalOpen}
          onClose={closeModal}
          currentData={data}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default ActiveAreaActions;
