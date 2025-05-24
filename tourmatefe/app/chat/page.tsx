"use client";

import React, { useState } from "react";
import ConversationList from "./conversationList";
import MessageList from "./messageList";
import MegaMenu from "@/components/MegaMenu";

export default function ChatPage() {
  const [selectedConversation, setSelectedConversation] = useState<number | null>(null);
  const [refreshConversationList, setRefreshConversationList] = useState(false);

  // Khi messageList nhận tin nhắn mới, gọi hàm này để báo ConversationList refetch
  const handleNewMessage = () => {
    setRefreshConversationList(prev => !prev); // Đổi state để trigger refetch
  };

  return (
    <>
      <MegaMenu />
      <div className="flex h-[100vh] mx-auto border rounded shadow">
        <ConversationList
          onSelect={(conv) => setSelectedConversation(conv.conversation.conversationId)}
          selectedId={selectedConversation ?? undefined}
          refresh={refreshConversationList} // truyền prop để refetch
        />
        <div className="flex-1 flex flex-col">
          {selectedConversation ? (
            <MessageList
              conversationId={selectedConversation}
              onNewMessage={handleNewMessage} // truyền callback
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
