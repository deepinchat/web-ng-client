import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subString'
})
export class SubStringPipe implements PipeTransform {

  transform(value: string, maxLength = 100): any {
    if (!value || value.length <= maxLength) return value;
    return `${value.substr(0, maxLength)}...`;
  }
}
