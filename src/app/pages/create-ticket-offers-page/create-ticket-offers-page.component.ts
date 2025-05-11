import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';


@Component({
  selector: 'app-create-ticket-offers-page',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './create-ticket-offers-page.component.html',
  standalone: true,
  styleUrl: './create-ticket-offers-page.component.css',
})
export class CreateTicketOffersPageComponent{

  constructor(private router: Router) {}
  navigateToHome(): void {
    this.router.navigate(['adminhome']);
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']);
  }
}
