import {
  Component,
  DoCheck,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { HeaderComponent } from './header/header.component';
import { ServerStatusComponent } from './dashboard/server-status/server-status.component';
import { TrafficComponent } from './dashboard/traffic/traffic.component';
import { TicketsComponent } from './dashboard/tickets/tickets.component';
import { DashboardItemComponent } from './dashboard/dashboard-item/dashboard-item.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    HeaderComponent,
    ServerStatusComponent,
    TrafficComponent,
    TicketsComponent,
    DashboardItemComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  //implements OnInit, OnChanges, OnDestroy, DoCheck
  @Input() text: string = 'Component Deep Dive';

  // constructor() {
  //   // Any type of initialization logic can go here
  //   // No complex intialization work should be done here
  //   console.log('AppComponent constructor');
  // }

  // ngOnInit() {
  //   // Initial HTTP requests or data fetching can be done here
  //   console.log('AppComponent initialized');
  // }

  // ngOnChanges(changes: SimpleChanges) {
  //   // This will trigger only if input properties changes so if text changes we can see the recent value and the previous value
  //   console.log('AppComponent changes detected', changes);
  // }

  // ngDoCheck() {
  //   // Custom change detection logic can be implemented here, Any changes accross the application will trigger this method
  //   // Not recommended
  //   console.log('AppComponent change detection run');
  // }

  // ngAfterViewInit() {
  //   // Logic that depends on the component's view being fully initialized can go here
  //   console.log('AppComponent view initialized');
  // }

  // ngAfterViewChecked() {
  //   // Logic that needs to run after every check of the component's view can go here
  //   console.log('AppComponent view checked');
  // }

  // ngAfterContecttInit() {
  //   // Logic that depends on the component's content being fully initialized can go here
  //   console.log('AppComponent content initialized');
  // }

  // ngAfterContentChecked() {
  //   // Logic that needs to run after every check of the component's content can go here
  //   console.log('AppComponent content checked');
  // }

  // ngOnDestroy() {
  //   // When the component get destroyed from the DOM
  //   console.log('AppComponent destroyed');
  // }
}
