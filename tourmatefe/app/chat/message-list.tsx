"use client"

import React, { useContext, useEffect, useState } from "react"
import { useInfiniteQuery } from "@tanstack/react-query"
import InfiniteScroll from "react-infinite-scroll-component"
import { type HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr"
import { fetchMessages } from "../api/message.api"
import type { Message } from "@/types/message"
import { jwtDecode } from "jwt-decode"
import { apiHub } from "@/types/constants"
import type { ConversationResponse } from "@/types/conversation"
import { Phone, Video, Send, Download, FileText, MoreVertical, ArrowLeft } from "lucide-react"
import type { GlobalCallManagerRef } from "./global-call-manager"
import type { MyJwtPayload } from "@/types/JwtPayload"
import { useToken } from "@/components/getToken"
import OtherButtons from "./other-buttons"
import SafeImage from "@/components/safe-image"
import FileUploadRender from "./file-upload-render"
import { FileUploadContext, type FileUploadContextProps } from "./file-upload-context"
import { baseFileTemplate } from "@/types/file"

const PAGE_SIZE = 20

type Props = {
  conversationId: number
  conversationResponse?: ConversationResponse
  globalCallManager?: React.RefObject<GlobalCallManagerRef | null>
  isMobile?: boolean
  onBack?: () => void
}

export default function MessageList({
  conversationId,
  conversationResponse,
  globalCallManager,
  isMobile,
  onBack,
}: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const { file, setFile } = useContext(FileUploadContext) as FileUploadContextProps
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
        try {
          await newConnection.invoke("JoinConversation", conversationId)
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
    if (!connection || (!text.trim() && file.downloadUrl.length === 0)) return

    const currentAccountIdNumber = Number(currentAccountId)
    if (isNaN(currentAccountIdNumber)) {
      console.error("Invalid currentAccountId:", currentAccountId)
      return
    }

    try {
      if (file.downloadUrl.trim().length > 0) {
        await connection.invoke(
          "SendWithFile",
          conversationId,
          text.trim(),
          currentAccountIdNumber,
          file.fileName,
          file.downloadUrl,
        )
        setFile({ ...baseFileTemplate })
      } else {
        await connection.invoke("SendMessage", conversationId, text.trim(), currentAccountIdNumber)
      }
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
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Đang tải tin nhắn...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Header */}
      <ConversationHeader
        conversationResponse={conversationResponse}
        onVoiceCall={() => initiateCall("voice")}
        onVideoCall={() => initiateCall("video")}
        isCallActive={false}
        onBack={isMobile ? onBack : undefined}
      />

      {/* Messages */}
      <div
        id="scrollableDiv"
        className="flex-1 overflow-auto p-4 flex flex-col-reverse bg-gradient-to-b from-gray-50 to-white"
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
          loader={
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto mb-2"></div>
              <p className="text-gray-500 text-sm">Đang tải thêm...</p>
            </div>
          }
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
      <FileUploadRender />
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
  onBack, // thêm prop này
}: {
  conversationResponse?: ConversationResponse
  onVoiceCall?: () => void
  onVideoCall?: () => void
  isCallActive?: boolean
  onBack?: () => void // thêm prop này
}) {
  const avatarUrl = "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"

  return (
    <div className="flex items-center p-4 border-b border-gray-200 bg-white shadow-sm">
      {/* Nút quay lại chỉ hiện trên mobile */}
      {onBack && (
        <button
          className="md:hidden mr-4 text-blue-600"
          onClick={onBack}
        >
          <ArrowLeft size={24} />
        </button>
      )}
      <div className="flex items-center flex-1">
        <div className="relative">
          <SafeImage
            src={conversationResponse?.account2Img || avatarUrl}
            alt="Conversation Avatar"
            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-md"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
        </div>
        <div className="ml-4">
          <h2 className="text-lg font-bold text-gray-900">{conversationResponse?.accountName2 || "Người dùng"}</h2>
          <p className="text-sm text-green-600 font-medium">Đang hoạt động</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          title="Gọi thoại"
          onClick={onVoiceCall}
          disabled={isCallActive}
          className={`p-3 rounded-full transition-all duration-200 ${
            isCallActive
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-green-50 text-green-600 hover:text-green-700 hover:scale-105"
          }`}
        >
          <Phone size={20} />
        </button>
        <button
          title="Gọi video"
          onClick={onVideoCall}
          disabled={isCallActive}
          className={`p-3 rounded-full transition-all duration-200 ${
            isCallActive
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : "hover:bg-blue-50 text-blue-600 hover:text-blue-700 hover:scale-105"
          }`}
        >
          <Video size={20} />
        </button>
        <button
          title="Tùy chọn khác"
          className="p-3 rounded-full hover:bg-gray-50 text-gray-600 hover:text-gray-700 transition-all duration-200 hover:scale-105"
        >
          <MoreVertical size={20} />
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
  const isImage = (fileName?: string) => !!fileName && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName)
  const isVideo = (fileName?: string) => !!fileName && /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(fileName)

  return (
    <div className={`flex mb-6 ${isSender ? "justify-end" : "justify-start"} group`}>
      <div className={`flex items-end ${isSender ? "flex-row-reverse" : "flex-row"} gap-3 max-w-[70%]`}>
        {showAvatar ? (
          <SafeImage
            src={message.senderAvatarUrl || "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"}
            alt="avatar"
            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm flex-shrink-0"
          />
        ) : (
          <div className="w-10 h-10 flex-shrink-0" />
        )}

        <div className="flex flex-col">
          {/* Image */}
          {message.fileName && message.downloadUrl && isImage(message.fileName) && (
            <div
              className={`${
                isSender ? "bg-blue-500" : "bg-white border border-gray-200"
              } p-3 rounded-2xl mb-2 shadow-sm hover:shadow-md transition-shadow duration-200`}
              style={{
                maxWidth: "300px",
                alignSelf: isSender ? "flex-end" : "flex-start",
              }}
            >
              <SafeImage
                src={message.downloadUrl}
                alt="image"
                className="rounded-xl max-w-full h-auto"
                style={{
                  maxWidth: "280px",
                  maxHeight: "280px",
                  objectFit: "cover",
                }}
              />
              <a
                href={message.downloadUrl}
                download={message.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isSender ? "text-blue-100 hover:text-white" : "text-blue-600 hover:text-blue-800"
                } text-sm mt-2 block truncate font-medium transition-colors duration-200`}
                title={message.fileName}
              >
                <Download className="w-4 h-4 inline mr-1" />
                {message.fileName}
              </a>
            </div>
          )}

          {/* Video */}
          {message.fileName && message.downloadUrl && isVideo(message.fileName) && (
            <div
              className={`${
                isSender ? "bg-blue-500" : "bg-white border border-gray-200"
              } p-3 rounded-2xl mb-2 shadow-sm hover:shadow-md transition-shadow duration-200`}
              style={{
                maxWidth: "300px",
                alignSelf: isSender ? "flex-end" : "flex-start",
              }}
            >
              <video
                controls
                src={message.downloadUrl}
                className="rounded-xl max-w-full h-auto"
                style={{
                  maxWidth: "280px",
                  maxHeight: "280px",
                }}
              />
              <a
                href={message.downloadUrl}
                download={message.fileName}
                target="_blank"
                rel="noopener noreferrer"
                className={`${
                  isSender ? "text-blue-100 hover:text-white" : "text-blue-600 hover:text-blue-800"
                } text-sm mt-2 block truncate font-medium transition-colors duration-200`}
                title={message.fileName}
              >
                <Download className="w-4 h-4 inline mr-1" />
                {message.fileName}
              </a>
            </div>
          )}

          {/* Message content */}
          <div
            className={`${
              isSender
                ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                : "bg-white text-gray-900 border border-gray-200"
            } px-4 py-3 rounded-2xl shadow-sm hover:shadow-md transition-all duration-200 break-words`}
            style={{
              maxWidth: "400px",
              minWidth: "60px",
              alignSelf: isSender ? "flex-end" : "flex-start",
            }}
          >
            {/* File attachment (non-image/video) */}
            {message.fileName && message.downloadUrl && !isImage(message.fileName) && !isVideo(message.fileName) && (
              <div className="flex items-center gap-3 mb-2 p-2 bg-black/10 rounded-lg">
                <div className={`p-2 rounded-lg ${isSender ? "bg-white/20" : "bg-blue-50"}`}>
                  <FileText className={`w-5 h-5 ${isSender ? "text-white" : "text-blue-600"}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <a
                    href={message.downloadUrl}
                    download={message.fileName}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${
                      isSender ? "text-white hover:text-blue-100" : "text-blue-600 hover:text-blue-800"
                    } font-medium text-sm truncate block transition-colors duration-200`}
                    title={message.fileName}
                  >
                    {message.fileName}
                  </a>
                </div>
                <Download className={`w-4 h-4 ${isSender ? "text-white/80" : "text-gray-500"} flex-shrink-0`} />
              </div>
            )}

            {/* Message text */}
            {message.messageText && <div className="leading-relaxed">{message.messageText}</div>}

            {/* Timestamp */}
            <div className={`text-xs mt-2 ${isSender ? "text-blue-100" : "text-gray-500"} text-right`}>
              {new Date(message.sendAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = React.useState("")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const { file } = useContext(FileUploadContext) as FileUploadContextProps

  const handleSend = () => {
    if (text.trim() === "" && file.downloadUrl.length === 0) return
    onSend(text)
    setText("")
    inputRef.current?.focus()
  }

  return (
    <div className="p-4 border-t border-gray-200 bg-white">
      <div className="flex items-end gap-3 mx-auto">
        {/* File upload button */}
        <div className="flex-shrink-0">
          <OtherButtons />
        </div>

        {/* Input container */}
        <div className="flex-1 relative">
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Nhập tin nhắn..."
            className="w-full px-4 py-3 pr-12 rounded-2xl border-2 border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 hover:bg-white resize-none"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
        </div>

        {/* Send button */}
        <button
          onClick={handleSend}
          disabled={text.trim() === "" && file.downloadUrl.length === 0}
          className="flex-shrink-0 p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 disabled:from-gray-300 disabled:to-gray-400 text-white rounded-2xl transition-all duration-200 transform hover:scale-105 active:scale-95 disabled:cursor-not-allowed disabled:transform-none shadow-lg hover:shadow-xl"
          title="Gửi tin nhắn"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  )
}
