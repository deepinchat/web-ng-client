import { Component, Input } from '@angular/core';
import { MessageAttachment } from '../../../../core/models/message.model';
import { ImageComponent } from '../../image/image.component';
import { VideoComponent } from '../../video/video.component';

@Component({
  selector: 'deepin-message-attachment',
  imports: [
    ImageComponent,
    VideoComponent
  ],
  templateUrl: './attachment.component.html',
  styleUrl: './attachment.component.scss'
})
export class MessageAttachmentComponent {
  @Input() attachment?: MessageAttachment;
}
