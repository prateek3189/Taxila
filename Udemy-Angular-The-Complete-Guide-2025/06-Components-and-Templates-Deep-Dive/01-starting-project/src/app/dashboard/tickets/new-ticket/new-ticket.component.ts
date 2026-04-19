import {
  Component,
  ElementRef,
  EventEmitter,
  Output,
  ViewChild,
} from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { ControlComponent } from '../../../components/control/control.component';
import { FormsModule } from '@angular/forms';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-new-ticket',
  standalone: true,
  imports: [ButtonComponent, ControlComponent, FormsModule],
  templateUrl: './new-ticket.component.html',
  styleUrl: './new-ticket.component.css',
})
export class NewTicketComponent {
  @ViewChild('form') form!: ElementRef<HTMLFormElement>;
  @Output() add = new EventEmitter<Ticket>();

  onSubmit(titleInput: HTMLInputElement, requestInput: HTMLTextAreaElement) {
    const title = titleInput.value;
    const request = requestInput.value;
    this.add.emit({
      id: Math.random(),
      title,
      request,
      status: 'open',
    });
    this.form.nativeElement.reset();
  }
}
