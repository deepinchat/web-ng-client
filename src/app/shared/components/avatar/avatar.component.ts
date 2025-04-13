import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FileService } from '../../../core/services/file.service';
import { map } from 'rxjs';

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
export class AvatarComponent implements OnInit, OnChanges {
  @Input() fileId: string | null = null;
  @Input() firstName: string = '';
  @Input() lastName: string = '';
  @Input() displayName: string = '';
  @Input() size: 'small' | 'default' | 'large' = 'default';
  @Input() shape: 'circle' | 'rounded' | 'square' = 'circle';
  backgroundColor: string = '';
  initials: string = '';
  imageUrl = '';
  constructor(
    private fileService: FileService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["firstName"] || changes["lastName"] || changes["displayName"]) {
      this.updateInitials();
      this.updateBackgroundColor();
    }
    if (changes["fileId"] && this.fileId) {
      this.loadImage(this.fileId);
    }
  }
  ngOnInit() {
    this.updateInitials();
    this.updateBackgroundColor();
    if (this.fileId) {
      this.loadImage(this.fileId);
    }
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

  loadImage(id: string) {
    this.fileService.download(id)
      .pipe(map((file) => {
        return URL.createObjectURL(file);
      }))
      .subscribe(objectUrl => {
        this.imageUrl = objectUrl;
      });
  }
}
