import { Injectable } from '@angular/core';
import { Producto } from '../interfaces/producto';

/**
 * @description
 * Servicio encargado de gestionar los productos (figuras de colección) en la tienda.
 * Maneja la persistencia del inventario en localStorage, realiza el descuento de stock
 * en compras y provee las operaciones CRUD para la vista de administrador.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly STORAGE_PRODUCTS_KEY = 'marvel_productos';

  private readonly PRODUCTOS_INICIALES: Producto[] = [
    {
      id: 1,
      nombre: "Iron Man (Model 09)",
      serie: "Marvel Comics",
      precio: 12990,
      stock: 8,
      descripcion: "Figura articulada de Iron Man Modelo 09. Incluye accesorios de efectos de energía y manos intercambiables. Edad recomendada: 4+.",
      imagen: "img/Iron Man 09.jpg",
      categoria: "Iron Man"
    },
    {
      id: 2,
      nombre: "The Incredible Hulk",
      serie: "Marvel 80 Years",
      precio: 14990,
      stock: 5,
      descripcion: "Hulk edición 80 Aniversario Marvel. Incluye tubería aplastada como accesorio. Figura diseño clásico.",
      imagen: "img/Increible Hulk.jpg",
      categoria: "Hulk"
    },
    {
      id: 3,
      nombre: "Juggernaut",
      serie: "Marvel Legends GamerVerse",
      precio: 24990,
      stock: 3,
      descripcion: "Figura premium de Juggernaut de la línea GamerVerse. Incluye 2 manos extra intercambiables. Figura de Marvel vs Capcom.",
      imagen: "img/Juggernaut.jpg",
      categoria: "X-Men"
    },
    {
      id: 4,
      nombre: "Cyclops",
      serie: "X-Men '97",
      precio: 13990,
      stock: 7,
      descripcion: "Cyclops de la serie animada X-Men '97. Incluye cabeza alternativa, manos y efecto de rayos ópticos.",
      imagen: "img/Cyclops.jpg",
      categoria: "X-Men"
    },
    {
      id: 5,
      nombre: "Magneto",
      serie: "X-Men '97",
      precio: 13990,
      stock: 6,
      descripcion: "Magneto de la serie animada X-Men '97. Incluye manos extra. Figura diseño clásico.",
      imagen: "img/Magneto.jpg",
      categoria: "X-Men"
    },
    {
      id: 6,
      nombre: "Deadpool (con Dogpool)",
      serie: "Marvel Legends - Deadpool & Wolverine",
      precio: 32990,
      stock: 4,
      descripcion: "Deadpool premium con figura de Dogpool incluida. Múltiples accesorios: espadas, manos, calavera. Para mayores de 14 años.",
      imagen: "img/Deadpool.jpg",
      categoria: "Deadpool"
    },
    {
      id: 7,
      nombre: "Wolverine (Brown Suit)",
      serie: "Marvel Legends - Deadpool & Wolverine",
      precio: 19990,
      stock: 9,
      descripcion: "Wolverine con traje clásico. Incluye cabeza con y sin máscara.",
      imagen: "img/Wolverine (Brown suit).jpg",
      categoria: "X-Men"
    },
    {
      id: 8,
      nombre: "Venom",
      serie: "Marvel Legends GamerVerse - Spider-Man 2",
      precio: 27990,
      stock: 2,
      descripcion: "Venom del videojuego Spider-Man 2. Figura con tentáculos de simbiontes and más accesorios.",
      imagen: "img/Venom.jpg",
      categoria: "Spider-Man"
    },
    {
      id: 9,
      nombre: "Scarlet Spider",
      serie: "Marvel Comics - Spider-Man",
      precio: 11990,
      stock: 10,
      descripcion: "Scarlet Spider (Clon de Spider-Man). Figura de Spider-Man de la serie animada de los 90s.",
      imagen: "img/Scarlet Spider.jpg",
      categoria: "Spider-Man"
    },
    {
      id: 10,
      nombre: "Dr. Doom",
      serie: "Marvel Legends Super Villains",
      precio: 15990,
      stock: 5,
      descripcion: "Dr. Doom línea Super Villains. Build-A-Figure Xemnu. Incluye manos adicionales y cráneo con columna vertebral.",
      imagen: "img/Dr. Doom.jpg",
      categoria: "Villanos"
    }
  ];

  constructor() {
    this.inicializarProductos();
  }

  /**
   * Inicializa la base de datos de productos en localStorage con las figuras por defecto
   * si no existe ninguna previa o si contiene datos antiguos incompatibles.
   */
  private inicializarProductos(): void {
    const data = localStorage.getItem(this.STORAGE_PRODUCTS_KEY);
    if (!data || data.includes('.png') || data.includes('img/ironman.png')) {
      localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(this.PRODUCTOS_INICIALES));
    }
  }

  /**
   * Obtiene la lista completa de figuras registradas en la tienda.
   * @returns Un arreglo con todos los objetos Producto.
   */
  getProductos(): Producto[] {
    const data = localStorage.getItem(this.STORAGE_PRODUCTS_KEY);
    return data ? JSON.parse(data) : this.PRODUCTOS_INICIALES;
  }

  /**
   * Sobrescribe y guarda la lista de productos en el almacenamiento local.
   * @param productos Lista completa de productos a persistir.
   */
  guardarProductos(productos: Producto[]): void {
    localStorage.setItem(this.STORAGE_PRODUCTS_KEY, JSON.stringify(productos));
  }

  /**
   * Busca y retorna una figura específica por su identificador numérico.
   * @param id Identificador único del producto.
   * @returns El objeto de tipo Producto o undefined si no es hallado.
   */
  getProductById(id: number): Producto | undefined {
    return this.getProductos().find(p => p.id === id);
  }

  /**
   * Registra una nueva figura coleccionable en el sistema asignándole un ID incremental.
   * @param producto Objeto del producto con sus propiedades excluyendo el ID.
   */
  agregarProducto(producto: Omit<Producto, 'id'>): void {
    const productos = this.getProductos();
    const nuevoId = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    const nuevoProducto: Producto = { ...producto, id: nuevoId };
    productos.push(nuevoProducto);
    this.guardarProductos(productos);
  }

  /**
   * Modifica los datos de una figura existente en el inventario local.
   * @param productoActualizado Objeto producto con el ID correspondiente y sus nuevos datos.
   */
  actualizarProducto(productoActualizado: Producto): void {
    const productos = this.getProductos();
    const idx = productos.findIndex(p => p.id === productoActualizado.id);
    if (idx !== -1) {
      productos[idx] = { ...productos[idx], ...productoActualizado };
      this.guardarProductos(productos);
    }
  }

  /**
   * Elimina un producto del catálogo por su ID.
   * @param id Identificador de la figura a remover.
   */
  eliminarProducto(id: number): void {
    const productos = this.getProductos();
    const filtrados = productos.filter(p => p.id !== id);
    this.guardarProductos(filtrados);
  }

  /**
   * Descuenta la cantidad comprada del stock físico actual de un producto.
   * @param id Identificador del producto comprado.
   * @param cantidadADescontar Número de unidades a restar del inventario.
   */
  actualizarStock(id: number, cantidadADescontar: number): void {
    const productos = this.getProductos();
    const idx = productos.findIndex(p => p.id === id);
    if (idx !== -1) {
      productos[idx].stock = Math.max(0, productos[idx].stock - cantidadADescontar);
      this.guardarProductos(productos);
    }
  }
}
