import { Component, Input } from '@angular/core';
import { FileService } from '../../../core/services/file.service';

@Component({
  selector: 'deepin-video',
  imports: [],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
  @Input() fileId: string | null = null;
  @Input() coverImageFileId: string | null = null;
  videoUrl: string | null = null;
  coverImageUrl: string | null = null;
  constructor(
    private fileService: FileService
  ) {

  }
  async ngOnInit() {
    if (this.fileId) {
      this.videoUrl = await this.fileService.getLocalDownloadUrl(this.fileId);
    }
    if (this.coverImageFileId) {
      this.coverImageUrl = await this.fileService.getLocalDownloadUrl(this.coverImageFileId);
    }
  }
}
