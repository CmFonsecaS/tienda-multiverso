import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.html',
  standalone: false
})
export class RecuperarComponent implements OnInit {
  recuperarForm!: FormGroup;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  enviarEnlace(): void {
    if (this.recuperarForm.invalid) {
      this.errorMessage = 'Por favor ingresa un correo electrónico válido.';
      return;
    }

    const { email } = this.recuperarForm.value;
    const usuarios = this.authService.getUsuarios();
    const existe = usuarios.some(u => u.email === email);

    if (existe) {
      this.errorMessage = null;
      this.successMessage = `¡Enlace de recuperación enviado! Revisa la bandeja de entrada de ${email} para restablecer tu contraseña.`;
      this.recuperarForm.reset();
    } else {
      this.successMessage = null;
      this.errorMessage = 'El correo electrónico ingresado no está registrado en el Multiverso.';
    }
  }
}
