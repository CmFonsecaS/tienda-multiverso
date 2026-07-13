import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes
import { LoginComponent } from './components/login/login';
import { RegistroComponent } from './components/registro/registro';
import { RecuperarComponent } from './components/recuperar/recuperar';
import { PerfilComponent } from './components/perfil/perfil';
import { CatalogoComponent } from './components/catalogo/catalogo';
import { CarritoComponent } from './components/carrito/carrito';
import { PagoComponent } from './components/pago/pago';
import { MisPedidosComponent } from './components/mis-pedidos/mis-pedidos';
import { AdminDashboardComponent } from './components/admin-dashboard/admin-dashboard';
import { ProductCrudComponent } from './components/product-crud/product-crud';

// Guards
import { AuthGuard } from './guards/auth.guard';
import { AdminGuard } from './guards/admin.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'registro', component: RegistroComponent },
  { path: 'recuperar', component: RecuperarComponent },
  
  // Rutas de Cliente Protegidas
  { path: 'perfil', component: PerfilComponent, canActivate: [AuthGuard] },
  { path: 'catalogo', component: CatalogoComponent, canActivate: [AuthGuard] },
  { path: 'tienda-multiverso', component: CatalogoComponent, canActivate: [AuthGuard] },
  { path: 'carrito', component: CarritoComponent, canActivate: [AuthGuard] },
  { path: 'pago', component: PagoComponent, canActivate: [AuthGuard] },
  { path: 'mis-pedidos', component: MisPedidosComponent, canActivate: [AuthGuard] },
  
  // Rutas de Administrador Protegidas
  { path: 'admin', component: AdminDashboardComponent, canActivate: [AuthGuard, AdminGuard] },
  { path: 'admin/productos', component: ProductCrudComponent, canActivate: [AuthGuard, AdminGuard] },
  
  // Comodines
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
