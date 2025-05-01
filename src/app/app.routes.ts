import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-home-page/admin-home-page.component').then(
        (m) => m.AdminHomePageComponent
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent
      ),
  },
  {
    path: 'matches',
    loadComponent: () =>
      import('./pages/sport-match-page/sport-match-page.component').then(
        (m) => m.SportMatchPageComponent
      ),
  },
  {
    path: 'stadiums',
    loadComponent: () =>
      import('./pages/stadium-page/stadium-page.component').then(
        (m) => m.StadiumPageComponent
      ),
  },
  {
    path: 'tickets',
    loadComponent: () =>
      import(
        './pages/view-ticket-offers-page/view-ticket-offers-page.component'
      ).then((m) => m.ViewTicketOffersPageComponent),
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
      import('./pages/view-ticket-offers-page/view-ticket-offers-page.component').then(
        (m) => m.ViewTicketOffersPageComponent
      ),
  },
  {
    path: 'admin/abonos',
    loadComponent: () =>
      import('./pages/abono-page/abono-page.component').then(
        (m) => m.AbonoPageComponent
      ),
  },
  {
    path: 'admin/estadios',
    loadComponent: () =>
      import('./pages/stadium-page/stadium-page.component').then(
        (m) => m.StadiumPageComponent
      ),
  },
  {
    path: 'admin/partidos',
    loadComponent: () =>
      import('./pages/sport-match-page/sport-match-page.component').then(
        (m) => m.SportMatchPageComponent 
      ),
  },
];
