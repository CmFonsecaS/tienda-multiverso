import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
    // Limpiar localStorage antes de cada prueba
    localStorage.clear();
    sessionStorage.clear();
  });

  it('debería ser creado el servicio de autenticación', () => {
    expect(service).toBeTruthy();
  });

  it('debería validar credenciales de inicio de sesión correctas', () => {
    const adminUser = service.iniciarSesion('admin@marvel.com', 'Admin@1234');
    expect(adminUser).toBeTruthy();
    expect(adminUser?.nombre).toBe('Admin Marvel');
    expect(adminUser?.rol).toBe('admin');
  });

  it('debería validar la robustez de una contraseña según las 4 reglas académicas', () => {
    // Contraseña válida: >=8, <=20, tiene número, tiene mayúscula, tiene especial
    expect(service.passwordValida('Admin@1234')).toBe(true);

    // Contraseñas inválidas
    expect(service.passwordValida('123')).toBe(false); // muy corta
    expect(service.passwordValida('sololetras')).toBe(false); // sin número ni mayus/especial
    expect(service.passwordValida('SoloLetrasYNumero123')).toBe(false); // sin especial
  });
});
