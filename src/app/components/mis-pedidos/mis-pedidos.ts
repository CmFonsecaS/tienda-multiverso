import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { Pedido } from '../../interfaces/pedido';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mis-pedidos',
  templateUrl: './mis-pedidos.html',
  standalone: false
})
export class MisPedidosComponent implements OnInit {
  pedidos: Pedido[] = [];
  usuarioNombre = '';

  constructor(
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

    this.usuarioNombre = user.nombre;
    const todosPedidos = this.cartService.getPedidos();
    // Filtrar pedidos por el usuario actual
    this.pedidos = todosPedidos.filter(p => p.usuarioId === user.id).reverse(); // los más recientes primero
  }
}
