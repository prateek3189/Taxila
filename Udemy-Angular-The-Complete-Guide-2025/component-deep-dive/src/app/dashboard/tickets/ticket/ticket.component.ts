import { Component, input, model, output, signal } from '@angular/core';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  data = input.required<Ticket>({ alias: 'ticket' });
  opened = signal(false);
  status = model<'open' | 'closed'>('open');

  onToggleDetails() {
    this.opened.update((value) => !value);
  }

  onCloseTicket() {
    this.status.set('closed');
  }
}
