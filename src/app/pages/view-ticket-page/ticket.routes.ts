import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./view-ticket-offers-page.component').then(
        (m) => m.ViewTicketPageComponent,
      ),
  },
  {
    path: 'create',
    loadComponent: () =>
      import(
        '../create-ticket-offers-page/create-ticket-offers-page.component'
      ).then((m) => m.CreateTicketOffersPageComponent),
  },
];
