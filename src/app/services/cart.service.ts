import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProductService } from './product.service';
import { ToastService } from './toast.service';
import { Producto } from '../interfaces/producto';
import { ItemPedido, Pedido } from '../interfaces/pedido';

interface ItemCarritoSimple {
  id: number;
  cantidad: number;
}

/**
 * @description
 * Servicio encargado de la gestión del carrito de compras y el historial de pedidos de los clientes.
 * Provee reactividad ante los cambios del carrito usando BehaviorSubjects de RxJS, valida
 * el stock límite antes de agregar o incrementar elementos y genera pedidos rebajando stock.
 */
@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly STORAGE_CART_KEY = 'marvel_carrito';
  private readonly STORAGE_ORDERS_KEY = 'marvel_pedidos';

  private cartSubject = new BehaviorSubject<ItemCarritoSimple[]>([]);
  private productos: Producto[] = [];
  
  /**
   * Observable que emite la lista simplificada de items agregados en el carrito actual.
   */
  cart$: Observable<ItemCarritoSimple[]> = this.cartSubject.asObservable();

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {
    this.cargarCarrito();
    this.cargarProductos();
  }

  /**
   * Carga la lista de productos desde el API asíncronamente para sincronizar el carrito.
   */
  cargarProductos(): void {
    this.productService.getProductos().subscribe({
      next: (prods) => {
        this.productos = prods;
        // Forzar emisión del carro para refrescar vistas con las figuras actualizadas
        this.cartSubject.next(this.getCarritoItems());
      }
    });
  }

  /**
   * Carga los elementos del carrito persistidos en sessionStorage al inicializar el servicio.
   */
  private cargarCarrito(): void {
    const data = sessionStorage.getItem(this.STORAGE_CART_KEY);
    const items = data ? JSON.parse(data) : [];
    this.cartSubject.next(items);
  }

  /**
   * Sincroniza y guarda los cambios del carrito en sessionStorage y notifica a los suscriptores.
   * @param items Arreglo de items simplificados en el carro.
   */
  private guardarCarrito(items: ItemCarritoSimple[]): void {
    sessionStorage.setItem(this.STORAGE_CART_KEY, JSON.stringify(items));
    this.cartSubject.next(items);
  }

  /**
   * Retorna el estado actual del carrito de compras en formato plano.
   * @returns Un arreglo de objetos con id y cantidad.
   */
  getCarritoItems(): ItemCarritoSimple[] {
    return this.cartSubject.value;
  }

  /**
   * Resuelve los datos detallados de cada figura agregada en el carrito cruzándolo con el inventario.
   * @returns Un arreglo de objetos conteniendo el objeto Producto original y la cantidad seleccionada.
   */
  getCarritoDetallado(): { producto: Producto; cantidad: number }[] {
    const items = this.getCarritoItems();
    return items
      .map(item => {
        const prod = this.productos.find(p => p.id === item.id);
        return prod ? { producto: prod, cantidad: item.cantidad } : null;
      })
      .filter((item): item is { producto: Producto; cantidad: number } => item !== null);
  }

  /**
   * Calcula la cantidad agregada total de figuras dentro del carrito de compras.
   * @returns Suma total de unidades.
   */
  contarCarrito(): number {
    return this.getCarritoItems().reduce((sum, item) => sum + item.cantidad, 0);
  }

  /**
   * Calcula la sumatoria del precio por cantidad de todos los productos en el carro.
   * @returns Total de la compra en formato numérico.
   */
  getPrecioTotal(): number {
    return this.getCarritoDetallado().reduce((sum, item) => sum + (item.producto.precio * item.cantidad), 0);
  }

  /**
   * Agrega una figura al carrito validando que exista suficiente stock remanente en inventario.
   * Muestra alertas interactivas tipo Toast sobre el resultado de la operación.
   * @param productoId Identificador de la figura de colección.
   */
  agregarAlCarrito(productoId: number): void {
    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) return;

    if (producto.stock <= 0) {
      this.toastService.mostrarToast('Producto sin stock disponible', 'warning');
      return;
    }

    const items = [...this.getCarritoItems()];
    const existente = items.find(item => item.id === productoId);

    if (existente) {
      if (existente.cantidad < producto.stock) {
        existente.cantidad++;
        this.guardarCarrito(items);
        this.toastService.mostrarToast('Producto agregado al carrito 🛒', 'success');
      } else {
        this.toastService.mostrarToast('No hay más stock disponible', 'warning');
      }
    } else {
      items.push({ id: productoId, cantidad: 1 });
      this.guardarCarrito(items);
      this.toastService.mostrarToast('Producto agregado al carrito 🛒', 'success');
    }
  }

  /**
   * Elimina un producto por completo del carrito sin importar su cantidad seleccionada.
   * @param productoId Identificador de la figura.
   */
  removerDelCarrito(productoId: number): void {
    const items = this.getCarritoItems().filter(item => item.id !== productoId);
    this.guardarCarrito(items);
    this.toastService.mostrarToast('Producto eliminado del carrito 🗑️', 'info');
  }

  /**
   * Incrementa en una unidad la cantidad seleccionada de un item en el carro si hay stock.
   * @param productoId Identificador de la figura de acción.
   */
  incrementarCantidad(productoId: number): void {
    const producto = this.productos.find(p => p.id === productoId);
    if (!producto) return;

    const items = [...this.getCarritoItems()];
    const existente = items.find(item => item.id === productoId);
    if (existente) {
      if (existente.cantidad < producto.stock) {
        existente.cantidad++;
        this.guardarCarrito(items);
      } else {
        this.toastService.mostrarToast('Límite de stock alcanzado', 'warning');
      }
    }
  }

  /**
   * Reduce en una unidad la cantidad seleccionada de un item en el carro, removiéndolo si llega a 0.
   * @param productoId Identificador de la figura.
   */
  decrementarCantidad(productoId: number): void {
    const items = [...this.getCarritoItems()];
    const existente = items.find(item => item.id === productoId);
    if (existente) {
      if (existente.cantidad > 1) {
        existente.cantidad--;
        this.guardarCarrito(items);
      } else {
        this.removerDelCarrito(productoId);
      }
    }
  }

  /**
   * Limpia totalmente el carrito de compras del usuario activo.
   */
  vaciarCarrito(): void {
    this.guardarCarrito([]);
  }

  /**
   * Obtiene todos los pedidos del multiverso registrados históricamente en localStorage.
   * @returns Un arreglo con los objetos de tipo Pedido.
   */
  getPedidos(): Pedido[] {
    const data = localStorage.getItem(this.STORAGE_ORDERS_KEY);
    return data ? JSON.parse(data) : [];
  }

  /**
   * Guarda y persiste el historial completo de pedidos en localStorage.
   * @param pedidos Arreglo de pedidos.
   */
  guardarPedidos(pedidos: Pedido[]): void {
    localStorage.setItem(this.STORAGE_ORDERS_KEY, JSON.stringify(pedidos));
  }

  /**
   * Registra una compra como un nuevo pedido y actualiza el stock físico de las figuras en el API.
   * @param usuarioId ID del comprador.
   * @param usuarioNombre Nombre completo del cliente.
   * @returns El objeto de tipo Pedido generado exitosamente, o null si el carro estaba vacío.
   */
  realizarPedido(usuarioId: number, usuarioNombre: string): Pedido | null {
    const detalle = this.getCarritoDetallado();
    if (detalle.length === 0) return null;

    // Descontar stock asíncronamente en el API REST
    detalle.forEach(item => {
      this.productService.actualizarStock(item.producto.id, item.cantidad).subscribe({
        next: () => {
          this.cargarProductos(); // Refrescar stock de la figura
        }
      });
    });

    const pedidos = this.getPedidos();
    const nuevoId = pedidos.length > 0 ? Math.max(...pedidos.map(p => p.id)) + 1 : 1;

    const nuevoPedido: Pedido = {
      id: nuevoId,
      usuarioId: usuarioId,
      usuarioNombre: usuarioNombre,
      productos: detalle.map(item => ({
        producto: item.producto,
        cantidad: item.cantidad
      })),
      total: this.getPrecioTotal(),
      fecha: new Date().toLocaleDateString('es-CL') + ' ' + new Date().toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit' }),
      estado: 'Pendiente'
    };

    pedidos.push(nuevoPedido);
    this.guardarPedidos(pedidos);
    this.vaciarCarrito();
    return nuevoPedido;
  }
}
