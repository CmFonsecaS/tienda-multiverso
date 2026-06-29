import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.html',
  standalone: false
})
export class RegistroComponent implements OnInit {
  registroForm!: FormGroup;
  showPassword = false;
  showConfirmPassword = false;
  errorMessage: string | null = null;
  
  // Guardará el estado de las reglas de contraseña en tiempo real
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
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
      telefono: ['', [Validators.pattern(/^\+?[0-9]{8,15}$/)]],
      direccion: ['', [Validators.minLength(5)]],
      rol: ['cliente', [Validators.required]]
    }, { validators: this.passwordsMatchValidator });

    // Escuchar cambios en la contraseña para actualizar las validaciones en tiempo real
    this.registroForm.get('password')?.valueChanges.subscribe(val => {
      this.passRules = this.authService.validarPassword(val || '');
    });
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  toggleConfirmPasswordVisibility(): void {
    this.showConfirmPassword = !this.showConfirmPassword;
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordsNotMatching: true };
  }

  isPasswordValid(): boolean {
    const pass = this.registroForm.get('password')?.value || '';
    return this.authService.passwordValida(pass);
  }

  registrar(): void {
    if (this.registroForm.invalid) {
      this.errorMessage = 'Por favor completa todos los campos correctamente.';
      return;
    }

    const { password } = this.registroForm.value;
    if (!this.authService.passwordValida(password)) {
      this.errorMessage = 'La contraseña no cumple con los requisitos mínimos de seguridad.';
      return;
    }

    const usuarios = this.authService.getUsuarios();
    const { email, nombre, telefono, direccion, rol } = this.registroForm.value;

    if (usuarios.some(u => u.email === email)) {
      this.errorMessage = 'El correo electrónico ya está registrado.';
      return;
    }

    this.errorMessage = null;
    this.authService.registrarUsuario({
      nombre,
      email,
      password,
      rol,
      telefono,
      direccion
    });

    this.toastService.mostrarToast('Registro exitoso! Ya puedes iniciar sesión 🦸', 'success');
    this.router.navigate(['/login']);
  }
}
