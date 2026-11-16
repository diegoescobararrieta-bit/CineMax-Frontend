import { Pelicula } from './pelicula.model';

// Lo que devuelve el backend (incluye la película)
export interface Funcion {
  id: number;
  pelicula: Pelicula;
  fecha: string;
  hora: string;
  sala: string;
  formato: string;
  idioma: string;
  precio: number;
  precioGeneralPlus: number;
  cuposDisponibles: number;
}

// Lo que se envía al crear o editar (solo el id de la película)
export interface FuncionRequest {
  peliculaId: number | null;
  fecha: string;
  hora: string;
  sala: string;
  formato: string;
  idioma: string;
  precio: number;
  precioGeneralPlus: number;
  cuposDisponibles: number;
}
