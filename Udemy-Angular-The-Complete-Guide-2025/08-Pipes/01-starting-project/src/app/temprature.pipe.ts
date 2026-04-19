import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temprature',
  standalone: true,
})
export class TempraturePipe implements PipeTransform {
  transform(value: string | number | null, inputUnit: 'cel' | 'fah'): unknown {
    let val: number;
    if (typeof value === 'string') {
      val = parseFloat(value);
    } else if (typeof value === 'number') {
      val = value;
    } else {
      val = 0;
    }

    let outputTemperature: number;
    if (inputUnit === 'cel') {
      outputTemperature = val * (9 / 5) + 32;
    } else {
      outputTemperature = (val - 32) * (5 / 9);
    }

    return (
      outputTemperature.toFixed(2) + ' °' + inputUnit.charAt(0).toUpperCase()
    );
  }
}
