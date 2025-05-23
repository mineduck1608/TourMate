import { Account } from "./account"
import { Conversation } from "./conversation"
import { MessageType } from "./messageType"

export type Message = {
    messageId: number,
    conversationId: number,
    senderId: number,
    messageText: string,
    sendAt: string,
    isRead: boolean,
    isEdited: boolean,
    isDeleted: boolean,
    messageTypeId: number
    messageType: MessageType
    conversation: Conversation
    sender: Account
}