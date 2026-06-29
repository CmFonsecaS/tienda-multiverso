import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AdminGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean | UrlTree {
    const user = this.authService.getUsuarioActual();
    if (user && user.rol === 'admin') {
      return true;
    }
    // Redirect to normal catalog if not admin
    return this.router.parseUrl('/catalogo');
  }
}
