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

  send(request: MessageRequest) {
    return this.httpClient.post<Message>(`${environment.apiGateway}/message/api/v1/messages`, request);
  }
}
