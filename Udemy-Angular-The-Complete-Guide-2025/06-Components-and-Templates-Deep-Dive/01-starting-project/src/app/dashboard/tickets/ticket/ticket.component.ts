import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Ticket } from '../ticket.model';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  @Input() ticket!: Ticket;
  @Output() close = new EventEmitter<string>();

  onClose() {
    this.close.emit();
  }
}
