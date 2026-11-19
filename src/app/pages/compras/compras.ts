import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Compra, CompraRequest } from '../../models/compra.model';
import { Funcion } from '../../models/funcion.model';
import { CompraService } from '../../services/compra.service';
import { FuncionService } from '../../services/funcion.service';
import { ReciboService } from '../../services/recibo.service';

@Component({
  selector: 'app-compras',
  imports: [FormsModule],
  templateUrl: './compras.html',
  styleUrl: './compras.css',
})
export class Compras implements OnInit {
  // Mismo cargo que aplica el backend (solo para mostrar el total antes de comprar)
  readonly CARGO_SERVICIO = 1500;

  funciones = signal<Funcion[]>([]);
  cargando = signal(false);
  mensaje = signal('');
  error = signal('');
  ultimaCompra = signal<Compra | null>(null);

  compra: CompraRequest = this.nuevaCompra();

  constructor(
    private funcionService: FuncionService,
    private compraService: CompraService,
    private route: ActivatedRoute,
    private reciboService: ReciboService,
  ) {}
  descargarRecibo(c: Compra): void {
    this.reciboService.descargar(c);
  }

  ngOnInit(): void {
    const id = Number(this.route.snapshot.queryParamMap.get('funcionId'));
    if (id) {
      this.compra.funcionId = id;
    }
    this.cargarFunciones();
  }

  nuevaCompra(): CompraRequest {
    return { funcionId: null, nombreCliente: '', cantidadBoletos: 1, ubicacion: 'GENERAL' };
  }

  cargarFunciones(): void {
    this.cargando.set(true);
    this.funcionService.listar().subscribe({
      next: (datos) => {
        this.funciones.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar las funciones. ¿Está encendido el backend?');
        this.cargando.set(false);
      },
    });
  }

  funcionSeleccionada(): Funcion | undefined {
    return this.funciones().find((f) => f.id === this.compra.funcionId);
  }

  precioUnitario(): number {
    const f = this.funcionSeleccionada();
    if (!f) {
      return 0;
    }
    return this.compra.ubicacion === 'GENERAL_PLUS' ? f.precioGeneralPlus : f.precio;
  }

  total(): number {
    const f = this.funcionSeleccionada();
    if (!f || !this.compra.cantidadBoletos) {
      return 0;
    }
    return this.precioUnitario() * this.compra.cantidadBoletos + this.CARGO_SERVICIO;
  }

  comprar(): void {
    this.mensaje.set('');
    this.error.set('');
    this.ultimaCompra.set(null);

    this.compraService.crear(this.compra).subscribe({
      next: (c) => {
        this.ultimaCompra.set(c);
        this.mensaje.set('Compra registrada correctamente.');
        this.compra = this.nuevaCompra();
        this.cargarFunciones(); // refresca los cupos
      },
      error: (e) => {
        // 409: cupos insuficientes. 400 y 404 también traen su mensaje
        this.error.set(e?.error?.mensaje ?? 'Ocurrió un error al registrar la compra.');
        this.cargarFunciones();
      },
    });
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
