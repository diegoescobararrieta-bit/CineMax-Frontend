import { Funcion } from './funcion.model';

export interface Compra {
  id: number;
  funcion: Funcion;
  nombreCliente: string;
  cantidadBoletos: number;
  ubicacion: string;
  precioUnitario: number;
  cargoServicio: number;
  valorTotal: number;
  fechaCompra: string;
}

export interface CompraRequest {
  funcionId: number | null;
  nombreCliente: string;
  cantidadBoletos: number;
  ubicacion: string;
}
