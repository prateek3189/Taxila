import { Component, effect, OnDestroy, OnInit, signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { interval, map, Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy {
  clickCount = signal(0);
  clickCount$ = toObservable(this.clickCount);
  subscription: any;
  interval$ = interval(1000);
  intervalSignal = toSignal(this.interval$, {
    initialValue: 0,
    manualCleanup: true,
  });

  customInterval$ = new Observable((subscriber) => {
    let executedTimes = 0;
    const interval = setInterval(() => {
      subscriber.next({
        message: 'Hello from custom interval!',
      });
      executedTimes++;
      if (executedTimes > 5) {
        subscriber.complete();
        clearInterval(interval);
        return;
      }
    }, 1000);
  });

  constructor() {
    // effect(() => {
    //   console.log('Effect ran: ' + this.clickCount());
    // });
  }

  ngOnInit(): void {
    this.clickCount$.subscribe({
      next: (value) => {
        console.log('Observable subscription: ' + value);
      },
    });
    // this.subscription = interval(1000)
    //   .pipe(map((value) => value * 2))
    //   .subscribe({
    //     next: (value) => console.log(value),
    //     complete: () => console.log('Completed'),
    //     error: (error) => console.error(error),
    //   });
    this.customInterval$.subscribe({
      next: (value) => console.log(value),
      complete: () => console.log('Custom interval completed'),
    });
  }

  onClick() {
    this.clickCount.update((current) => current + 1);
  }

  ngOnDestroy(): void {
    // this.subscription.unsubscribe();
    this.clickCount$.subscribe().unsubscribe();
  }
}
