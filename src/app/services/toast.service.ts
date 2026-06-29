import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  mostrarToast(mensaje: string, tipo: 'success' | 'danger' | 'warning' | 'info' = 'success'): void {
    let contenedor = document.getElementById('toast-container');
    if (!contenedor) {
      contenedor = document.createElement('div');
      contenedor.id = 'toast-container';
      contenedor.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;';
      document.body.appendChild(contenedor);
    }

    const colores = { 
      success: '#27ae60', 
      danger: '#e74c3c', 
      warning: '#f39c12', 
      info: '#3498db' 
    };
    
    const toast = document.createElement('div');
    toast.style.cssText = `
      background:${colores[tipo] || colores.info};
      color:white;
      padding:12px 20px;
      border-radius:8px;
      margin-top:8px;
      font-family:'Nunito',sans-serif;
      font-weight:700;
      font-size:0.9rem;
      box-shadow:0 4px 12px rgba(0,0,0,0.2);
      animation: slideIn 0.3s ease;
    `;
    toast.textContent = mensaje;

    let style = document.getElementById('toast-style');
    if (!style) {
      style = document.createElement('style');
      style.id = 'toast-style';
      style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
      document.head.appendChild(style);
    }

    contenedor.appendChild(toast);
    setTimeout(() => {
      toast.remove();
      if (contenedor && contenedor.childNodes.length === 0) {
        contenedor.remove();
      }
    }, 3000);
  }
}
