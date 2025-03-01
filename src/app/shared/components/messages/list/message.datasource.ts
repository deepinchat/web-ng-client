import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, Observable, of, Subscription } from "rxjs";
import { Message, MessageQuery } from "../../../../core/models/message.model";
import { MessageService } from "../../../../core/services/message.service";

export class MessageDataSource extends DataSource<Message> {
    private readonly _dataStream = new BehaviorSubject<Message[]>([]);
    private loadingSubject = new BehaviorSubject<boolean>(false);
    private subscription = new Subscription();
    backwardsQuery: {
        isLoading: boolean,
        hasMore: boolean,
        query: MessageQuery
    };

    forwardsQuery: {
        isLoading: boolean,
        hasMore: boolean,
        query: MessageQuery
    };
    constructor(chatId: string, private messageService: MessageService) {
        super();
        this.backwardsQuery = {
            isLoading: false,
            hasMore: false,
            query: {
                chatId,
                offset: 0,
                limit: 30,
                direction: 'backward',
                anchorSquence: 0
            }
        };
        this.forwardsQuery = {
            isLoading: false,
            hasMore: false,
            query: {
                chatId,
                offset: 0,
                limit: 30,
                direction: 'forward',
                anchorSquence: 0
            }
        };
        this.loadInitialMessages();
    }


    connect(): Observable<Message[]> {
        return this._dataStream.asObservable();
    }


    disconnect() {
        this.subscription.unsubscribe();
        this._dataStream.complete();
        this.loadingSubject.complete();
    }


    get messages(): Message[] {
        return this._dataStream.value;
    }

    get isLoadingNewer(): boolean {
        return this.forwardsQuery.isLoading;
    }

    get isLoadingHistory(): boolean {
        return this.backwardsQuery.isLoading;
    }

    get hasMoreHistory(): boolean {
        return this.backwardsQuery.hasMore;
    }

    addMessages(items: Message[]) {
        if (items.length === 0) {
            return;
        }
        const currentMessages = this.messages;
        const newMessages = items.filter(item => !currentMessages.find(m => m.id === item.id));
        const merged = [...newMessages, ...currentMessages];
        this._dataStream.next(merged.sort((a, b) => a.sequence - b.sequence));
    }

    addMessage(message: Message) {
        this.addMessages([message]);
    }

    updateMessage(message: Message) {
        const currentMessages = this.messages;
        const index = currentMessages.findIndex(m => m.id === message.id);
        if (index === -1) {
            return;
        }
        currentMessages[index] = message;
        this._dataStream.next(currentMessages);
    }

    removeMessage(message: Message) {
        const currentMessages = this.messages;
        const filtered = currentMessages.filter(m => m.id !== message.id);
        if (filtered.length === currentMessages.length) {
            return;
        }
        this._dataStream.next(filtered);
        if (this.backwardsQuery.query.anchorSquence === message.sequence) {
            this.backwardsQuery.query.anchorSquence = filtered[0].sequence;
        }
        if (this.forwardsQuery.query.anchorSquence === message.sequence) {
            this.forwardsQuery.query.anchorSquence = filtered[filtered.length - 1].sequence;
        }
    }

    loadInitialMessages() {
        this.loadingSubject.next(true);
        this.backwardsQuery.isLoading = true;
        this.subscription.add(this.messageService.getMessages(this.backwardsQuery.query)
            .subscribe({
                next: (res) => {
                    this.backwardsQuery.hasMore = res.hasMore;
                    if (res.items.length > 0) {
                        this.backwardsQuery.query.anchorSquence = res.items[0].sequence;
                        this.forwardsQuery.query.anchorSquence = res.items[res.items.length - 1].sequence;
                    }
                    this.addMessages(res.items);
                },
                complete: () => {
                    this.loadingSubject.next(false);
                    this.backwardsQuery.isLoading = false;
                }
            }));

    }

    loadOlderMessages() {
        if (this.backwardsQuery.isLoading || !this.backwardsQuery.hasMore || !this.backwardsQuery.query.anchorSquence) {
            return of(false);
        }
        this.backwardsQuery.isLoading = true;
        this.backwardsQuery.query.offset = this.messages.length;
        this.loadingSubject.next(true);
        return new Observable<boolean>(observer => {
            this.subscription.add(this.messageService.getMessages(this.backwardsQuery.query)
                .subscribe({
                    next: (res) => {
                        if (res.items.length === 0) {
                            this.backwardsQuery.hasMore = false;
                        } else {
                            this.backwardsQuery.query.anchorSquence = res.items[0].sequence;
                            this.backwardsQuery.hasMore = res.hasMore;
                            this.addMessages(res.items);
                        }
                        observer.next(res.items.length > 0);
                        observer.complete();
                    },
                    complete: () => {
                        this.backwardsQuery.isLoading = false;
                        this.loadingSubject.next(false);
                        observer.next(false);
                        observer.complete();
                    }
                }));
        });
    }

    loadNewerMessages() {
        if (this.forwardsQuery.isLoading || !this.forwardsQuery.hasMore || !this.forwardsQuery.query.anchorSquence) {
            return of(false);
        }
        this.forwardsQuery.isLoading = true;
        this.forwardsQuery.query.offset = this.messages.length;
        this.loadingSubject.next(true);

        return new Observable<boolean>(observer => {
            this.subscription.add(this.messageService.getMessages(this.forwardsQuery.query)
            .subscribe({
                next: (res) => {
                    if (res.items.length > 0) {
                        this.forwardsQuery.query.anchorSquence = res.items[res.items.length - 1].sequence;
                        this.forwardsQuery.hasMore = res.hasMore;
                        this.addMessages(res.items);
                    } else {
                        this.forwardsQuery.hasMore = false;
                    }
                    observer.next(res.items.length > 0);
                    observer.complete();
                },
                complete: () => {
                    this.forwardsQuery.isLoading = false;
                    this.loadingSubject.next(false);
                    observer.next(false);
                    observer.complete();
                }
            }))
        });
    }
}