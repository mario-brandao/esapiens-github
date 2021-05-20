import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, Output, ViewChild } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';
import { debounceTime, tap } from 'rxjs/operators';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements AfterViewInit, OnDestroy {

  @Output() leave = new EventEmitter<void>();
  @Output() loadMore = new EventEmitter<void>();

  @Input() users: User[];
  @Input() loading: boolean;

  @ViewChild('listEl') listEl: any;

  userRoute: string;
  scrollOffset: number;

  private subscriptions: Subscription;

  constructor() {
    this.userRoute = APP_CONSTANTS.USER_ROUTE;
    this.scrollOffset = 80;
    this.subscriptions = new Subscription();
  }

  ngAfterViewInit(): void {
    this.debounceScrollEv();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  navigateAway(): void {
    this.leave.emit();
  }

  onScroll(event: any): void {
    const {target: el} = event;
    const reachedTheBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - this.scrollOffset;

    if (!this.loading && reachedTheBottom) {
      this.loading = true;
      this.loadMore.emit();
    }
  }

  debounceScrollEv(): void {
    this.subscriptions = fromEvent(this.listEl.nativeElement, 'scroll').pipe(
      debounceTime(150),
      tap(event => this.onScroll(event))
    ).subscribe();
  }

}
