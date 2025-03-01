import { DatePipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime'
})
export class FormatTimePipe implements PipeTransform {
  transform(value: Date, ...args: unknown[]) {
    const now = new Date();
    const messageDate = new Date(value);

    if (now.getDate() === messageDate.getDate() &&
      now.getMonth() === messageDate.getMonth() &&
      now.getFullYear() === messageDate.getFullYear()) {
      return new DatePipe('en-US').transform(value, 'HH:mm');
    } else if (now.getFullYear() === messageDate.getFullYear()) {
      return new DatePipe('en-US').transform(value, 'MMM d, HH:mm');
    } else {
      return new DatePipe('en-US').transform(value, 'MMM d, y, HH:mm');
    }
  }
}
