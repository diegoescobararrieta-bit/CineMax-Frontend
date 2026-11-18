import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Funcion } from '../../models/funcion.model';
import { Pelicula } from '../../models/pelicula.model';
import { FuncionService } from '../../services/funcion.service';
import { PeliculaService } from '../../services/pelicula.service';

@Component({
  selector: 'app-detalle',
  imports: [RouterLink],
  templateUrl: './detalle.html',
  styleUrl: './detalle.css',
})
export class Detalle implements OnInit {
  pelicula = signal<Pelicula | null>(null);
  funciones = signal<Funcion[]>([]);
  trailer = signal<SafeResourceUrl | null>(null);
  cargando = signal(true);
  error = signal('');

  constructor(
    private route: ActivatedRoute,
    private peliculaService: PeliculaService,
    private funcionService: FuncionService,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.peliculaService.listar().subscribe({
      next: (datos) => {
        const p = datos.find((x) => x.id === id);
        if (!p) {
          this.error.set('No se encontró la película.');
        } else {
          this.pelicula.set(p);
          if (p.trailerUrl) {
            this.trailer.set(this.sanitizer.bypassSecurityTrustResourceUrl(p.trailerUrl));
          }
        }
        this.cargando.set(false);
      },
      error: () => {
        this.error.set('No fue posible cargar la película. ¿Está encendido el backend?');
        this.cargando.set(false);
      },
    });

    this.funcionService.listar().subscribe({
      next: (fs) => this.funciones.set(fs.filter((f) => f.pelicula.id === id)),
    });
  }

  dinero(valor: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0,
    }).format(valor);
  }
}
