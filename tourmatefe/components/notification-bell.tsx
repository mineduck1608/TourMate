"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { Bell, Dot, Clock, ExternalLink, Loader2 } from 'lucide-react'
import * as signalR from "@microsoft/signalr"
import { apiHub } from "@/types/constants"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

type Notification = {
  id?: string
  message: string
  link: string
  createdAt: string
  isRead?: boolean
}

// // Mock API function - replace with your actual API
// const fetchNotifications = async (page: number, pageSize: number = 10) => {
//   // Replace this with your actual API call
//   const response = await fetch(`/api/notifications?page=${page}&pageSize=${pageSize}`)
//   return response.json()
// }

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
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
      .withUrl(`${apiHub}/notificationHub`, {
        accessTokenFactory: () => token,
      })
      .withAutomaticReconnect()
      .build()

    connection
      .start()
      .then(() => console.log("✅ SignalR connected"))
      .catch((err) => console.error("SignalR error:", err))

    connection.on("ReceiveNotification", (notification: Notification) => {
      setNotifications((prev) => [{ ...notification, isRead: false }, ...prev])
      console.log("📩 Thông báo mới:", notification)
    })

    return () => {
      connection.stop()
    }
  }, [])

  // Load notifications from API
  const loadNotifications = useCallback(async (pageNum: number, reset = false) => {
    setLoading(true)
    try {
      // Replace with your actual API call
      // const data = await fetchNotifications(pageNum)
      
      // Mock data for demonstration
      const mockData = {
        notifications: Array.from({ length: 10 }, (_, i) => ({
          id: `${pageNum}-${i}`,
          message: `Thông báo ${pageNum}-${i + 1}: Bạn có một tin nhắn mới từ hướng dẫn viên`,
          link: `/chat/${i}`,
          createdAt: new Date(Date.now() - i * 3600000).toISOString(),
          isRead: Math.random() > 0.5
        })),
        hasMore: pageNum < 5
      }

      if (reset) {
        setNotifications(mockData.notifications)
      } else {
        setNotifications(prev => [...prev, ...mockData.notifications])
      }
      setHasMore(mockData.hasMore)
      setPage(pageNum)
    } catch (error) {
      console.error("Error loading notifications:", error)
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

  const handleNotificationClick = (notification: Notification) => {
    setOpen(false)
    
    // Mark as read
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, isRead: true } : n)
    )
    
    router.push(notification.link)
  }

  const unreadCount = notifications.filter(n => !n.isRead).length
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
        onClick={() => setOpen(prev => !prev)}
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
            className="absolute right-0 mt-2 w-96 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Thông báo</h3>
                {unreadCount > 0 && (
                  <span className="text-sm text-blue-600 font-medium">
                    {unreadCount} chưa đọc
                  </span>
                )}
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
                    <motion.button
                      key={notification.id || index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => handleNotificationClick(notification)}
                      className={`w-full text-left px-6 py-4 hover:bg-gray-50 transition-all duration-200 group relative ${
                        !notification.isRead ? "bg-blue-50/50" : ""
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Unread indicator */}
                        {!notification.isRead && (
                          <Dot className="h-6 w-6 text-blue-500 flex-shrink-0 -ml-1" />
                        )}
                        
                        <div className="flex-1 min-w-0">
                          <div
                            dangerouslySetInnerHTML={{ __html: notification.message }}
                            className={`text-sm leading-relaxed ${
                              !notification.isRead ? "font-medium text-gray-900" : "text-gray-700"
                            }`}
                          />
                          
                          <div className="flex items-center gap-2 mt-2">
                            <Clock className="h-3 w-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {formatTimeAgo(notification.createdAt)}
                            </span>
                          </div>
                        </div>

                        <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors flex-shrink-0 opacity-0 group-hover:opacity-100" />
                      </div>
                    </motion.button>
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
                    <div className="text-center py-4 text-sm text-gray-400">
                      Đã hiển thị tất cả thông báo
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50">
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium transition-colors">
                  Xem tất cả thông báo
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default NotificationBell
