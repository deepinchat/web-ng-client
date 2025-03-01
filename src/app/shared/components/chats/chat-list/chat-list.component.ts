import { Component, OnInit } from '@angular/core';
import { MatList } from '@angular/material/list';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';
import { Chat } from '../../../../core/models/chat.model';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'deepin-chat-list',
  imports: [
    MatList,
    ChatListItemComponent
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit {
  chats: Chat[] = [];
  isLoading = false;
  openedChatId: string = '';
  constructor(private chatService: ChatService) {
    this.chatService.chat.subscribe((chat) => {
      this.openedChatId = chat?.id || '';
    });
    this.chatService.chatChanged.subscribe(() => {
      this.loadChats();
    });
  }

  ngOnInit() {
    this.loadChats();
  }

  onChat(chat: Chat) {
    this.openedChatId = chat.id;
    this.chatService.open(chat);
  }

  private loadChats() {
    if (this.isLoading) return;
    this.isLoading = true;
    this.chatService.getList().subscribe({
      next: (chats) => {
        this.chats = chats;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }
}
