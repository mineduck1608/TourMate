"use client"

import type React from "react"

import { useEffect, useState, useRef, useCallback } from "react"
import { Bell, Dot, Clock, ExternalLink, Loader2, Check, Trash2 } from "lucide-react"
import * as signalR from "@microsoft/signalr"
import { apiHub } from "@/types/constants"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  type Notification,
} from "@/app/api/notification.api"
import { toast } from "react-toastify"

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const connectionRef = useRef<signalR.HubConnection | null>(null)
  const processedNotifications = useRef<Set<string>>(new Set()) // Track processed notifications
  const router = useRouter()

  // Load initial notifications
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if (!token) return

    loadNotifications(1, true)
  }, [])

  // SignalR connection
  useEffect(() => {
    const token = sessionStorage.getItem("accessToken")
    if (!token) return

    const connection = new signalR.HubConnectionBuilder()
      .withUrl(`${apiHub}/appHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build()

    connection
      .start()
      .then(() => {
        connectionRef.current = connection
      })
      .catch((err) => console.error("SignalR connection error:", err))

    // Listen for notifications - with deduplication
    connection.on("ReceiveNotification", (data) => {

      // Create a unique key for deduplication
      const notificationKey = `${data.message}_${data.link}_${data.createdAt}`

      // Check if we've already processed this notification
      if (processedNotifications.current.has(notificationKey)) {
        return
      }

      // Mark as processed
      processedNotifications.current.add(notificationKey)

      const notification: Notification = {
        id: `temp_${Date.now()}_${Math.random()}`, // More unique ID
        message: data.message,
        link: data.link,
        createdAt: data.createdAt || new Date().toISOString(),
        isRead: false,
      }

      // Add to notifications list
      setNotifications((prev) => {
        // Double check for duplicates in state
        const isDuplicate = prev.some(
          (n) =>
            n.message === notification.message &&
            n.link === notification.link &&
            Math.abs(new Date(n.createdAt).getTime() - new Date(notification.createdAt).getTime()) < 5000, // Within 5 seconds
        )

        if (isDuplicate) {
          return prev
        }

        return [notification, ...prev]
      })

      setTotalCount((prev) => prev + 1)

      // // Show toast notification only once
      // toast.info("Bạn có thông báo mới!", {
      //   position: "top-right",
      //   autoClose: 3000,
      //   toastId: notificationKey, // Prevent duplicate toasts
      // })
    })

    return () => {
      if (connectionRef.current) {
        connectionRef.current.stop()
        connectionRef.current = null
      }
    }
  }, [])

  // Clean up processed notifications periodically (prevent memory leak)
  useEffect(() => {
    const cleanup = setInterval(
      () => {
        // Keep only recent notifications (last hour)
        const oneHourAgo = Date.now() - 60 * 60 * 1000
        const recentKeys = new Set<string>()

        processedNotifications.current.forEach((key) => {
          // Extract timestamp from key if possible, otherwise keep it
          const parts = key.split("_")
          const timestamp = parts[parts.length - 1]
          if (!timestamp || Number.parseInt(timestamp) > oneHourAgo) {
            recentKeys.add(key)
          }
        })

        processedNotifications.current = recentKeys
      },
      10 * 60 * 1000,
    ) // Clean every 10 minutes

    return () => clearInterval(cleanup)
  }, [])

  // Load notifications from API
  const loadNotifications = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true)
    try {
      const data = await fetchNotifications(pageNum, 10)

      if (reset) {
        setNotifications(data.notifications)
      } else {
        setNotifications((prev) => [...prev, ...data.notifications])
      }

      setHasMore(data.hasMore)
      setPage(pageNum)
      setTotalCount(data.totalCount || data.notifications.length)
    } catch (error) {
      console.error("Error loading notifications:", error)

      // Don't show error toast or use mock data - just fail silently
      if (reset) {
        setNotifications([])
      }
      setHasMore(false)
    } finally {
      setLoading(false)
    }
  }, [])

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || loading || !hasMore) return

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
    if (scrollTop + clientHeight >= scrollHeight - 5) {
      loadNotifications(page + 1)
    }
  }, [loading, hasMore, page, loadNotifications])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleNotificationClick = async (notification: Notification) => {
    try {
      setOpen(false)

      // Mark as read if not already read
      if (!notification.isRead && notification.id) {
        await markNotificationAsRead(notification.id)
        setNotifications((prev) => prev.map((n) => (n.id === notification.id ? { ...n, isRead: true } : n)))
      }

      // Navigate to link
      router.push(notification.link)
    } catch (error) {
      console.error("Error marking notification as read:", error)
      // Still navigate even if marking as read fails
      router.push(notification.link)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
      toast.success("Đã đánh dấu tất cả thông báo là đã đọc")
    } catch (error) {
      console.error("Error marking all as read:", error)
      toast.error("Không thể cập nhật thông báo")
    }
  }

  const handleDeleteNotification = async (notificationId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteNotification(notificationId)
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId))
      setTotalCount((prev) => prev - 1)
      toast.success("Đã xóa thông báo")
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("Không thể xóa thông báo")
    }
  }

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60))

    if (diffInMinutes < 1) return "Vừa xong"
    if (diffInMinutes < 60) return `${diffInMinutes} phút trước`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`
    return `${Math.floor(diffInMinutes / 1440)} ngày trước`
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button
        onClick={() => setOpen((prev) => !prev)}
        className="relative group p-2 rounded-xl hover:bg-gray-100 transition-all duration-200"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Bell className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full min-w-[20px] h-5 flex items-center justify-center shadow-lg"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-[90vw] max-w-xs sm:max-w-sm md:max-w-md lg:w-96 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">Thông báo</h3>
                  {totalCount > 0 && <p className="text-sm text-gray-500">{totalCount} thông báo</p>}
                </div>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center gap-1"
                    >
                      <Check className="h-4 w-4" />
                      Đánh dấu tất cả
                    </button>
                  )}
                  {unreadCount > 0 && (
                    <span className="text-sm text-blue-600 font-medium bg-blue-100 px-2 py-1 rounded-full">
                      {unreadCount} chưa đọc
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Notifications List */}
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
            >
              {notifications.length === 0 && !loading ? (
                <div className="p-8 text-center">
                  <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 font-medium">Không có thông báo nào</p>
                  <p className="text-sm text-gray-400 mt-1">Thông báo mới sẽ xuất hiện ở đây</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-100">
                  {notifications.map((notification, index) => (
                    <motion.div
                      key={notification.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`relative group hover:bg-gray-50 transition-all duration-200 ${!notification.isRead ? "bg-blue-50/50" : ""
                        }`}
                    >
                      <button
                        onClick={() => handleNotificationClick(notification)}
                        className="w-full text-left px-6 py-4 focus:outline-none focus:bg-gray-50"
                      >
                        <div className="flex items-start gap-3">
                          {/* Unread indicator */}
                          {!notification.isRead && <Dot className="h-6 w-6 text-blue-500 flex-shrink-0 -ml-1" />}

                          <div className="flex-1 min-w-0">
                            <div
                              dangerouslySetInnerHTML={{ __html: notification.message }}
                              className={`text-sm leading-relaxed ${!notification.isRead ? "font-medium text-gray-900" : "text-gray-700"
                                }`}
                            />

                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{formatTimeAgo(notification.createdAt)}</span>
                            </div>
                          </div>

                          <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
                        </div>
                      </button>

                      {/* Delete button */}
                      {notification.id && (
                        <button
                          onClick={(e) => handleDeleteNotification(notification.id!, e)}
                          className="absolute top-2 right-2 p-1 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </motion.div>
                  ))}

                  {/* Loading indicator */}
                  {loading && (
                    <div className="flex items-center justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
                      <span className="ml-2 text-sm text-gray-500">Đang tải...</span>
                    </div>
                  )}

                  {/* End of list indicator */}
                  {!hasMore && notifications.length > 0 && (
                    <div className="text-center py-4 text-sm text-gray-400">Đã hiển thị tất cả thông báo</div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                <div className="flex items-center justify-between">
                  {unreadCount > 0 && (
                    <button
                      onClick={handleMarkAllAsRead}
                      className="text-sm text-gray-600 hover:text-gray-700 transition-colors"
                    >
                      Đánh dấu tất cả đã đọc
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell
