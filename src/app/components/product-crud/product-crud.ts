import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { ToastService } from '../../services/toast.service';
import { Producto } from '../../interfaces/producto';

@Component({
  selector: 'app-product-crud',
  templateUrl: './product-crud.html',
  standalone: false
})
export class ProductCrudComponent implements OnInit {
  productos: Producto[] = [];
  productForm!: FormGroup;

  // Modales y control de estados
  mostrarModal = false;
  modoEdicion = false;
  productoEdicionId: number | null = null;

  // Lista de imágenes locales disponibles para asociar
  imagenesDisponibles = [
    { label: 'Iron Man (Model 09)', path: 'img/Iron Man 09.jpg' },
    { label: 'The Incredible Hulk', path: 'img/Increible Hulk.jpg' },
    { label: 'Juggernaut', path: 'img/Juggernaut.jpg' },
    { label: 'Cyclops', path: 'img/Cyclops.jpg' },
    { label: 'Magneto', path: 'img/Magneto.jpg' },
    { label: 'Deadpool (con Dogpool)', path: 'img/Deadpool.jpg' },
    { label: 'Wolverine (Brown Suit)', path: 'img/Wolverine (Brown suit).jpg' },
    { label: 'Venom', path: 'img/Venom.jpg' },
    { label: 'Scarlet Spider', path: 'img/Scarlet Spider.jpg' },
    { label: 'Dr. Doom', path: 'img/Dr. Doom.jpg' },
    { label: 'Imagen por Defecto', path: 'img/default.jpg' }
  ];

  categorias = ['Iron Man', 'Hulk', 'X-Men', 'Deadpool', 'Spider-Man', 'Villanos'];

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.cargarProductos();
    this.initForm();
  }

  cargarProductos(): void {
    this.productos = this.productService.getProductos();
  }

  initForm(): void {
    this.productForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      serie: ['', [Validators.required]],
      categoria: ['Iron Man', [Validators.required]],
      precio: [0, [Validators.required, Validators.min(100)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      imagen: ['img/default.jpg', [Validators.required]]
    });
  }

  abrirAgregar(): void {
    this.modoEdicion = false;
    this.productoEdicionId = null;
    this.productForm.reset({
      categoria: 'Iron Man',
      precio: 0,
      stock: 0,
      imagen: 'img/default.jpg'
    });
    this.mostrarModal = true;
  }

  abrirEditar(p: Producto): void {
    this.modoEdicion = true;
    this.productoEdicionId = p.id;
    this.productForm.reset({
      nombre: p.nombre,
      serie: p.serie,
      categoria: p.categoria,
      precio: p.precio,
      stock: p.stock,
      descripcion: p.descripcion,
      imagen: p.imagen
    });
    this.mostrarModal = true;
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.productoEdicionId = null;
  }

  guardar(): void {
    if (this.productForm.invalid) {
      return;
    }

    const datosForm = this.productForm.value;

    if (this.modoEdicion && this.productoEdicionId !== null) {
      // Modificar
      const productoActualizado: Producto = {
        id: this.productoEdicionId,
        ...datosForm
      };
      this.productService.actualizarProducto(productoActualizado);
      this.toastService.mostrarToast('Producto actualizado exitosamente 🦸', 'success');
    } else {
      // Crear
      this.productService.agregarProducto(datosForm);
      this.toastService.mostrarToast('Producto creado exitosamente 🦸', 'success');
    }

    this.cargarProductos();
    this.cerrarModal();
  }

  eliminar(pId: number): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta figura de colección de la tienda?')) {
      this.productService.eliminarProducto(pId);
      this.toastService.mostrarToast('Producto eliminado exitosamente 🗑️', 'danger');
      this.cargarProductos();
    }
  }
}
