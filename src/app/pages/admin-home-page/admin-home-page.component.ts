import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';  // Para los botones
import { MatToolbarModule } from '@angular/material/toolbar';  // Para la barra de herramientas
import { MatIconModule } from '@angular/material/icon';  // Para los íconos
import { CommonModule } from '@angular/common'; // Importa CommonModule


@Component({
  selector: 'app-admin-home-page',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatToolbarModule, MatIconModule,  CommonModule],
  templateUrl: './admin-home-page.component.html',
  standalone: true,
  styleUrls: ['./admin-home-page.component.css'], // Cambié "styleUrl" por "styleUrls" (es el nombre correcto)
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AdminHomePageComponent {
  selected: string = ''; // Para gestionar el botón seleccionado
  canActivate: boolean = true; // Inicialización de la propiedad

  constructor(private router: Router) {}

  // Este es el método navigateTo que maneja la navegación
  navigateTo(routes: string): void {
    this.selected = routes; // Guardamos el valor de la página seleccionada
    this.router.navigate([`/${routes}`]); // Navegamos a la página correspondiente
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    // Lógica para cerrar sesión, puede incluir eliminación de datos de usuario, redirección a la página de login, etc.
    this.router.navigate(['']); // Redirige a la página de login
  }
}
