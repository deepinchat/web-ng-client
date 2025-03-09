import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatSidenavContainer, MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { MatDivider } from '@angular/material/divider';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { UserService } from '../../../core/services/user.service';
import { ChatHubService } from '../../../core/services/chat-hub.service';

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    MatSidenavContainer,
    MatSidenav,
    MatSidenavContent,
    MatDivider,
    SidebarComponent
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit {
  constructor(
    private userService: UserService,
    private chatHubService: ChatHubService
  ) {
  }
  ngOnInit(): void {
    this.userService.init();
    this.chatHubService.start();
  }
}
