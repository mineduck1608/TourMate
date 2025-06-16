"use client"

import React, { useEffect, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import { type HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { fetchMessages } from "../api/message.api"
import type { Message } from "@/types/message"
import { jwtDecode } from "jwt-decode"
import { apiHub } from "@/types/constants"
import type { ConversationResponse } from "@/types/conversation"
import { Phone, Video } from "lucide-react"
import type { GlobalCallManagerRef } from "./global-call-manager"
import { MyJwtPayload } from "@/types/JwtPayload"
import { useToken } from "@/components/getToken"

const PAGE_SIZE = 20

type Props = {
  conversationId: number
  conversationResponse?: ConversationResponse
  globalCallManager?: React.RefObject<GlobalCallManagerRef | null>
}

export default function MessageList({ conversationId, conversationResponse, globalCallManager }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [messages, setMessages] = useState<Message[]>([])

  const token = useToken("accessToken")
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null
  const currentAccountId = decoded?.AccountId ? Number(decoded.AccountId) : undefined

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isFetching, refetch } = useInfiniteQuery<
    { messages: Message[]; hasMore: boolean },
    unknown
  >({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = 1 }) => fetchMessages(conversationId, pageParam, PAGE_SIZE),
    getNextPageParam: (lastPage, allPages) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    enabled: !!conversationId,
    initialPageParam: 1,
    staleTime: 0,
  })

  useEffect(() => {
    setMessages([])
    refetch()
  }, [conversationId, refetch])

  useEffect(() => {
    if (data) {
      const allMessages = data.pages.flatMap((page) => page.messages) ?? []
      setMessages(allMessages)
    }
  }, [data])

  // SignalR connection setup
  useEffect(() => {
    if (!conversationId) return

    const newConnection = new HubConnectionBuilder()
      .withUrl(`${apiHub}/chatHub?conversationId=${conversationId}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build()

    setConnection(newConnection)

    newConnection
      .start()
      .then(async () => {
        console.log("SignalR connected")
        try {
          await newConnection.invoke("JoinConversation", conversationId)
          console.log("Joined conversation", conversationId)
        } catch (err) {
          console.error("Failed to join conversation:", err)
        }
      })
      .catch((e) => console.log("SignalR connection failed: ", e))

    // Message handling
    newConnection.on("ReceiveMessage", (message: Message) => {
      if (message.conversationId === conversationId) {
        setMessages((prev) => (prev.some((m) => m.messageId === message.messageId) ? prev : [message, ...prev]))
      }
    })

    return () => {
      newConnection.off("ReceiveMessage")
      newConnection.stop()
    }
  }, [conversationId, currentAccountId])

  const initiateCall = async (type: "voice" | "video") => {
    if (!globalCallManager?.current || !conversationResponse) return

    try {
      await globalCallManager.current.initiateCall(type, conversationId, conversationResponse.conversation.account2Id)
    } catch (error) {
      console.error("Failed to initiate call:", error)
    }
  }

  const sendMessage = async (text: string) => {
    if (!connection || !text.trim()) return

    const currentAccountIdNumber = Number(currentAccountId)
    if (isNaN(currentAccountIdNumber)) {
      console.error("Invalid currentAccountId:", currentAccountId)
      return
    }

    try {
      await connection.invoke("SendMessage", conversationId, text.trim(), currentAccountIdNumber)
    } catch (error) {
      console.error("Send message error:", error)
    }
  }

  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }

  if ((isFetching || isLoading) && messages.length === 0) {
    return <div className="flex-1 flex items-center justify-center text-gray-500">Đang tải tin nhắn...</div>
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <ConversationHeader
        conversationResponse={conversationResponse}
        onVoiceCall={() => initiateCall("voice")}
        onVideoCall={() => initiateCall("video")}
        isCallActive={false}
      />

      {/* Messages */}
      <div
        id="scrollableDiv"
        className="flex-1 overflow-auto p-4 flex flex-col-reverse"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
            loadMoreMessages()
          }
        }}
      >
        <InfiniteScroll
          dataLength={messages.length}
          next={loadMoreMessages}
          hasMore={!!hasNextPage}
          loader={<div className="text-center text-gray-500">Đang tải thêm...</div>}
          inverse={true}
          scrollableTarget="scrollableDiv"
          style={{ display: "flex", flexDirection: "column-reverse" }}
        >
          {messages.map((msg, index) => {
            const nextMsg = messages[index - 1]
            const isLastFromSender = !nextMsg || nextMsg.senderId !== msg.senderId

            return (
              <MessageItem
                key={msg.messageId}
                message={msg}
                currentAccountId={currentAccountId}
                showAvatar={isLastFromSender}
              />
            )
          })}
        </InfiniteScroll>
      </div>

      {/* Message Input */}
      <MessageInput onSend={sendMessage} />
    </div>
  )
}

function ConversationHeader({
  conversationResponse,
  onVoiceCall,
  onVideoCall,
  isCallActive,
}: {
  conversationResponse?: ConversationResponse
  onVoiceCall?: () => void
  onVideoCall?: () => void
  isCallActive?: boolean
}) {
  const avatarUrl = "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"

  return (
    <div className="flex items-center p-4 border-b border-gray-300">
      <img
        src={conversationResponse?.account2Img || avatarUrl}
        alt="Conversation Avatar"
        className="w-12 h-12 rounded-full"
      />
      <div className="ml-4 flex-1">
        <h2 className="text-lg font-semibold">{conversationResponse?.accountName2 || "Người dùng"}</h2>
      </div>
      <div className="flex gap-2">
        <button
          title="Gọi thoại"
          onClick={onVoiceCall}
          disabled={isCallActive}
          className={`p-2 rounded-full transition-colors ${
            isCallActive ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 text-blue-600"
          }`}
        >
          <Phone size={20} />
        </button>
        <button
          title="Gọi video"
          onClick={onVideoCall}
          disabled={isCallActive}
          className={`p-2 rounded-full transition-colors ${
            isCallActive ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 text-blue-600"
          }`}
        >
          <Video size={20} />
        </button>
      </div>
    </div>
  )
}

function MessageItem({
  message,
  currentAccountId,
  showAvatar,
}: {
  message: Message
  currentAccountId?: number
  showAvatar: boolean
}) {
  const isSender = currentAccountId == message.senderId

  return (
    <div className={`flex mb-2 ${isSender ? "justify-end" : "justify-start"}`}>
      <div className={`flex items-end gap-2 ${isSender ? "flex-row-reverse" : "flex-row"}`}>
        {showAvatar ? (
          <img
            src={
              message.senderAvatarUrl ||
              "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg" ||
              "/placeholder.svg" ||
              "/placeholder.svg" ||
              "/placeholder.svg"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10" />
        )}
        <div
          className={`max-w-[70%] p-3 rounded-lg break-words whitespace-pre-wrap ${
            isSender ? "bg-blue-500 text-white" : "bg-gray-100 text-black"
          }`}
          style={{ wordBreak: "break-word", whiteSpace: "pre-wrap" }}
        >
          <div>{message.messageText}</div>
          <div className={`text-xs mt-1 ${isSender ? "text-white text-right" : "text-gray-500 text-left"}`}>
            {new Date(message.sendAt).toLocaleTimeString()}
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (text.trim() === "") return
    onSend(text)
    setText("")
    inputRef.current?.focus()
  }

  return (
    <div className="flex p-3 border-t">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend()
        }}
      />
      <button onClick={handleSend} className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2">
        Gửi
      </button>
    </div>
  )
}
