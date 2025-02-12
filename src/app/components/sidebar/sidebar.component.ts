import { Component } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIcon } from '@angular/material/icon';
import { LayoutService, ThemeType } from '../../core/services/layout.service';

@Component({
  selector: 'deepin-sidebar',
  imports: [
    MatListModule,
    MatIcon
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss'
})
export class SidebarComponent {
  theme: ThemeType;
  constructor(
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
}
