import { Component, OnDestroy, OnInit } from '@angular/core';
import { ChatService } from '../../core/services/chat.service';
import { ActivatedRoute } from '@angular/router';
import { MatIconButton } from '@angular/material/button';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { MatToolbar } from '@angular/material/toolbar';
import { Chat } from '../../core/models/chat.model';
import { MatIcon } from '@angular/material/icon';
import { FileUrlPipe } from '../../shared/pipes/file-url.pipe';
import { AvatarComponent } from '../../shared/components/avatar/avatar.component';
import { MessageEditorComponent } from '../../shared/components/messages/editor/editor.component';
import { MessaageListComponent } from '../../shared/components/messages/list/list.component';

@Component({
  selector: 'app-room',
  imports: [
    MatToolbar,
    MatIconButton,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatIcon,
    MessageEditorComponent,
    MessaageListComponent,
    AvatarComponent,
    FileUrlPipe
  ],
  templateUrl: './room.component.html',
  styleUrl: './room.component.scss'
})
export class RoomComponent implements OnInit, OnDestroy {
  id: string = '';
  chat?: Chat;
  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService
  ) {
    this.id = this.route.snapshot.params['chatId'];
    route.params.subscribe(params => {
      this.id = params['chatId'];
    });
    this.chatService.chat.subscribe(chat => {
      if (chat) {
        this.chat = chat;
      }
    }
    );
  }
  ngOnDestroy(): void {
    this.chatService.close();
  }

  loadChat() {
    this.chatService.get(this.id)
      .subscribe(chat => {
        if (chat) {
          this.chat = chat;
          this.chatService.open(chat);
        }
      });
  }
  ngOnInit() {
    this.loadChat();
  }

}
