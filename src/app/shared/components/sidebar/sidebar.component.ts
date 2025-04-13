import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { MatMenu, MatMenuItem, MatMenuTrigger } from '@angular/material/menu';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ChatEditorComponent } from '../chats/chat-editor/chat-editor.component';
import { ThemeType, LayoutService } from '../../../core/services/layout.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'deepin-sidebar',
  imports: [
    RouterLink,
    RouterLinkActive,
    MatListModule,
    MatIcon,
    MatMenu,
    MatMenuItem,
    MatMenuTrigger,
    MatDialogModule,
    MatButtonModule
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  theme: ThemeType;
  constructor(
    private dialog: MatDialog,
    private layoutService: LayoutService,
  ) {
    this.theme = this.layoutService.defaultTheme;
    this.layoutService.theme.subscribe(res => {
      this.theme = res;
    });
  }

  toggleTheme() {
    const nextTheme = this.theme === 'light' ? 'dark' : 'light';
    this.layoutService.changeTheme(nextTheme);
  }

  createGroup() {
    this.dialog.open(ChatEditorComponent, {
      data: { type: 'group' },
      minWidth: 400,
      height: 'auto'
    });
  }

  createChannel() {
    this.dialog.open(ChatEditorComponent, {
      data: { type: 'channel' },
      minWidth: 400,
      height: 'auto'
    });
  }
}
