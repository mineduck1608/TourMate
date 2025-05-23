"use client"

import React, { useEffect, useState, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import {
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import http from "../utils/http";

const PAGE_SIZE = 20;
const conversationId = 4; // Thay bằng id thực tế

// Kiểu Message
type Message = {
  messageId: number;
  senderId: number;
  senderName: string;
  messageText: string;
  sendAt: string;
  conservationId: string;
  // Thêm trường nếu cần
};

// Kiểu dữ liệu API trả về cho mỗi trang
type ApiResponse = {
  messages: Message[];
  hasMore: boolean;
};

export default function Chat() {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // Kết nối SignalR
  useEffect(() => {
    const newConnection = new HubConnectionBuilder()
      .withUrl(`https://localhost:7147/chatHub?conversationId=${conversationId}`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(newConnection);

    newConnection
      .start()
      .then(() => console.log("SignalR connected"))
      .catch((e) => console.log("SignalR connection failed: ", e));

    newConnection.on("ReceiveMessage", (message: Message) => {
      setMessages((prev) => [message, ...prev]);
    });

    return () => {
      newConnection.stop();
    };
  }, []);

  // Lấy tin nhắn phân trang với React Query
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<ApiResponse>({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = 1 }) =>
      http
        .get<ApiResponse>(`/conversation/${conversationId}/messages`, {
          params: { page: pageParam, pageSize: PAGE_SIZE },
        })
        .then((res) => res.data),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  useEffect(() => {
    if (data) {
      const allMessages = data.pages.flatMap((page) => page.messages) ?? [];
      setMessages(allMessages);
    }
  }, [data]);


  // Tải thêm tin nhắn khi scroll lên đầu
  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Gửi tin nhắn qua SignalR
  const sendMessage = async (text: string) => {
    if (!connection || !text.trim()) return;
    try {
      // Gửi conversationId, text, senderId (ví dụ senderId = 123)
      await connection.invoke("SendMessage", conversationId, text.trim(), 1);
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <div className="max-w-md mx-auto flex flex-col h-[600px] border rounded-lg shadow-md bg-white">
      <div
        id="scrollableDiv"
        className="flex-1 overflow-auto p-4 flex flex-col-reverse"
        onScroll={(e) => {
          if (e.currentTarget.scrollTop === 0 && hasNextPage && !isFetchingNextPage) {
            loadMoreMessages();
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
          {messages.map((msg) => (
            <MessageItem key={msg.messageId} message={msg} />
          ))}
        </InfiniteScroll>
      </div>
      <MessageInput onSend={sendMessage} />
    </div>
  );
}

function MessageItem({ message }: { message: Message }) {
  return (
    <div className="bg-gray-100 p-3 rounded-lg mb-3 max-w-[80%]">
      <div className="font-semibold text-blue-600">
        {message.senderName || `Người dùng ${message.senderId}`}
      </div>
      <div>{message.messageText}</div>
      <div className="text-xs text-gray-500 mt-1">
        {new Date(message.sendAt).toLocaleTimeString()}
      </div>
    </div>
  );
}

function MessageInput({ onSend }: { onSend: (text: string) => void }) {
  const [text, setText] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() === "") return;
    onSend(text);
    setText("");
    inputRef.current?.focus();
  };

  return (
    <div className="flex p-3 border-t">
      <input
        ref={inputRef}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Nhập tin nhắn..."
        className="flex-grow rounded-full border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onKeyDown={(e) => {
          if (e.key === "Enter") handleSend();
        }}
      />
      <button
        onClick={handleSend}
        className="ml-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5 py-2"
      >
        Gửi
      </button>
    </div>
  );
}
