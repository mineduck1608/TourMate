"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { debounce } from "lodash";
import { ConversationResponse } from "@/types/conversation";
import { fetchConversations } from "../api/conversation.api";
import { Search } from "lucide-react";
import { MyJwtPayload } from "@/types/JwtPayload";
import { jwtDecode } from "jwt-decode";
import { GetToken } from "@/components/getToken";

type Props = {
  onSelect: (conversation: ConversationResponse) => void;
  selectedId?: number;
  refresh: boolean; // Nhận prop refresh để trigger refetch
};

const PAGE_SIZE = 20;

export default function ConversationList({ onSelect, selectedId, refresh }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");
  const [localConversations, setLocalConversations] = useState<ConversationResponse[]>([]);

  const token = GetToken("accessToken");
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null;
  const currentAccountId = decoded?.AccountId;

  // Refs để giữ giá trị mới nhất cho event handler hoặc callback
  const debouncedTermRef = useRef(debouncedTerm);
  useEffect(() => {
    debouncedTermRef.current = debouncedTerm;
  }, [debouncedTerm]);

  const currentAccountIdRef = useRef(currentAccountId);
  useEffect(() => {
    currentAccountIdRef.current = currentAccountId;
  }, [currentAccountId]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch, // Lấy hàm refetch từ react-query
  } = useInfiniteQuery<
    { conversations: ConversationResponse[]; hasMore: boolean },
    unknown
  >({
    queryKey: ["conversations", debouncedTerm, currentAccountId],
    queryFn: ({ pageParam = 1 }) =>
      fetchConversations(pageParam, PAGE_SIZE, currentAccountId as number, debouncedTerm),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
    enabled: !!currentAccountId,
  });

  // Khi prop refresh thay đổi, gọi refetch để lấy dữ liệu mới
  useEffect(() => {
    if (refresh) {
      refetch();
    }
  }, [refresh, refetch]);

  // Đồng bộ dữ liệu từ React Query vào localConversations mỗi khi data thay đổi
  useEffect(() => {
    if (data?.pages) {
      const allConversations = data.pages.flatMap(page => page.conversations);

      // Sắp xếp giảm dần theo latestMessage.sendAt
      allConversations.sort((a, b) => {
        const timeA = a.latestMessage?.sendAt ? new Date(a.latestMessage.sendAt).getTime() : 0;
        const timeB = b.latestMessage?.sendAt ? new Date(b.latestMessage.sendAt).getTime() : 0;
        return timeB - timeA;
      });

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

  // Memo sắp xếp lại localConversations trước render (phòng trường hợp setLocalConversations không đảm bảo thứ tự)
  const sortedConversations = React.useMemo(() => {
    return [...localConversations].sort((a, b) => {
      const timeA = a.latestMessage?.sendAt ? new Date(a.latestMessage.sendAt).getTime() : 0;
      const timeB = b.latestMessage?.sendAt ? new Date(b.latestMessage.sendAt).getTime() : 0;
      return timeB - timeA;
    });
  }, [localConversations]);

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
        {isLoading && (
          <div className="p-4 text-center text-gray-500">Đang tải...</div>
        )}
        {!isLoading && sortedConversations.length === 0 && (
          <div className="p-4 text-gray-500">Không có cuộc trò chuyện</div>
        )}

        {sortedConversations.map((conversation) => (
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
      className={`cursor-pointer p-3 border-b hover:bg-gray-100 ${
        selected ? "bg-blue-100 font-semibold" : ""
      }`}
    >
      <div>{conversation.accountName2}</div>
      <div
        className={`text-xs truncate ${
          conversation.isRead
            ? "text-gray-500 font-normal"
            : "text-black font-semibold"
        }`}
      >
        {conversation.latestMessage?.messageText}
      </div>
    </div>
  );
}
