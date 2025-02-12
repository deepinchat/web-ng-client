import { Inject, Injectable } from '@angular/core';
import { User, UserManager, UserManagerSettings } from 'oidc-client-ts';
import { environment } from '../../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userManager: UserManager;
  private user: User | null = null;
  private userSubject = new BehaviorSubject<User | null>(null);
  constructor(@Inject(DOCUMENT) private document: Document) {
    const clientUrl = this.document.location.origin;
    const settings: UserManagerSettings = {
      authority: environment.identityUrl,
      client_id: environment.clientId,
      redirect_uri: `${clientUrl}/callback/signin`,
      post_logout_redirect_uri: `${clientUrl}/callback/signout`,
      silent_redirect_uri: `${clientUrl}/callback/silent-renew`,
      scope: environment.clientScope,
      response_type: 'code',
      automaticSilentRenew: true,
      loadUserInfo: true,
    };
    this.userManager = new UserManager(settings);
    this.userManager.events.addUserLoaded(() => this.loadUser());
    this.userManager.events.addUserUnloaded(() => this.userSubject.next(null));
    this.loadUser();
  }

  private async loadUser(): Promise<void> {
    try {
      this.user = await this.userManager.getUser();
      this.userSubject.next(this.user);
    } catch (error) {
      console.error('Error loading user', error);
    }
  }

  getUser(): Observable<User | null> {
    return this.userSubject.asObservable();
  }

  getAccessToken(): string | null {
    return this.user?.access_token ?? null;
  }

  signin(returnUrl: string = '/'): Promise<void> {
    return this.userManager.signinRedirect({ state: returnUrl });
  }

  signinSilent() {
    this.userManager.signinSilent()
      .then((user) => {
        this.userSubject.next(user);
      });
  }

  async signinCallback() {
    this.user = await this.userManager.signinRedirectCallback();
    this.userSubject.next(this.user);
    return this.user.state ?? '/';
  }

  renewToken(): Promise<User | null> {
    return this.userManager.signinSilent();
  }

  signout(): Promise<void> {
    return this.userManager.signoutRedirect();
  }

  isAuthenticated(): boolean {
    return this.user != null && !this.user.expired;
  }
}
