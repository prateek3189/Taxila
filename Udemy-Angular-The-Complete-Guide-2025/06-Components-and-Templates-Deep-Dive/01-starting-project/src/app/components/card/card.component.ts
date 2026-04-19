import { Component, input, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css',
  // host: {
  //   class: 'dashboard-item',
  // },
})
export class CardComponent {
  @Input({ required: true }) image!: {
    src: string;
    alt: string;
  };
  title = input.required<string>();
}
