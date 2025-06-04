"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { Applications } from "@/types/applications";
import { Badge } from "@/components/ui/badge";
import RecruitActions from "./recruitAction";
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

export const columns: ColumnDef<Applications>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(value)
        }
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
          maxWidth: "300px", // Chiều rộng tối đa của cột
          whiteSpace: "normal", // Cho phép nội dung xuống dòng
          overflowWrap: "break-word", // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue("fullName")}
      </div>
    ),
  },
  {
    accessorKey: "account.email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
    cell: ({ row }) => {
      const gender = row.getValue("gender") as string;
      return gender === "male" ? "Nam" : "Nữ";
    },
  },
  {
    accessorKey: "address",
    header: "Địa chỉ",
    cell: ({ row }) => (
      <div className="max-w-[300px] whitespace-normal break-words">
        {row.getValue("address")}
      </div>
    ),
  },
  {
    accessorKey: "link",
    header: "CV",
    cell: ({ row }) => {
      const link = row.getValue("link") as string;
      return link ? (
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          Xem CV
        </a>
      ) : (
        <span className="text-gray-500">Không có CV</span>
      );
    },
  },
  {
    accessorKey: "description",
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="max-w-[300px] whitespace-normal break-words">
        {row.getValue("description")}
      </div>
    ),
  },
  {
    accessorKey: "dateOfBirth",
    header: "Ngày sinh",
    cell: (info) => {
      const date = new Date(info.getValue() as string | Date);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0"); // Tháng bắt đầu từ 0
      const year = date.getFullYear();
      return `${day}/${month}/${year}`;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge
          variant={
            status === "pending"
              ? "outline"
              : status === "approved"
              ? "secondary"
              : "destructive"
          }
        >
          {status === "pending"
            ? "Chờ duyệt"
            : status === "approved"
            ? "Đã duyệt"
            : "Từ chối"}
        </Badge>
      );
    },
  },
  {
    accessorKey: "image",
    header: "Hình ảnh",
    cell: ({ row }) => {
      const imageUrl = row.getValue("image") as string;
      return (
        <div
          style={{
            maxWidth: "200px",
          }}
        >
          {/* Hiển thị ảnh nếu có URL */}
          {imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={imageUrl}
              alt="Banner"
              style={{ maxWidth: "100%", height: "auto", borderRadius: "8px" }} // Style cho ảnh
            />
          ) : (
            <span>Không có ảnh</span>
          )}
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const data = row.original;
      return <RecruitActions data={data} />;
    },
  },
];
