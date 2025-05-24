// MessageList.tsx
"use client";

import React, { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroll-component";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { fetchMessages } from "../api/message.api";
import { Message } from "@/types/message";
import { getToken } from "@/components/getToken";

const PAGE_SIZE = 20;

type Props = {
  conversationId: number;
};

export default function MessageList({ conversationId }: Props) {
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery<
    { messages: Message[]; hasMore: boolean },
    unknown
  >({
    queryKey: ["messages", conversationId],
    queryFn: ({ pageParam = 1 }) => fetchMessages(conversationId, pageParam, PAGE_SIZE),
    getNextPageParam: (
      lastPage: { messages: Message[]; hasMore: boolean },
      allPages: { messages: Message[]; hasMore: boolean }[]
    ) => (lastPage.hasMore ? allPages.length + 1 : undefined),
    enabled: !!conversationId,
    initialPageParam: 1,
  });

  // Khi conversationId đổi, reset danh sách tin nhắn
  useEffect(() => {
    setMessages([]);
    refetch();
  }, [conversationId, refetch]);

var token = getToken("accessToken");
console.log(token);

  // Khi data mới fetch về, gộp tin nhắn
  useEffect(() => {
    if (data) {
      const allMessages = data.pages.flatMap((page) => page.messages) ?? [];
      setMessages(allMessages);
    }
  }, [data]);

  // Kết nối SignalR realtime
  useEffect(() => {
    if (!conversationId) return;

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
      // Chỉ thêm tin nhắn đúng conversation đang mở
      if (message.conversationId === conversationId) {
        setMessages((prev) => [message, ...prev]);
      }
    });

    return () => {
      newConnection.stop();
    };
  }, [conversationId]);

  // Load thêm tin nhắn khi scroll đến đầu
  const loadMoreMessages = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  // Gửi tin nhắn qua SignalR
  const sendMessage = async (text: string) => {
    if (!connection || !text.trim()) return;
    try {
      await connection.invoke("SendMessage", conversationId, text.trim(), 3);
    } catch (error) {
      console.error("Send message error:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div
        id="scrollableDiv"
        className="flex-1 overflow-auto p-4 flex flex-col-reverse"
        onScroll={(e) => {
          if (
            e.currentTarget.scrollTop === 0 &&
            hasNextPage &&
            !isFetchingNextPage
          ) {
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
  const [text, setText] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

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
