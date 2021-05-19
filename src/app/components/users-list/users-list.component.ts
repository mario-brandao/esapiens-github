import { Component, EventEmitter, Input, Output } from '@angular/core';
import { APP_CONSTANTS } from 'src/app/app.constants';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent {

  @Output() leave = new EventEmitter<void>();

  @Input() users: User[];

  userRoute: string;

  constructor() {
    this.userRoute = APP_CONSTANTS.USER_ROUTE;
  }

  navigateAway(): void {
    this.leave.emit();
  }

  // TODO: infinite scroll

}
