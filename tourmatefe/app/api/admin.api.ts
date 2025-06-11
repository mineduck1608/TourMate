import { toast } from "react-toastify"
import http from "../utils/http"

// Types matching .NET DTOs
export interface FinancialStatus {
  totalRevenue: number
  tourCommissionRevenue: number
  membershipRevenue: number
  netProfit: number
  profitMargin: number
  revenueGrowth: number
  commissionGrowth: number
  membershipGrowth: number
}

export interface AreaStatus {
  areaId: number
  areaName: string
  completedTours: number
  totalRequests: number
  averageRating: number
  totalRevenue: number
  cancelledTours: number
  activeGuides: number
}

export interface UserStatus {
  newUsers: number
  newGuides: number
  totalActiveUsers: number
  totalActiveGuides: number
  userGrowthRate: number
  guideGrowthRate: number
}

export interface TourPerformance {
  tourId: number
  tourTitle: string
  areaName: string
  profit: number
  averageBids: number
  averageRating: number
  completedCount: number
}

export interface GuidePerformance {
  guideId: number
  guideName: string
  areaName: string
  averageRating: number
  totalTours: number
  totalRevenue: number
  completionRate: number
}

export interface MembershipStatus {
  packageId: number
  packageName: string
  price: number
  duration: string
  totalSales: number
  revenue: number
  growthRate: number
}

export interface AdminDashboardData {
  financial: FinancialStatus
  areas: AreaStatus[]
  users: UserStatus
  topTours: TourPerformance[]
  topGuides: GuidePerformance[]
  membershipPackages: MembershipStatus[]
  cancelledToursByArea: AreaStatus[]
}

export interface DashboardFilters {
  fromDate?: string
  toDate?: string
  areaFilter?: string
}

// API functions
export const getDashboardData = async (filters: DashboardFilters, signal?: AbortSignal) => {
  try {
    const response = await http.get<AdminDashboardData>("admin-dashboard", {
      params: filters,
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải dữ liệu dashboard")
    }
    throw error
  }
}

export const getFinancialStats = async (filters: DashboardFilters, signal?: AbortSignal) => {
  try {
    const response = await http.get<FinancialStatus>("admin-dashboard/financial", {
      params: filters,
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải thống kê tài chính")
    }
    throw error
  }
}

export const getAreaStats = async (filters: DashboardFilters, signal?: AbortSignal) => {
  try {
    const response = await http.get<AreaStatus[]>("admin-dashboard/areas", {
      params: filters,
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải thống kê khu vực")
    }
    throw error
  }
}

export const getUserStats = async (filters: DashboardFilters, signal?: AbortSignal) => {
  try {
    const response = await http.get<UserStatus>("admin-dashboard/users", {
      params: filters,
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải thống kê người dùng")
    }
    throw error
  }
}

export const getTopTours = async (filters: DashboardFilters, limit = 10, signal?: AbortSignal) => {
  try {
    const response = await http.get<TourPerformance[]>("admin-dashboard/top-tours", {
      params: { ...filters, limit },
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải top tour")
    }
    throw error
  }
}

export const getTopGuides = async (filters: DashboardFilters, limit = 10, signal?: AbortSignal) => {
  try {
    const response = await http.get<GuidePerformance[]>("admin-dashboard/top-guides", {
      params: { ...filters, limit },
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải top hướng dẫn viên")
    }
    throw error
  }
}

export const getMembershipStats = async (filters: DashboardFilters, signal?: AbortSignal) => {
  try {
    const response = await http.get<MembershipStatus[]>("admin-dashboard/membership", {
      params: filters,
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải thống kê membership")
    }
    throw error
  }
}

export const getCancelledToursByArea = async (filters: DashboardFilters, signal?: AbortSignal) => {
  try {
    const response = await http.get<AreaStatus[]>("admin-dashboard/cancelled-tours", {
      params: filters,
      signal,
    })
    return response.data
  } catch (error) {
    if (!signal?.aborted) {
      toast.error("Không thể tải thống kê tour bị hủy")
    }
    throw error
  }
}

// Admin API object for easier imports
export const adminApi = {
  getDashboardData,
  getFinancialStats,
  getAreaStats,
  getUserStats,
  getTopTours,
  getTopGuides,
  getMembershipStats,
  getCancelledToursByArea,
}
