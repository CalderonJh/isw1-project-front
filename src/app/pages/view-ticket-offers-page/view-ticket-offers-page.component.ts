import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view-ticket-offers-page',
  templateUrl: './view-ticket-offers-page.component.html',
  styleUrls: ['./view-ticket-offers-page.component.css']
})
export class ViewTicketOffersPageComponent {

  constructor(private router: Router) {}

  // Función para navegar programáticamente a "admin/boletas"
  navigateToBoletas(): void {
    this.router.navigate(['/admin/boletas']);
  }
}
