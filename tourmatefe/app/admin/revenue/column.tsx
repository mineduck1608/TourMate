import { ColumnDef } from "@tanstack/react-table";

export type RevenueRecord = {
  revenueId: string;
  tourGuide: string;
  customer: string;
  tourDescription: string;
  bookDate: string;
  amount: number;
  revenuePercent: number;
  revenueAmount: number;
  status: "Paid" | "Unpaid";
  avatarUrl?: string;
};

export const columns: ColumnDef<RevenueRecord>[] = [
  {
    id: "select",
    header: () => <input type="checkbox" disabled />,
    cell: () => <input type="checkbox" />,
    size: 32,
  },
  {
    accessorKey: "tourGuide",
    header: "Tour Guide",
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 font-bold">
          {/* Avatar placeholder */}
          {row.original.avatarUrl ? (
            <img
              src={row.original.avatarUrl}
              alt={row.original.tourGuide}
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <span>✦</span>
          )}
        </div>
        <span className="font-semibold">{row.original.tourGuide}</span>
      </div>
    ),
  },
  {
    accessorKey: "customer",
    header: "Customer",
  },
  // {
  //   accessorKey: "tourDescription",
  //   header: "Tour Description",
  //   cell: ({ getValue }) => (
  //     <span className="truncate block max-w-[180px]">{getValue()}</span>
  //   ),
  // },
  {
    accessorKey: "bookDate",
    header: "Book Date",
    cell: ({ getValue }) => new Date(getValue() as string).toLocaleDateString(),
  },
  {
    accessorKey: "amount",
    header: "Amount",
    cell: ({ getValue }) => (
      <span className="font-semibold text-gray-800">
        ${Number(getValue()).toFixed(2)}
      </span>
    ),
  },
  {
    accessorKey: "revenuePercent",
    header: "Revenue %",
    cell: ({ getValue }) => `${getValue()}%`,
  },
  {
    accessorKey: "revenueAmount",
    header: "Revenue Amount",
    cell: ({ getValue }) => (
      <span className="font-semibold">${Number(getValue()).toFixed(2)}</span>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ getValue }) =>
      getValue() === "Paid" ? (
        <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-semibold">
          Paid
        </span>
      ) : (
        <span className="bg-red-100 text-red-500 px-3 py-1 rounded-full text-xs font-semibold">
          Unpaid
        </span>
      ),
  },
];
