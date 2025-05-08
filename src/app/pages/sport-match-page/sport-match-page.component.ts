import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog'; // Importa MatDialog
import { FormBuilder, FormGroup } from '@angular/forms'; // Importa FormBuilder y FormGroup
import { DialogOverviewExampleDialog } from '..//../components/path-to-dialog/path-to-dialog.component';

@Component({
  selector: 'app-sport-match-page',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './sport-match-page.component.html',
  standalone: true,
  styleUrls: ['./sport-match-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})


export class SportMatchPageComponent {
  partidoForm: FormGroup; // Define el formulario reactivo

  constructor(
    private router: Router,
    private dialog: MatDialog,  // Agrega el servicio MatDialog
    private fb: FormBuilder     // Agrega FormBuilder para crear el formulario reactivo
  ) {
    // Crea el formulario reactivo
    this.partidoForm = this.fb.group({
      equipoVisitante: [''],
      estadio: [''],
      temporada: this.fb.group({
        anio: [''],
        periodo: ['']
      }),
      inicio: this.fb.group({
        fecha: [''],
        hora: ['']
      })
    });
  }

  // Función para ir al inicio
  navigateToHome(): void {
    this.router.navigate(['adminhome']); // Navega a la página principal del admin
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']); // Redirige a la página de login
  }

  // Abre el dialogo del partido
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px',
      data: { name: 'Partido' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      console.log('El diálogo se cerró', result);
    });
  }
}
