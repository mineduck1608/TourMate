"use client";

import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../../utils/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getCVApplications } from "@/app/api/cv-application.api";

const LIMIT = 10;

export default function RecruitPage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const { data } = useQuery({
    queryKey: ["applications", page],
    queryFn: async () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      const response = await getCVApplications(page, LIMIT, controller.signal);
      console.log("API Response from RecruitPage:", response); // Add this line
      return response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  console.log("Current data in RecruitPage:", data); // Add this line
  return (
    <div>
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
