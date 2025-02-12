import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ThemeType = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  private _theme: BehaviorSubject<ThemeType> = new BehaviorSubject<ThemeType>(this.defaultTheme);
  public readonly theme = this._theme.asObservable();
  constructor(@Inject(DOCUMENT) private document: Document) { }

  changeTheme(theme: ThemeType) {
    this._theme.next(theme);
    const localStorage = this.document?.defaultView?.localStorage;
    if (localStorage) {
      localStorage.setItem('theme', theme);
    }
    this.document.documentElement.style.colorScheme = theme;
  }

  get defaultTheme() {
    const localStorage = this.document?.defaultView?.localStorage;
    if (localStorage) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        return savedTheme as ThemeType;
      }
    }
    return this.document?.documentElement.style.colorScheme as ThemeType ?? 'light';
  }
}
