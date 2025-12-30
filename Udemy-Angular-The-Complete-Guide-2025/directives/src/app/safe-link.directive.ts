import { Directive, ElementRef, inject, input } from '@angular/core';
import { LogDirective } from './log.directive';

@Directive({
  selector: 'a[appSafeLink], button[appSafeLink]',
  standalone: true,
  host: {
    '(click)': 'onConfirmLeave($event)',
  },
  hostDirectives: [LogDirective],
})
export class SafeLinkDirective {
  queryParam = input('myapp', { alias: 'appSafeLink' });

  private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  onConfirmLeave(event: Event) {
    const goAhead = window.confirm('Are you sure you want to leave this page?');

    if (goAhead) {
      const address = this.hostElementRef.nativeElement.href;
      this.hostElementRef.nativeElement.href =
        address + '?ref=' + this.queryParam();
      return;
    } else {
      event.preventDefault();
    }
  }
}
