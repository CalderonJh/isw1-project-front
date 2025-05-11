import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'view-ticket-offers-page',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './view-ticket-offers-page.component.html',
  styleUrls: ['./view-ticket-offers-page.component.css']
})

export class ViewTicketOffersPageComponent {

  constructor(private router: Router) {}

  // Función para redirigir a la página de inicio (adminhome)
  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']);
  }

  // Función para redirigir al formulario de creación de oferta
  crearOferta(): void {
    this.router.navigate(['tickets/create']);  // Redirige a la página de creación de oferta
  }
}

