"use client";
import * as React from "react";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { columns, RevenueRecord } from "./column";

const mockData: RevenueRecord[] = [
  {
    revenueId: "REV-001",
    tourGuide: "Sarah Johnson",
    customer: "John Smith",
    tourDescription: "Historical Downtown Tour",
    bookDate: "2024-01-15",
    amount: 120,
    revenuePercent: 70,
    revenueAmount: 84,
    status: "Unpaid",
  },
  {
    revenueId: "REV-002",
    tourGuide: "Michael Chen",
    customer: "Emma Wilson",
    tourDescription: "Food & Culture Experience",
    bookDate: "2024-01-16",
    amount: 95,
    revenuePercent: 65,
    revenueAmount: 61.75,
    status: "Paid",
  },
  {
    revenueId: "REV-003",
    tourGuide: "Sarah Johnson",
    customer: "David Brown",
    tourDescription: "City Highlights Tour",
    bookDate: "2024-01-17",
    amount: 150,
    revenuePercent: 70,
    revenueAmount: 105,
    status: "Unpaid",
  },
  {
    revenueId: "REV-004",
    tourGuide: "Emma Rodriguez",
    customer: "Lisa Garcia",
    tourDescription: "Adventure Hiking Tour",
    bookDate: "2024-01-18",
    amount: 200,
    revenuePercent: 75,
    revenueAmount: 150,
    status: "Unpaid",
  },
  {
    revenueId: "REV-005",
    tourGuide: "Michael Chen",
    customer: "Robert Taylor",
    tourDescription: "Local Markets Tour",
    bookDate: "2024-01-19",
    amount: 80,
    revenuePercent: 65,
    revenueAmount: 52,
    status: "Unpaid",
  },
  {
    revenueId: "REV-006",
    tourGuide: "David Kim",
    customer: "Maria Lopez",
    tourDescription: "Art Gallery Tour",
    bookDate: "2024-01-20",
    amount: 110,
    revenuePercent: 60,
    revenueAmount: 66,
    status: "Paid",
  },
  {
    revenueId: "REV-007",
    tourGuide: "Emma Rodriguez",
    customer: "James Wilson",
    tourDescription: "Nature Photography Tour",
    bookDate: "2024-01-21",
    amount: 180,
    revenuePercent: 75,
    revenueAmount: 135,
    status: "Unpaid",
  },
  {
    revenueId: "REV-008",
    tourGuide: "Lisa Thompson",
    customer: "Anna Davis",
    tourDescription: "Sunset Photography Tour",
    bookDate: "2024-01-22",
    amount: 130,
    revenuePercent: 70,
    revenueAmount: 91,
    status: "Unpaid",
  },
];

export function DataTable() {
  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="bg-white rounded-xl p-6 mt-6 border">
      <div className="font-semibold text-lg mb-1">Revenue Records</div>
      <div className="text-gray-500 mb-5 text-sm">
        Detailed view of all tour guide revenue records
      </div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
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
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="text-center">
                Không có dữ liệu
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
