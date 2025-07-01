import { useQuery } from "@tanstack/react-query";
import { useQueryString } from "../../utils/utils";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { getTourGuides } from "@/app/api/tour-guide.api";
import { getSimplifiedAreas } from "@/app/api/active-area.api";
import { SimplifiedAreaContext } from "./simplified-area-context";

const LIMIT = 10;

export default function TourGuidePage() {
  const queryString: { page?: string } = useQueryString();
  const page = Number(queryString.page) || 1;

  const { data } = useQuery({
    queryKey: ['tour-guide', page],
    queryFn: () => {
      const controller = new AbortController();
      setTimeout(() => {
        controller.abort();
      }, 5000);
      return getTourGuides(page, LIMIT, controller.signal);
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  const simplifiedAreaQuery = useQuery({
    queryKey: ['simplified-area'],
    queryFn: () => getSimplifiedAreas(),
    staleTime: 24 * 3600 * 1000
  })

  const simplifiedAreas = simplifiedAreaQuery.data?.data ?? []
  const simplifiedAreaMap = simplifiedAreas.reduce(
    (acc: Record<number, string>, area: { areaId: number; areaName: string }) => {
      acc[area.areaId] = area.areaName;
      return acc;
    },
    {}
  );

  return (
    <div>
      <SimplifiedAreaContext.Provider value={{ areas: simplifiedAreaMap }}>
        <DataTable
          columns={columns}
          data={data?.result ?? []}
          totalResults={data?.totalResult ?? 0}
          totalPages={data?.totalPage ?? 0}
          page={page}
        />
      </SimplifiedAreaContext.Provider>
    </div>
  );
}
