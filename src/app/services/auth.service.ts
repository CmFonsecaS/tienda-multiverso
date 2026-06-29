import { Injectable } from '@angular/core';
import { Usuario } from '../interfaces/usuario';

/**
 * @description
 * Servicio encargado de gestionar la autenticación de usuarios, el registro,
 * la persistencia de sesiones en el almacenamiento web (localStorage/sessionStorage)
 * y la validación de contraseñas con criterios de seguridad.
 */
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly STORAGE_USERS_KEY = 'marvel_usuarios';
  private readonly STORAGE_CURRENT_USER_KEY = 'marvel_usuario_actual';
  private readonly RECORDAR_EMAIL_KEY = 'marvel_recordar_email';

  private readonly USUARIOS_INICIALES: Usuario[] = [
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

  constructor() {
    this.inicializarUsuarios();
  }

  /**
   * Inicializa la lista de usuarios por defecto en localStorage si no existe ninguna.
   */
  private inicializarUsuarios(): void {
    if (!localStorage.getItem(this.STORAGE_USERS_KEY)) {
      localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(this.USUARIOS_INICIALES));
    }
  }

  /**
   * Obtiene la lista completa de usuarios registrados en el sistema.
   * @returns Un arreglo con todos los objetos de tipo Usuario.
   */
  getUsuarios(): Usuario[] {
    const data = localStorage.getItem(this.STORAGE_USERS_KEY);
    return data ? JSON.parse(data) : this.USUARIOS_INICIALES;
  }

  /**
   * Guarda la lista de usuarios en el almacenamiento local.
   * @param usuarios Arreglo de usuarios a persistir.
   */
  guardarUsuarios(usuarios: Usuario[]): void {
    localStorage.setItem(this.STORAGE_USERS_KEY, JSON.stringify(usuarios));
  }

  /**
   * Obtiene los datos del usuario actualmente logueado en la sesión.
   * @returns El objeto de tipo Usuario si existe una sesión activa, de lo contrario null.
   */
  getUsuarioActual(): Usuario | null {
    const data = sessionStorage.getItem(this.STORAGE_CURRENT_USER_KEY);
    return data ? JSON.parse(data) : null;
  }

  /**
   * Establece el usuario actual en el almacenamiento de sesión.
   * @param usuario Datos del usuario a loguear, o null para limpiar la sesión.
   */
  setUsuarioActual(usuario: Usuario | null): void {
    if (usuario) {
      sessionStorage.setItem(this.STORAGE_CURRENT_USER_KEY, JSON.stringify(usuario));
    } else {
      sessionStorage.removeItem(this.STORAGE_CURRENT_USER_KEY);
    }
  }

  /**
   * Guarda o elimina el email del usuario en localStorage para recordar sus credenciales.
   * @param email Correo electrónico a recordar.
   * @param recordar Flag de decisión de persistencia.
   */
  recordarEmail(email: string, recordar: boolean): void {
    if (recordar) {
      localStorage.setItem(this.RECORDAR_EMAIL_KEY, email);
    } else {
      localStorage.removeItem(this.RECORDAR_EMAIL_KEY);
    }
  }

  /**
   * Recupera el correo electrónico recordado en el navegador.
   * @returns El string del correo recordado o vacío.
   */
  getEmailRecordado(): string {
    return localStorage.getItem(this.RECORDAR_EMAIL_KEY) || '';
  }

  /**
   * Verifica las credenciales de inicio de sesión de un usuario.
   * @param email Correo electrónico.
   * @param pass Contraseña en texto plano.
   * @returns El objeto Usuario si las credenciales son correctas, de lo contrario null.
   */
  iniciarSesion(email: string, pass: string): Usuario | null {
    const usuarios = this.getUsuarios();
    const usuario = usuarios.find(u => u.email === email && u.password === pass);
    if (usuario) {
      this.setUsuarioActual(usuario);
      return usuario;
    }
    return null;
  }

  /**
   * Registra un nuevo usuario en el almacenamiento local con un ID autoincremental.
   * @param usuario Objeto usuario con los datos obligatorios omitiendo el ID.
   */
  registrarUsuario(usuario: Omit<Usuario, 'id'>): void {
    const usuarios = this.getUsuarios();
    const nuevoId = usuarios.length > 0 ? Math.max(...usuarios.map(u => u.id)) + 1 : 1;
    const nuevoUsuario: Usuario = { ...usuario, id: nuevoId };
    usuarios.push(nuevoUsuario);
    this.guardarUsuarios(usuarios);
  }

  /**
   * Actualiza el perfil de un usuario existente en localStorage y sincroniza la sesión activa.
   * @param usuarioActualizado Datos modificados del usuario.
   */
  actualizarPerfil(usuarioActualizado: Usuario): void {
    const usuarios = this.getUsuarios();
    const idx = usuarios.findIndex(u => u.id === usuarioActualizado.id);
    if (idx !== -1) {
      usuarios[idx] = { ...usuarios[idx], ...usuarioActualizado };
      this.guardarUsuarios(usuarios);
      
      const actual = this.getUsuarioActual();
      if (actual && actual.id === usuarioActualizado.id) {
        this.setUsuarioActual(usuarios[idx]);
      }
    }
  }

  /**
   * Cierra la sesión activa del usuario y limpia los datos del carrito en la sesión.
   */
  cerrarSesion(): void {
    sessionStorage.removeItem(this.STORAGE_CURRENT_USER_KEY);
    sessionStorage.removeItem('marvel_carrito');
  }

  /**
   * Analiza individualmente las 5 reglas de seguridad obligatorias en una contraseña.
   * @param password Contraseña a verificar.
   * @returns Un objeto con los flags booleanos correspondientes a cada regla.
   */
  validarPassword(password: string) {
    return {
      longMin: password.length >= 8,
      longMax: password.length <= 20,
      tieneNumero: /\d/.test(password),
      tieneMayuscula: /[A-Z]/.test(password),
      tieneEspecial: /[!@#$%^&*(),.?":{}|<>_\-]/.test(password)
    };
  }

  /**
   * Determina si una contraseña cumple simultáneamente con todas las reglas de robustez académicas.
   * @param password Contraseña a validar.
   * @returns True si es válida y segura, de lo contrario False.
   */
  passwordValida(password: string): boolean {
    const v = this.validarPassword(password);
    return v.longMin && v.longMax && v.tieneNumero && v.tieneMayuscula && v.tieneEspecial;
  }
}
