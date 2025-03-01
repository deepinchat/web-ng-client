import { Directive, Input } from '@angular/core';
import { CdkVirtualScrollViewport, VIRTUAL_SCROLL_STRATEGY, VirtualScrollStrategy } from '@angular/cdk/scrolling';
import { distinctUntilChanged, Observable, Subject } from 'rxjs';
@Directive({
  selector: 'cdk-virtual-scroll-viewport[autoSize]',
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useFactory: autoSizeVirtualScrollStrategyFactory
  }]
})
export class AutoSizeDirective {
  private scrollStrategy: AutoSizeVirtualScrollStrategy = autoSizeVirtualScrollStrategyFactory();
  @Input()
  set minBufferPx(value: number) {
    if (this.scrollStrategy) {
      this.scrollStrategy.minBufferPx = value;
    }
  }

  @Input()
  set maxBufferPx(value: number) {
    if (this.scrollStrategy) {
      this.scrollStrategy.maxBufferPx = value;
    }
  }

  constructor() { }

  scrollToBottom(behavior: ScrollBehavior = 'auto'): void {
    this.scrollStrategy.scrollToBottom(behavior);
  }

  prepareForHistoricalContent(): void {
    this.scrollStrategy.prepareForHistoricalContent();
  }


}

export class AutoSizeVirtualScrollStrategy implements VirtualScrollStrategy {
  scrolledIndexChange = new Subject<number>();
  private viewport: CdkVirtualScrollViewport | null = null;
  private itemSizeCache: { [key: number]: number } = {};
  private averageItemSize = 80; // Default initial message size estimate
  private pendingMeasurement = false;
  private stickyToBottom = true;
  private lastScrollOffset = 0;
  private scrollDirection: 'up' | 'down' = 'down';

  // For handling pull-to-load
  private previousTopItems: { index: number, offset: number, height: number }[] = [];
  private maintainScrollPosition = false;
  private scrollAnchorIndex = 0;
  private scrollAnchorOffset = 0;

  constructor(public minBufferPx: number = 200, public maxBufferPx: number = 400) { }

  attach(viewport: CdkVirtualScrollViewport): void {
    this.viewport = viewport;
    this.updateTotalContentSize();
    this.updateRenderedRange();

    // Keep track of scroll direction
    this.viewport.elementScrolled().subscribe(() => {
      if (!this.viewport) return;

      const currentOffset = this.viewport.measureScrollOffset();
      this.scrollDirection = currentOffset > this.lastScrollOffset ? 'down' : 'up';
      this.lastScrollOffset = currentOffset;

      // Check if we're at the bottom
      // We're at the bottom if the distance to the bottom is very small
      this.stickyToBottom = this.viewport.measureScrollOffset('bottom') < 10;
    });
  }

  detach(): void {
    this.scrolledIndexChange.complete();
    this.viewport = null;
  }

  onContentScrolled(): void {
    this.updateRenderedRange();
  }

  onDataLengthChanged(): void {
    if (!this.viewport) return;

    const previousRange = this.viewport.getRenderedRange();
    const previousLength = this.previousTopItems.length > 0 ?
      this.previousTopItems[0].index : 0;
    const currentLength = this.viewport.getDataLength();

    // If more items were added at the beginning (historical messages)
    if (currentLength > previousLength && this.previousTopItems.length > 0 && this.maintainScrollPosition) {
      const newItemsCount = currentLength - previousLength;
      this.scrollAnchorIndex = previousRange.start + newItemsCount;

      // Calculate offset to maintain position
      const oldTop = this.previousTopItems[0];
      this.scrollAnchorOffset = oldTop.offset;

      this.updateTotalContentSize();
      this.updateRenderedRange();

      // Reset the flag
      this.maintainScrollPosition = false;
    } else {
      this.updateTotalContentSize();
      this.updateRenderedRange();

      // If we were at the bottom before, scroll to bottom after new messages
      if (this.stickyToBottom && this.scrollDirection === 'down') {
        setTimeout(() => {
          if (this.viewport) {
            this.viewport.scrollTo({ bottom: 0, behavior: 'smooth' });
          }
        }, 0);
      }
    }

    // Save current top items for reference
    this.saveTopItems();
  }

  onContentRendered(): void {
    if (!this.pendingMeasurement) {
      this.pendingMeasurement = true;
      setTimeout(() => {
        this.measureRenderedItems();
        this.updateTotalContentSize();
        this.pendingMeasurement = false;
      }, 0);
    }
  }

  onRenderedOffsetChanged(): void {
    // Not needed for this strategy
  }

