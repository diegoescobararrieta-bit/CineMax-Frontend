import { Injectable, computed, signal } from '@angular/core';

interface Admin {
  usuario: string; // nombre normalizado: minúsculas y sin tildes
  nombre: string;  // nombre para mostrar
  hash: string;    // SHA-256 de "cinemax|usuario|clave"
}

const CLAVE_SESION = 'cinemax_admin';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly admins: Admin[] = [
    {
      usuario: 'diego escobar arrieta',
      nombre: 'Diego Escobar Arrieta',
      hash: 'ceffeb286cfca9e02bf5b4c20c33fde739eddb2a88843bba65cc7bbcd53fda12',
    },
    {
      usuario: 'nestor andres torres mora',
      nombre: 'Néstor Andrés Torres Mora',
      hash: 'fcc281d02c151760f1649314630b2c28592e03ac75e60c5dce6b024c895225e7',
    },
  ];

  private readonly sesion = signal<string | null>(this.leerSesion());
  readonly nombre = this.sesion.asReadonly();
  readonly esAdmin = computed(() => this.sesion() !== null);

  async iniciarSesion(usuario: string, clave: string): Promise<boolean> {
    const u = this.normalizar(usuario);
    const admin = this.admins.find((a) => a.usuario === u);
    if (!admin) {
      return false;
    }
    const hash = await this.sha256(`cinemax|${u}|${clave}`);
    if (hash !== admin.hash) {
      return false;
    }
    this.sesion.set(admin.nombre);
    this.guardarSesion(admin.nombre);
    return true;
  }

  cerrarSesion(): void {
    this.sesion.set(null);
    this.guardarSesion(null);
  }

  private normalizar(texto: string): string {
    return texto
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ');
  }

  private async sha256(texto: string): Promise<string> {
    const datos = new TextEncoder().encode(texto);
    const resumen = await crypto.subtle.digest('SHA-256', datos);
    return Array.from(new Uint8Array(resumen))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  private leerSesion(): string | null {
    try {
      return sessionStorage.getItem(CLAVE_SESION);
    } catch {
      return null;
    }
  }

  private guardarSesion(nombre: string | null): void {
    try {
      if (nombre) {
        sessionStorage.setItem(CLAVE_SESION, nombre);
      } else {
        sessionStorage.removeItem(CLAVE_SESION);
      }
    } catch {
      // sin almacenamiento: la sesión dura mientras no se recargue la página
    }
  }
}
