/* ============================================
   NAVBAR COMPARTIDA
   ============================================ */

function renderNavbar(activo) {
  const usuario = getUsuarioActual();
  const esAdmin = usuario && usuario.rol === 'admin';
  const cantCarrito = contarCarrito();

  const base = '../'; // estamos siempre en /pages/

  const htmlNavbar = `
  <nav class="navbar navbar-marvel navbar-expand-lg">
    <div class="container">
      <a class="brand-text" href="${base}pages/catalogo.html">TIENDA <span>MULTIVERSO</span></a>

      <button class="navbar-toggler border-0" type="button" data-bs-toggle="collapse" data-bs-target="#navMain" style="color:white;">
        <span style="font-size:1.5rem;">☰</span>
      </button>

      <div class="collapse navbar-collapse" id="navMain">
        <ul class="navbar-nav me-auto mt-2 mt-lg-0">
          <li class="nav-item">
            <a class="nav-link ${activo==='catalogo'?'text-white':''}" href="${base}pages/catalogo.html">🏪 Catálogo</a>
          </li>
          ${esAdmin ? `
          <li class="nav-item">
            <a class="nav-link ${activo==='admin'?'text-white':''}" href="${base}pages/admin-dashboard.html">⚙️ Panel Admin</a>
          </li>` : `
          <li class="nav-item">
            <a class="nav-link ${activo==='pedidos'?'text-white':''}" href="${base}pages/mis-pedidos.html">📦 Mis Pedidos</a>
          </li>`}
        </ul>

        <div class="d-flex align-items-center gap-2 mt-2 mt-lg-0">
          ${usuario ? `
          <a href="${base}pages/perfil.html" class="btn btn-outline-light btn-sm" style="border-radius:20px;">
            👤 ${usuario.nombre.split(' ')[0]}
          </a>
          <button class="btn-carrito btn btn-sm position-relative" data-bs-toggle="offcanvas" data-bs-target="#carritoPanel">
            🛒 Carrito
            <span class="badge-carrito" style="display:${cantCarrito>0?'flex':'none'}">${cantCarrito}</span>
          </button>
          <button class="btn btn-sm btn-outline-danger" style="border-radius:20px;" onclick="cerrarSesion()">Salir</button>
          ` : `
          <a href="${base}index.html" class="btn btn-marvel btn-sm">Ingresar</a>
          `}
        </div>
      </div>
    </div>
  </nav>`;

  // Panel carrito offcanvas
  const htmlCarrito = `
  <div class="offcanvas offcanvas-end" tabindex="-1" id="carritoPanel" style="max-width:380px;">
    <div class="offcanvas-header" style="background:var(--azul-oscuro); color:white;">
      <h5 class="offcanvas-title" style="font-family:'Bangers',cursive; letter-spacing:2px;">🛒 Mi Carrito</h5>
      <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas"></button>
    </div>
    <div class="offcanvas-body">
      <div id="carrito-items"></div>
      <div id="carrito-total" class="mt-3 pt-3 border-top d-none">
        <div class="d-flex justify-content-between mb-3">
          <span class="fw-bold">Total:</span>
          <span class="fw-bold" id="total-precio" style="color:var(--rojo-marvel); font-family:'Bangers',cursive; font-size:1.3rem;"></span>
        </div>
        <a href="${base}pages/carrito.html" class="btn btn-marvel w-100">Ir al Carrito</a>
      </div>
    </div>
  </div>`;

  document.getElementById('navbar-container').innerHTML = htmlNavbar + htmlCarrito;
  renderCarritoPreview();

  // Escuchar cuando se abre el offcanvas para actualizar la previsualización del carrito
  const panel = document.getElementById('carritoPanel');
  if (panel) {
    panel.addEventListener('show.bs.offcanvas', () => {
      renderCarritoPreview();
    });
  }
}

function renderCarritoPreview() {
  const carrito = getCarrito();
  const productos = getProductos();
  const cont = document.getElementById('carrito-items');
  const totalDiv = document.getElementById('carrito-total');
  if (!cont) return;

  if (carrito.length === 0) {
    cont.innerHTML = `<div class="text-center py-4 text-muted">
      <div style="font-size:3rem;">🛒</div>
      <p>Tu carrito está vacío</p>
    </div>`;
    if (totalDiv) totalDiv.classList.add('d-none');
    return;
  }

  let totalGeneral = 0;
  cont.innerHTML = carrito.map(item => {
    const p = productos.find(x => x.id === item.id);
    if (!p) return '';
    const subtotal = p.precio * item.cantidad;
    totalGeneral += subtotal;
    const imgPath = obtenerRuta(p.imagen);
    return `
    <div class="item-carrito">
      <img src="${imgPath}" alt="${p.nombre}"/>
      <div style="flex:1;">
        <div style="font-size:0.85rem; font-weight:700;">${p.nombre}</div>
        <div style="font-size:0.8rem; color:#888;">${item.cantidad} × ${formatearPrecio(p.precio)}</div>
      </div>
      <div style="font-weight:700; color:var(--rojo-marvel);">${formatearPrecio(subtotal)}</div>
    </div>`;
  }).join('');

  if (totalDiv) {
    totalDiv.classList.remove('d-none');
    document.getElementById('total-precio').textContent = formatearPrecio(totalGeneral);
  }
}
