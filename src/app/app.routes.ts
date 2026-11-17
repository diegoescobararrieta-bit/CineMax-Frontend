import { Routes } from '@angular/router';
import { Peliculas } from './pages/peliculas/peliculas';
import { Funciones } from './pages/funciones/funciones';
import { Compras } from './pages/compras/compras';
import { Historial } from './pages/historial/historial';
import { Cartelera } from './pages/cartelera/cartelera';
export const routes: Routes = [
  { path: '', redirectTo: 'peliculas', pathMatch: 'full' },
  { path: 'peliculas', component: Peliculas },
  { path: 'funciones', component: Funciones },
  { path: 'compras', component: Compras },
  { path: 'historial', component: Historial },
  { path: 'cartelera', component: Cartelera },
];
