import { Message } from "./message.model";
import { UserInfo } from "./user.model";

export type ChatType = 'direct' | 'group' | 'channel';
export type ChatMemberRole = 'admin' | 'member' | 'viewer' | 'owner' | 'banned';

export interface ChatRequest {
    name: string;
    description: string;
    avatarFileId: string;
    isPublic: boolean;
    type: ChatType;
}

export interface Chat {
    id: string;
    type: ChatType;
    name: string;
    description: string;
    avatarFileId: string;
    isPublic: boolean;
    isDraft: boolean;
    createdAt: string;
    updatedAt: string;
    lastReadMessageId: string;
    unreadMessagesCount: number;
    lastMessage: Message;
    members: ChatMember[];
}

export interface ChatMember {
    userId: string;
    displayName: string;
    createdAt: string;
    role: ChatMemberRole;
    user: UserInfo;
}