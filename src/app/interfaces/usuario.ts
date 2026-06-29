export interface Usuario {
  id: number;
  nombre: string;
  email: string;
  password?: string; // Optional for safety
  rol: 'admin' | 'cliente';
  telefono?: string;
  direccion?: string;
}
