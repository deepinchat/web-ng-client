import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatList } from '@angular/material/list';
import { ChatListItemComponent } from '../chat-list-item/chat-list-item.component';
import { Chat } from '../../../../core/models/chat.model';
import { ChatService } from '../../../../core/services/chat.service';
import { Subscription } from 'rxjs';
import { ChatHubService } from '../../../../core/services/chat-hub.service';
import { MatToolbar } from '@angular/material/toolbar';
import { MatFormField, MatInput, MatInputModule, MatSuffix } from '@angular/material/input';
import { MatFormFieldControl, MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'deepin-chat-list',
  imports: [
    MatList,
    MatInput,
    MatSuffix,
    MatToolbar,
    MatFormFieldModule,
    MatIcon,
    ChatListItemComponent
  ],
  templateUrl: './chat-list.component.html',
  styleUrl: './chat-list.component.scss'
})
export class ChatListComponent implements OnInit, OnDestroy {
  chats: Chat[] = [];
  isLoading = false;
  openedChatId: string = '';
  subscription = new Subscription();
  constructor(private chatService: ChatService, private chatHubService: ChatHubService) {
    this.subscription.add(
      this.chatService.chat.subscribe((chat) => {
        this.openedChatId = chat?.id || '';
      })
    );
    this.subscription.add(
      this.chatService.chatChanged.subscribe(() => {
        this.loadChats();
      }));
    this.subscription.add(
      this.chatHubService.newMessage$.subscribe(message => {
        if (message) {
          const chat = this.chats.find(c => c.id === message.chatId);
          if (chat) {
            chat.lastMessage = message;
            if (chat.lastReadMessage) {
              chat.unreadCount = message.sequence - chat.lastReadMessage.sequence;
            } else {
              chat.unreadCount = message.sequence;
            }
          }
        }
      })
    );
  }
  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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
