import { Component } from '@angular/core';
import { NewTicketComponent } from './new-ticket/new-ticket.component';
import { ButtonComponent } from '../../shared/button/button.component';
import { Ticket } from './ticket.model';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [NewTicketComponent, ButtonComponent, TicketComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent {
  tickets: Ticket[] = [];

  onAdd(ticketData: { title: string; request: string }) {
    const newTicket: Ticket = {
      id: Math.random().toString(36).substring(2, 9),
      title: ticketData.title,
      request: ticketData.request,
      status: 'open',
    };
    this.tickets.push(newTicket);
  }

  onCloseTicket(ticketId: string) {
    this.tickets = this.tickets.map((t) => {
      if (t.id === ticketId) {
        return { ...t, status: 'closed' };
      }
      return t;
    });
  }
}
