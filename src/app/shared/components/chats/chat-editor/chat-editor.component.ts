import { NgIf, DOCUMENT } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { ChatType, Chat } from '../../../../core/models/chat.model';
import { ChatService } from '../../../../core/services/chat.service';
import { FileUploaderComponent } from '../../file-uploader/file-uploader.component';
import { FileModel } from '../../../../core/models/file.model';
import { AvatarComponent } from "../../avatar/avatar.component";

@Component({
  selector: 'app-chat-editor',
  imports: [
    NgIf,
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatCheckbox,
    MatButton,
    MatIcon,
    MatProgressSpinner,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatInputModule,
    FileUploaderComponent,
    AvatarComponent
  ],
  templateUrl: './chat-editor.component.html',
  styleUrl: './chat-editor.component.scss'
})
export class ChatEditorComponent {
  form?: FormGroup;
  isLoading = false;
  isNew = true;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(MAT_DIALOG_DATA) public data: { type: ChatType, chat?: Chat },
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private chatService: ChatService,
    private dialogRef: MatDialogRef<ChatEditorComponent>
  ) {
    this.isNew = !this.data.chat;
  }

  ngOnInit() {
    this.buildForm(this.data.chat);
  }

  formControlErrors(name: string) {
    return this.form?.get(name)?.errors;
  }

  formControlValue(name: string) {
    return this.form?.get(name)?.value;
  }

  buildForm(chat?: Chat) {
    this.form = this.fb.group({
      type: this.fb.control(chat?.type ?? this.data.type),
      name: this.fb.control(chat?.name ?? '', [Validators.required, Validators.maxLength(32)]),
      userName: this.fb.control(chat?.userName ?? '', [Validators.required, Validators.maxLength(32)]),
      description: this.fb.control(chat?.description ?? '', [Validators.maxLength(256)]),
      isPublic: this.fb.control(chat?.isPublic ?? true),
      avatarFileId: this.fb.control(chat?.avatarFileId ?? '')
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.form || this.isLoading || this.form.invalid) return;
    this.isLoading = true;
    this.chatService.createOrUpdate(this.form.value, this.data.chat?.id)
      .subscribe({
        next: () => {
          this.snackBar.open(this.isNew ? 'Chat Updated.' : 'Chat Updated.', 'Close', { duration: 3000 });
          this.dialogRef.close();
          this.chatService.refresh();
        },
        complete: () => {
          this.isLoading = false;
        }
      })
  }

  onFileUploaded(files: FileModel[]) {
    this.form?.get('avatarFileId')?.setValue(files[0].id);
  }
}
