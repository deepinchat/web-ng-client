import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileUrl'
})
export class FileUrlPipe implements PipeTransform {

  transform(fileId: string) {
    return `https://i.pravatar.cc/150?u=${fileId}`;
    // return fileId ? `http://storage.deepin.me/files/${fileId}` : '';
  }

}
