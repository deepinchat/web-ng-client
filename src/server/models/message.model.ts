import { UserInfo } from "./user.model";

export interface MessageRequest {
    chatId: string;
    text: string;
    replyTo: number;
}

export interface Message {
    id: string;
    text: string;
    createdAt: string;
    updatedAt: string;
    from: UserInfo;
}

export interface MessageQuery {
    chatId?: string;
    direction: MessageQueryDirection;
    limit: number;
    offset: number;
    fixedMessageId?: number;
}

export type MessageQueryDirection = 'backward' | 'forward';