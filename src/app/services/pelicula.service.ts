import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pelicula } from '../models/pelicula.model';

@Injectable({ providedIn: 'root' })
export class PeliculaService {
  private apiUrl = 'http://localhost:8080/api/peliculas';

  constructor(private http: HttpClient) {}

  listar(titulo?: string): Observable<Pelicula[]> {
    let params = new HttpParams();
    if (titulo && titulo.trim()) {
      params = params.set('titulo', titulo.trim());
    }
    return this.http.get<Pelicula[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<Pelicula> {
    return this.http.get<Pelicula>(`${this.apiUrl}/${id}`);
  }

  crear(datos: Pelicula): Observable<Pelicula> {
    return this.http.post<Pelicula>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: Pelicula): Observable<Pelicula> {
    return this.http.put<Pelicula>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
