"use client";

import { ColumnDef } from "@tanstack/react-table";
import { News } from "@/types/news";
import { Checkbox } from "@/components/ui/checkbox";
import NewsActions from "./newsAction";

// Hàm định dạng ngày theo dd/mm/yyyy
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
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
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => formatDate(row.getValue("createdAt")), // Định dạng lại ngày
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
            <span>Không có ảnh</span>
          )}
        </div>
      );
    }
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      return <NewsActions data={data} />
    },
  },
];
