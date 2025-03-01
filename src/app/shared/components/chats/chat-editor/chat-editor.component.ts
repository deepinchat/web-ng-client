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
    MatInputModule
  ],
  templateUrl: './chat-editor.component.html',
  styleUrl: './chat-editor.component.scss'
})
export class ChatEditorComponent {
  form?: FormGroup;
  isLoading = false;
  constructor(
    @Inject(DOCUMENT) private document: Document,
    @Inject(MAT_DIALOG_DATA) public data: { id?: string, type: ChatType },
    private snackBar: MatSnackBar,
    private fb: FormBuilder,
    private chatService: ChatService,
    private dialogRef: MatDialogRef<ChatEditorComponent>
  ) { }

  ngOnInit() {
    if (this.data.id) {
      this.chatService.get(this.data.id)
        .subscribe(res => {
          this.buildForm(res);
        });
    } else {
      this.buildForm();
    }
  }

  formControlErrors(name: string) {
    console.log(this.form?.get(name)?.errors);
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
      isPublic: this.fb.control(chat?.isPublic ?? false),
      avatarFileId: this.fb.control(chat?.avatarFileId ?? '')
    });
  }

  onCancel() {
    this.dialogRef.close();
  }

  onSubmit() {
    if (!this.form || this.isLoading || this.form.invalid) return;
    this.isLoading = true;
    this.chatService.createOrUpdate(this.form.value, this.data.id)
      .subscribe({
        next: () => {
          this.snackBar.open(this.data.id ? 'Chat Updated.' : 'Chat Created.', 'Close', { duration: 2000 });
          this.dialogRef.close();
          this.chatService.refresh();
        },
        complete: () => {
          this.isLoading = false;
        }
      })
  }


  // getOrCreateImageUploadElement() {
  //   let input: any = this.document.getElementById('group-chat-picture-uploader');
  //   if (!input) {
  //     input = this.document.createElement('input');
  //     input.type = 'file';
  //     input.style.display = 'none';
  //     input.multiple = false;
  //     input.accept = 'image/*';
  //     input.onchange = () => {
  //       const files = input.files;
  //       if (files && files.length > 0) {
  //         this.fileService.upload(files[0])
  //           .subscribe({
  //             next: (file) => {
  //               if (this.form) {
  //                 this.pictureId = file.id;
  //                 this.form.get('pictureId')?.setValue(file.id);
  //               }
  //             },
  //           })
  //       }
  //     }
  //     this.document.body.append(input);
  //   }
  //   return input;
  // }

  onUploadAvatar() {
    // const input: HTMLInputElement = this.getOrCreateImageUploadElement();
    // input.click();
  }
}
