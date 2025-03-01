import { Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';
import { MatListItem, MatListItemAvatar, MatListItemLine, MatListItemMeta, MatListItemTitle } from '@angular/material/list';
import { MatBadge } from '@angular/material/badge';
import { RouterLink } from '@angular/router';
import { AvatarComponent } from '../../avatar/avatar.component';
import { Chat } from '../../../../core/models/chat.model';
import { FileUrlPipe } from '../../../pipes/file-url.pipe';
import { SubStringPipe } from '../../../pipes/sub-string.pipe';

@Component({
  selector: 'deepin-chat-list-item',
  imports: [
    NgIf,
    DatePipe,
    RouterLink,
    MatListItem,
    MatListItemAvatar,
    MatListItemTitle,
    MatListItemLine,
    MatListItemMeta,
    MatBadge,
    FileUrlPipe,
    SubStringPipe,
    AvatarComponent
  ],
  templateUrl: './chat-list-item.component.html',
  styleUrl: './chat-list-item.component.scss'
})
export class ChatListItemComponent {
  @Input() chat!: Chat;
  @Input() isActive = false;
}
