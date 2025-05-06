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

  constructor(private router: Router) {} // Inyectamos el servicio Router

  // Este es el método navigateTo que maneja la navegación
  navigateTo(routes: string): void {
    this.selected = routes; // Guardamos el valor de la página seleccionada
    this.router.navigate([`/adminhome/${routes}`]); // Navegamos a la página correspondiente
  }

  // Función para ir al inicio
  navigateToHome(): void {
    this.router.navigate(['/admin/home']); // Navega a la página principal del admin
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    // Lógica para cerrar sesión, puede incluir eliminación de datos de usuario, redirección a la página de login, etc.
    this.router.navigate(['/login']); // Redirige a la página de login
  }
}
