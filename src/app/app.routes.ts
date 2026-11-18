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
  { path: 'login', component: Login },
  { path: 'cartelera', component: Cartelera },
  { path: 'cartelera/:id', component: Detalle },
  { path: 'compras', component: Compras },
  { path: 'confiteria', component: Confiteria },

  // Solo administrador
  { path: 'peliculas', component: Peliculas, canActivate: [adminGuard] },
  { path: 'funciones', component: Funciones, canActivate: [adminGuard] },
  { path: 'historial', component: Historial, canActivate: [adminGuard] },
];
