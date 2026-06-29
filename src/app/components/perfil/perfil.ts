import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { Usuario } from '../../interfaces/usuario';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.html',
  standalone: false
})
export class PerfilComponent implements OnInit {
  perfilForm!: FormGroup;
  usuarioActual!: Usuario;
  showPassword = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  passRules = {
    longMin: false,
    longMax: false,
    tieneNumero: false,
    tieneMayuscula: false,
    tieneEspecial: false
  };

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUsuarioActual();
    if (user) {
      this.usuarioActual = user;
      
      this.perfilForm = this.fb.group({
        nombre: [user.nombre, [Validators.required, Validators.minLength(3)]],
        email: [{ value: user.email, disabled: true }], // Email read-only
        password: [user.password || '', [Validators.required]],
        telefono: [user.telefono || '', [Validators.pattern(/^\+?[0-9]{8,15}$/)]],
        direccion: [user.direccion || '', [Validators.minLength(5)]]
      });

      // Validar password inicial y cambios
      this.passRules = this.authService.validarPassword(user.password || '');
      this.perfilForm.get('password')?.valueChanges.subscribe(val => {
        this.passRules = this.authService.validarPassword(val || '');
      });
    }
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  isPasswordValid(): boolean {
    const pass = this.perfilForm.get('password')?.value || '';
    return this.authService.passwordValida(pass);
  }

  guardarCambios(): void {
    if (this.perfilForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const pass = this.perfilForm.get('password')?.value || '';
    if (!this.authService.passwordValida(pass)) {
      this.errorMessage = 'La contraseña no cumple con los requisitos mínimos de seguridad.';
      return;
    }

    this.errorMessage = null;
    const datosActualizados: Usuario = {
      ...this.usuarioActual,
      nombre: this.perfilForm.get('nombre')?.value,
      password: pass,
      telefono: this.perfilForm.get('telefono')?.value,
      direccion: this.perfilForm.get('direccion')?.value
    };

    this.authService.actualizarPerfil(datosActualizados);
    this.usuarioActual = datosActualizados;
    this.toastService.mostrarToast('Perfil actualizado con éxito 🦸', 'success');
  }
}
