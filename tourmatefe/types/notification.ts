/**
 * Notification entity matching your component structure
 */
export interface Notification {
  id?: string
  message: string
  link: string
  createdAt: string
  isRead?: boolean
}

/**
 * API Response for paginated notifications
 */
export interface NotificationResponse {
  notifications: Notification[]
  hasMore: boolean
  totalCount?: number
}

/**
 * Request payload for creating notifications
 * Matches .NET DTO structure
 */
export interface CreateNotificationRequest {
  receiverAccountId: number
  message: string
  link?: string
  createdAt?: string
  isRead?: boolean
}

/**
 * Request payload for updating notifications
 */
export interface UpdateNotificationRequest {
  message?: string
  link?: string
  isRead?: boolean
}

/**
 * Notification statistics from .NET API
 */
export interface NotificationStats {
  total: number
  unread: number
  read: number
  today: number
}

/**
 * Bulk delete request matching .NET DTO
 */
export interface BulkDeleteRequest {
  notificationIds: number[]
}

/**
 * SignalR notification payload
 */
export interface SignalRNotification extends Notification {
  // Additional SignalR specific properties if needed
}
