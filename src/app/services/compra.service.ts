import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Compra, CompraRequest } from '../models/compra.model';

@Injectable({ providedIn: 'root' })
export class CompraService {
  private apiUrl = 'http://localhost:8080/api/compras';

  constructor(private http: HttpClient) {}

  // Sin fechas: todo el historial. Solo "desde": ese día. Con "hasta": un rango.
  listar(desde?: string, hasta?: string): Observable<Compra[]> {
    let params = new HttpParams();
    if (desde) {
      params = params.set('desde', desde);
    }
    if (desde && hasta) {
      params = params.set('hasta', hasta);
    }
    return this.http.get<Compra[]>(this.apiUrl, { params });
  }

  crear(datos: CompraRequest): Observable<Compra> {
    return this.http.post<Compra>(this.apiUrl, datos);
  }
}
