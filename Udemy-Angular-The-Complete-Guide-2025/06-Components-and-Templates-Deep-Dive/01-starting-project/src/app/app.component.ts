import { Component } from '@angular/core';
import { TicketsComponent } from './dashboard/tickets/tickets.component';
import { TrafficComponent } from './dashboard/traffic/traffic.component';
import { ServerStatusComponent } from './dashboard/server-status/server-status.component';
import { HeaderComponent } from './header/header.component';
import { CardComponent } from './components/card/card.component';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [
    ServerStatusComponent,
    TrafficComponent,
    TicketsComponent,
    HeaderComponent,
    CardComponent,
  ],
})
export class AppComponent {}
