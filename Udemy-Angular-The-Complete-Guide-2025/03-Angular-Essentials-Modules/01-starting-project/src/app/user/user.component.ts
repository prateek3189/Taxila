import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from './user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  @Input() selected = false;
  @Input() user!: User;
  userImagePath = computed(() => {
    return 'assets/users/' + this.user.avatar;
  });
  @Output() select = new EventEmitter<User>();

  onUserClick() {
    this.select.emit(this.user);
  }
}
