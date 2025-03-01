import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatMiniFabButton } from '@angular/material/button';
import { MatFormField, MatSuffix } from '@angular/material/form-field';
import { MatIcon } from '@angular/material/icon';
import { MatInput } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ChatService } from '../../../../core/services/chat.service';
import { MessageService } from '../../../../core/services/message.service';

@Component({
  selector: 'deepin-message-editor',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatInput,
    MatIcon,
    MatProgressSpinner,
    MatSuffix,
    MatMiniFabButton
  ],
  templateUrl: './editor.component.html',
  styleUrl: './editor.component.scss'
})
export class MessageEditorComponent implements OnInit {
  form?: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private chatService: ChatService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.chatService.chat.subscribe(chat => {
      if (chat) {
        this.buildForm(chat.id);
      }
    })
  }

  private buildForm(chatId: string) {
    this.form = this.fb.group({
      chatId: this.fb.control(chatId),
      content: this.fb.control('', [Validators.required, Validators.maxLength(8192)]),
      replyTo: this.fb.control('')
    });
  }

  resetForm() {
    this.form?.reset({
      chatId: this.form.value.chatId,
      replyTo: ''
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
          this.resetForm();
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  }


}
