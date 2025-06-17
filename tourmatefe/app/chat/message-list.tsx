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
import { Phone, Video } from "lucide-react"
import type { GlobalCallManagerRef } from "./global-call-manager"
import { MyJwtPayload } from "@/types/JwtPayload"
import { useToken } from "@/components/getToken"
import OtherButtons from "./other-buttons"
import SafeImage from "@/components/safe-image"
import FileUploadRender from "./file-upload-render"
import { FileUploadContext, FileUploadContextProps } from "./file-upload-context"
import { baseFileTemplate } from "@/types/file"

const PAGE_SIZE = 20

type Props = {
  conversationId: number
  conversationResponse?: ConversationResponse
  globalCallManager?: React.RefObject<GlobalCallManagerRef | null>
}

export default function MessageList({ conversationId, conversationResponse, globalCallManager }: Props) {
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
      if (file.downloadUrl.trim().length > 0) {
        await connection.invoke(
          "SendWithFile",
          conversationId,
          text.trim(),
          currentAccountIdNumber,
          file.fileName,
          file.downloadUrl
        )
        setFile({ ...baseFileTemplate })
      }
      else {
        await connection.invoke(
          "SendMessage",
          conversationId,
          text.trim(),
          currentAccountIdNumber
        )
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
}: {
  conversationResponse?: ConversationResponse
  onVoiceCall?: () => void
  onVideoCall?: () => void
  isCallActive?: boolean
}) {
  const avatarUrl = "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"

  return (
    <div className="flex items-center p-4 border-b border-gray-300">
      <SafeImage
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
          className={`p-2 rounded-full transition-colors ${isCallActive ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 text-blue-600"
            }`}
        >
          <Phone size={20} />
        </button>
        <button
          title="Gọi video"
          onClick={onVideoCall}
          disabled={isCallActive}
          className={`p-2 rounded-full transition-colors ${isCallActive ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "hover:bg-blue-100 text-blue-600"
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
  message: Message;
  currentAccountId?: number;
  showAvatar: boolean;
}) {
  const isSender = currentAccountId == message.senderId;
  const isImage = (fileName?: string) =>
    !!fileName && /\.(jpg|jpeg|png|gif|bmp|webp)$/i.test(fileName);
  const isVideo = (fileName?: string) =>
    !!fileName && /\.(mp4|webm|ogg|mov|avi|mkv)$/i.test(fileName);


  return (
    <div className={`flex mb-4 ${isSender ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-end ${isSender ? "flex-row-reverse" : "flex-row"} gap-2`}
      >
        {showAvatar ? (
          <SafeImage
            src={
              message.senderAvatarUrl ||
              "https://cdn2.fptshop.com.vn/small/avatar_trang_1_cd729c335b.jpg"
            }
            alt="avatar"
            className="w-10 h-10 rounded-full"
          />
        ) : (
          <div className="w-10 h-10" />
        )}

        <div className="flex flex-col max-w-xs">
          {/* Image */}
          {message.fileName && message.downloadUrl && isImage(message.fileName) && (
            <div
              className={`${isSender ? "bg-blue-100" : "bg-gray-100"} p-2 rounded mb-1`}
              style={{
                maxWidth: "40vw",
                alignSelf: isSender ? "flex-end" : "flex-start",
              }}
            >
              <SafeImage
                src={message.downloadUrl}
                alt="image"
                style={{
                  maxWidth: "40vw",
                  maxHeight: "40vw",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: "#fff",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* Video */}
          {message.fileName && message.downloadUrl && isVideo(message.fileName) && (
            <div
              className={`${isSender ? "bg-blue-100" : "bg-gray-100"} p-2 rounded mb-1`}
              style={{
                maxWidth: "40vw",
                alignSelf: isSender ? "flex-end" : "flex-start",
              }}
            >
              <video
                controls
                src={message.downloadUrl}
                style={{
                  maxWidth: "40vw",
                  maxHeight: "40vw",
                  borderRadius: 8,
                  border: "1px solid #eee",
                  background: "#fff",
                  display: "block",
                }}
              />
            </div>
          )}

          {/* Message content */}
          <div
            className={`${isSender ? "bg-blue-500 text-white" : "bg-gray-100 text-black"} p-2 rounded mt-1 break-words`}
            style={{
              maxWidth: 320,
              minWidth: 48,
              alignSelf: isSender ? "flex-end" : "flex-start",
            }}
          >
            {message.fileName && message.downloadUrl && !isImage(message.fileName) && !isVideo(message.fileName) && (
              <div className="flex items-center gap-2 mb-1">
                <svg width="20" height="24" viewBox="0 0 24 24" fill={isSender ? "#fff" : "#888"}>
                  <path d="M6 2a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8.83A2 2 0 0 0 19.41 7.41l-4.83-4.83A2 2 0 0 0 13.17 2H6zm7 1.5V8a1 1 0 0 0 1 1h4.5L13 3.5z" />
                </svg>
                <a
                  href={message.downloadUrl}
                  download={message.fileName}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={isSender ? "text-white underline font-medium" : "text-blue-700 underline font-medium"}
                  style={{ maxWidth: 180, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                  title={message.fileName}
                >
                  {message.fileName}
                </a>
              </div>
            )}
            {/* Message text */}
            {message.messageText}
            {/* Example: do not remove time */}
            <div className="text-xs text-right opacity-80 mt-1">
              {new Date(message.sendAt).toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex items-center p-3 border-t bg-white dark:bg-gray-900">
      {/* Messenger-style buttons */}
      <OtherButtons />
      {/* Input */}
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white dark:bg-gray-800"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        onClick={handleSend}
        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2 transition"
      >
        Gửi
      </button>
    </div>
  );
}
