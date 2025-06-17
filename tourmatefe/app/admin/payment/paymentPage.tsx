"use client";

import { useQuery } from "@tanstack/react-query";
import { Payment } from "@/types/payment";
import { columns } from "./column";
import { DataTable } from "./data-table";
import { getAllPayments } from "@/app/api/payment.api";

export default function PaymentPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => getAllPayments(),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="hidden h-full flex-1 flex-col space-y-8 p-8 md:flex">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            Lịch sử giao dịch
          </h2>
          <p className="text-muted-foreground">
            Danh sách các giao dịch trong hệ thống
          </p>
        </div>
      </div>
      <DataTable data={data?.result || []} columns={columns} />
    </div>
  );
}
