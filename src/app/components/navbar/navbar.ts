import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CartService } from '../../services/cart.service';
import { Usuario } from '../../interfaces/usuario';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  standalone: false
})
export class NavbarComponent implements OnInit, OnDestroy {
  usuarioActual: Usuario | null = null;
  cantCarrito = 0;
  carritoDetalle: any[] = [];
  totalCarrito = 0;
  private subscriptions = new Subscription();

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.usuarioActual = this.authService.getUsuarioActual();
    
    // Subscribe to cart changes
    this.subscriptions.add(
      this.cartService.cart$.subscribe(() => {
        this.cantCarrito = this.cartService.contarCarrito();
        this.carritoDetalle = this.cartService.getCarritoDetallado();
        this.totalCarrito = this.cartService.getPrecioTotal();
        this.cdr.detectChanges(); // Forzar actualización de vista
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  removerItem(productoId: number): void {
    this.cartService.removerDelCarrito(productoId);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion();
    this.router.navigate(['/login']);
  }
}
