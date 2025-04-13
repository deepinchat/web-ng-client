import { Component, Input } from '@angular/core';
import { AvatarComponent } from '../../avatar/avatar.component';
import { Message } from '../../../../core/models/message.model';
import { FormatTimePipe } from '../../../pipes/format-time.pipe';

@Component({
  selector: 'deepin-message',
  imports: [
    AvatarComponent,
    FormatTimePipe
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message?: Message;
}
