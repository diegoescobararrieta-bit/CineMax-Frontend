import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  usuario = '';
  clave = '';
  error = signal('');
  cargando = signal(false);

  constructor(
    private auth: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  async entrar(): Promise<void> {
    this.error.set('');
    this.cargando.set(true);
    const ok = await this.auth.iniciarSesion(this.usuario, this.clave);
    this.cargando.set(false);
    if (!ok) {
      this.error.set('Usuario o contraseña incorrectos.');
      return;
    }
    const destino = this.route.snapshot.queryParamMap.get('volver') ?? '/peliculas';
    this.router.navigateByUrl(destino);
  }
}
