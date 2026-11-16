import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pelicula } from '../../models/pelicula.model';
import { PeliculaService } from '../../services/pelicula.service';

@Component({
  selector: 'app-peliculas',
  imports: [FormsModule],
  templateUrl: './peliculas.html',
  styleUrl: './peliculas.css',
})
export class Peliculas implements OnInit {
  // Los datos que llegan del backend van en signals para que la vista se actualice
  peliculas = signal<Pelicula[]>([]);
  cargando = signal(false);
  mensaje = signal('');
  error = signal('');

  busquedaTitulo = '';
  busquedaId: number | null = null;

  modoEdicion = false;
  pelicula: Pelicula = this.nuevaPelicula();
  estados = ['EN_CARTELERA', 'PREVENTA', 'PROXIMAMENTE'];

  constructor(private peliculaService: PeliculaService) {}

  ngOnInit(): void {
    this.cargar();
  }

  nuevaPelicula(): Pelicula {
    return {
      titulo: '',
      tituloOriginal: '',
      genero: '',
      duracionMin: 90,
      clasificacion: '',
      sinopsis: '',
      reparto: '',
      imagenUrl: '',
      trailerUrl: '',
      fechaEstreno: null,
      estado: 'EN_CARTELERA',
    };
  }

  // Listar todas (o filtrar por título)
  cargar(): void {
    this.cargando.set(true);
    this.peliculaService.listar(this.busquedaTitulo).subscribe({
      next: (datos) => {
        this.peliculas.set(datos);
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar las películas. ¿Está encendido el backend?');
        this.cargando.set(false);
      },
    });
  }

  // Buscar una película específica por su id
  buscarPorId(): void {
    this.limpiarMensajes();
    if (this.busquedaId === null) {
      this.cargar();
      return;
    }
    this.peliculaService.obtenerPorId(this.busquedaId).subscribe({
      next: (p) => this.peliculas.set([p]),
      error: (e) => {
        this.peliculas.set([]);
        this.error.set(this.textoError(e));
      },
    });
  }

  limpiarBusqueda(): void {
    this.busquedaTitulo = '';
    this.busquedaId = null;
    this.limpiarMensajes();
    this.cargar();
  }

  // Crear o actualizar según el modo
  guardar(): void {
    this.limpiarMensajes();
    const datos: Pelicula = {
      ...this.pelicula,
      fechaEstreno: this.pelicula.fechaEstreno || null,
    };
    const eraEdicion = this.modoEdicion;
    const peticion = eraEdicion
      ? this.peliculaService.actualizar(datos.id!, datos)
      : this.peliculaService.crear(datos);

    peticion.subscribe({
      next: () => {
        this.mensaje.set(eraEdicion ? 'Película actualizada.' : 'Película creada.');
        this.cancelar();
        this.cargar();
      },
      error: (e) => this.error.set(this.textoError(e)),
    });
  }

  editar(p: Pelicula): void {
    this.limpiarMensajes();
    this.pelicula = { ...p };
    this.modoEdicion = true;
  }

  cancelar(): void {
    this.pelicula = this.nuevaPelicula();
    this.modoEdicion = false;
  }

  eliminar(p: Pelicula): void {
    if (!confirm(`¿Eliminar la película "${p.titulo}"?`)) {
      return;
    }
    this.limpiarMensajes();
    this.peliculaService.eliminar(p.id!).subscribe({
      next: () => {
        this.mensaje.set('Película eliminada.');
        this.cargar();
      },
      error: (e) => this.error.set(this.textoError(e)),
    });
  }

  private limpiarMensajes(): void {
    this.mensaje.set('');
    this.error.set('');
  }

  // Muestra el mensaje que devuelve el backend (400, 404 o 409)
  private textoError(e: any): string {
    return e?.error?.mensaje ?? 'Ocurrió un error al comunicarse con el servidor.';
  }
}
