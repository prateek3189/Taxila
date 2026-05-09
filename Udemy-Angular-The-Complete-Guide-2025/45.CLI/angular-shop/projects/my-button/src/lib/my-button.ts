import { Component } from '@angular/core';

@Component({
  selector: 'lib-my-button',
  imports: [],
  template: ` <button><<ng-content></ng-content>></button> `,
  styles: ``,
})
export class MyButton {}
