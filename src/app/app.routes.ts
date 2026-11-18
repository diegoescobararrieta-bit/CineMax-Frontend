import { Routes } from '@angular/router';
import { Peliculas } from './pages/peliculas/peliculas';
import { Funciones } from './pages/funciones/funciones';
import { Compras } from './pages/compras/compras';
import { Historial } from './pages/historial/historial';
import { Cartelera } from './pages/cartelera/cartelera';
import { Detalle } from './pages/detalle/detalle';
import { Confiteria } from './pages/confiteria/confiteria';
import { Login } from './pages/login/login';
import { adminGuard } from './services/admin.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'cartelera', pathMatch: 'full' },
  { path: 'peliculas', component: Peliculas },
  { path: 'funciones', component: Funciones },
  { path: 'compras', component: Compras },
  { path: 'historial', component: Historial },
  { path: 'cartelera', component: Cartelera },
  { path: 'cartelera/:id', component: Detalle },
  { path: 'confiteria', component: Confiteria },
];
