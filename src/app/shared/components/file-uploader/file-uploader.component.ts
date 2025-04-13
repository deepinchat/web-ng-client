import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FileService } from '../../../core/services/file.service';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { DOCUMENT } from '@angular/common';
import { FileModel } from '../../../core/models/file.model';

@Component({
  selector: 'deepin-file-uploader',
  imports: [
    MatIcon,
    MatButton
  ],
  templateUrl: './file-uploader.component.html',
  styleUrl: './file-uploader.component.scss'
})
export class FileUploaderComponent implements OnInit, OnDestroy {
  @Input() multiple: boolean = false;
  @Input() accept: string = '';
  @Input() maxSize: number = 0;
  @Input() disabled: boolean = false;
  @Input() text: string = 'Upload File';
  @Output() fileUploaded: EventEmitter<FileModel> = new EventEmitter<FileModel>();
  private elementId = 'file-uploader-' + Math.random().toString(36).substring(7);
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private fileService: FileService) {

  }

  ngOnDestroy(): void {
    const input = this.document.getElementById(this.elementId);
    if (input) {
      this.document.body.removeChild(input);
    }
  }

  ngOnInit(): void {

  }

  onUpload(): void {
    const input = this.getOrCreateImageUploadElement();
    input.click();
  }

  private getOrCreateImageUploadElement() {
    let input: any = this.document.getElementById(this.elementId);
    if (!input) {
      input = this.document.createElement('input');
      input.type = 'file';
      input.style.display = 'none';
      input.multiple = this.multiple;
      input.accept = this.accept;
      input.onchange = () => {
        const files = input.files;
        if (files && files.length > 0) {
          this.fileService.upload(files[0])
            .subscribe({
              next: (file) => {
                this.fileUploaded.emit(file);
              },
            })
        }
      }
      this.document.body.append(input);
    }
    return input;
  }
}
