import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard.service';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/admin-home-page/admin-home-page.component').then(
        (m) => m.AdminHomePageComponent,
      ),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'partidos',
    loadComponent: () =>
      import('./pages/sport-match-page/sport-match-page.component').then(
        (m) => m.SportMatchPageComponent,
      ),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'estadios',
    loadComponent: () =>
      import('./pages/stadium-page/stadium-page.component').then(
        (m) => m.StadiumPageComponent,
      ),
    canActivate: [AuthGuard], // Protege esta ruta
  },
  {
    path: 'boletas',
    loadComponent: () =>
      import(
        './pages/view-ticket-page/view-ticket-offers-page.component' // Cambia la ruta según tu estructura de carpetas
      ).then((m) => m.ViewTicketPageComponent),
  },
  {
    path: 'tickets/create',
    loadComponent: () =>
      import(
        './pages/create-ticket-offers-page/create-ticket-offers-page.component'
      ).then((m) => m.CreateTicketOffersPageComponent),
  },


  // Aquí se agregan las rutas del administrador
  {
    path: 'admin/boletas',
    loadComponent: () =>
      import('./pages/view-ticket-page/view-ticket-offers-page.component').then(
        (m) => m.ViewTicketPageComponent
      ),
  },
  {
    path: 'abonos',
    loadComponent: () =>
      import('./pages/abono-page/abono-page.component').then(
        (m) => m.AbonoPageComponent,
      ),
    canActivate: [AuthGuard], // Protege esta ruta
  },
];
