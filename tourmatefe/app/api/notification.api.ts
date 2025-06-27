import type { Notification, NotificationResponse } from "@/types/notification"
import http from "../utils/http"

/**
 * API Layer - Calls to .NET backend
 */

/**
 * GET /notifications?page=1&pageSize=10
 */
export const fetchNotifications = async (page = 1, pageSize = 10): Promise<NotificationResponse> => {
  const response = await http.get<NotificationResponse>("/notifications", {
    params: { page, pageSize },
  })
  return response.data
}

/**
 * PUT /notifications/{id}/mark-read
 */
export const markNotificationAsRead = async (id: string): Promise<void> => {
  await http.put(`/notifications/${id}/mark-read`)
}

/**
 * PUT /notifications/mark-all-read
 */
export const markAllNotificationsAsRead = async (): Promise<void> => {
  await http.put("/notifications/mark-all-read")
}

/**
 * DELETE /notifications/{id}
 */
export const deleteNotification = async (id: string): Promise<void> => {
  await http.delete(`/notifications/${id}`)
}

/**
 * GET /notifications/unread-count
 */
export const getUnreadNotificationCount = async (): Promise<number> => {
  const response = await http.get<number>("/notifications/unread-count")
  return response.data
}

/**
 * GET /notifications/stats
 */
export const getNotificationStats = async () => {
  const response = await http.get("/notifications/stats")
  return response.data
}

// Re-export types
export type { Notification, NotificationResponse }



export const sendNotificationToGuides = async (areaId: number, accId: number) => {
  try {
    await http.post('/notifications/tour-bid', {
      areaId,
      accId
    });
  } catch (err) {
    console.error('Không thể gửi thông báo SignalR:', err);
  }
};