export interface UserProfile {
    id: string;
    username: string;
    email: string;
    displayName: string;
    firstName: string;
    lastName: string;
    avatarFileId: string;
    createdAt: Date;
}
export interface UserPresence {
    userId: string;
    status: PresenceStatus;
    lastSeen: Date;
    customStatus: string;
    customStatusExpiresAt?: Date;
}
export type PresenceStatus = 'online' | 'offline' | 'away' | 'busy' | 'doNotDisturb' | 'custom';