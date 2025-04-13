import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Message, MessageQuery, MessageRequest } from '../models/message.model';
import { environment } from '../../../environments/environment';
import { PagedResult } from '../models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(private httpClient: HttpClient) { }

  getMessages(query: MessageQuery) {
    return this.httpClient.get<PagedResult<Message>>(`${environment.apiGateway}/api/v1/chats/${query.chatId}/messages`, {
      params: {
        direction: query.direction === 'forward' ? 1 : 0,
        limit: query.limit,
        offset: query.offset,
        anchorSquence: query.anchorSquence
      }
    });
  }

  getMessage(chatId: string, id: string) {
    return this.httpClient.get<Message>(`${environment.apiGateway}/api/v1/chats/${chatId}/messages/${id}`);
  }

  send(request: MessageRequest) {
    return this.httpClient.post<Message>(`${environment.apiGateway}/message/api/v1/messages`, request);
  }
  
  markAsRead(chatId: string, messageId: string) {
    return this.httpClient.post(`${environment.apiGateway}/api/v1/chats/${chatId}/messages/${messageId}/read`, {});
  }
}
