import { UserProfile } from "./user.model";

export interface MessageRequest {
    chatId: string;
    content: string;
    replyTo: string;
}

export interface Message {
    id: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
    from: UserProfile;
    sequence: number;
    replyTo?: Message;
    isEdited: boolean;
    isRead: boolean;
    isMyMessage: boolean;
}

export interface MessageQuery {
    chatId: string;
    direction: MessageQueryDirection;
    limit: number;
    offset: number;
    anchorSquence: number;
}

export type MessageQueryDirection = 'backward' | 'forward';