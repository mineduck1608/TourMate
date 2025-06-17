"use client"

import { useEffect, useState, Suspense, useRef } from "react"
import { useSearchParams } from "next/navigation"
import ConversationList from "./conversation-list"
import MessageList from "./message-list"
import MegaMenu from "@/components/mega-menu"
import type { ConversationResponse } from "@/types/conversation"
import { fetchMarkRead, fetchOrCreateConversation } from "../api/conversation.api"
import { jwtDecode } from "jwt-decode"
import GlobalCallManager from "./global-call-manager"
import * as signalR from "@microsoft/signalr"
import { apiHub } from "@/types/constants"
import { MyJwtPayload } from "@/types/JwtPayload"
import { useToken } from "@/components/getToken"

interface GlobalCallManagerRef {
  initiateCall: (type: "voice" | "video", conversationId: number, toAccountId: number) => Promise<void>
}

function ChatContent() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null)
  const searchParams = useSearchParams()
  const userId = searchParams.get("userId")
  const [allConversations, setAllConversations] = useState<ConversationResponse[]>([])
  const [hubConnection, setHubConnection] = useState<signalR.HubConnection | null>(null)

  const globalCallManagerRef = useRef<GlobalCallManagerRef | null>(null)

  const token = useToken("accessToken")
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
  const currentUserId = decoded?.AccountId ? Number(decoded.AccountId) : undefined

  // Setup global SignalR connection
  useEffect(() => {
    if (!currentUserId) return

    const connection = new signalR.HubConnectionBuilder().withUrl(`${apiHub}/chatHub`).withAutomaticReconnect().build()

    setHubConnection(connection)

    connection
      .start()
      .then(() => console.log("Global SignalR connected"))
      .catch((err) => console.error("Global SignalR connection error:", err))

    return () => {
      connection.stop()
    }
  }, [currentUserId])

  useEffect(() => {
    const loadFromUserId = async () => {
      if (userId && !selectedConversation && currentUserId) {
        try {
          const conv = await fetchOrCreateConversation(currentUserId, Number(userId))
          setSelectedConversation(conv)
        } catch (error) {
          console.error("Không thể mở cuộc trò chuyện:", error)
        }
      }
    }

    loadFromUserId()
  }, [userId, selectedConversation, currentUserId])

  const handleSelectConversation = async (conv: ConversationResponse) => {
    setSelectedConversation(conv)
    try {
      await fetchMarkRead(conv.conversation.conversationId, conv.conversation.account2Id)
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error)
    }
  }

  return (
    <>
      <MegaMenu />
      <GlobalCallManager
        ref={globalCallManagerRef}
        connection={hubConnection}
        currentAccountId={currentUserId || 0}
        conversations={allConversations}
      />
      <div className="flex h-[100vh] mx-auto border rounded shadow">
        <ConversationList
          onSelect={handleSelectConversation}
          selectedId={selectedConversation?.conversation.conversationId}
          onConversationsChange={setAllConversations}
          hubConnection={hubConnection} // 👈 truyền xuống đây
        />
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <MessageList
              conversationId={selectedConversation.conversation.conversationId}
              conversationResponse={selectedConversation}
              globalCallManager={globalCallManagerRef}
            />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">Vui lòng chọn cuộc trò chuyện</div>
          )}
        </div>
      </div>
    </>
  )
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ChatContent />
    </Suspense>
  )
}
