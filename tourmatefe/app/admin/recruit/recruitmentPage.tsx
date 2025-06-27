import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../../utils/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getCVApplications } from "@/app/api/cv-application.api";
import { RecruitmentStats } from "./recruitmentStats";

const LIMIT = 10;

export default function CVApplicationsPage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const { data, isLoading, error } = useQuery({
    queryKey: ["cv-applications", page],
    queryFn: async () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 500);
      const response = await getCVApplications(page, LIMIT, controller.signal);
      return response;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });



  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading data</div>;

  return (
    <div className="container mx-auto py-2">
      <RecruitmentStats applications={data?.result || []} />

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
