import {
  AfterViewChecked,
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  output,
  viewChild,
} from '@angular/core';
import { ButtonComponent } from '../../../shared/button/button.component';
import { FormControlComponent } from '../../../shared/form-control/form-control.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, FormControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css',
})
export class NewTicketComponent {
  @ViewChild('form') private form?: ElementRef<HTMLFormElement>;
  title = '';
  request = '';

  add = output<{ title: string; request: string }>();

  onSubmit() {
    this.add.emit({ title: this.title, request: this.request });
    this.title = '';
    this.request = '';
  }
}
