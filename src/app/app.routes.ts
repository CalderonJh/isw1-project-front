import { Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { SportsMatchesComponent } from './sports-matches/sports-matches.component';
import { StadiumsComponent } from './stadiums/stadiums.component';
import { SubscriptionOffersComponent } from './subscription-offers/subscription-offers.component';
import { TicketsComponent } from './tickets/tickets.component';
import { TribunesComponent } from './tribunes/tribunes.component';

export const routes: Routes = [
  { path: '', component: AdminDashboardComponent },
  { path: 'sports-matches', component: SportsMatchesComponent },
  { path: 'stadiums', component: StadiumsComponent },
  { path: 'subscription-offers', component: SubscriptionOffersComponent },
  { path: 'tickets', component: TicketsComponent },
  { path: 'tribunes', component: TribunesComponent },
];
