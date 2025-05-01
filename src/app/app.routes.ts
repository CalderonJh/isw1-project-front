import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/admin-home-page/admin-home-page.component').then(
        (m) => m.AdminHomePageComponent,
      ),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login-page/login-page.component').then(
        (m) => m.LoginPageComponent,
      ),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register-page/register-page.component').then(
        (m) => m.RegisterPageComponent,
      ),
  },
  {
    path: 'matches',
    loadComponent: () =>
      import('./pages/sport-match-page/sport-match-page.component').then(
        (m) => m.SportMatchPageComponent,
      ),
  },
  {
    path: 'favorite',
    loadComponent: () =>
      import('./pages/favorite-team-page/favorite-team-page.component').then(
        (m) => m.FavoriteTeamPageComponent,
      ),
  },
  {
    path: 'stadiums',
    loadComponent: () =>
      import('./pages/stadium-page/stadium-page.component').then(
        (m) => m.StadiumPageComponent,
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
];
