import {
  AfterContentInit,
  Component,
  ContentChild,
  ElementRef,
  ViewEncapsulation,
  afterNextRender,
  afterRender,
  contentChild,
  inject,
  input,
} from '@angular/core';

@Component({
  selector: 'app-form-control',
  standalone: true,
  imports: [],
  templateUrl: './form-control.component.html',
  styleUrl: './form-control.component.css',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'control',
    '(click)': 'onClick()',
  },
})
export class FormControlComponent implements AfterContentInit {
  label = input.required<string>();

  private el = inject(ElementRef);

  // @ContentChild('input') private control?: ElementRef<
  //   HTMLInputElement | HTMLTextAreaElement
  // >;
  private control =
    contentChild.required<ElementRef<HTMLInputElement | HTMLTextAreaElement>>(
      'input'
    );

  constructor() {
    afterRender(() => {
      console.log(' After Render');
      // console.log(this.control?.nativeElement);
      console.log(this.control().nativeElement);
    });
    afterNextRender(() => {
      console.log(' After Next Render');
      // console.log(this.control?.nativeElement);
      console.log(this.control().nativeElement);
    });
  }

  onClick() {
    console.log('Form control clicked');
    console.log(this.el);
    // console.log(this.control?.nativeElement);
    console.log(this.control().nativeElement);
  }

  ngAfterContentInit(): void {
    console.log('FormControlComponent Content Initialized');
    // console.log(this.control?.nativeElement);
    console.log(this.control().nativeElement);
  }
}
