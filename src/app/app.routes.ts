import { Routes } from '@angular/router';
import { AuthGuard } from './services/auth.guard.service'; // Asegúrate que la ruta sea correcta

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'adminhome',
    loadComponent: () =>
      import('./pages/admin-home-page/admin-home-page.component').then(
        (m) => m.AdminHomePageComponent
      ),
      canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'matches',
    loadComponent: () =>
      import('./pages/sport-match-page/sport-match-page.component').then(
        (m) => m.SportMatchPageComponent
      ),
      canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'stadiums',
    loadComponent: () =>
      import('./pages/stadium-page/stadium-page.component').then(
        (m) => m.StadiumPageComponent
      ),
      canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import(
        './pages/view-ticket-offers-page/view-ticket-offers-page.component'
      ).then((m) => m.ViewTicketOffersPageComponent),
      canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'tickets/create',
    loadComponent: () =>
      import(
        './pages/create-ticket-offers-page/create-ticket-offers-page.component'
      ).then((m) => m.CreateTicketOffersPageComponent),
      canActivate: [AuthGuard] // Protege esta ruta
  },
  {
    path: 'abono',
    loadComponent: () =>
      import(
        './pages/abono-page/abono-page.component'
      ).then((m) => m.AbonoPageComponent),
      canActivate: [AuthGuard] // Protege esta ruta
  },

  // Aquí se agregan las rutas del administrador
  {
    path: 'adminhome/boletas',
    loadComponent: () =>
      import('./pages/view-ticket-offers-page/view-ticket-offers-page.component').then(
        (m) => m.ViewTicketOffersPageComponent
      ),
  },
  {
    path: 'adminhome/abonos',
    loadComponent: () =>
      import('./pages/abono-page/abono-page.component').then(
        (m) => m.AbonoPageComponent
      ),
  },
  {
    path: 'adminhome/estadios',
    loadComponent: () =>
      import('./pages/stadium-page/stadium-page.component').then(
        (m) => m.StadiumPageComponent
      ),
  },
  {
    path: 'adminhome/partidos',
    loadComponent: () =>
      import('./pages/sport-match-page/sport-match-page.component').then(
        (m) => m.SportMatchPageComponent 
      ),
  },
];
