export interface Pelicula {
  id?: number;
  titulo: string;
  tituloOriginal?: string | null;
  genero: string;
  duracionMin: number;
  clasificacion: string;
  sinopsis?: string | null;
  reparto?: string | null;
  imagenUrl?: string | null;
  trailerUrl?: string | null;
  fechaEstreno?: string | null;
  estado: string;
}
