import { Directive, ElementRef, EventEmitter, Inject, Input, Output } from '@angular/core';
import { FileService } from '../../core/services/file.service';
import { DOCUMENT } from '@angular/common';
import { FileModel } from '../../core/models/file.model';

@Directive({
  selector: '[fileUploader]'
})
export class FileUploaderDirective {
  @Input() multiple: boolean = false;
  @Input() accept: string = '';
  @Input() maxSize: number = 0;
  @Output() fileUploaded: EventEmitter<FileModel[]> = new EventEmitter<FileModel[]>();
  private elementId = 'file-uploader-' + Math.random().toString(36).substring(7);
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private elemenrRef: ElementRef,
    private fileService: FileService) { }

  ngOnInit() {
    const button = this.elemenrRef.nativeElement;
    button.addEventListener('click', () => {
      const input = this.getOrCreateImageUploadElement();
      input.click();
    });
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
          this.fileService.upload(files)
            .subscribe({
              next: (files) => {
                this.fileUploaded.emit(files);
              },
            })
        }
      }
      this.document.body.append(input);
    }
    return input;
  }

}
