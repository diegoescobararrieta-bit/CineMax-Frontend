import { Routes } from '@angular/router';
import { Peliculas } from './pages/peliculas/peliculas';
import { Funciones } from './pages/funciones/funciones';

export const routes: Routes = [
  { path: '', redirectTo: 'peliculas', pathMatch: 'full' },
  { path: 'peliculas', component: Peliculas },
  { path: 'funciones', component: Funciones },
];
