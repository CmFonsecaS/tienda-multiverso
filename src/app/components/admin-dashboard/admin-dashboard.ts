import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/product.service';
import { Pedido } from '../../interfaces/pedido';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.html',
  standalone: false
})
export class AdminDashboardComponent implements OnInit {
  pedidos: Pedido[] = [];
  productos: Producto[] = [];
  
  // Métricas
  totalVentas = 0;
  cantClientes = 0;
  cantProductosBajoStock = 0;
  cantItemsVendidos = 0;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.pedidos = this.cartService.getPedidos();
    this.productos = this.productService.getProductos();
    
    this.calcularMetricas();
  }

  calcularMetricas(): void {
    // Total ventas
    this.totalVentas = this.pedidos.reduce((sum, p) => sum + p.total, 0);

    // Clientes registrados
    const usuarios = this.authService.getUsuarios();
    this.cantClientes = usuarios.filter(u => u.rol === 'cliente').length;

    // Productos con bajo stock (< 3)
    this.cantProductosBajoStock = this.productos.filter(p => p.stock < 3).length;

    // Cantidad de items vendidos
    this.cantItemsVendidos = this.pedidos.reduce((sum, p) => {
      return sum + p.productos.reduce((innerSum, item) => innerSum + item.cantidad, 0);
    }, 0);
  }

  actualizarEstadoPedido(pedidoId: number, nuevoEstado: 'Pendiente' | 'Entregado' | 'Cancelado'): void {
    const todosPedidos = this.cartService.getPedidos();
    const idx = todosPedidos.findIndex(p => p.id === pedidoId);
    if (idx !== -1) {
      todosPedidos[idx].estado = nuevoEstado;
      this.cartService.guardarPedidos(todosPedidos);
      this.pedidos = todosPedidos;
      this.calcularMetricas();
    }
  }
}
