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
  styleUrl: './admin-home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomePageComponent {
  selected: string = ''; // Para gestionar el botón seleccionado

  constructor(private router: Router) {} // Inyectamos el servicio Router

  // Este es el método navigateTo que maneja la navegación
  navigateTo(page: string): void {
    this.selected = page; // Guardamos el valor de la página seleccionada
    this.router.navigate([`/admin/${page}`]); // Navegamos a la página correspondiente
  }
}