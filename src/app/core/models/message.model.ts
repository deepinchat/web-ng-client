import { UserProfile } from "./user.model";
const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg', 'tiff', 'ico', 'heic'];
const VIDEOS_EXTENSIONS = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm', 'm4v', '3gp'];
const AUDIO_EXTENSIONS = ['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma', 'aiff', 'opus'];
const DOCUMENT_EXTENSIONS = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'rtf', 'csv', 'odt', 'ods', 'odp', 'html', 'htm', 'xml', 'json', 'md'];

export function getAttachmentType(fileName: string): AttachmentType {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (extension) {
        if (IMAGE_EXTENSIONS.includes(extension)) {
            return 'image';
        } else if (VIDEOS_EXTENSIONS.includes(extension)) {
            return 'video';
        } else if (AUDIO_EXTENSIONS.includes(extension)) {
            return 'audio';
        } else if (DOCUMENT_EXTENSIONS.includes(extension)) {
            return 'document';
        }
    }
    return 'file';
}

export enum MessageType {
    Text,
    Image,
    Video,
    Audio,
    Document,
    File,
    Location,
    Contact,
    Poll,
    Sticker,
    System
}

export type AttachmentType = 'image' | 'video' | 'audio' | 'document' | 'file';

export enum MentionType {
    User,
    All
}

export interface MessageReaction {
    userId: string;
    emoji: string;
    isAdded: boolean;
    createdAt: Date;
}

export interface MessageAttachment {
    type: AttachmentType;
    fileId: string;
    fileName: string;
    fileSize: number;
    thumbnailFileId?: string;
    mimeType: string;
    metaData?: string;
}

export interface MessageMention {
    type: MentionType;
    userId?: string;
    start: number;
    end: number;
}

export interface MessageRequest {
    chatId: string;
    type: MessageType;
    text?: string;
    parentId?: string;
    replyToId?: string;
    attachments?: MessageAttachment[];
    mentions?: MessageMention[];
}

export interface Message {
    id: string;
    type: MessageType;
    chatId: string;
    text: string;
    createdAt: Date;
    updatedAt: Date;
    sequence: number;
    replyTo?: Message;
    parentId?: string;
    replyToId?: string;
    isEdited: boolean;
    isRead: boolean;
    isPinned: boolean;
    isMyMessage: boolean;
    sender: UserProfile;
    attachments?: MessageAttachment[];
    mentions?: MessageMention[];
    reactions?: MessageReaction[];
}

export interface MessageQuery {
    chatId: string;
    direction: MessageQueryDirection;
    limit: number;
    offset: number;
    anchorSquence: number;
}

export type MessageQueryDirection = 'backward' | 'forward';