import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatearPrecio',
  standalone: false
})
export class FormatearPrecioPipe implements PipeTransform {
  transform(value: number | undefined | null): string {
    if (value === undefined || value === null) return '$0';
    return '$' + value.toLocaleString('es-CL');
  }
}
