import { Component, Input } from '@angular/core';
import { MatCard, MatCardContent } from '@angular/material/card';
import { AvatarComponent } from '../../avatar/avatar.component';
import { Message } from '../../../../core/models/message.model';
import { FileUrlPipe } from '../../../pipes/file-url.pipe';
import { FormatTimePipe } from '../../../pipes/format-time.pipe';

@Component({
  selector: 'deepin-message',
  imports: [
    AvatarComponent,
    FileUrlPipe,
    FormatTimePipe
  ],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {
  @Input() message?: Message;
}
