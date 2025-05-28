"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { TourGuide } from "@/types/tour-guide";
import TourGuideActions from "./tourGuideAction";

// Hàm định dạng ngày theo dd/mm/yyyy
// const formatDate = (dateString: string) => {
//   const date = new Date(dateString);
//   const day = String(date.getDate()).padStart(2, '0');
//   const month = String(date.getMonth() + 1).padStart(2, '0');
//   const year = date.getFullYear();
//   const hours = String(date.getHours()).padStart(2, '0');
//   const minutes = String(date.getMinutes()).padStart(2, '0');
//   const seconds = String(date.getSeconds()).padStart(2, '0');
  
//   return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
// };



export const columns: ColumnDef<TourGuide>[] = [

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
    accessorKey: "fullName",
    header: "Họ và tên",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '300px',       // Chiều rộng tối đa của cột
          whiteSpace: 'normal',    // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue('fullName')}
      </div>
    ),
  },
  {
    accessorKey: "account.email",
    header: "Email"
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại"
  },
  {
    accessorKey: "dateOfBirth",
    header: "Ngày sinh",
    cell: (info) => {
      const date = new Date(info.getValue() as string | Date);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  {
    accessorKey: "account.status",
    header: "Trạng thái",
    cell: (info) => {
      const status = info.getValue();
      const label = status ? "Hoạt động" : "Đã khóa";
      const color = status ? "green" : "red"; // Xanh cho hoạt động, đỏ cho khóa
      return (
        <span style={{ color: color, fontWeight: 'bold' }}>
          {label}
        </span>
      );
    },
  },  
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const imageUrl = row.getValue('image') as string;
      return (
        <div
          style={{
            maxWidth: '200px',

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
      return <TourGuideActions data={data} />
    },
  },
];
