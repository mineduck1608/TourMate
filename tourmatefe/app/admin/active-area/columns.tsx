"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import ActiveAreaActions from "./activeAreaAction";
import { ActiveArea } from "@/types/active-area";

export const columns: ColumnDef<ActiveArea>[] = [

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
    accessorKey: "areaName",
    header: "Tên địa điểm",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '200px',       // Chiều rộng tối đa của cột
          whiteSpace: 'normal',    // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue('areaName')}
      </div>
    ),
  },
  {
    accessorKey: "areaType",
    header: "Khu vực",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '200px',       // Chiều rộng tối đa của cột
          whiteSpace: 'normal',    // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue('areaType')}
      </div>
    ),
  },
  {
    accessorKey: "areaTitle",
    header: "Tiêu đề",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '200px',       // Chiều rộng tối đa của cột
          whiteSpace: 'normal',    // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue('areaTitle')}
      </div>
    ),
  },
  {
    accessorKey: "areaSubtitle",
    header: "Tiêu đề phụ",
    cell: ({ row }) => (
      <div
        style={{
          maxWidth: '200px',       // Chiều rộng tối đa của cột
          whiteSpace: 'normal',    // Cho phép nội dung xuống dòng
          overflowWrap: 'break-word', // Cho phép cắt từ nếu cần thiết
        }}
      >
        {row.getValue('areaSubtitle')}
      </div>
    ),
  },
  {
  accessorKey: "areaContent",
  header: "Nội dung",
  cell: ({ row }) => {
    const content = (row.getValue("areaContent") as string) || "";

    // Thay thế tất cả URL ảnh trong nội dung bằng thẻ <img>
    const updatedContent = content.replace(
        /(https?:\/\/[^\s"<>]+(?:png|jpg|jpeg|gif|bmp|svg))/gi,  // Biểu thức chính quy tìm tất cả các URL ảnh
      (match) => {
        return `<img src="${match}" alt="Image" style="max-width: 100%; height: auto; object-fit: contain; margin-bottom: 10px;" />`;
      }
    );
    console.log("Updated Content:", updatedContent); // In ra nội dung đã cập nhật

    return (
      <div
        style={{
          maxWidth: '400px',
          maxHeight: '400px',
          whiteSpace: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          overflowWrap: 'break-word',
        }}
        dangerouslySetInnerHTML={{ __html: updatedContent }}  // Hiển thị HTML với ảnh
      />
    );
  },
}
,
  {
    accessorKey: "bannerImg",
    header: "Ảnh Nền",
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
      return <ActiveAreaActions data={data} />
    },
  },
];
