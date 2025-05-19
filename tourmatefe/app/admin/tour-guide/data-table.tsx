"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Link from "next/link";
import { addTourGuide, getTourGuides } from "@/app/api/tour-guide.api";
import { TourGuide } from "@/types/tourGuide";
import AddTourGuideModal from "./addTourGuideModal";
import { Input } from "@/components/ui/input";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalResults: number;
  totalPages: number;
  page: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalResults,
  totalPages,
  page,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const LIMIT = 10; // Giới hạn số bản ghi/trang

  // React Table setup
  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  // React Query lấy dữ liệu theo page
  const { refetch } = useQuery({
    queryKey: ["tour-guide", page],
    queryFn: ({ queryKey, signal }) => {
      const [, currentPage] = queryKey;
      return getTourGuides(currentPage, LIMIT, signal, searchTerm);
    },
    enabled: false, // Tắt tự động fetch khi component mount, gọi refetch thủ công
  });

  React.useEffect(() => {
    refetch();
  }, [page]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  // Mutation thêm hướng dẫn viên
  const addTourGuideMutation = useMutation({
    mutationFn: addTourGuide,
    onSuccess: () => {
      toast.success("Thêm hướng dẫn viên thành công");
      refetch();
      closeModal();
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data?.msg || "Thêm hướng dẫn viên thất bại"
      );
    },
  });

  const handleSave = (data: TourGuide) => {
    addTourGuideMutation.mutate(data);
  };

   const [searchTerm, setSearchTerm] = React.useState("");
  
    React.useEffect(() => {
      refetch();
    }, [searchTerm]);

  return (
    <div>
      <div className="flex items-center pb-5">
         <Input
          type="text"
          placeholder="Tìm kiếm số điện thoại"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm bg-white mr-5 p-2 border rounded"
        />
        <Button variant="outline" className="ml-auto" onClick={openModal}>
          Tạo hướng dẫn viên mới
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-5">
              Hiển thị cột
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {!header.isPlaceholder &&
                      flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  Dữ liệu trống.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 pt-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} trên {totalResults} dòng được chọn.
        </div>

        {page === 1 ? (
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
        ) : (
          <Link href={`/admin/tour-guide?page=${page - 1}`}>
            <Button variant="outline" size="sm">
              Trước
            </Button>
          </Link>
        )}

        <span className="text-sm text-muted-foreground">
          Trang {page} trên {totalPages}
        </span>

        {page === totalPages ? (
          <Button variant="outline" size="sm" disabled>
            Sau
          </Button>
        ) : (
          <Link href={`/admin/tour-guide?page=${page + 1}`}>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </Link>
        )}
      </div>

      <AddTourGuideModal isOpen={isModalOpen} onClose={closeModal} onSave={handleSave} />
    </div>
  );
}
