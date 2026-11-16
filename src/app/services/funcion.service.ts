import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcion, FuncionRequest } from '../models/funcion.model';

@Injectable({ providedIn: 'root' })
export class FuncionService {
  private apiUrl = 'http://localhost:8080/api/funciones';

  constructor(private http: HttpClient) {}

  listar(fecha?: string): Observable<Funcion[]> {
    let params = new HttpParams();
    if (fecha) {
      params = params.set('fecha', fecha);
    }
    return this.http.get<Funcion[]>(this.apiUrl, { params });
  }

  obtenerPorId(id: number): Observable<Funcion> {
    return this.http.get<Funcion>(`${this.apiUrl}/${id}`);
  }

  crear(datos: FuncionRequest): Observable<Funcion> {
    return this.http.post<Funcion>(this.apiUrl, datos);
  }

  actualizar(id: number, datos: FuncionRequest): Observable<Funcion> {
    return this.http.put<Funcion>(`${this.apiUrl}/${id}`, datos);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
