import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Funcion, FuncionRequest } from '../../models/funcion.model';
import { Pelicula } from '../../models/pelicula.model';
import { FuncionService } from '../../services/funcion.service';
import { PeliculaService } from '../../services/pelicula.service';

@Component({
  selector: 'app-funciones',
  imports: [FormsModule],
  templateUrl: './funciones.html',
  styleUrl: './funciones.css',
})
export class Funciones implements OnInit {
  funciones = signal<Funcion[]>([]);
  peliculas = signal<Pelicula[]>([]); // para el select
  cargando = signal(false);
  mensaje = signal('');
  error = signal('');

  filtroFecha = '';
  modoEdicion = false;
  funcionId: number | null = null;
  funcion: FuncionRequest = this.nuevaFuncion();

  formatos = ['2D', '3D', 'IMAX'];
  idiomas = ['DOBLADA', 'SUBTITULADA'];

  constructor(
    private funcionService: FuncionService,
    private peliculaService: PeliculaService,
  ) {}

  ngOnInit(): void {
    this.cargarPeliculas();
    this.cargar();
  }

  nuevaFuncion(): FuncionRequest {
    return {
      peliculaId: null,
      fecha: '',
      hora: '',
      sala: '',
      formato: '2D',
      idioma: 'DOBLADA',
      precio: 11000,
      precioGeneralPlus: 13000,
      cuposDisponibles: 60,
    };
  }

  // Películas para llenar la lista desplegable
  cargarPeliculas(): void {
    this.peliculaService.listar().subscribe({
      next: (datos) => this.peliculas.set(datos),
      error: () => this.error.set('No fue posible cargar las películas para el selector.'),
    });
  }

  cargar(): void {
    this.cargando.set(true);
    this.funcionService.listar(this.filtroFecha || undefined).subscribe({
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

  limpiarFiltro(): void {
    this.filtroFecha = '';
    this.cargar();
  }

  guardar(): void {
    this.limpiarMensajes();
    const eraEdicion = this.modoEdicion;
    const peticion = eraEdicion
      ? this.funcionService.actualizar(this.funcionId!, this.funcion)
      : this.funcionService.crear(this.funcion);

    peticion.subscribe({
      next: () => {
        this.mensaje.set(eraEdicion ? 'Función actualizada.' : 'Función creada.');
        this.cancelar();
        this.cargar();
      },
      error: (e) => this.error.set(this.textoError(e)),
    });
  }

  editar(f: Funcion): void {
    this.limpiarMensajes();
    this.funcionId = f.id;
    this.funcion = {
      peliculaId: f.pelicula.id ?? null,
      fecha: f.fecha,
      hora: f.hora.substring(0, 5), // "18:40:00" -> "18:40"
      sala: f.sala,
      formato: f.formato,
      idioma: f.idioma,
      precio: f.precio,
      precioGeneralPlus: f.precioGeneralPlus,
      cuposDisponibles: f.cuposDisponibles,
    };
    this.modoEdicion = true;
  }

  cancelar(): void {
    this.funcion = this.nuevaFuncion();
    this.funcionId = null;
    this.modoEdicion = false;
  }

  eliminar(f: Funcion): void {
    if (!confirm(`¿Eliminar la función de "${f.pelicula.titulo}" del ${f.fecha}?`)) {
      return;
    }
    this.limpiarMensajes();
    this.funcionService.eliminar(f.id).subscribe({
      next: () => {
        this.mensaje.set('Función eliminada.');
        this.cargar();
      },
      error: (e) => this.error.set(this.textoError(e)),
    });
  }

  dinero(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }

  private limpiarMensajes(): void {
    this.mensaje.set('');
    this.error.set('');
  }

  private textoError(e: any): string {
    return e?.error?.mensaje ?? 'Ocurrió un error al comunicarse con el servidor.';
  }
}
