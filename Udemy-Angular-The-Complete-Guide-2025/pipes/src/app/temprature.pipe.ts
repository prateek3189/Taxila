import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'temp',
  standalone: true,
})
export class TempraturePipe implements PipeTransform {
  transform(
    value: string | number | null,
    inputType: 'c' | 'f',
    outputType: 'c' | 'f'
  ) {
    if (!value) {
      return '';
    }

    let val: number;

    if (typeof value === 'string') {
      val = parseFloat(value);
    } else {
      val = value;
    }

    let outputTemp: number;
    if (inputType === 'c' && outputType === 'f') {
      outputTemp = val * (9 / 5) + 32;
    } else if (inputType === 'f' && outputType === 'c') {
      outputTemp = (val - 32) * (5 / 9);
    } else {
      outputTemp = val;
    }

    let symbol: '°C' | '°F';
    if (!outputType) {
      symbol = inputType === 'c' ? '°C' : '°F';
    } else {
      symbol = outputType === 'c' ? '°C' : '°F';
    }

    return `${outputTemp.toFixed(2)} ${symbol}`;
  }
}
