// ConversationList.tsx
"use client";

import React, { useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { ConversationResponse } from "@/types/conversation";
import { fetchConversations } from "../api/conversation.api";

type Props = {
  onSelect: (conversation: ConversationResponse) => void;
  selectedId?: number;
};

const PAGE_SIZE = 20;
const selfId = 1;

export default function ConversationList({ onSelect, selectedId }: Props) {
  const [searchTerm, setSearchTerm] = useState("");

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery<
    { conversations: ConversationResponse[]; hasMore: boolean },
    unknown
  >({
    queryKey: ["conversations", searchTerm],
    queryFn: ({ pageParam = 1 }) => fetchConversations(pageParam, PAGE_SIZE, selfId, searchTerm),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.hasMore ? allPages.length + 1 : undefined,
    initialPageParam: 1,
  });

  const conversations = data?.pages.flatMap(page => page.conversations) ?? [];

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const el = e.currentTarget;
    if (el.scrollHeight - el.scrollTop === el.clientHeight && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <div className="flex flex-col border-r h-full w-80">
      <div className="p-3 border-b">
        <input
          className="w-full p-2 rounded border"
          placeholder="Tìm kiếm cuộc trò chuyện"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div
        className="flex-1 overflow-auto"
        onScroll={handleScroll}
      >
        {conversations.length === 0 && <div className="p-4 text-gray-500">Không có cuộc trò chuyện</div>}
        {conversations.map((conversation) => (
          <ConversationItem
            key={conversation.conversation.conversationId}
            conversation={conversation}
            selected={selectedId === conversation.conversation.conversationId}
            onClick={() => onSelect(conversation)}
          />
        ))}
        {isFetchingNextPage && <div className="p-2 text-center text-gray-500">Đang tải thêm...</div>}
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
      className={`cursor-pointer p-3 border-b hover:bg-gray-100 ${selected ? "bg-blue-100 font-semibold" : ""}`}
    >
      <div>{conversation.accountName1}</div>
      <div
        className={`text-xs truncate ${conversation.isRead ? "text-gray-500 font-normal" : "text-black font-semibold"
          }`}
      >
        {conversation.latestMessage?.messageText}
      </div>
    </div>
  );
}
