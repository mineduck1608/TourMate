"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ConversationResponse } from "@/types/conversation";
import { fetchConversations } from "../api/conversation.api";
import { Search } from "lucide-react";
import { HubConnectionBuilder, HubConnection, LogLevel } from "@microsoft/signalr";
import { Message } from "@/types/message";

type Props = {
  onSelect: (conversation: ConversationResponse) => void;
  selectedId?: number;
};

const PAGE_SIZE = 20;
const selfId = 1; // bạn nên lấy ID này từ auth hoặc props thực tế

export default function ConversationList({ onSelect, selectedId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [connection, setConnection] = useState<HubConnection | null>(null);
  const [localConversations, setLocalConversations] = useState<ConversationResponse[]>([]);

  const queryClient = useQueryClient();

  // React Query fetch dữ liệu phân trang
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useInfiniteQuery<
    { conversations: ConversationResponse[]; hasMore: boolean },
    unknown
  >({
    queryKey: ["conversations", debouncedTerm],
    queryFn: ({ pageParam = 1 }) =>
      fetchConversations(pageParam, PAGE_SIZE, selfId, debouncedTerm),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  // Đồng bộ dữ liệu từ React Query vào localConversations mỗi khi data thay đổi
  useEffect(() => {
    if (data?.pages) {
      const allConversations = data.pages.flatMap(page => page.conversations);
      setLocalConversations(allConversations);
    }
  }, [data]);

  // debounce search input
  const debounceSearch = useCallback(
    debounce((term: string) => setDebouncedTerm(term.trim().toLowerCase())),
    []
  );

  useEffect(() => {
    debounceSearch(searchTerm);
  }, [searchTerm, debounceSearch]);

  // Setup SignalR connection
  useEffect(() => {
    const conn = new HubConnectionBuilder()
      .withUrl(`https://localhost:7147/chatHub?conversationId=0`)
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();

    setConnection(conn);

    conn
      .start()
      .then(() => {
        console.log("SignalR connected in ConversationList");

        conn.on("ReceiveMessage", (message: Message) => {
          console.log("Message received:", message);
          console.log("conversationId:", message.conversationId);
          console.log("senderId:", message.senderId);
          setLocalConversations((prev) => {
            const index = prev.findIndex(
              (c) => c.conversation.conversationId === message.conversationId
            );
            if (index === -1) {
              // Nếu conversation chưa có trong list, invalid query để fetch lại data từ server
              queryClient.invalidateQueries({ queryKey: ["conversations", debouncedTerm] });
              return prev;
            }

            // Cập nhật latestMessage và isRead
            const updatedConversation = {
              ...prev[index],
              latestMessage: message,
              isRead: message.senderId === selfId,
            };

            // Đẩy conversation mới lên đầu danh sách
            const newList = [updatedConversation, ...prev.filter((_, i) => i !== index)];
            return newList;
          });
        });
      })
      .catch((err) => console.error("SignalR connection error:", err));

    return () => {
      conn.stop();
    };
  }, [queryClient, debouncedTerm]);

  // Xử lý scroll lấy trang tiếp theo
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (
      el.scrollHeight - el.scrollTop - el.clientHeight < 300 &&
      hasNextPage &&
      !isFetchingNextPage
    ) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex flex-col border-r h-full w-80">
      <h1 className="p-3 text-3xl font-bold">Trò chuyện</h1>

      <div className="relative p-3">
        <span className="absolute left-5 top-2/5 transform -translate-y-1/2 text-gray-500">
          <Search />
        </span>
        <input
          className="w-full p-2 pl-10 mb-5 rounded border rounded-full bg-gray-200"
          placeholder="Tìm kiếm cuộc trò chuyện"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-auto" onScroll={handleScroll}>
        {isLoading && (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        )}
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

        {isFetchingNextPage && (
          <div className="p-2 text-center text-gray-500">Đang tải thêm...</div>
        )}
        {!hasNextPage && !isLoading && (
          <div className="p-2 text-center text-gray-400 text-sm">
            Đã hiển thị tất cả cuộc trò chuyện
          </div>
        )}
      </div>
    </div>
  );
}

function ConversationItem({
  conversation,
  selected,
  onClick,
}: {
  conversation: ConversationResponse;
  selected?: boolean;
  onClick: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer p-3 border-b hover:bg-gray-100 ${selected ? "bg-blue-100 font-semibold" : ""
        }`}
    >
      <div>{conversation.accountName2}</div>
      <div
        className={`text-xs truncate ${conversation.isRead
            ? "text-gray-500 font-normal"
            : "text-black font-semibold"
          }`}
      >
        {conversation.latestMessage?.messageText}
      </div>
    </div>
  );
}
