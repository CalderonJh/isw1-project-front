import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sport-match-page',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './sport-match-page.component.html',
  standalone: true,
  styleUrls: ['./sport-match-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportMatchPageComponent {
  selected: string = ''; // Para gestionar el botón seleccionado
  isAddFormVisible: boolean = false; // Controla la visibilidad del formulario de agregar partido
  newPartido = { visitante: '', estadio: '', temporada: '', fecha: '' }; // Datos del nuevo partido
  partidos = [
    { visitante: 'Equipo A', estadio: 'Estadio A', temporada: '2023', fecha: '2023-04-01' },
    { visitante: 'Equipo B', estadio: 'Estadio B', temporada: '2023', fecha: '2023-04-02' },
    { visitante: 'Equipo C', estadio: 'Estadio C', temporada: '2023', fecha: '2023-04-03' }
  ];
  displayedColumns: string[] = ['visitante', 'estadio', 'temporada', 'fecha'];

  constructor(private router: Router) {}

  // Abre el formulario de agregar un nuevo partido
  openAddForm(): void {
    this.isAddFormVisible = true;
  }

  // Cierra el formulario sin guardar cambios
  closeAddForm(): void {
    this.isAddFormVisible = false;
    this.newPartido = { visitante: '', estadio: '', temporada: '', fecha: '' }; // Limpiar formulario
  }

  // Agrega el nuevo partido a la lista y cierra el formulario
  addPartido(): void {
    this.partidos.push({ ...this.newPartido }); // Agregar una copia del nuevo partido
    this.closeAddForm(); // Cerrar el formulario
  }

  // Función para ir al inicio
  navigateToHome(): void {
    this.router.navigate(['adminhome']); // Navega a la página principal del admin
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']); // Redirige a la página de login
  }
}
