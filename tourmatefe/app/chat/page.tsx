"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ConversationList from "./conversationList";
import MessageList from "./messageList";
import MegaMenu from "@/components/mega-menu";
import { ConversationResponse } from "@/types/conversation";
import { fetchMarkRead, fetchOrCreateConversation } from "../api/conversation.api";
import { jwtDecode } from "jwt-decode";
import { MyJwtPayload } from "@/types/JwtPayload";
import { useToken } from "@/components/getToken";

function ChatContent() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);
  const searchParams = useSearchParams();
  const userId = searchParams.get("userId");

  const token = useToken("accessToken");
  const decoded: MyJwtPayload | null = token ? jwtDecode<MyJwtPayload>(token.toString()) : null;
  const currentUserId = decoded?.AccountId;

  useEffect(() => {
    const loadFromUserId = async () => {
      if (userId && !selectedConversation && currentUserId) {
        try {
          const conv = await fetchOrCreateConversation(currentUserId, Number(userId));
          setSelectedConversation(conv);
        } catch (error) {
          console.error("Không thể mở cuộc trò chuyện:", error);
        }
      }
    };

    loadFromUserId();
  }, [userId, selectedConversation, currentUserId]);

  const handleSelectConversation = async (conv: ConversationResponse) => {
    setSelectedConversation(conv);
    try {
      await fetchMarkRead(conv.conversation.conversationId, conv.conversation.account2Id);
    } catch (error) {
      console.error("Lỗi đánh dấu đã đọc:", error);
    }
  };

  return (
    <>
      <MegaMenu />
      <div className="flex h-[100vh] mx-auto border rounded shadow">
        <ConversationList
          onSelect={handleSelectConversation}
          selectedId={selectedConversation?.conversation.conversationId}
        />
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <MessageList conversationId={selectedConversation.conversation.conversationId} />
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              Vui lòng chọn cuộc trò chuyện
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div>Đang tải...</div>}>
      <ChatContent />
    </Suspense>
  );
}
