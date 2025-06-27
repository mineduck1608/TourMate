"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import { debounce } from "lodash"
import type { ConversationResponse } from "@/types/conversation"
import { fetchConversations } from "../api/conversation.api"
import { Search } from "lucide-react"
import { jwtDecode } from "jwt-decode"
import * as signalR from "@microsoft/signalr"
import { useToken } from "@/components/getToken"
import { MyJwtPayload } from "@/types/JwtPayload"

type Props = {
  onSelect: (conversation: ConversationResponse) => void
  selectedId?: number
  onConversationsChange?: (conversations: ConversationResponse[]) => void
  hubConnection: signalR.HubConnection | null // 👈 thêm dòng này
}

const PAGE_SIZE = 10

export default function ConversationList({ onSelect, selectedId, onConversationsChange, hubConnection }: Props) {
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedTerm, setDebouncedTerm] = useState("")
  const [localConversations, setLocalConversations] = useState<ConversationResponse[]>([])

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

  // Track joined conversations to prevent duplicate joins
  const [joinedConversations, setJoinedConversations] = useState<Set<number>>(new Set())

  // Update local conversations and join SignalR groups (improved)
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

      // Join new conversations only
      if (hubConnection?.state === signalR.HubConnectionState.Connected) {
        allConversations.forEach((conv) => {
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
    }
  }, [data, hubConnection, onConversationsChange])

  // Join conversations when connection is ready (improved)
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
  }, [hubConnection?.state]) // Removed localConversations from dependencies

  // Reset joined conversations when connection changes
  useEffect(() => {
    if (hubConnection?.state === signalR.HubConnectionState.Disconnected) {
      setJoinedConversations(new Set())
    }
  }, [hubConnection?.state])

  // Handle real-time message updates
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

        // Move conversation with new message to top
        return [updatedConv, ...prev.filter((_, i) => i !== index)]
      })
    }

    hubConnection.on("ReceiveMessage", handleReceiveMessage)

    return () => {
      hubConnection.off("ReceiveMessage", handleReceiveMessage)
    }
  }, [hubConnection])

  // Debounced search
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
    <div className="flex flex-col border-r h-full w-80">
      <h1 className="p-3 text-3xl font-bold">Trò chuyện</h1>

      <div className="relative px-3">
        <span className="absolute left-5 top-1/3 transform -translate-y-1/2 text-gray-500 pointer-events-none">
          <Search />
        </span>
        <input
          type="search"
          className="w-full p-2 pl-10 mb-5 rounded-full border bg-gray-200
               text-sm sm:text-base
               focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Tìm kiếm cuộc trò chuyện"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        {isLoading && <div className="p-4 text-center text-gray-500">Đang tải...</div>}
        {!isLoading && localConversations.length === 0 && (
          <div className="p-4 text-gray-500">Không có cuộc trò chuyện</div>
        )}

        {localConversations.map((conversation) => (
          <ConversationItem
            key={conversation.conversation.conversationId}
            conversation={conversation}
            selected={selectedId === conversation.conversation.conversationId}
            onClick={() => onSelect(conversation)}
          />
        ))}

        {isFetchingNextPage && <div className="p-2 text-center text-gray-500">Đang tải thêm...</div>}
        {!hasNextPage && !isLoading && (
          <div className="p-2 text-center text-gray-400 text-sm">Đã hiển thị tất cả cuộc trò chuyện</div>
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
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 border-b hover:bg-gray-100 flex items-center gap-3 ${selected ? "bg-blue-100 font-semibold" : ""
        }`}
    >
      {/* Avatar */}
      <img
        src={conversation.account2Img || "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"}
        alt={`${conversation.accountName2} avatar`}
        className="w-10 h-10 rounded-full object-cover"
      />

      {/* Conversation Content */}
      <div className="flex flex-col overflow-hidden">
        <div className="truncate">{conversation.accountName2}</div>
        <div className="text-xs truncate text-gray-500 font-normal">{conversation.latestMessage?.messageText}</div>
      </div>
    </div>
  )
}
