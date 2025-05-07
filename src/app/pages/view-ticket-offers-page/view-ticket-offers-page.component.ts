import { Router } from '@angular/router';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { FormBuilder, FormGroup } from '@angular/forms'; // Importa FormBuilder y FormGroup


@Component({
  selector: 'view-ticket-offers-page',
  standalone: true,
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './view-ticket-offers-page.component.html',
  styleUrls: ['./view-ticket-offers-page.component.css']
})
export class ViewTicketOffersPageComponent {





  
  constructor(private router: Router) {}
  // Función para ir al inicio
  navigateToHome(): void {
    this.router.navigate(['adminhome']); // Navega a la página principal del admin
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']); // Redirige a la página de login
  }

}
