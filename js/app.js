/* ============================================
   TIENDA MULTIVERSO - LÓGICA PRINCIPAL JS
   ============================================ */

// ---- DATOS INICIALES DE PRODUCTOS ----
const PRODUCTOS_INICIALES = [
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

// ---- USUARIOS INICIALES ----
const USUARIOS_INICIALES = [
  {
    id: 1,
    nombre: "Admin Marvel",
    email: "admin@marvel.com",
    password: "Admin@1234",
    rol: "admin",
    telefono: "+56912345678",
    direccion: "Av. Latveria 123"
  },
  {
    id: 2,
    nombre: "Tony Stark",
    email: "tony@stark.com",
    password: "IronMan@99",
    rol: "cliente",
    telefono: "+56987654321",
    direccion: "Parque Riesco 999"
  }
];

// ---- HELPERS DE STORAGE ----
function getUsuarios() {
  const data = localStorage.getItem('marvel_usuarios');
  return data ? JSON.parse(data) : USUARIOS_INICIALES;
}

function guardarUsuarios(usuarios) {
  localStorage.setItem('marvel_usuarios', JSON.stringify(usuarios));
}

function getProductos() {
  const data = localStorage.getItem('marvel_productos');
  return data ? JSON.parse(data) : PRODUCTOS_INICIALES;
}

function guardarProductos(productos) {
  localStorage.setItem('marvel_productos', JSON.stringify(productos));
}

function getCarrito() {
  const data = sessionStorage.getItem('marvel_carrito');
  return data ? JSON.parse(data) : [];
}

function guardarCarrito(carrito) {
  sessionStorage.setItem('marvel_carrito', JSON.stringify(carrito));
}

function getUsuarioActual() {
  const data = sessionStorage.getItem('marvel_usuario_actual');
  return data ? JSON.parse(data) : null;
}

function setUsuarioActual(usuario) {
  sessionStorage.setItem('marvel_usuario_actual', JSON.stringify(usuario));
}

function cerrarSesion() {
  sessionStorage.removeItem('marvel_usuario_actual');
  sessionStorage.removeItem('marvel_carrito');
  window.location.href = obtenerRuta('index.html');
}

function getPedidos() {
  const data = localStorage.getItem('marvel_pedidos');
  return data ? JSON.parse(data) : [];
}

function guardarPedidos(pedidos) {
  localStorage.setItem('marvel_pedidos', JSON.stringify(pedidos));
}

// ---- INICIALIZAR DATOS SI NO EXISTEN ----
function inicializarDatos() {
  if (!localStorage.getItem('marvel_usuarios')) {
    guardarUsuarios(USUARIOS_INICIALES);
  }
  
  const productosExistentes = localStorage.getItem('marvel_productos');
  // Si no existen productos, o si existen pero usan las rutas antiguas de imagen (con .png o el antiguo ironman.png), sobrescribir
  if (!productosExistentes || productosExistentes.includes('.png') || productosExistentes.includes('img/ironman.png')) {
    guardarProductos(PRODUCTOS_INICIALES);
  }
}

// ---- FORMATEAR PRECIO ----
function formatearPrecio(valor) {
  return '$' + valor.toLocaleString('es-CL');
}

// ---- VALIDACIONES DE CONTRASEÑA ----
function validarPassword(password) {
  return {
    longMin: password.length >= 8,
    longMax: password.length <= 20,
    tieneNumero: /\d/.test(password),
    tieneMayuscula: /[A-Z]/.test(password),
    tieneEspecial: /[!@#$%^&*(),.?":{}|<>_\-]/.test(password)
  };
}

function passwordValida(password) {
  const v = validarPassword(password);
  return v.longMin && v.longMax && v.tieneNumero && v.tieneMayuscula && v.tieneEspecial;
}

// ---- MOSTRAR VALIDACIONES CONTRASEÑA ----
function mostrarValidacionesPassword(password, contenedorId) {
  const v = validarPassword(password);
  const c = document.getElementById(contenedorId);
  if (!c) return;

  const items = [
    { key: 'longMin', texto: 'Mínimo 8 caracteres' },
    { key: 'longMax', texto: 'Máximo 20 caracteres' },
    { key: 'tieneNumero', texto: 'Al menos un número' },
    { key: 'tieneMayuscula', texto: 'Al menos una mayúscula' },
    { key: 'tieneEspecial', texto: 'Al menos un carácter especial (!@#$...)' }
  ];

  c.innerHTML = items.map(item =>
    `<div class="req-item ${v[item.key] ? 'ok' : 'fail'}">
      ${v[item.key] ? '✓' : '✗'} ${item.texto}
    </div>`
  ).join('');
}

// ---- CARRITO ----
function contarCarrito() {
  const carrito = getCarrito();
  return carrito.reduce((sum, item) => sum + item.cantidad, 0);
}

function actualizarBadgeCarrito() {
  const badges = document.querySelectorAll('.badge-carrito');
  const count = contarCarrito();
  badges.forEach(b => {
    b.textContent = count;
    b.style.display = count > 0 ? 'flex' : 'none';
  });
  if (typeof renderCarritoPreview === 'function') {
    renderCarritoPreview();
  }
}

function agregarAlCarrito(productoId) {
  const productos = getProductos();
  const producto = productos.find(p => p.id === productoId);
  if (!producto || producto.stock <= 0) return;

  const carrito = getCarrito();
  const existente = carrito.find(item => item.id === productoId);

  if (existente) {
    if (existente.cantidad < producto.stock) {
      existente.cantidad++;
    } else {
      mostrarToast('No hay más stock disponible', 'warning');
      return;
    }
  } else {
    carrito.push({ id: productoId, cantidad: 1 });
  }

  guardarCarrito(carrito);
  actualizarBadgeCarrito();
  mostrarToast('Producto agregado al carrito 🛒', 'success');
}

// ---- TOAST SIMPLE ----
function mostrarToast(mensaje, tipo = 'success') {
  let contenedor = document.getElementById('toast-container');
  if (!contenedor) {
    contenedor = document.createElement('div');
    contenedor.id = 'toast-container';
    contenedor.style.cssText = 'position:fixed;bottom:20px;right:20px;z-index:9999;';
    document.body.appendChild(contenedor);
  }

  const colores = { success: '#27ae60', danger: '#e74c3c', warning: '#f39c12', info: '#3498db' };
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

  const style = document.createElement('style');
  style.textContent = '@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}}';
  document.head.appendChild(style);

  contenedor.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ---- VERIFICAR SESIÓN ----
function requiereLogin() {
  if (!getUsuarioActual()) {
    window.location.href = obtenerRuta('index.html');
    return false;
  }
  return true;
}

function requiereAdmin() {
  const u = getUsuarioActual();
  if (!u || u.rol !== 'admin') {
    window.location.href = obtenerRuta('index.html');
    return false;
  }
  return true;
}

// ---- RUTA DINÁMICA SEGÚN DIRECTORIO ----
function obtenerRuta(pagina) {
  // Si estamos en /pages/, subir un nivel
  if (window.location.pathname.includes('/pages/')) {
    return '../' + pagina;
  }
  return pagina;
}

function obtenerRutaPages(pagina) {
  if (window.location.pathname.includes('/pages/')) {
    return pagina;
  }
  return 'pages/' + pagina;
}

// Inicializar siempre
inicializarDatos();
