import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({
  name: 'fileUrl'
})
export class FileUrlPipe implements PipeTransform {
  transform(fileId: string) {
    return fileId ? `${environment.apiGateway}/storage/api/v1/files/${fileId}` : null;
  }
}
