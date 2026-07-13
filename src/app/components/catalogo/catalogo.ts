import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.html',
  standalone: false
})
export class CatalogoComponent implements OnInit {
  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  
  categorias = ['Todos', 'Iron Man', 'Hulk', 'X-Men', 'Deadpool', 'Spider-Man', 'Villanos'];
  categoriaSeleccionada = 'Todos';
  searchQuery = '';

  // Detalle Modal
  mostrarModal = false;
  productoSeleccionado: Producto | null = null;

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.productService.getProductos().subscribe({
      next: (prods) => {
        this.productos = prods;
        this.aplicarFiltros();
        this.cdr.detectChanges();
      }
    });
  }

  seleccionarCategoria(cat: string): void {
    this.categoriaSeleccionada = cat;
    this.aplicarFiltros();
  }

  onSearchChange(): void {
    this.aplicarFiltros();
  }

  aplicarFiltros(): void {
    this.productosFiltrados = this.productos.filter(p => {
      const cumpleCategoria = this.categoriaSeleccionada === 'Todos' || p.categoria === this.categoriaSeleccionada;
      const cumpleBusqueda = p.nombre.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             p.serie.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
                             p.descripcion.toLowerCase().includes(this.searchQuery.toLowerCase());
      return cumpleCategoria && cumpleBusqueda;
    });
  }

  agregarAlCarro(pId: number): void {
    this.cartService.agregarAlCarrito(pId);
    this.cargarProductos(); // Recargar por si cambia el stock en la vista localmente
  }

  abrirDetalle(p: Producto): void {
    this.productoSeleccionado = p;
    this.mostrarModal = true;
  }

  cerrarDetalle(): void {
    this.productoSeleccionado = null;
    this.mostrarModal = false;
  }
}
