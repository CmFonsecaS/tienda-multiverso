import { Producto } from './producto';

export interface ItemPedido {
  producto: Producto;
  cantidad: number;
}

export interface Pedido {
  id: number;
  usuarioId: number;
  usuarioNombre: string;
  productos: ItemPedido[];
  total: number;
  fecha: string;
  estado: 'Pendiente' | 'Entregado' | 'Cancelado';
}
