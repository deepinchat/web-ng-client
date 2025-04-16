import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconButton } from '@angular/material/button';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatChipEditedEvent, MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ChatService } from '../../../../core/services/chat.service';
import { MessageService } from '../../../../core/services/message.service';
import { FileModel } from '../../../../core/models/file.model';
import { getAttachmentType, MessageAttachment } from '../../../../core/models/message.model';
import { FileUploaderDirective } from '../../../directives/file-uploader.directive';

@Component({
  selector: 'deepin-message-editor',
  imports: [
    ReactiveFormsModule,
    MatChipsModule,
    MatLabel,
    MatFormField,
    MatInput,
    MatIcon,
    MatProgressSpinner,
    MatSuffix,
    MatIconButton,
    FileUploaderDirective
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class MessageEditorComponent implements OnInit {
  form?: FormGroup;
  isLoading = false;
  chatId: string = '';
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.chatService.chat.subscribe(chat => {
      if (chat) {
        this.chatId = chat.id;
        this.buildForm();
      }
    })
  }

  private buildForm() {
    if (!this.chatId) return;
    this.form = this.fb.group({
      type: this.fb.control('text'),
      chatId: this.fb.control(this.chatId),
      text: this.fb.control('', [Validators.required, Validators.maxLength(1024 * 100)]),
      attachments: this.fb.array([]),
    });
  }

  enterForm(event: any) {
    if (event.ctrlKey && event.keyCode === 13) {
      this.onSubmit();
    }
  }

  onSubmit() {
    if (!this.form || this.form?.invalid || this.isLoading) return;
    this.isLoading = true;
    this.messageService.send(this.form.value)
      .subscribe({
        next: () => {
          this.buildForm();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }

  onFileUploaded(files: FileModel[]) {
    if (!this.form) return;
    const attachments = this.form.get('attachments')?.value || [];
    files.forEach(file => {
      attachments.push({
        type: getAttachmentType(file.name),
        fileId: file.id,
        fileName: file.name,
        fileSize: file.length,
        thumbnailFileId: undefined,
        mimeType: file.mimeType
      });
    })
    this.updateAttachments(attachments);
  }

  updateAttachments(files: MessageAttachment[]) {
    if (!this.form) return;
    const attachmentsControl = this.form.get('attachments') as FormArray;
    attachmentsControl.clear();
    files.forEach(file => {
      attachmentsControl.push(this.fb.group({
        type: file.type,
        fileId: file.fileId,
        fileName: file.fileName,
        fileSize: file.fileSize,
        thumbnailFileId: file.thumbnailFileId,
        mimeType: file.mimeType
      }));
    });
  }

  removeFile(fileId: string) {
    if (!this.form) return;
    const attachments = this.form.get('attachments')?.value || [];
    const index = attachments.findIndex((f: MessageAttachment) => f.fileId === fileId);
    if (index !== -1) {
      attachments.splice(index, 1);
      this.updateAttachments(attachments);
    }
  }

  get attachments() {
    const attachments = this.form?.get('attachments')?.value || [];
    return attachments;
  }
}
