import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { FileModel } from '../models/file.model';
import { environment } from '../../../environments/environment';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FileService {
  static cachedUrls: Map<string, string> = new Map<string, string>();
  constructor(private httpClient: HttpClient) { }
  get(id: string) {
    return this.httpClient.get<FileModel>(`${environment.apiGateway}/storage/api/v1/files/${id}`);
  }

  upload(files: File[]) {
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append('files', files[i]);
    }
    return this.httpClient.post<FileModel[]>(`${environment.apiGateway}/storage/api/v1/files`, formData);
  }

  download(id: string) {
    return this.httpClient.get(`${environment.apiGateway}/storage/api/v1/files/${id}/download`, {
      responseType: 'blob'
    })
  }

  async getLocalDownloadUrl(id: string) {
    if (!id) return null;
    if (FileService.cachedUrls.has(id)) {
      return FileService.cachedUrls.get(id)!;
    }
    const blob = await firstValueFrom(this.download(id));
    const objectUrl = URL.createObjectURL(blob);
    FileService.cachedUrls.set(id, objectUrl);
    return objectUrl;
  }

  getTemporaryDownloadToken(id: string) {
    return this.httpClient.get<{ token: string }>(`${environment.apiGateway}/storage/api/v1/files/${id}/download-token`);
  }

  async getTemporaryDownloadUrl(id: string, token?: string) {
    if (!token) {
      token = (await firstValueFrom(this.getTemporaryDownloadToken(id))).token;
    }
    return `${environment.apiGateway}/storage/api/v1/files/${id}/download/${token}`;
  }
}
