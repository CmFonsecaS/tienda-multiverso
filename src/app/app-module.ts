import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing-module';
import { App } from './app';

// Componentes
import { NavbarComponent } from './components/navbar/navbar';
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

// Pipes
import { FormatearPrecioPipe } from './pipes/formatear-precio.pipe';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    LoginComponent,
    RegistroComponent,
    RecuperarComponent,
    PerfilComponent,
    CatalogoComponent,
    CarritoComponent,
    PagoComponent,
    MisPedidosComponent,
    AdminDashboardComponent,
    ProductCrudComponent,
    FormatearPrecioPipe
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners(),
  ],
  bootstrap: [App]
})
export class AppModule { }
