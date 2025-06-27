"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import type { ConversationResponse } from "@/types/conversation"
import { fetchConversations } from "../api/conversation.api"
import { Search, MessageCircle } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import * as signalR from "@microsoft/signalr"
import { useToken } from "@/components/getToken"
import type { MyJwtPayload } from "@/types/JwtPayload"

type Props = {
  onSelect: (conversation: ConversationResponse) => void
  selectedId?: number
  onConversationsChange?: (conversations: ConversationResponse[]) => void
  hubConnection: signalR.HubConnection | null
}

const PAGE_SIZE = 10

export default function ConversationList({ onSelect, selectedId, onConversationsChange, hubConnection }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm, setDebouncedTerm] = useState("")
  const [localConversations, setLocalConversations] = useState<ConversationResponse[]>([])
  const [joinedConversations, setJoinedConversations] = useState<Set<number>>(new Set())

  const token = useToken("accessToken")
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
  const currentAccountId = decoded?.AccountId

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useInfiniteQuery<
    { conversations: ConversationResponse[]; hasMore: boolean },
    unknown
  >({
    queryKey: ["conversations", debouncedTerm, currentAccountId],
    queryFn: ({ pageParam = 1 }) => fetchConversations(pageParam, PAGE_SIZE, currentAccountId as number, debouncedTerm),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    initialPageParam: 1,
    enabled: !!currentAccountId,
  })

  useEffect(() => {
    if (data?.pages) {
      const allConversations = data.pages.flatMap((page) => page.conversations)

      allConversations.sort((a, b) => {
        const timeA = a.latestMessage?.sendAt ? new Date(a.latestMessage.sendAt).getTime() : 0
        const timeB = b.latestMessage?.sendAt ? new Date(b.latestMessage.sendAt).getTime() : 0
        return timeB - timeA
      })

      setLocalConversations(allConversations)
      onConversationsChange?.(allConversations)
    }
  }, [data, onConversationsChange])

  useEffect(() => {
    if (
      hubConnection &&
      hubConnection.state === signalR.HubConnectionState.Connected &&
      localConversations.length > 0
    ) {
      localConversations.forEach((conv) => {
        const id = conv.conversation.conversationId
        if (!joinedConversations.has(id)) {
          hubConnection
            .invoke("JoinConversation", id)
            .then(() => {
              setJoinedConversations((prev) => new Set([...prev, id]))
            })
            .catch((err) => console.error(`JoinConversation failed for ${id}:`, err))
        }
      })
    }
  }, [hubConnection, localConversations])

  useEffect(() => {
    if (hubConnection?.state === signalR.HubConnectionState.Disconnected) {
      setJoinedConversations(new Set())
    }
  }, [hubConnection?.state])

  useEffect(() => {
    if (!hubConnection) return

    const handleReceiveMessage = (message: {
      messageId: number
      senderId: number
      senderName: string
      conversationId: number
      senderAvatarUrl: string
      messageText: string
      sendAt: string
    }) => {
      setLocalConversations((prev) => {
        const index = prev.findIndex((conv) => conv.conversation.conversationId === message.conversationId)

        if (index === -1) return prev

        const updatedConv = { ...prev[index] }
        updatedConv.latestMessage = {
          messageId: message.messageId,
          senderId: message.senderId,
          senderName: message.senderName,
          conversationId: message.conversationId,
          senderAvatarUrl: message.senderAvatarUrl,
          messageText: message.messageText,
          sendAt: message.sendAt,
        }

        return [updatedConv, ...prev.filter((_, i) => i !== index)]
      })
    }

    hubConnection.on("ReceiveMessage", handleReceiveMessage)

    return () => {
      hubConnection.off("ReceiveMessage", handleReceiveMessage)
    }
  }, [hubConnection])

  const debounceSearch = useCallback(
    debounce((term: string) => setDebouncedTerm(term.trim().toLowerCase())),
    [],
  )

  useEffect(() => {
    debounceSearch(searchTerm)
  }, [searchTerm, debounceSearch])

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    if (el.scrollHeight - el.scrollTop - el.clientHeight < 300 && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  return (
    <div className="flex flex-col border-r border-gray-200 h-full w-80 bg-white">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <MessageCircle className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Trò chuyện</h1>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="search"
            className="w-full pl-10 pr-4 py-3 rounded-xl border-2 border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm placeholder-gray-500"
            placeholder="Tìm kiếm cuộc trò chuyện..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        {isLoading && (
          <div className="p-6 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent mx-auto mb-3"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        )}

        {!isLoading && localConversations.length === 0 && (
          <div className="p-6 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <MessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">Không có cuộc trò chuyện</p>
          </div>
        )}

        {localConversations.map((conversation) => (
          <ConversationItem
            key={conversation.conversation.conversationId}
            conversation={conversation}
            selected={selectedId === conversation.conversation.conversationId}
            onClick={() => onSelect(conversation)}
          />
        ))}

        {isFetchingNextPage && (
          <div className="p-4 text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
          </div>
        )}

        {!hasNextPage && !isLoading && localConversations.length > 0 && (
          <div className="p-4 text-center">
            <p className="text-gray-400 text-sm">Đã hiển thị tất cả cuộc trò chuyện</p>
          </div>
        )}
      </div>
    </div>
  )
}

function ConversationItem({
  conversation,
  selected,
  onClick,
}: {
  conversation: ConversationResponse
  selected?: boolean
  onClick: () => void
}) {
  const formatTime = (dateString?: string) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else {
      return date.toLocaleDateString()
    }
  }

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-4 border-b border-gray-100 hover:bg-gray-50 transition-all duration-200 ${
        selected ? "bg-blue-50 border-l-4 border-l-blue-500" : ""
      }`}
    >
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={conversation.account2Img || "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"}
            alt={`${conversation.accountName2} avatar`}
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3 className={`font-semibold truncate ${selected ? "text-blue-700" : "text-gray-900"}`}>
              {conversation.accountName2}
            </h3>
            <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
              {formatTime(conversation.latestMessage?.sendAt)}
            </span>
          </div>
          <p className="text-sm text-gray-600 truncate leading-relaxed">
            {conversation.latestMessage?.messageText || "Chưa có tin nhắn"}
          </p>
        </div>
      </div>
    </div>
  )
}
