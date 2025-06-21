// "use client";
// import * as React from "react";
// import {
//   useReactTable,
//   getCoreRowModel,
//   flexRender,
//   ColumnDef,
// } from "@tanstack/react-table";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Button } from "@/components/ui/button";

// interface DataTableProps<T> {
//   columns: ColumnDef<T>[];
//   data: T[];
//   isLoading?: boolean;
// }

// export function DataTable<T>({ columns, data, isLoading }: DataTableProps<T>) {
//   const table = useReactTable({
//     data,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//   });

//   if (isLoading) return <div>Đang tải dữ liệu...</div>;

//   return (
//     <div className="rounded-md border bg-white">
//       <Table>
//         <TableHeader>
//           {table.getHeaderGroups().map((headerGroup) => (
//             <TableRow key={headerGroup.id}>
//               {headerGroup.headers.map((header) => (
//                 <TableHead key={header.id}>
//                   {flexRender(
//                     header.column.columnDef.header,
//                     header.getContext()
//                   )}
//                 </TableHead>
//               ))}
//             </TableRow>
//           ))}
//         </TableHeader>
//         <TableBody>
//           {table.getRowModel().rows.length > 0 ? (
//             table.getRowModel().rows.map((row) => (
//               <TableRow key={row.id}>
//                 {row.getVisibleCells().map((cell) => (
//                   <TableCell key={cell.id}>
//                     {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                   </TableCell>
//                 ))}
//               </TableRow>
//             ))
//           ) : (
//             <TableRow>
//               <TableCell colSpan={columns.length} className="text-center">
//                 Không có dữ liệu
//               </TableCell>
//             </TableRow>
//           )}
//         </TableBody>
//       </Table>
//     </div>
//   );
// }
