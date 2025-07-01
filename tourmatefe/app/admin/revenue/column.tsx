import { ColumnDef } from "@tanstack/react-table";
import { RevenueDto } from "@/types/revenue";
import { TourGuide } from "@/types/tour-guide";
import { Account } from "@/types/account";
import { Checkbox } from "@/components/ui/checkbox";
const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

type RevenueTableRow = RevenueDto | TourGuide | Account;

export const columns: ColumnDef<RevenueTableRow>[] = [
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
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => {
      const value = row.getValue("email");
      return value !== undefined ? value : "";
    },
  },
  {
    accessorKey: "phone",
    header: "Số điện thoại",
  },
  {
    accessorKey: "totalAmount",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const value = row.getValue("totalAmount");
      return value !== undefined && value !== null
      ? Number(value).toLocaleString("vi-VN", {
        style: "currency",
        currency: "VND",
        minimumFractionDigits: 0,
      }) : "";
    },
  },
  {
    accessorKey: "actualReceived",
    header: "Thực nhận",
    cell: ({ row }) => {
      const value = row.getValue("actualReceived");
      return value !== undefined && value !== null
        ? Number(value).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
          })
        : "";
    },
  },
  {
    accessorKey: "platformCommission",
    header: "Hoa hồng nền tảng",
    cell: ({ row }) => {
      const value = row.getValue("platformCommission");
      return value !== undefined && value !== null
        ? Number(value).toLocaleString("vi-VN", {
            style: "currency",
            currency: "VND",
            minimumFractionDigits: 0,
          })
        : "";
    },
  },
  {
    accessorKey: "createdAt",
    header: "Ngày tạo",
    cell: ({ row }) => {
      const value = row.getValue("createdAt");
      return value ? formatDate(value as string) : "";
    },
  },
  {
    accessorKey: "paymentStatus",
    header: "Trạng thái thanh toán",
    cell: ({ row }) => {
      const value = row.getValue("paymentStatus");
      // Hiển thị tiếng Việt nếu muốn
      if (value === true) return "Đã thanh toán";
      if (value === false) return "Chưa thanh toán";
      return value || "";
    },
  },
];