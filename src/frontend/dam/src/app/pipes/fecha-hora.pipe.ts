import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fechaHora',
  standalone: true
})
export class FechaHoraPipe implements PipeTransform {

  transform(value: string | Date, tipo: 'fecha' | 'hora' | null = null): string {
    if (!value) return '';

    // Asegurarse de que la fecha es un objeto Date
    const date = new Date(value);

    if (tipo === 'fecha') {
      // Retornar solo la fecha en formato 'YYYY-MM-DD'
      return date.toLocaleDateString('es-ES');
    } else if (tipo === 'hora') {
      // Retornar solo la hora en formato 'HH:mm:ss'
      return date.toLocaleTimeString('es-ES');
    }

    // Si no se especifica tipo, retornar ambos (fecha y hora) concatenados
    return `${date.toLocaleDateString('es-ES')} ${date.toLocaleTimeString('es-ES')}`;
  }
}
