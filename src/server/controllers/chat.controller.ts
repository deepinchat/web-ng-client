import { Request, Response } from 'express';
import { ChatService } from "../services/chat.service";

export class ChatController {
    private chatService: ChatService;
    constructor() {
        this.chatService = new ChatService();
        this.getChats = this.getChats.bind(this);
    }

    async getChats(req: Request, res: Response) {
        const chats = await this.chatService.getChats();
        res.json(chats);
    }
}