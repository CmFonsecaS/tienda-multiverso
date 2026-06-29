import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  standalone: false
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  showPassword = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Redirigir si ya hay sesión activa
    const u = this.authService.getUsuarioActual();
    if (u) {
      this.redireccionarSegunRol(u.rol);
      return;
    }

    const emailRecordado = this.authService.getEmailRecordado();

    this.loginForm = this.fb.group({
      email: [emailRecordado, [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      recordarme: [!!emailRecordado]
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  iniciarSesion(): void {
    if (this.loginForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const { email, password, recordarme } = this.loginForm.value;
    const usuario = this.authService.iniciarSesion(email, password);

    if (usuario) {
      this.errorMessage = null;
      this.authService.recordarEmail(email, recordarme);
      this.redireccionarSegunRol(usuario.rol);
    } else {
      this.errorMessage = 'Correo o contraseña incorrectos. Verifica tus datos.';
    }
  }

  private redireccionarSegunRol(rol: 'admin' | 'cliente'): void {
    if (rol === 'admin') {
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/catalogo']);
    }
  }
}
