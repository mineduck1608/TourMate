"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Payment } from "@/types/payment";

const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: "paymentId",
    header: "ID",
  },
  {
    accessorKey: "price",
    header: "Giá tiền",
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("price"));
      const formatted = new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(price);
      return <div>{formatted}</div>;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <div
          className={`font-medium ${
            status === "Thành công" ? "text-green-600" : "text-red-600"
          }`}
        >
          {status}
        </div>
      );
    },
  },
  {
    accessorKey: "completeDate",
    header: "Ngày giao dịch",
    cell: ({ row }) => {
      return <div>{formatDate(row.getValue("completeDate"))}</div>;
    },
  },
  {
    accessorKey: "paymentType",
    header: "Loại giao dịch",
    cell: ({ row }) => {
      const paymentType = row.getValue("paymentType") as string;
      return <div>{paymentType || "Đặt chuyến đi"}</div>;
    },
  },
  {
    accessorKey: "paymentMethod",
    header: "Phương thức thanh toán",
    cell: ({ row }) => {
      const method = row.getValue("paymentMethod") as string;
      return <div>{method === "VNPAY" ? "VNPay" : method}</div>;
    },
  },
  {
    accessorKey: "invoiceId",
    header: "Mã hóa đơn",
  },
];
