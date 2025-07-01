"use client"

import { useState, useEffect, useRef } from "react"
import {
  getUnpaidRevenuesForAdmin,
  getPaymentHistoryForAdmin,
  processPaymentForAdmin,
  getDashboardStatsForAdmin,
} from "./admin-revenue-service"
import type {
  RevenueAdmin,
  PaymentHistoryAdmin,
  ProcessPaymentRequest,
  DashboardStatsAdmin,
} from "@/types/revenue"
import { PagedResult } from "@/types/pagedResult"

export const useDashboardStatsForAdmin = () => {
  const [data, setData] = useState<DashboardStatsAdmin | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Add small delay to prevent rapid cancellations
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Check if request was canceled during delay
        if (controller.signal.aborted) {
          return
        }

        const result = await getDashboardStatsForAdmin(controller.signal)

        // Check if request was canceled after completion
        if (!controller.signal.aborted) {
          setData(result)
        }
      } catch (err) {
        // Only set error if request wasn't canceled
        if (!controller.signal.aborted) {
          console.error("Error fetching dashboard stats:", err)

          if (err instanceof Error) {
            if (err.name === "AbortError" || err.name === "CanceledError") {
              // Request was canceled, don't show error
              return
            }
            setError(err.message === "Failed to fetch" ? "Không thể kết nối đến server" : err.message)
          } else {
            setError("Có lỗi xảy ra khi tải dữ liệu")
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      controller.abort()
    }
  }, [])

  const refetch = () => {
    setData(null)
    setError(null)
    setLoading(true)
  }

  return { data, loading, error, refetch }
}

export const useUnpaidRevenuesForAdmin = (page: number, pageSize: number, searchTerm?: string) => {
  const [data, setData] = useState<PagedResult<RevenueAdmin> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Add small delay to prevent rapid cancellations
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Check if request was canceled during delay
        if (controller.signal.aborted) {
          return
        }

        const result = await getUnpaidRevenuesForAdmin(page, pageSize, searchTerm, controller.signal)

        // Check if request was canceled after completion
        if (!controller.signal.aborted) {
          setData(result)
        }
      } catch (err) {
        // Only set error if request wasn't canceled
        if (!controller.signal.aborted) {
          console.error("Error fetching unpaid revenues:", err)

          if (err instanceof Error) {
            if (err.name === "AbortError" || err.name === "CanceledError") {
              // Request was canceled, don't show error
              return
            }
            setError(err.message === "Failed to fetch" ? "Không thể kết nối đến server" : err.message)
          } else {
            setError("Có lỗi xảy ra khi tải dữ liệu")
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      controller.abort()
    }
  }, [page, pageSize, searchTerm])

  const refetch = () => {
    setData(null)
    setError(null)
    setLoading(true)
  }

  return { data, loading, error, refetch }
}

export const usePaymentHistoryForAdmin = (page: number, pageSize: number) => {
  const [data, setData] = useState<PagedResult<PaymentHistoryAdmin> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Cancel previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller
    const controller = new AbortController()
    abortControllerRef.current = controller

    const fetchData = async () => {
      try {
        setLoading(true)
        setError(null)

        // Add small delay to prevent rapid cancellations
        await new Promise((resolve) => setTimeout(resolve, 100))

        // Check if request was canceled during delay
        if (controller.signal.aborted) {
          return
        }

        const result = await getPaymentHistoryForAdmin(page, pageSize, controller.signal)

        // Check if request was canceled after completion
        if (!controller.signal.aborted) {
          setData(result)
        }
      } catch (err) {
        // Only set error if request wasn't canceled
        if (!controller.signal.aborted) {
          console.error("Error fetching payment history:", err)

          if (err instanceof Error) {
            if (err.name === "AbortError" || err.name === "CanceledError") {
              // Request was canceled, don't show error
              return
            }
            setError(err.message === "Failed to fetch" ? "Không thể kết nối đến server" : err.message)
          } else {
            setError("Có lỗi xảy ra khi tải dữ liệu")
          }
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    fetchData()

    // Cleanup function
    return () => {
      controller.abort()
    }
  }, [page, pageSize])

  return { data, loading, error }
}

export const useProcessPaymentForAdmin = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const processPaymentAsync = async (request: ProcessPaymentRequest) => {
    const controller = new AbortController()

    try {
      setLoading(true)
      setError(null)

      const result = await processPaymentForAdmin(request, controller.signal)
      return result
    } catch (err) {
      console.error("Error processing payment:", err)

      if (err instanceof Error) {
        if (err.name === "AbortError" || err.name === "CanceledError") {
          throw new Error("Yêu cầu bị hủy")
        }
        const errorMessage = err.message === "Failed to fetch" ? "Không thể kết nối đến server" : err.message
        setError(errorMessage)
        throw new Error(errorMessage)
      } else {
        const errorMessage = "Payment processing failed"
        setError(errorMessage)
        throw new Error(errorMessage)
      }
    } finally {
      setLoading(false)
    }
  }

  return { processPaymentAsync, loading, error }
}
