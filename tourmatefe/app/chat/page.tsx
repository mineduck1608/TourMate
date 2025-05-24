"use client";

import React, { useState } from "react";
import ConversationList from "./conversationList";
import MessageList from "./messageList";
import MegaMenu from "@/components/MegaMenu";
import Footer from "@/components/Footer";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);

  return (
    <>
    <MegaMenu />
    <div className="flex h-[100vh] mx-auto border rounded shadow">
      <ConversationList
        onSelect={(conv) => setSelectedConversation(conv.conversation.conversationId)}
        selectedId={selectedConversation ?? undefined}
      />
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <MessageList conversationId={selectedConversation} />
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
