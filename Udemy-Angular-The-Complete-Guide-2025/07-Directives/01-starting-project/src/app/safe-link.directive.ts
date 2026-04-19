import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: 'a[appSafeLink]',
  standalone: true,
  host: {
    '(click)': 'onClick($event)',
  },
})
export class SafeLinkDirective {
  queryParam = input<string>('myapp', { alias: 'appSafeLink' });
  private hostElementRef = inject<ElementRef<HTMLAnchorElement>>(ElementRef);

  onClick(event: Event) {
    const goAhead = confirm('This link may be unsafe. Do you want to proceed?');
    if (!goAhead) {
      event.preventDefault();
    } else {
      const address = this.hostElementRef.nativeElement.href;
      this.hostElementRef.nativeElement.href =
        address + '?ref=' + this.queryParam();
      return;
    }
  }
}
