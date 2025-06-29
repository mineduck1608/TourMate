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
import type { MyJwtPayload } from "@/types/JwtPayload"
import { useToken } from "@/components/getToken"
import { baseFileTemplate } from "@/types/file"
import { FileUploadContext } from "./file-upload-context"

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

  // Simple useMediaQuery implementation
  function useMediaQuery(query: string): boolean {
    const [matches, setMatches] = useState(false);

    useEffect(() => {
      const media = window.matchMedia(query);
      if (media.matches !== matches) {
        setMatches(media.matches);
      }
      const listener = () => setMatches(media.matches);
      media.addEventListener("change", listener);
      return () => media.removeEventListener("change", listener);
    }, [matches, query]);

    return matches;
  }

  const isMobile = useMediaQuery("(max-width: 768px)") // hoặc dùng window.innerWidth
  const [showConversationListMobile, setShowConversationListMobile] = useState(true)

  // Setup global SignalR connection
  useEffect(() => {
    if (!currentUserId) return

    const connection = new signalR.HubConnectionBuilder().withUrl(`${apiHub}/appHub`).withAutomaticReconnect().build()

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
    setShowConversationListMobile(false) // Ẩn danh sách khi chọn trên mobile
    try {
      await fetchMarkRead(conv.conversation.conversationId, conv.conversation.account2Id)
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error)
    }
  }

  return (
    <div className="min-h-screen w-full bg-gray-50 overflow-x-hidden">
      <MegaMenu />
      <GlobalCallManager
        ref={globalCallManagerRef}
        connection={hubConnection}
        currentAccountId={currentUserId || 0}
        conversations={allConversations}
      />
      <div>
        <div className="flex w-full h-[calc(100vh-80px)] bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {/* ConversationList: Ẩn trên mobile nếu đã chọn chat */}
          <div
            className={`h-full ${selectedConversation && !showConversationListMobile ? "hidden" : "block"
              } flex-shrink-0 md:w-[320px] md:block`}
          >
            <ConversationList
              onSelect={handleSelectConversation}
              selectedId={selectedConversation?.conversation.conversationId}
              onConversationsChange={setAllConversations}
              hubConnection={hubConnection}
            />
          </div>
          {/* MessageList: Ẩn trên mobile nếu chưa chọn chat */}
          <div
            className={`flex-1 flex flex-col ${!selectedConversation || showConversationListMobile ? "hidden" : "flex"
              } md:flex`}
          >
            {selectedConversation ? (
              <MessageList
                conversationId={selectedConversation.conversation.conversationId}
                conversationResponse={selectedConversation}
                globalCallManager={globalCallManagerRef}
                isMobile={isMobile}
                onBack={() => setShowConversationListMobile(true)}
              />
            ) : (
              <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                <div className="text-center">
                  <div className="w-24 h-24 mx-auto mb-6 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Chào mừng đến với Chat</h3>
                  <p className="text-gray-600">Chọn một cuộc trò chuyện để bắt đầu nhắn tin</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  const [currentFile, setCurrentFile] = useState({ ...baseFileTemplate })
  const [isUploading, setIsUploading] = useState(false)
  const [currentProgress, setCurrentProgress] = useState<number | undefined>(undefined)

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg font-medium">Đang tải chat...</p>
          </div>
        </div>
      }
    >
      <FileUploadContext.Provider
        value={{
          file: currentFile,
          setFile: setCurrentFile,
          isUploading,
          setIsUploading,
          currentProgress,
          setCurrentProgress,
        }}
      >
        <ChatContent />
      </FileUploadContext.Provider>
    </Suspense>
  )
}
