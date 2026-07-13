import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { Producto } from '../interfaces/producto';

/**
 * @description
 * Servicio encargado de gestionar los productos (figuras de colección) en la tienda.
 * Realiza el consumo asíncrono de la API REST mediante HttpClient para todas las operaciones CRUD.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  constructor(private http: HttpClient) {}

  /**
   * Resuelve dinámicamente la URL base del API.
   * Si es desarrollo local corre en el puerto 3000, si es Docker corre por el proxy de Nginx.
   */
  private getApiUrl(): string {
    return window.location.origin.includes('localhost:4200')
      ? 'http://localhost:3000'
      : '/tienda-multiverso-json-server';
  }

  /**
   * Obtiene la lista completa de figuras de colección.
   * @returns Un Observable con la lista de productos.
   */
  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${this.getApiUrl()}/productos`).pipe(
      map(productos => productos.map(p => ({
        ...p,
        id: isNaN(Number(p.id)) ? p.id : Number(p.id)
      })))
    );
  }

  /**
   * Obtiene un producto individual por su ID.
   * @param id Identificador numérico de la figura.
   */
  getProductById(id: number | string): Observable<Producto> {
    return this.http.get<Producto>(`${this.getApiUrl()}/productos/${id}`).pipe(
      map(p => ({
        ...p,
        id: isNaN(Number(p.id)) ? p.id : Number(p.id)
      }))
    );
  }

  /**
   * Agrega un nuevo producto a la base de datos de json-server calculando secuencialmente el ID.
   * @param producto Datos del producto sin el ID.
   */
  agregarProducto(producto: Omit<Producto, 'id'>): Observable<Producto> {
    return this.getProductos().pipe(
      switchMap(productos => {
        const idsNumericos = productos
          .map(p => Number(p.id))
          .filter(id => !isNaN(id));
        const nuevoId = idsNumericos.length > 0 ? Math.max(...idsNumericos) + 1 : 11;
        const productoConId = { ...producto, id: String(nuevoId) };
        return this.http.post<Producto>(`${this.getApiUrl()}/productos`, productoConId as any).pipe(
          map(p => ({
            ...p,
            id: isNaN(Number(p.id)) ? p.id : Number(p.id)
          }))
        );
      })
    );
  }

  /**
   * Actualiza los datos de un producto existente.
   * @param producto Objeto del producto con su respectivo ID.
   */
  actualizarProducto(producto: Producto): Observable<Producto> {
    const payload = { ...producto, id: String(producto.id) };
    return this.http.put<Producto>(`${this.getApiUrl()}/productos/${producto.id}`, payload as any).pipe(
      map(p => ({
        ...p,
        id: isNaN(Number(p.id)) ? p.id : Number(p.id)
      }))
    );
  }

  /**
   * Elimina un producto por su ID.
   * @param id ID del producto a borrar.
   */
  eliminarProducto(id: number | string): Observable<void> {
    return this.http.delete<void>(`${this.getApiUrl()}/productos/${id}`);
  }

  /**
   * Descuenta stock de un producto realizando un PATCH dinámico.
   * @param id ID del producto.
   * @param cantidadADescontar Unidades a restar del stock.
   */
  actualizarStock(id: number | string, cantidadADescontar: number): Observable<Producto> {
    return this.getProductById(id).pipe(
      switchMap(prod => {
        const nuevoStock = Math.max(0, prod.stock - cantidadADescontar);
        return this.http.patch<Producto>(`${this.getApiUrl()}/productos/${id}`, { stock: nuevoStock }).pipe(
          map(p => ({
            ...p,
            id: isNaN(Number(p.id)) ? p.id : Number(p.id)
          }))
        );
      })
    );
  }
}
