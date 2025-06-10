"use client"

import { adminApi, DashboardFilters } from "@/app/api/admin.api"
import { useQuery } from "@tanstack/react-query"

export function useAdminDashboard(fromDate?: string, toDate?: string, areaFilter?: string) {
  return useQuery({
    queryKey: [
      "adminDashboard",
      fromDate,
      toDate, 
      areaFilter,
    ],
    queryFn: ({ signal }) => adminApi.getDashboardData({ fromDate, toDate, areaFilter }, signal),
    enabled: true,
    staleTime: 5 * 60 * 1000, // 5 phút
    gcTime: 10 * 60 * 1000,
    retry: false, // Tắt tự động retry
    refetchOnWindowFocus: false, // Tắt tự động refetch khi focus window
    refetchOnMount: false, // Tắt tự động refetch khi mount component
    refetchOnReconnect: false // Tắt tự động refetch khi reconnect
  })
}

export function useFinancialStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: [
      "financialStats",
      filters.fromDate,
      filters.toDate,
      filters.areaFilter,
    ],
    queryFn: ({ signal }) => adminApi.getFinancialStats(filters, signal),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useAreaStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: [
      "areaStats",
      filters.fromDate,
      filters.toDate,
      filters.areaFilter,
    ],
    queryFn: ({ signal }) => adminApi.getAreaStats(filters, signal),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useUserStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: [
      "userStats",
      filters.fromDate,
      filters.toDate,
      filters.areaFilter,
    ],
    queryFn: ({ signal }) => adminApi.getUserStats(filters, signal),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}

export function useMembershipStats(filters: DashboardFilters) {
  return useQuery({
    queryKey: [
      "membershipStats",
      filters.fromDate,
      filters.toDate,
      filters.areaFilter,
    ],
    queryFn: ({ signal }) => adminApi.getMembershipStats(filters, signal),
    enabled: true,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  })
}