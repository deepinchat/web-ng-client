import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Chat, ChatRequest } from '../models/chat.model';
import { BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private _chatChanged = new Subject<boolean>();
  private _currentChat: BehaviorSubject<Chat | null> = new BehaviorSubject<Chat | null>(null);
  public readonly chat = this._currentChat.asObservable();
  public readonly chatChanged = this._chatChanged.asObservable();

  constructor(private httpClient: HttpClient) { }

  open(chat: Chat) {
    this._currentChat.next(chat);
  }

  close() {
    this._currentChat.next(null);
  }

  refresh() {
    this._chatChanged.next(true);
  }

  getList() {
    return this.httpClient.get<Chat[]>(`${environment.apiGateway}/api/v1/chats`);
  }

  get(id: string) {
    return this.httpClient.get<Chat>(`${environment.apiGateway}/api/v1/chats/${id}`);
  }

  create(request: ChatRequest) {
    return this.httpClient.post<Chat>(`${environment.apiGateway}/chat/api/v1/chats`, request);
  }

  update(request: ChatRequest, chatId: string) {
    return this.httpClient.put<Chat>(`${environment.apiGateway}/chat/api/v1/chats/${chatId}`, {
      id: chatId,
      ...request
    });
  }

  createOrUpdate(request: ChatRequest, chatId?: string) {
    if (chatId) {
      return this.update(request, chatId);
    } else {
      return this.create(request);
    }
  }

  getMembers(chatId: string, offset: number, limit: number) {
    return this.httpClient.get(`${environment.apiGateway}/api/v1/chats/${chatId}/members?offset=${offset}&limit=${limit}`);
  }
}
