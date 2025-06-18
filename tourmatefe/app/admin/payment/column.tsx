// "use client";

// import { ColumnDef } from "@tanstack/react-table";
// import { Payment } from "@/types/payment";
// import { DataTableColumnHeader } from "@/components/ui/data-table-column-header";
// import { formatDate } from "@/lib/utils";

// export const columns: ColumnDef<Payment>[] = [
//   {
//     accessorKey: "price",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Giá tiền" />
//     ),
//     cell: ({ row }) => {
//       const price = parseFloat(row.getValue("price"));
//       const formatted = new Intl.NumberFormat("vi-VN", {
//         style: "currency",
//         currency: "VND",
//       }).format(price);
//       return <div>{formatted}</div>;
//     },
//   },
//   {
//     accessorKey: "status",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Trạng thái" />
//     ),
//     cell: ({ row }) => {
//       return <div className={`font-medium`}>{row.getValue("status")}</div>;
//     },
//   },
//   {
//     accessorKey: "completeDate",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Ngày giao dịch" />
//     ),
//     cell: ({ row }) => {
//       return <div>{formatDate(row.getValue("completeDate"))}</div>;
//     },
//   },
//   {
//     accessorKey: "paymentType",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Loại giao dịch" />
//     ),
//   },
//   {
//     accessorKey: "paymentMethod",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Phương thức thanh toán" />
//     ),
//   },
// ];
