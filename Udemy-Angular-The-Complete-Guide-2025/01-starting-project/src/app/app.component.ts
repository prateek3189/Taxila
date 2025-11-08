import { Component } from '@angular/core';
import { DUMMY_USERS } from './user/dummy-users';
import { UserInterface } from './user/user.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  users = DUMMY_USERS;
  selectedUser: UserInterface | undefined;

  onSelectUser(user: UserInterface) {
    this.selectedUser = user;
  }
}
