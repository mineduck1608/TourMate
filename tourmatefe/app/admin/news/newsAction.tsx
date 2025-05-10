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
import { News } from "@/types/news";
import React, { useState } from "react";
import DeleteModal from "@/components/DeleteModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteNews, getNews, updateNews } from "@/app/api/news.api";
import { toast } from "react-toastify";
import { useQueryString } from "@/app/utils/utils";
import UpdateNewsModal from "./updateNewsModal";

interface NewsActionsProps {
  data: News;
}

const NewsActions: React.FC<NewsActionsProps> = ({ data }) => {
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
    queryKey: ['news', page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getNews(page, limit, ''); // Pass the extracted values to getNews
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

   const openModal = () => {
        setIsModalOpen(true);
      };
    
      const closeModal = () => {
        setIsModalOpen(false);
      };
    
      const handleSave = (newsData: News) => {
          updateNewsMutation.mutate({ id: newsData.newsId, data: newsData });
      };

    // Mutation for updating news
    const updateNewsMutation = useMutation({
        mutationFn: ({ id, data }: { id: number; data: News }) => updateNews(id, data),
        onSuccess: () => {
          toast.success('Cập nhật tin tức thành công');
          refetch(); // Refetch dữ liệu sau khi cập nhật thành công
        },
        onError: (error) => {
          toast.error('Cập nhật tin tức thất bại');
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
    mutationFn: (id: number | string) => deleteNews(id),
    onSuccess: () => {
      toast.success(`Xóa tin tức thành công`)
      queryClient.invalidateQueries({ queryKey: ['news', page], exact: true })
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
            onClick={() => navigator.clipboard.writeText(data.newsId.toString())}
          >
            Copy payment ID
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem  onClick={openModal}>Cập nhật</DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => { setItemToDelete(data.newsId.toString()); openDeleteModal(); }}
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
        message="Are you sure you want to delete this news?"
      />

      {/* Render UpdateNewsModal only when needed */}
      {isModalOpen && (
        <UpdateNewsModal
          isOpen={isModalOpen}
          onClose={closeModal}
          currentNews={data}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default NewsActions;
