
export type Message = {
    messageId: number;
    senderId: number;
    senderName: string;
    messageText: string;
    sendAt: string;
    conversationId: number;
}

export type ApiResponse = {
    messages: Message[];
    hasMore: boolean;
};