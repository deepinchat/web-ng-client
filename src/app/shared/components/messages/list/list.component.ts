import { CdkVirtualForOf, CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MessageDataSource } from './message.datasource';
import { filter, fromEvent, Subscription, throttleTime } from 'rxjs';
import { AutoSizeDirective } from '../../../directives/auto-size.directive';
import { MessageService } from '../../../../core/services/message.service';
import { Message } from '../../../../core/models/message.model';
import { AvatarComponent } from '../../avatar/avatar.component';
import { FileUrlPipe } from '../../../pipes/file-url.pipe';
import { FormatTimePipe } from '../../../pipes/format-time.pipe';

@Component({
  selector: 'deepin-message-list',
  imports: [
    AutoSizeDirective,
    CdkVirtualScrollViewport,
    CdkVirtualForOf,
    AvatarComponent,
    FileUrlPipe,
    FormatTimePipe
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class MessaageListComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() chatId: string = '';
  @ViewChild(AutoSizeDirective) autoSizeDirective!: AutoSizeDirective;
  @ViewChild('cdkScrollViewport') scrollViewport!: CdkVirtualScrollViewport;
  dataSource?: MessageDataSource;
  pullToLoadProgress = 0;
  isPulling = false;
  touchStartY = 0;
  pullThreshold = 80;
  pullDistance = 0;
  private subscription = new Subscription();

  constructor(
    private ngZone: NgZone,
    private messageService: MessageService
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['chatId'] && changes['chatId'].currentValue && changes['chatId'].currentValue !== changes['chatId'].previousValue) {
      this.chatId = changes['chatId'].currentValue;
      if (this.dataSource) {
        this.dataSource.disconnect();
      }
      this.dataSource = new MessageDataSource(this.chatId, this.messageService);
    }
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.dataSource?.disconnect();
  }

  ngAfterViewInit(): void {
    setTimeout(() => this.scrollToBottom(), 200);

    this.setupPullToLoadGestures();

    if (this.scrollViewport) {
      this.subscription.add(
        this.scrollViewport.elementScrolled().pipe(
          throttleTime(200)
        ).subscribe(() => {
          this.checkScrollPosition();
        })
      );
    }
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  checkScrollPosition(): void {
    const scrollTop = this.scrollViewport.measureScrollOffset('top');

    if (scrollTop < 20 && !this.dataSource?.isLoadingHistory && this.dataSource?.hasMoreHistory) {
      this.loadOlderMessages();
    }
  }

  loadOlderMessages(): void {
    if (this.dataSource?.isLoadingHistory) return;

    if (this.autoSizeDirective) {
      this.autoSizeDirective.prepareForHistoricalContent();
    }

    this.subscription.add(this.dataSource?.loadOlderMessages().subscribe(success => { }));
  }

  loadNewerMessages(): void {
    if (this.dataSource?.isLoadingNewer) return;

    this.subscription.add(
      this.dataSource?.loadNewerMessages().subscribe(success => {
        if (success) {
          setTimeout(() => this.scrollToBottom(), 100);
        }
      })
    );
  }

  scrollToBottom(): void {
    if (this.autoSizeDirective) {
      this.autoSizeDirective.scrollToBottom('smooth');
    }
  }

  setupPullToLoadGestures(): void {
    const element = this.scrollViewport.elementRef.nativeElement;

    // 触摸开始
    this.subscription.add(
      fromEvent<TouchEvent>(element, 'touchstart').subscribe(event => {
        const scrollTop = this.scrollViewport.measureScrollOffset('top');
        const scrollBottom = this.scrollViewport.measureScrollOffset('bottom');

        if (scrollTop < 5 || scrollBottom < 5) {
          this.touchStartY = event.touches[0].clientY;
          this.isPulling = true;
          this.pullDistance = 0;
        }
      })
    );

    this.subscription.add(
      fromEvent<TouchEvent>(element, 'touchmove').pipe(
        filter(() => this.isPulling)
      ).subscribe(event => {
        const currentY = event.touches[0].clientY;
        const scrollTop = this.scrollViewport.measureScrollOffset('top');
        const scrollBottom = this.scrollViewport.measureScrollOffset('bottom');

        if (scrollTop < 5 && currentY > this.touchStartY) {
          this.pullDistance = currentY - this.touchStartY;
          this.pullToLoadProgress = Math.min(100, (this.pullDistance / this.pullThreshold) * 100);

          event.preventDefault();
        } else if (scrollBottom < 5 && currentY < this.touchStartY) {
          this.pullDistance = this.touchStartY - currentY;
          this.pullToLoadProgress = Math.min(100, (this.pullDistance / this.pullThreshold) * 100);

          event.preventDefault();
        }
      })
    );

    this.subscription.add(
      fromEvent<TouchEvent>(element, 'touchend').pipe(
        filter(() => this.isPulling)
      ).subscribe(() => {
        const scrollTop = this.scrollViewport.measureScrollOffset('top');
        const scrollBottom = this.scrollViewport.measureScrollOffset('bottom');

        if (this.pullDistance >= this.pullThreshold) {
          if (scrollTop < 5) {
            this.loadOlderMessages();
          } else if (scrollBottom < 5) {
            this.loadNewerMessages();
          }
        }

        this.isPulling = false;
        this.pullToLoadProgress = 0;
        this.pullDistance = 0;
      })
    );
  }
}
