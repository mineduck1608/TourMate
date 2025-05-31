"use client"
import React, { useEffect, useState } from "react";
import ConversationList from "./conversationList";
import MessageList from "./messageList";
import MegaMenu from "@/components/mega-menu";
import { ConversationResponse } from "@/types/conversation";
import { fetchMarkRead } from "../api/conversation.api";


export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<ConversationResponse | null>(null);

  // Khi chọn conversation
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
            <MessageList
              conversationId={selectedConversation.conversation.conversationId}
            />
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
