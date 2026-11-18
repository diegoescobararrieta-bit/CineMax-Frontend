import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Compra } from '../../models/compra.model';
import { CompraService } from '../../services/compra.service';

@Component({
  selector: 'app-historial',
  imports: [FormsModule],
  templateUrl: './historial.html',
  styleUrl: './historial.css',
})
export class Historial implements OnInit {
  compras = signal<Compra[]>([]);
  cargando = signal(false);
  error = signal('');

  desde = '';
  hasta = '';

  constructor(private compraService: CompraService) {}

  ngOnInit(): void {
    this.buscar();
  }

  buscar(): void {
    this.error.set('');
    if (this.hasta && !this.desde) {
      this.error.set('Para filtrar por rango, indica también la fecha "Desde".');
      return;
    }
    if (this.desde && this.hasta && this.hasta < this.desde) {
      this.error.set('La fecha "Hasta" no puede ser anterior a "Desde".');
      return;
    }
    this.cargando.set(true);
    this.compraService.listar(this.desde || undefined, this.hasta || undefined).subscribe({
      next: (datos) => {
        this.compras.set(datos);
        this.cargando.set(false);
      },
      error: (e) => {
        this.error.set(e?.error?.mensaje ?? 'No fue posible cargar el historial.');
        this.cargando.set(false);
      },
    });
  }

  limpiar(): void {
    this.desde = '';
    this.hasta = '';
    this.buscar();
  }

  totalVendido(): number {
    return this.compras().reduce((suma, c) => suma + c.valorTotal, 0);
  }

  totalBoletas(): number {
    return this.compras().reduce((suma, c) => suma + c.cantidadBoletos, 0);
  }

  etiquetaUbicacion(u: string): string {
    return u === 'GENERAL_PLUS' ? 'CineMax+ (VIP)' : 'Estándar';
  }

  dinero(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }
}
