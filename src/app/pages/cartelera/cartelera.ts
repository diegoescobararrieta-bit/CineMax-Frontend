import { Component, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Pelicula } from '../../models/pelicula.model';
import { PeliculaService } from '../../services/pelicula.service';

@Component({
  selector: 'app-cartelera',
  imports: [RouterLink],
  templateUrl: './cartelera.html',
  styleUrl: './cartelera.css',
})
export class Cartelera implements OnInit {
  peliculas = signal<Pelicula[]>([]);
  error = signal('');
  trailerAbierto = signal<SafeResourceUrl | null>(null);
  tituloTrailer = signal('');

  constructor(
    private peliculaService: PeliculaService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.peliculaService.listar().subscribe({
      next: (datos) => this.peliculas.set(datos),
      error: () => this.error.set('No fue posible cargar la cartelera. ¿Está encendido el backend?'),
    });
  }

  verTrailer(p: Pelicula): void {
    if (!p.trailerUrl) {
      return;
    }
    this.tituloTrailer.set(p.titulo);
    this.trailerAbierto.set(this.sanitizer.bypassSecurityTrustResourceUrl(p.trailerUrl));
  }

  cerrarTrailer(): void {
    this.trailerAbierto.set(null);
  }
}