  scrollToIndex(index: number, behavior: ScrollBehavior): void {
    if (!this.viewport) return;

    // Calculate offset to the index
    let offset = 0;
    for (let i = 0; i < index; i++) {
      offset += this.getItemSize(i);
    }

    this.viewport.scrollToOffset(offset, behavior);
  }

  scrollToBottom(behavior: ScrollBehavior = 'auto'): void {
    if (!this.viewport) return;
    this.viewport.scrollTo({ bottom: 0, behavior });
    this.stickyToBottom = true;
  }

  // Method to prepare for historical content loading
  prepareForHistoricalContent(): void {
    if (!this.viewport) return;

    this.maintainScrollPosition = true;
    this.saveTopItems();
  }

  get scrolledIndexChange$(): Observable<number> {
    return this.scrolledIndexChange.pipe(distinctUntilChanged());
  }

  private getItemSize(index: number): number {
    return this.itemSizeCache[index] || this.averageItemSize;
  }

  private measureRenderedItems(): void {
    if (!this.viewport) return;

    const range = this.viewport.getRenderedRange();
    // Use elementRef to get the native element since getViewportElement() doesn't exist
    const viewportElement = this.viewport.elementRef.nativeElement;
    const items = viewportElement.querySelectorAll('.chat-message-item');

    let totalMeasuredSize = 0;
    let measuredCount = 0;

    items.forEach((item, i: number) => {
      const index = range.start + i;
      const size = item.getBoundingClientRect().height;

      this.itemSizeCache[index] = size;
      totalMeasuredSize += size;
      measuredCount++;
    });

    // Update average size based on measured items
    if (measuredCount > 0) {
      this.averageItemSize = (this.averageItemSize + (totalMeasuredSize / measuredCount)) / 2;
    }
  }

  // Helper to save current top visible items
  private saveTopItems(): void {
    if (!this.viewport) return;

    const range = this.viewport.getRenderedRange();
    if (range.start === range.end) return;

    this.previousTopItems = [{
      index: range.start,
      offset: this.viewport.measureScrollOffset(),
      height: this.getItemSize(range.start)
    }];
  }

  private updateTotalContentSize(): void {
    if (!this.viewport) return;

    const dataLength = this.viewport.getDataLength();
    let totalSize = 0;

    // Sum up known sizes and use average for unknown
    for (let i = 0; i < dataLength; i++) {
      totalSize += this.getItemSize(i);
    }

    this.viewport.setTotalContentSize(totalSize);
  }

  private updateRenderedRange(): void {
    if (!this.viewport) return;

    let scrollOffset;

    // If we need to maintain scroll position after loading more historical messages
    if (this.maintainScrollPosition && this.scrollAnchorIndex > 0) {
      // Calculate new offset based on added items
      let topOffset = 0;
      for (let i = 0; i < this.scrollAnchorIndex; i++) {
        topOffset += this.getItemSize(i);
      }

      // Force scroll to maintain position
      this.viewport.scrollTo({ top: topOffset + this.scrollAnchorOffset });
      scrollOffset = topOffset + this.scrollAnchorOffset;
    } else {
      scrollOffset = this.viewport.measureScrollOffset();
    }

    const viewportSize = this.viewport.getViewportSize();

    // Find start index (first visible item)
    let startOffset = 0;
    let startIndex = 0;

    while (startOffset < scrollOffset && startIndex < this.viewport.getDataLength()) {
      startOffset += this.getItemSize(startIndex);
      startIndex++;
    }

    if (startIndex > 0) startIndex--;

    // Find end index
    let endIndex = startIndex;
    let visibleSize = 0;

    while (visibleSize < viewportSize + this.maxBufferPx &&
      endIndex < this.viewport.getDataLength()) {
      visibleSize += this.getItemSize(endIndex);
      endIndex++;
    }

    // Add buffer before
    let bufferedStartIndex = startIndex;
    let preBufferSize = 0;

    while (bufferedStartIndex > 0 && preBufferSize < this.minBufferPx) {
      bufferedStartIndex--;
      preBufferSize += this.getItemSize(bufferedStartIndex);
    }

    // Set the range and offset
    this.viewport.setRenderedRange({
      start: bufferedStartIndex,
      end: endIndex
    });

    this.viewport.setRenderedContentOffset(this.calculateOffset(bufferedStartIndex));
    this.scrolledIndexChange.next(startIndex);
  }

  private calculateOffset(startIndex: number): number {
    let offset = 0;
    for (let i = 0; i < startIndex; i++) {
      offset += this.getItemSize(i);
    }
    return offset;
  }
}

export function autoSizeVirtualScrollStrategyFactory() {
  return new AutoSizeVirtualScrollStrategy();
}