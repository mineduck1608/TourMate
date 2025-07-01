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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { getAllAccount } from "@/app/api/account.api";
import { getAllRevenue } from "@/app/api/revenue.api";
import { getTourGuides } from "@/app/api/tour-guide.api";

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
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const LIMIT = 20; // Giới hạn số bản ghi/trang

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
  const { refetch: refetchRevenues } = useQuery({
    queryKey: ["revenues", page],
    queryFn: ({ queryKey, signal }) => {
      const [, currentPage] = queryKey;
      return getAllRevenue(currentPage, LIMIT, signal);
    },
    enabled: false, // Tắt tự động fetch khi component mount, gọi refetch thủ công
  });

  const { refetch: refetchTourGuides } = useQuery({
    queryKey: ["tour-guides", page],
    queryFn: ({ queryKey, signal }) => {
      const [, currentPage] = queryKey;
      return getTourGuides(currentPage, LIMIT, signal);
    },
    enabled: false, // Tắt tự động fetch khi component mount, gọi refetch thủ công
  });

  const { refetch: refetchAccounts } = useQuery({
    queryKey: ["accounts", page],
    queryFn: ({ queryKey, signal }) => {
      const [, currentPage] = queryKey;
      return getAllAccount(currentPage, LIMIT, signal);
    },
    enabled: false, // Tắt tự động fetch khi component mount, gọi refetch thủ công
  });

  React.useEffect(() => {
    refetchRevenues();
    refetchTourGuides();
    refetchAccounts();
  }, [page]);
  React.useEffect(() => {
    refetchRevenues();
    refetchTourGuides();
    refetchAccounts();
  }, []);

  return (
    <div>
      <div className="rounded-md border bg-white text-center">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="text-center">
                    {!header.isPlaceholder &&
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
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

      {/* Pagination */}
      <div className="flex items-center justify-end space-x-2 pt-5">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} trên {totalResults}{" "}
          dòng được chọn.
        </div>

        {page === 1 ? (
          <Button variant="outline" size="sm" disabled>
            Trước
          </Button>
        ) : (
          <Link href={`/admin/revenue?page=${page - 1}`}>
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
          <Link href={`/admin/revenue?page=${page + 1}`}>
            <Button variant="outline" size="sm">
              Sau
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
