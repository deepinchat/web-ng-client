import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileModel } from '../models/file.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private httpClient: HttpClient) { }
  get(id: string) {
    return this.httpClient.get<FileModel>(`${environment.apiGateway}/storage/api/v1/files/${id}`);
  }

  upload(file: File) {
    const formData = new FormData();
    formData.append('file', file);
    return this.httpClient.post<FileModel>(`${environment.apiGateway}/storage/api/v1/files`, formData);
  }

  download(id: string) {
    return this.httpClient.get(`${environment.apiGateway}/storage/api/v1/files/${id}/download`, {
      responseType: 'blob'
    })
  }
}
