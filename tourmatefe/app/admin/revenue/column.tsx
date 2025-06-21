import { ColumnDef } from "@tanstack/react-table";
import { RevenueDto } from "@/app/api/revenue.api";

export const columns: ColumnDef<RevenueDto>[] = [
  { accessorKey: "revenueId", header: "ID" },
  { accessorKey: "tourGuideName", header: "Hướng dẫn viên" },
  { accessorKey: "customerName", header: "Khách hàng" },
  { accessorKey: "tourDescription", header: "Tour" },
  {
    accessorKey: "createdAt",
    header: "Ngày đặt",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ getValue }) => Number(getValue()).toLocaleString() + " đ",
  },
  { accessorKey: "platformCommission", header: "Phí nền tảng (%)" },
  {
    accessorKey: "actualReceived",
    header: "Doanh thu nhận",
    cell: ({ getValue }) => Number(getValue()).toLocaleString() + " đ",
  },
  {
    accessorKey: "paymentStatus",
    header: "Trạng thái",
    cell: ({ getValue }) => (getValue() ? "Đã thanh toán" : "Chưa thanh toán"),
  },
];
