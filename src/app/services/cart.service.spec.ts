import { TestBed } from '@angular/core/testing';
import { CartService } from './cart.service';
import { ProductService } from './product.service';
import { ToastService } from './toast.service';
import { of } from 'rxjs';

describe('CartService', () => {
  let service: CartService;

  const MOCK_PRODUCTOS = [
    {
      id: 1,
      nombre: 'Iron Man (Model 09)',
      serie: 'Marvel Comics',
      precio: 12990,
      stock: 8,
      descripcion: 'Figura articulada de Iron Man Modelo 09.',
      imagen: 'img/Iron Man 09.jpg',
      categoria: 'Iron Man'
    }
  ];

  const mockProductService = {
    getProductos: () => of(MOCK_PRODUCTOS),
    getProductById: (id: number) => of(MOCK_PRODUCTOS[0]),
    actualizarStock: (id: number, cant: number) => of(MOCK_PRODUCTOS[0])
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CartService,
        { provide: ProductService, useValue: mockProductService },
        ToastService
      ]
    });
    service = TestBed.inject(CartService);
    
    // Limpiar almacenamientos
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debería ser creado el servicio de carrito', () => {
    expect(service).toBeTruthy();
  });

  it('debería agregar un producto al carrito, contar la cantidad y calcular el precio total', () => {
    // Asegurar carrito vacío al inicio
    service.vaciarCarrito();
    // Forzar carga manual en el test por si acaso
    service.cargarProductos();
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
