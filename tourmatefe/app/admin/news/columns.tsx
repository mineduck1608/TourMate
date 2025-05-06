"use client";

import { ColumnDef } from "@tanstack/react-table";
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
import { Checkbox } from "@/components/ui/checkbox";

// Hàm định dạng ngày theo dd/mm/yyyy
const formatDate = (date: string) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
};

export const columns: ColumnDef<News>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) => table.toggleAllPageRowsSelected(value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '300px',       // Chiều rộng tối đa của cột
          whiteSpace: 'normal',    // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue('title')}
      </div>
    ),
  },
  {
    accessorKey: "createdDate",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.getValue("createdDate")), // Định dạng lại ngày
    meta: {
      style: { width: "150px" } // Chỉnh chiều rộng cột
    }
  },
  {
    accessorKey: "content",
    header: "Nội dung",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '600px',
          whiteSpace: 'normal',  // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu quá dài
        }}
        dangerouslySetInnerHTML={{
          __html: row.getValue("content") || "",  // Hiển thị HTML (cẩn thận với dữ liệu không xác thực)
        }}
      />
    ),
  },
  {
    accessorKey: "bannerImg",
    header: "Ảnh",
    cell: ({ row }) => {
      const imageUrl = row.getValue('bannerImg') as string;
      return (
        <div
          style={{
            maxWidth: '200px',
            whiteSpace: 'normal', // Cho phép ảnh xuống dòng nếu cần
            overflowWrap: 'break-word',
          }}
        >
          {/* Hiển thị ảnh nếu có URL */}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img 
              src={imageUrl} 
              alt="Banner" 
              style={{ maxWidth: '100%', height: 'auto', borderRadius: '8px' }} // Style cho ảnh
            />
          ) : (
            <span>No Image</span> // Nếu không có ảnh, hiển thị "No Image"
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(data.newsId.toString())}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
