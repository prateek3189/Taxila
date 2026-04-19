import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-server-status',
  standalone: true,
  imports: [],
  templateUrl: './server-status.component.html',
  styleUrl: './server-status.component.css',
})
export class ServerStatusComponent implements OnInit, OnDestroy {
  currentStatus = 'online';
  private interval?: ReturnType<typeof setInterval>;

  constructor() {}

  ngOnInit() {
    this.interval = setInterval(() => {
      const random = Math.random();
      if (random < 0.33) {
        this.currentStatus = 'online';
      } else if (random < 0.66) {
        this.currentStatus = 'offline';
      } else {
        this.currentStatus = 'unknown';
      }
    }, 5000);
  }

  ngOnDestroy(): void {
    clearInterval(this.interval);
  }
}
