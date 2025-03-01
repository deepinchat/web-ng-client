import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

const COLORS = [
  '#FF6767',
  '#FFA467',
  '#FFD567',
  '#67FF7F',
  '#67D4FF',
  '#6781FF',
  '#A367FF',
  '#FF67D4',
  '#FF67A4',
  '#67FFD5'
]
@Component({
  selector: 'deepin-avatar',
  imports: [],
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss'
})
export class AvatarComponent implements OnInit {
  @Input() avatarUrl: string | null = null;
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() displayName: string = '';
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() shape: 'circle' | 'rounded' | 'square' = 'circle';
  backgroundColor: string = '';
  initials: string = '';

  ngOnInit(): void {
    this.updateInitials();
    this.updateBackgroundColor();
  }

  private updateInitials(): void {
    let initials = '';

    if (this.firstName) {
      initials += this.firstName.charAt(0);
    }

    if (this.lastName) {
      initials += this.lastName.charAt(0);
    }

    if (!initials) {
      initials = this.displayName.charAt(0);
    }

    this.initials = initials || '?';
  }
  private updateBackgroundColor(): void {
    let name = (this.firstName + this.lastName) || this.displayName;

    if (!name) {
      this.backgroundColor = COLORS[0];
      return;
    }
    let sum = 0;
    for (let i = 0; i < name.length; i++) {
      sum += name.charCodeAt(i);
    }

    const colorIndex = sum % COLORS.length;
    this.backgroundColor = COLORS[colorIndex];
  }

  handleImageError(): void {
    this.avatarUrl = null;
  }
}
