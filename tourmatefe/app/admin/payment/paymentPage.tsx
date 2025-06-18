import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../../utils/utils";
import { DataTable } from "./data-table";
import { columns } from "./column";
import { getAllPayments } from "@/app/api/payment.api";
import { PagedResult } from "@/types/pagedResult";
import { Payment } from "@/types/payment";

const LIMIT = 10;

export default function PaymentsPage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const { data, isLoading, error } = useQuery<PagedResult<Payment>>({
    queryKey: ["payments", page],
    queryFn: async () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const response = await getAllPayments(page, LIMIT, controller.signal);
      console.log("API response:", response);
      return response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  console.log("Current data:", data);
  console.log("Data being passed to DataTable:", {
    result: data?.result,
    totalResults: data?.totalResult,
    totalPages: data?.totalPage,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center p-4">Lỗi khi tải dữ liệu</div>
    );
  }

  return (
    <div className="container mx-auto py-2">
      <div className="rounded-md border p-3">
        <DataTable
          columns={columns}
          data={data?.result || []}
          totalResults={data?.totalResult || 0}
          totalPages={data?.totalPage || 0}
          page={page}
        />
      </div>
    </div>
  );
}
