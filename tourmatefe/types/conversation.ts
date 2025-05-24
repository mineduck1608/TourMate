import { Message } from "./message";

export type ConversationResponse = {
    conversation: Conversation,
    accountName1: string,
    accountName2: string,
    latestMessage: Message,
    isRead: boolean
}

export type ConversationListResult = {
  totalCount: string;
  conversations: ConversationResponse[];
  hasMore: boolean;
};


export type Conversation = {
    conversationId: number,
    account1Id: number,
    account2Id: number,
    createdAt: string
}