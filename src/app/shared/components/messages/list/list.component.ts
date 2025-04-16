import { CdkVirtualForOf, CdkVirtualScrollViewport, ScrollDispatcher, ScrollingModule } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, Input, NgZone, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ScrollingModule as ExperimentalScrollingModule } from '@angular/cdk-experimental/scrolling';
import { MessageDataSource } from './message.datasource';
import { filter, Subscription, throttleTime } from 'rxjs';
import { MessageService } from '../../../../core/services/message.service';
import { Message } from '../../../../core/models/message.model';
import { ChatHubService } from '../../../../core/services/chat-hub.service';
import { MessageComponent } from '../message/message.component';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { ChatService } from '../../../../core/services/chat.service';

@Component({
  selector: 'deepin-message-list',
  imports: [
    ScrollingModule,
    CdkVirtualForOf,
    MatProgressSpinner,
    MessageComponent
  ],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss',
})
export class MessaageListComponent implements OnInit, OnDestroy, AfterViewInit, OnChanges {
  @Input() chatId: string = '';
  @Input() lastReadMessageId = '';
  @ViewChild('cdkScrollViewport') scrollViewport!: CdkVirtualScrollViewport;
  dataSource?: MessageDataSource;
  isAtBottom = false;
  isInitialized = false;
  lastScrollPosition = 0;
  private subscriptions: Subscription[] = [];

  constructor(
    private ngZone: NgZone,
    private scrollDispatcher: ScrollDispatcher,
    private messageService: MessageService,
    private chatHubService: ChatHubService,
    private chatService: ChatService
  ) { }

  ngOnChanges(changes: SimpleChanges): void {
    const chatIdChange = changes['chatId'];
    if (chatIdChange && chatIdChange.currentValue && chatIdChange.previousValue && chatIdChange.currentValue !== chatIdChange.previousValue) {
      console.log('chatIdChange', chatIdChange);
      this.chatId = chatIdChange.currentValue;
      if (changes['lastReadMessageId']) {
        this.lastReadMessageId = changes['lastReadMessageId'].currentValue;
      }
      this.dataSourceInit(this.chatId);
    }
  }

  dataSourceInit(chatId: string) {
    this.isInitialized = false;
    if (this.dataSource) {
      this.dataSource.disconnect();
    }
    this.dataSource = new MessageDataSource(chatId, this.messageService);
    this.dataSource.loadInitialMessages()
      .subscribe(res => {
        setTimeout(() => {
          this.scrollToBottom();
        }, 100);
        setTimeout(() => {
          this.isInitialized = true;
        }, 1000);
      });
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.chatHubService.newMessage$.subscribe(message => {
        if (message && message.chatId === this.chatId) {
          this.dataSource?.addMessage(message);
          if (this.isAtBottom) {
            setTimeout(() => this.scrollToBottom(), 100);
          }
        }
      })
    );

    this.dataSourceInit(this.chatId);
  }

  ngAfterViewInit(): void {
    this.subscriptions.push(
      this.scrollDispatcher.scrolled().pipe(
        throttleTime(500),
        filter(() => this.isInitialized && this.scrollViewport.getDataLength() > 0)
      ).subscribe(() => {
        this.checkScrollPosition();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.subscriptions = [];
    this.dataSource?.disconnect();
  }

  trackByMessageId(index: number, message: Message): string {
    return message.id;
  }

  checkScrollPosition(): void {
    if (!this.scrollViewport) return;
    const scrollTop = this.scrollViewport.measureScrollOffset('top');
    const scrollBottom = this.scrollViewport.measureScrollOffset('bottom');
    const scrollHeight = this.scrollViewport.getElementRef().nativeElement.scrollHeight;
    const isScrollingUp = this.lastScrollPosition > scrollTop;
    this.lastScrollPosition = scrollTop;
    const threshold = scrollHeight * 0.5;
    console.log({
      scrollHeight,
      scrollTop,
      scrollBottom,
      threshold
    });
    if (isScrollingUp && scrollTop < threshold && !this.dataSource?.isLoadingHistory && this.dataSource?.hasMoreHistory) {
      this.dataSource?.loadOlderMessages().subscribe(success => { })
      return;
    }
    if (!isScrollingUp && scrollBottom < threshold && !this.dataSource?.isLoadingNewer && this.dataSource?.hasMoreNewer) {
      this.dataSource?.loadNewerMessages().subscribe(success => {
        if (success) {
          setTimeout(() => this.scrollToBottom(), 100);
        }
      })
    }
  }

  // private scrollToAnchorMessage(message: Message): void {
  //   const anchorElement = document.getElementById(`message-${message.id}`);
  //   if (anchorElement) {
  //     anchorElement.scrollIntoView({ block: 'start' });
  //   }
  // }
  // private scrollToLastRead(): void {
  //   if (!this.lastReadMessageId || !this.dataSource) return;
  //   this.dataSource.backwardsQuery.query.anchorSquence = this.dataSource.messages.findIndex(m => m.id === this.lastReadMessageId);

  // }

  scrollToLatest(): void {
    if (!this.dataSource) return;
    if (!this.dataSource.hasMoreHistory) {
      this.scrollToBottom();
    } else {
      this.dataSource.loadInitialMessages().subscribe(success => {
        if (success) {
          this.scrollToBottom();
        }
      });
    }
  }

  scrollToBottom(): void {
    this.isAtBottom = true;
    this.ngZone.run(() => {
      if (this.scrollViewport) {
        this.scrollViewport.scrollTo({ bottom: 0, behavior: this.isInitialized ? 'smooth' : 'auto' });
        if (this.isInitialized && this.dataSource?.latestMessage) {
          this.chatService.readMessage(this.chatId, this.dataSource.latestMessage.id).subscribe();
        }
      }
    });
  }
}
