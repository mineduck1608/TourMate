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
// import { Input } from "@/components/ui/input";

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
import { addCustomer, getCustomers } from "@/app/api/customer.api";
import AddCustomerModal from "./addCustomerModal";
import { Customer } from "@/types/customer";
import { Input } from "@/components/ui/input";
interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalResults: number; // Thêm trường totalResults
  totalPages: number; // Thêm trường totalPages
  page: number; // Thêm trường page
}

export function DataTable<TData, TValue>({
  columns,
  data,
  totalResults,
  totalPages,
  page,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

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

  const { refetch } = useQuery({
    queryKey: ["customer", page], // Pass page and limit as part of the query key
    queryFn: ({ queryKey }) => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const [, page, limit] = queryKey; // Destructure page and limit from queryKey
      return getCustomers(page, limit, controller.signal, searchTerm);
    },
    enabled: false, // Tắt tự động fetch, chỉ gọi refetch khi cần
  });

  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (data: Customer) => {
    addCustomerMutation.mutate(data);
  };

  // Mutation for adding customer
  const addCustomerMutation = useMutation({
    mutationFn: addCustomer,
    onSuccess: () => {
      toast.success("Thêm khách hàng thành công");
      refetch(); // Refetch dữ liệu sau khi thêm thành công
    },
    onError: (error) => {
      toast.error(
        (error as { response?: { data?: { msg?: string } } })?.response?.data
          ?.msg || "Thêm khách hàng thất bại"
      );
    },
  });

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

        <Button
          variant="outline"
          className="ml-auto"
          onClick={() => openModal()}
        >
          Tạo khách hàng mới
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
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Dữ liệu trống.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} trên {totalResults}{" "}
          dòng được chọn.
        </div>
        {/* Previous Button */}
        {page === 1 ? (
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
        ) : (
          <Link
            href={`/admin/customer?page=${page - 1}`}
          >
            <Button variant="outline" size="sm">
              Trước
            </Button>
          </Link>
        )}

        {/* Page Numbers */}
        <span className="text-sm text-muted-foreground">
          Trang {page} trên {totalPages}
        </span>

        {/* Next Button */}
        {page === totalPages ? (
          <Button
            variant="outline"
            size="sm"
            disabled={!table.getCanNextPage()}
          >
            Sau
          </Button>
        ) : (
          <Link href={`/admin/customer?page=${page + 1}`}>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </Link>
        )}
      </div>
      <AddCustomerModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onSave={handleSave}
      />
    </div>
  );
}
