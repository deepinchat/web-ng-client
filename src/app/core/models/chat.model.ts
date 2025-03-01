import { Message } from "./message.model";
import { UserProfile } from "./user.model";

export type ChatType = 'direct' | 'group' | 'channel';
export type ChatMemberRole = 'admin' | 'member' | 'guest' | 'owner' | 'banned' | 'muted';

export interface ChatRequest {
    name: string;
    description: string;
    avatarFileId: string;
    isPublic: boolean;
    type: ChatType;
}

export interface Chat {
    id: string;
    name: string;
    userName: string;
    description: string;
    avatarFileId: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    unreadCount: number;
    type: ChatType;
    lastMessage: Message;
    lastReadMessage: Message;
}

export interface ChatMember {
    userId: string;
    displayName: string;
    joinedAt: string;
    updatedAt: Date;
    role: ChatMemberRole;
    profile: UserProfile;
}