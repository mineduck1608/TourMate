import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../../utils/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getCustomers } from "@/app/api/customer.api";

const LIMIT = 10;

export default function CustomerPage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const { data } = useQuery({
    queryKey: ['customer', page],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return getCustomers(page, LIMIT, controller.signal);
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return (
    <div>
      {/* Render dữ liệu từ `data` */}
      <DataTable 
        columns={columns} 
        data={data?.result ?? []} 
        totalResults={data?.totalResult ?? 0} 
        totalPages={data?.totalPage ?? 0} 
        page={page}
      />
    </div>
  );
}
