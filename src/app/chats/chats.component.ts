import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChatListComponent } from '../shared/components/chats/chat-list/chat-list.component';

@Component({
  selector: 'deepin-chats',
  imports: [
    RouterOutlet,
    ChatListComponent
  ],
  templateUrl: './chats.component.html',
  styleUrl: './chats.component.scss'
})
export class ChatsComponent {

}
