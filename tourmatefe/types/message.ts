
export type Message = {
    messageId: number;
    senderId: number;
    senderName: string;
    messageText: string;
    sendAt: string;
    conversationId: number;
    senderAvatarUrl: string;
}

export type ApiResponse = {
    messages: Message[];
    hasMore: boolean;
};