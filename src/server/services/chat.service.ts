import { Chat } from "../models/chat.model";

export class ChatService {
    constructor() { }

    getChats(): Promise<Chat[]> {
        return new Promise((resolve, reject) => {
            resolve([
                {
                    id: '1',
                    type: 'direct',
                    name: 'Direct Chat',
                    description: 'Direct Chat Description',
                    avatarFileId: '1',
                    isPublic: false,
                    isDraft: false,
                    createdAt: '2021-01-01T00:00:00.000Z',
                    updatedAt: '2021-01-01T00:00:00.000Z',
                    lastReadMessageId: '1',
                    unreadMessagesCount: 0,
                    lastMessage: {
                        id: '1',
                        text: 'Hello! your order has been shipped.',
                        createdAt: '2021-01-01T00:00:00.000Z',
                        updatedAt: '2021-01-01T00:00:00.000Z',
                        from: {
                            id: '1',
                            username: 'user1',
                            email: '',
                            displayName: 'Leo Yang',
                            firstName: 'Leo',
                            lastName: 'Yang',
                            avatarFileId: '1',
                            createdAt: '2021-01-01T00:00:00.000Z',
                            updatedAt: '2021-01-01T00:00:00.000Z'
                        }
                    },
                    members: []
                },
                {
                    id: '2',
                    type: 'group',
                    name: 'Group Chat',
                    description: 'Group Chat Description',
                    avatarFileId: '2',
                    isPublic: false,
                    isDraft: false,
                    createdAt: '2021-01-01T00:00:00.000Z',
                    updatedAt: '2021-01-01T00:00:00.000Z',
                    lastReadMessageId: '1',
                    unreadMessagesCount: 0,
                    lastMessage: {
                        id: '1',
                        text: 'Hello! your order has been shipped.',
                        createdAt: '2021-01-01T00:00:00.000Z',
                        updatedAt: '2021-01-01T00:00:00.000Z',
                        from: {
                            id: '1',
                            username: 'user1',
                            email: '',
                            displayName: 'Leo Yang',
                            firstName: 'Leo',
                            lastName: 'Yang',
                            avatarFileId: '1',
                            createdAt: '2021-01-01T00:00:00.000Z',
                            updatedAt: '2021-01-01T00:00:00.000Z'
                        }
                    },
                    members: []
                }
            ]);
        });
    }
}