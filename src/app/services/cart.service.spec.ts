import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import { ToastService } from './toast.service';

describe('CartService', () => {
  let service: CartService;
  let productService: ProductService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CartService, ProductService, ToastService]
    });
    service = TestBed.inject(CartService);
    productService = TestBed.inject(ProductService);
    
    // Reset databases and states
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debería ser creado el servicio de carrito', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un producto al carrito, contar la cantidad y calcular el precio total', () => {
    // Vaciar al inicio
    service.vaciarCarrito();
    expect(service.contarCarrito()).toBe(0);

    // Agregar producto con ID 1 (Iron Man, precio: 12990)
    service.agregarAlCarrito(1);
    expect(service.contarCarrito()).toBe(1);
    
    // Verificar que el subtotal y total coincidan
    expect(service.getPrecioTotal()).toBe(12990);
    
    // Agregar otro del mismo (ID 1)
    service.agregarAlCarrito(1);
    expect(service.contarCarrito()).toBe(2);
    expect(service.getPrecioTotal()).toBe(12990 * 2);
  });
});
