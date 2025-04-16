import { Component, Input, OnInit } from '@angular/core';
import { FileService } from '../../../core/services/file.service';
import { map } from 'rxjs';

@Component({
  selector: 'deepin-image',
  imports: [],
  templateUrl: './image.component.html',
  styleUrl: './image.component.scss'
})
export class ImageComponent implements OnInit {
  @Input() fileId: string | null = null;
  imageUrl: string | null = null;
  constructor(
    private fileService: FileService
  ) {

  }
  async ngOnInit() {
    if (this.fileId) {
      this.imageUrl = await this.fileService.getLocalDownloadUrl(this.fileId);
    }
  }
}
