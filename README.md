# TIENDA MULTIVERSO: Versión final EFT 🌌

Este es un proyecto de aplicación web sobre una tienda en línea de figuras de colección del Universo de Marvel, migrado completamente a una arquitectura basada en microservicios contenerizados y consumo de API REST.

---

## 🚀 Características Principales

### 👥 Perfil de Cliente
*   **Autenticación segura:** Inicio de sesión, recuperación de contraseña simulada y registro de usuarios con validación interactiva de 5 reglas de seguridad en tiempo real para contraseñas.
*   **Catálogo interactivo REST:** Búsqueda por texto, filtrado por categorías y ordenación por precio o nombre consumiendo datos en tiempo real mediante observables asíncronos.
*   **Carrito de compras reactivo:** Panel lateral deslizante (Offcanvas) sincronizado al instante y vista detallada del carrito con edición de cantidades, cálculo de subtotales y validación de stock disponible contra el servidor.
*   **Pasarela de pago asíncrona:** Procesamiento de compra interactivo que realiza la actualización de stock en caliente en la base de datos REST mediante peticiones HTTP asíncronas.
*   **Historial de Pedidos:** Sección de "Mis Pedidos" para revisar las compras realizadas y sus datos de envío.

<img width="2560" height="1392" alt="Snag_395c24" src="https://github.com/user-attachments/assets/82e85d47-73b5-4a52-89a6-77ca01dac611" />

### 👑 Perfil de Administrador
*   **Dashboard de Métricas:** Visualización en tiempo real de ingresos totales facturados, alertas de bajo stock crítico (≤ 3 unidades) y top de productos más vendidos.
*   **Control de Inventario:** Modificación rápida de stock con botones de incremento/decremento y guardado instantáneo sincronizado con el servidor.
*   **Mantenimiento (CRUD completo):** Creación de nuevos productos con generación de IDs secuenciales numéricos en el cliente, modificación de atributos y eliminación con retroalimentación Toast flotante inmediata.

<img width="1920" height="1032" alt="Snag_3a618e" src="https://github.com/user-attachments/assets/c7343110-c44c-4147-b254-e887e7bbc402" />

---

## 🛠️ Tecnologías Utilizadas

*   **Frontend Framework:** Angular v18+ (enrutamiento, formularios reactivos y servicios centralizados).
*   **Consumo de API:** `HttpClient` de Angular con flujos asíncronos basados en observables de RxJS.
*   **Backend REST (Simulado):** `json-server` (versión estable 0.17.4) para una persistencia e incremento numérico robustos en archivos de base de datos JSON.
*   **Servidor Web y Proxy Inverso:** Nginx (actuando como servidor estático en puerto 8080 y proxy inverso redirigiendo las llamadas `/tienda-multiverso-json-server/` al backend).
*   **Contenerización y Orquestación:** Docker y Docker Compose (aislamiento y comunicación segura entre el servicio frontend y el backend API).
*   **Estilos y Responsividad:** CSS3 personalizado integrado con **Bootstrap 5.3.3** para garantizar diseño adaptativo en móviles, tablets y PCs.
*   **Pruebas Unitarias Automatizadas:** Pruebas unitarias de lógica de negocio y flujos críticos utilizando **Vitest**.
*   **Documentación del Código:** Portal interactivo de documentación de arquitectura del software a través de **Compodoc**.

---

## 🐳 Arquitectura de Contenedores y Despliegue

El proyecto se encuentra orquestado y contenerizado de la siguiente manera:

*   **Servicio Frontend (`frontend_app`):** Corre en el puerto `8080` (interno `80`). Utiliza una compilación multi-stage de Node para generar el bundle de Angular y servirlo de forma estática con Nginx.
*   **Servicio Backend (`backend_api`):** Corre en el puerto `3000`. Utiliza `json-server` para levantar la API REST de persistencia.
*   **Volumen de Persistencia Sincronizado:** El contenedor backend comparte y sincroniza en tiempo real el archivo `db.json` con tu computadora. Cualquier cambio de stock, compra del cliente o creación/edición del administrador se guarda físicamente en tu host al instante sin bloqueos de archivo.

### ⚡ Cómo Ejecutar el Proyecto Localmente

Para levantar y compilar el entorno completo de forma limpia, sigue estos comandos en tu terminal (con Docker Desktop ejecutándose de fondo):

1.  **Limpiar contenedores y redes previas:**
    ```bash
    docker compose down
    ```
2.  **Compilar imágenes de Docker sin utilizar caché (Garantiza código nuevo):**
    ```bash
    docker compose build --no-cache
    ```
3.  **Levantar los contenedores en segundo plano (Detached):**
    ```bash
    docker compose up -d
    ```
4.  **Acceder a la aplicación:**
    *   👉 **Aplicación Frontend:** [http://localhost:8080](http://localhost:8080)
    *   👉 **Catálogo Directo (Enrutamiento Angular):** [http://localhost:8080/tienda-multiverso](http://localhost:8080/tienda-multiverso)
    *   👉 **API REST (Reverse Proxy Nginx):** [http://localhost:8080/tienda-multiverso-json-server/productos](http://localhost:8080/tienda-multiverso-json-server/productos)
        
<img width="1618" height="839" alt="Snag_38b12f" src="https://github.com/user-attachments/assets/36e1dcce-5a86-49d0-a6d5-5e6701c3600f" />

---

## 🧪 Pruebas Unitarias y Calidad

Para validar el correcto funcionamiento de los servicios mockeados y flujos de negocio sin depender de la base de datos REST física, ejecuta en tu terminal local:
```bash
npm run test -- --watch=false
```
<img width="769" height="414" alt="Snag_34951e" src="https://github.com/user-attachments/assets/02bb9775-dbf9-48fe-8d99-554a72ac4b2c" />


