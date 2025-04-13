import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, Observable, of, Subscription } from "rxjs";
import { Message, MessageQuery } from "../../../../core/models/message.model";
import { MessageService } from "../../../../core/services/message.service";

export class MessageDataSource extends DataSource<Message> {
    private readonly _dataStream = new BehaviorSubject<Message[]>([]);
    private _messageChanged = new BehaviorSubject<boolean>(false);
    public messageChanged$ = this._messageChanged.asObservable();
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
            hasMore: true,
            query: {
                chatId,
                offset: 0,
                limit: 20,
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
    }


    connect(): Observable<Message[]> {
        return this._dataStream.asObservable();
    }


    disconnect() {
        this.subscription.unsubscribe();
        this._dataStream.complete();
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

    get hasMoreNewer(): boolean {
        return this.forwardsQuery.hasMore;
    }

    get latestMessage(): Message | null {
        return this.messages && this.messages.length ? this.messages[this.messages.length - 1] : null;
    }

    private updateDataStream(messages: Message[]) {
        this._dataStream.next(messages.sort((a, b) => a.sequence - b.sequence));
        this._messageChanged.next(true);
    }

    addMessages(items: Message[]) {
        if (items.length === 0) {
            return;
        }
        const currentMessages = this.messages;
        const newMessages = items.filter(item => !currentMessages.find(m => m.id === item.id));
        const merged = [...newMessages, ...currentMessages];
        this.updateDataStream(merged);
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
        this.updateDataStream(currentMessages);
    }

    removeMessage(message: Message) {
        const currentMessages = this.messages;
        const filtered = currentMessages.filter(m => m.id !== message.id);
        if (filtered.length === currentMessages.length) {
            return;
        }
        this.updateDataStream(filtered);
        if (this.backwardsQuery.query.anchorSquence === message.sequence) {
            this.backwardsQuery.query.anchorSquence = filtered[0].sequence;
        }
        if (this.forwardsQuery.query.anchorSquence === message.sequence) {
            this.forwardsQuery.query.anchorSquence = filtered[filtered.length - 1].sequence;
        }
    }

    loadInitialMessages() {
        return new Observable<boolean>(observer => {
            this.loadOlderMessages().subscribe({
                next: (res) => {
                    console.log('loadInitialMessages', res);
                    if (res) {
                        this.forwardsQuery.query.anchorSquence = this.messages[this.messages.length - 1].sequence;
                    }
                    observer.next(res);
                    observer.complete();
                },
                complete: () => {
                    observer.next(false);
                    observer.complete();
                }
            });
        });
    }

    async loadAroundMessages(anchorMessage: Message) {
        this.backwardsQuery.query.anchorSquence = anchorMessage.sequence;
        this.forwardsQuery.query.anchorSquence = anchorMessage.sequence;
        this.backwardsQuery.query.offset = 0;
        this.forwardsQuery.query.offset = 0;
        forkJoin([
            this.loadNewerMessages(),
            this.loadOlderMessages()
        ]).subscribe({
            next: (res) => {
                console.log('loadAroundMessages', res);
            },
            complete: () => {
            }
        });
    }

    loadOlderMessages() {
        if (this.backwardsQuery.isLoading || !this.backwardsQuery.hasMore) {
            return of(false);
        }
        this.backwardsQuery.isLoading = true;
        return new Observable<boolean>(observer => {
            this.subscription.add(this.messageService.getMessages(this.backwardsQuery.query)
                .subscribe({
                    next: (res) => {
                        if (res.items.length) {
                            this.backwardsQuery.query.offset = res.items.length + this.backwardsQuery.query.offset;
                            this.addMessages(res.items);
                        }
                        this.backwardsQuery.hasMore = res.hasMore;
                        observer.next(res.items.length > 0);
                        console.log('loadOlderMessages', res.items.length);
                        observer.complete();
                    },
                    complete: () => {
                        this.backwardsQuery.isLoading = false;
                        observer.next(false);
                        observer.complete();
                    }
                }));
        });
    }

    loadNewerMessages() {
        if (this.forwardsQuery.isLoading || !this.forwardsQuery.hasMore) {
            return of(false);
        }
        this.forwardsQuery.isLoading = true;

        return new Observable<boolean>(observer => {
            this.subscription.add(this.messageService.getMessages(this.forwardsQuery.query)
                .subscribe({
                    next: (res) => {
                        if (res.items.length) {
                            this.forwardsQuery.query.offset = res.items.length + this.forwardsQuery.query.offset;
                            this.addMessages(res.items);
                        }
                        this.forwardsQuery.hasMore = res.hasMore;
                        observer.next(res.items.length > 0);
                        observer.complete();
                    },
                    complete: () => {
                        this.forwardsQuery.isLoading = false;
                        observer.next(false);
                        observer.complete();
                    }
                }))
        });
    }
}