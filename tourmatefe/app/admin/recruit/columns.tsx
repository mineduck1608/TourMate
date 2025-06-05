"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Applications } from "@/types/applications";
import { Badge } from "@/components/ui/badge";
import RecruitActions from "./recruitAction";
import { Checkbox } from "@/components/ui/checkbox";

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
      <div className="max-w-[300px] whitespace-normal break-words">
        {row.getValue("fullName")}
      </div>
    ),
  },
  {
    accessorKey: "email", // Thay đổi từ account.email thành email
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
      return gender === "Nam" ? "Nam" : "Nữ"; // Đổi male thành Nam để phù hợp với API
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
    accessorKey: "dateOfBirth",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const date = new Date(row.getValue("dateOfBirth") as string);
      return new Intl.DateTimeFormat("vi-VN").format(date);
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <Badge variant={status === "active" ? "secondary" : "destructive"}>
          {status === "active" ? "Hoạt động" : "Không hoạt động"}
        </Badge>
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

console.log("Column definitions:", columns);
