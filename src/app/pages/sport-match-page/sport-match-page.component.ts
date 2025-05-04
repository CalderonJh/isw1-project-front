import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';  // Importante para los botones de mat-icon-button
import { MatToolbarModule } from '@angular/material/toolbar';  // Para la barra de herramientas
import { Router } from '@angular/router';

@Component({
  selector: 'app-sport-match-page',
  imports: [MatTableModule,MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './sport-match-page.component.html',
  standalone: true,
  styleUrl: './sport-match-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SportMatchPageComponent {
  selected: string = ''; // Para gestionar el botón seleccionado

  constructor(private router: Router) {} // Inyectamos el servicio Router

  // Este es el método navigateTo que maneja la navegación
  navigateTo(page: string): void {
    this.selected = page; // Guardamos el valor de la página seleccionada
    this.router.navigate([`/admin/${page}`]); // Navegamos a la página correspondiente
  }

  // Función para ir al inicio
  navigateToHome(): void {
    this.router.navigate(['']); // Navega a la página principal del admin
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    // Lógica para cerrar sesión, puede incluir eliminación de datos de usuario, redirección a la página de login, etc.
    this.router.navigate(['/login']); // Redirige a la página de login
  }


    // Datos de los partidos
    partidos = [
      { visitante: 'Equipo A', estadio: 'Estadio A', temporada: '2023', fecha: '2023-04-01' },
      { visitante: 'Equipo B', estadio: 'Estadio B', temporada: '2023', fecha: '2023-04-02' },
      { visitante: 'Equipo C', estadio: 'Estadio C', temporada: '2023', fecha: '2023-04-03' }
    ];
  
    displayedColumns: string[] = ['visitante', 'estadio', 'temporada', 'fecha'];
}