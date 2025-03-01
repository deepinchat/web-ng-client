import { Injectable } from '@angular/core';
import { UserProfile } from '../models/user.model';
import { BehaviorSubject, map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private _user: BehaviorSubject<UserProfile | null> = new BehaviorSubject<UserProfile | null>(null);
  public readonly user = this._user.asObservable();

  constructor(private httpClient: HttpClient) { }

  init() {
    this.getUser().subscribe(res => {
      this._user.next(res);
    });
  }

  getUser() {
    return this.httpClient.get<UserProfile>(`${environment.apiGateway}/api/v1/users`)
      .pipe(map(res => {
        this._user.next(res);
        return res;
      }));
  }

  getUserById(id: string) {
    return this.httpClient.get<UserProfile>(`${environment.apiGateway}/api/v1/users/${id}`);
  }
}
