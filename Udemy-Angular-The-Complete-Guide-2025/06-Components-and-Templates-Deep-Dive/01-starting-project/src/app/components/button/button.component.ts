import { Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'button[appButton], a[appButton]',
  standalone: true,
  imports: [],
  templateUrl: './button.component.html',
  styleUrl: './button.component.css',
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  @Input({ required: true }) label!: string;
  @Input({ required: true }) icon!: string;
}
