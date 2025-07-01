import { getRevenueById, getUnpaidRevenues, processPayment, getPaymentHistory, getDashboardStats } from "@/app/api/revenue.api"
import type { ProcessPaymentRequest } from "@/types/revenue"

export const getDashboardStatsForAdmin = async (signal?: AbortSignal) => {
  return await getDashboardStats(signal)
}

export const getRevenueByIdForAdmin = async (revenueId: number, signal?: AbortSignal) => {
  return await getRevenueById(revenueId, signal)
}

export const getUnpaidRevenuesForAdmin = async (page = 1, pageSize = 10, searchTerm?: string, signal?: AbortSignal) => {
  return await getUnpaidRevenues(page, pageSize, searchTerm, signal)
}

export const processPaymentForAdmin = async (request: ProcessPaymentRequest, signal?: AbortSignal) => {
  return await processPayment(request, signal)
}

export const getPaymentHistoryForAdmin = async (page = 1, pageSize = 10, signal?: AbortSignal) => {
  return await getPaymentHistory(page, pageSize, signal)
}
