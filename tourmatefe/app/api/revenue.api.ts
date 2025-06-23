import { toast } from "react-toastify"
import { PagedResult } from "@/types/pagedResult";
import http from "../utils/http";
import {
  RevenueDto,
  RevenueStatsDto,
  MonthlyRevenueDto,
  RevenueFilterDto,
} from "../../types/revenue";
// Types based on .NET API DTOs

// Revenue API functions using axios
export const getRevenueStats = async (
  tourGuideId: number,
  month: number,
  year: number,
  signal?: AbortSignal
) => {
  const loadingToast = toast.loading("Đang tải dữ liệu doanh thu...");

  try {
    const response = await http.get<RevenueStatsDto>(
      `revenue/stats/${tourGuideId}`,
      {
        params: {
          month,
          year,
        },
        signal,
      }
    );

    toast.update(loadingToast, {
      render: "Tải dữ liệu thành công!",
      type: "success",
      isLoading: false,
      autoClose: 2000,
    });

    return response.data;
  } catch (error) {
    toast.update(loadingToast, {
      render: "Không thể tải dữ liệu doanh thu",
      type: "error",
      isLoading: false,
      autoClose: 5000,
    });
    throw error;
  }
};

export const getMonthlyRevenue = async (
  tourGuideId: number,
  month: number,
  year: number,
  signal?: AbortSignal
) => {
  const response = await http.get<MonthlyRevenueDto>(
    `revenue/monthly/${tourGuideId}`,
    {
      params: {
        month,
        year,
      },
      signal,
    }
  );
  return response.data;
};

export const getRevenueList = async (
  filter: RevenueFilterDto,
  signal?: AbortSignal
) => {
  const response = await http.get<RevenueDto[]>("revenue/list", {
    params: filter,
    signal,
  });
  return response.data;
};

export const getRevenueById = async (
  revenueId: number,
  signal?: AbortSignal
) => {
  const response = await http.get<RevenueDto>(`revenue/${revenueId}`, {
    signal,
  });
  return response.data;
};

export const createRevenue = async (
  data: Omit<RevenueDto, "revenueId" | "createdAt">
) => {
  const response = await http.post<RevenueDto>("revenue", data);
  toast.success("Tạo doanh thu thành công!");
  return response.data;
};

export const updateRevenue = async (
  revenueId: number,
  data: Partial<RevenueDto>
) => {
  const response = await http.put<RevenueDto>(`revenue/${revenueId}`, data);
  toast.success("Cập nhật doanh thu thành công!");
  return response.data;
};

export const deleteRevenue = async (revenueId: number) => {
  await http.delete(`revenue/${revenueId}`);
  toast.success("Xóa doanh thu thành công!");
};

export const getGrowthPercentage = async (
  tourGuideId: number,
  month: number,
  year: number,
  signal?: AbortSignal
) => {
  const response = await http.get<{ growthPercentage: number }>(
    `revenue/growth/${tourGuideId}`,
    {
      params: {
        month,
        year,
      },
      signal,
    }
  );
  return response.data;
};

export const getAllRevenue = async (
  page: number | string,
  limit: number | string,
  signal?: AbortSignal
) => {
  const res = await http.get<PagedResult<RevenueDto>>("revenue", {
    params: {
      pageSize: limit,
      pageIndex: page,
    },
    signal,
  });
};

export const exportRevenueExcel = async (tourGuideId: number, month: number, year: number) => {
  const loadingToast = toast.loading("Đang tạo file Excel...")

  try {
    const response = await http.get(`revenue/export/${tourGuideId}`, {
      params: {
        month,
        year,
      },
      responseType: "blob",
      headers: {
        Accept: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      },
    })

    // Create download link
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement("a")
    link.href = url
    link.setAttribute("download", `revenue-report-${month}-${year}.xlsx`)
    document.body.appendChild(link)
    link.click()
    link.remove()
    window.URL.revokeObjectURL(url)

    toast.update(loadingToast, {
      render: "Xuất Excel thành công!",
      type: "success",
      isLoading: false,
      autoClose: 3000,
    })

    return response.data
  } catch (error) {
    toast.update(loadingToast, {
      render: "Không thể xuất file Excel",
      type: "error",
      isLoading: false,
      autoClose: 5000,
    })
    throw error
  }
}

// Revenue API object for easier imports
export const revenueApi = {
  getStats: getRevenueStats,
  getMonthly: getMonthlyRevenue,
  getList: getRevenueList,
  getById: getRevenueById,
  create: createRevenue,
  update: updateRevenue,
  delete: deleteRevenue,
  getGrowth: getGrowthPercentage,
  exportExcel: exportRevenueExcel,
}
