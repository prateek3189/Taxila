import {
  Component,
  ContentChild,
  ElementRef,
  HostListener,
  inject,
  Input,
  ViewEncapsulation,
} from '@angular/core';

@Component({
  selector: 'app-control',
  standalone: true,
  imports: [],
  templateUrl: './control.component.html',
  styleUrl: './control.component.css',
  encapsulation: ViewEncapsulation.ShadowDom,
  host: {
    class: 'control',
    // '(click)': 'onClick()',
  },
})
export class ControlComponent {
  // @HostBinding('class') className = 'control';
  // @HostListener('click')
  @ContentChild('input') private control!: ElementRef<
    HTMLInputElement | HTMLTextAreaElement
  >;

  @Input({ required: true })
  label!: string;

  private ele = inject(ElementRef); // Host Element

  @HostListener('click') onClick() {
    console.log('Clicked');
    console.log(this.ele);
    console.log(this.control);
  }
}
