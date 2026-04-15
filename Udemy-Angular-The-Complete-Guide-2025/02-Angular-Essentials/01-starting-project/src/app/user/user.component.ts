import {
  Component,
  computed,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { User } from './user.model';
import { CardComponent } from '../components/card/card.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent {
  @Input() selected = false;
  @Input() user!: User;
  userImagePath = computed(() => 'assets/users/' + this.user.avatar);
  @Output() select = new EventEmitter<User>();

  onUserClick() {
    this.select.emit(this.user);
  }
}
