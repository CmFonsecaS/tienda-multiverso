import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrito',
  templateUrl: './carrito.html',
  standalone: false
})
export class CarritoComponent implements OnInit, OnDestroy {
  carritoDetalle: any[] = [];
  subtotal = 0;
  costoEnvio = 3990;
  total = 0;
  private subscription = new Subscription();

  constructor(
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.cartService.cart$.subscribe(() => {
        this.cargarCarrito();
        this.cdr.detectChanges(); // Forzar actualización de vista
      })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  cargarCarrito(): void {
    this.carritoDetalle = this.cartService.getCarritoDetallado();
    this.subtotal = this.cartService.getPrecioTotal();
    
    // Envío gratis para compras superiores a 30,000
    if (this.subtotal >= 30000 || this.subtotal === 0) {
      this.costoEnvio = 0;
    } else {
      this.costoEnvio = 3990;
    }
    
    this.total = this.subtotal + this.costoEnvio;
  }

  incrementar(pId: number): void {
    this.cartService.incrementarCantidad(pId);
  }

  decrementar(pId: number): void {
    this.cartService.decrementarCantidad(pId);
  }

  eliminar(pId: number): void {
    this.cartService.removerDelCarrito(pId);
  }

  vaciar(): void {
    this.cartService.vaciarCarrito();
  }

  irAPagar(): void {
    if (this.carritoDetalle.length > 0) {
      this.router.navigate(['/pago']);
    }
  }
}
