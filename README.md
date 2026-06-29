# TIENDA MULTIVERSO 🌌

Este es un proyecto de aplicación web sobre una tienda en línea de figuras de colección del Universo de Marvel.
---

## 🚀 Características Principales

### 👥 Perfil de Cliente
*   **Autenticación segura:** Inicio de sesión, recuperación de contraseña simulada y registro de usuarios con validación interactiva de 5 reglas de seguridad en tiempo real para contraseñas.
*   **Catálogo interactivo:** Búsqueda por texto, filtrado por categorías y ordenación por precio o nombre al vuelo.
*   **Carrito de compras reactivo:** Panel lateral deslizante (Offcanvas) sincronizado al instante y vista detallada del carrito con edición de cantidades y cálculo de subtotales.
*   **Pasarela de pago simulada:** Validación de formato de tarjetas de crédito y simulación del procesamiento de compra.
*   **Historial de Pedidos:** Sección de "Mis Pedidos" para revisar las compras realizadas y sus datos de envío.

### 👑 Perfil de Administrador
*   **Dashboard de Métricas:** Visualización de ingresos totales facturados, alertas de bajo stock crítico (≤ 3 unidades) y top de productos más vendidos.
*   **Control de Inventario:** Modificación rápida de stock con botones de incremento/decremento y guardado instantáneo.
*   **Mantenimiento (CRUD):** Gestión completa de la base de datos de productos (crear, editar, eliminar) y usuarios.

---

## 🛠️ Tecnologías Utilizadas

*   **Estructura:** HTML5.
*   **Diseño y Responsividad:** CSS3 personalizado integrado con **Bootstrap 5.3.3** así se garantiza un diseño adaptativo en móviles, tablets y PCs.
*   **Lógica de negocio:** JavaScript.
*   **Persistencia de datos:**
    *   `localStorage`: Para usuarios registrados, catálogo de productos e historial de pedidos.
    *   `sessionStorage`: Para la sesión del usuario activo y el estado temporal del carrito de compras.

---

## 🛠️ Galería

<img width="545" height="723" alt="Snag_9f844d" src="https://github.com/user-attachments/assets/c98b271d-a1fb-426d-9e58-577b572faf5b" />
<img width="1912" height="907" alt="Snag_9f8d08" src="https://github.com/user-attachments/assets/bd77ed72-01f1-41c7-ad1b-ebca57046056" />
<img width="1369" height="917" alt="Snag_9f9526" src="https://github.com/user-attachments/assets/b226cb57-2e9b-4e8a-bc0f-71a61a017513" />
<img width="742" height="855" alt="Snag_9f9b7f" src="https://github.com/user-attachments/assets/8d020711-b068-4453-85d8-7e2ee17d8002" />
<img width="731" height="890" alt="Snag_9fa245" src="https://github.com/user-attachments/assets/143e574b-0a87-4f74-bcc0-773fd103f9d6" />
<img width="662" height="828" alt="Snag_9fb10a" src="https://github.com/user-attachments/assets/0a0d4419-2a11-466d-9d2b-884abf37d229" />

---

## ⚡ Novedades de la Fase 2: Migración a Angular

En esta segunda fase, la aplicación se ha migrado completamente de una arquitectura estática a un **Framework Moderno (Angular v18+)** para lograr un desarrollo escalable, robusto y profesional:

*   **Estructura basada en Componentes:** Organización de la app en componentes desacoplados y enrutamiento dinámico (`AppRoutingModule`).
*   **Formularios Reactivos Avanzados:** Implementación de `ReactiveFormsModule` para login, registro y pasarela de pago con validaciones en tiempo real (reglas de contraseñas y formatos de tarjetas).
*   **Servicios y Reactividad:** Gestión centralizada de estados y comunicación reactiva con RxJS (`BehaviorSubject`) entre componentes hermanos.
*   **Pruebas Unitarias Automatizadas:** Integración de pruebas unitarias de lógica de negocio y flujos críticos utilizando **Vitest**.
*   **Documentación del Código:** Generación del portal interactivo de documentación de arquitectura del software a través de **Compodoc**.
