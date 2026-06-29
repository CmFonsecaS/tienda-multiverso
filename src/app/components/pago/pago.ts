import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Usuario } from '../../interfaces/usuario';
import { Pedido } from '../../interfaces/pedido';

@Component({
  selector: 'app-pago',
  templateUrl: './pago.html',
  standalone: false
})
export class PagoComponent implements OnInit {
  pagoForm!: FormGroup;
  usuarioActual!: Usuario;
  
  subtotal = 0;
  costoEnvio = 3990;
  total = 0;
  carritoDetalle: any[] = [];

  // Estado del pago
  pagoCompletado = false;
  pedidoGenerado: Pedido | null = null;
  cargando = false;

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUsuarioActual();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.usuarioActual = user;
    const items = this.cartService.getCarritoItems();
    if (items.length === 0) {
      this.router.navigate(['/catalogo']);
      return;
    }

    this.subtotal = this.cartService.getPrecioTotal();
    this.costoEnvio = this.subtotal >= 30000 ? 0 : 3990;
    this.total = this.subtotal + this.costoEnvio;
    this.carritoDetalle = this.cartService.getCarritoDetallado();

    this.pagoForm = this.fb.group({
      nombreTarjeta: [user.nombre, [Validators.required, Validators.minLength(3)]],
      numeroTarjeta: ['', [Validators.required, Validators.pattern(/^[0-9]{16}$/)]],
      expiracion: ['', [Validators.required, Validators.pattern(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/)]],
      cvv: ['', [Validators.required, Validators.pattern(/^[0-9]{3}$/)]],
      direccion: [user.direccion || '', [Validators.required, Validators.minLength(5)]]
    });
  }

  /**
   * Formatea la fecha de expiracion para autocompletar la barra oblicua (/)
   */
  formatExpiracion(event: Event): void {
    const input = event.target as HTMLInputElement;
    let val = input.value.replace(/\D/g, ''); // Remover no dígitos
    if (val.length >= 2) {
      val = val.substring(0, 2) + '/' + val.substring(2, 4);
    }
    val = val.substring(0, 5); // Limitar a MM/YY
    input.value = val;
    this.pagoForm.get('expiracion')?.setValue(val, { emitEvent: false });
  }

  procesarPago(): void {
    if (this.pagoForm.invalid) {
      return;
    }

    // Guardar dirección actualizada en el perfil del usuario si cambió
    const dirInput = this.pagoForm.get('direccion')?.value;
    if (dirInput && dirInput !== this.usuarioActual.direccion) {
      this.usuarioActual.direccion = dirInput;
      this.authService.actualizarPerfil(this.usuarioActual);
    }

    // Generar el pedido de forma instantánea
    const pedido = this.cartService.realizarPedido(this.usuarioActual.id, this.usuarioActual.nombre);
    if (pedido) {
      this.pedidoGenerado = pedido;
      this.pagoCompletado = true;
    }
  }
}
