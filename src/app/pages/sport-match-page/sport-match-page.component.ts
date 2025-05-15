import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SportsMatchesService, Partido } from '../../services/sports-matches.service';
import { SportMatchDialog } from './sport-match-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sport-match-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: './sport-match-page.component.html',
  styleUrls: ['./sport-match-page.component.css'],
})
export class SportMatchPageComponent {
  partidos: any[] = [];
  displayedColumns: string[] = ['visitante', 'estadio', 'temporada', 'fecha', 'acciones'];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private sportsMatchesService: SportsMatchesService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loadPartidos();
  }

  loadPartidos() {
    this.sportsMatchesService.getSportsMatches().subscribe((data: any[]) => {
      if (!data || data.length === 0) {
        this.partidos = [];
        return;
      }

      // Procesamos los partidos y asignamos directamente los valores de nombre del club y estadio
      this.partidos = data.map((partido: any) => {
        return {
          ...partido,
          visitante: partido.awayClub?.description || 'Club no encontrado', // Usar directamente la descripción
          estadio: partido.stadium?.description || 'Estadio no disponible', // Usar directamente la descripción
          temporada: `${partido.year} - ${partido.season}`,
          fecha: partido.matchDate
            ? new Date(partido.matchDate).toLocaleDateString()
            : 'Fecha no disponible',
        };
      });
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  openDialog(partidoToEdit?: any): void {
    const dialogRef = this.dialog.open(SportMatchDialog, {
      width: '600px',  // Ajusta el tamaño del ancho
      height: 'auto',  // Ajusta la altura automáticamente
      data: partidoToEdit ? { ...partidoToEdit } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (result.matchId) {
          this.updatePartido(result);
        } else {
          this.createPartido(result);
        }
      }
    });
  }

  createPartido(partido: any): void {
    const awayClubId = Number(partido.awayClubId);
    const stadiumId = Number(partido.stadiumId);
    const year = Number(partido.year);
    const season = Number(partido.season);
    const matchDate = partido.matchDate;

    // Generar un matchId provisional si no existe
    const provisionalMatchId = this.generateProvisionalMatchId();

    const partidoToSave = {
      matchId: provisionalMatchId,  // aquí agregas el matchId que se requiere
      awayClubId,
      stadiumId,
      year,
      season,
      matchDate,
    };

    console.log('Payload a enviar:', partidoToSave);

    this.sportsMatchesService.createSportsMatch(partidoToSave).subscribe(
      () => this.loadPartidos(),
      (error) => {
        console.error('Error al guardar el partido:', error);
        if (error.error && error.error.errors) {
          console.error('Detalles del error:', error.error.errors);
        }
        this.snackBar.open('Error al guardar partido. Revisa consola para detalles.', 'Cerrar', {
          duration: 5000,  // Duración en milisegundos
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'] // clase CSS para personalizar el color
        });
      }
    );
  }

  // Método para generar un ID provisional (ejemplo simple)
  generateProvisionalMatchId(): number {
    // Puedes usar timestamp o un contador local (según tu lógica)
    return Date.now();  // número único basado en timestamp
  }


  updatePartido(partido: any): void {
    // Verificar si el partido tiene matchId, si no, se genera uno provisional
    const matchId = partido.matchId || this.generateProvisionalMatchId();  // Si no tiene matchId, se genera uno provisional

    const partidoToUpdate: Partido = {
      matchId,  // Ahora incluye el matchId en el objeto
      awayClubId: parseInt(partido.awayClubId, 10),
      stadiumId: parseInt(partido.stadiumId, 10),
      year: parseInt(partido.year, 10),
      season: parseInt(partido.season, 10),
      matchDate: partido.matchDate,
    };

    console.log('Datos a enviar:', partidoToUpdate); // Verifica en consola los datos que se enviarán

    this.sportsMatchesService.updateSportsMatch(matchId, partidoToUpdate).subscribe(
      () => this.loadPartidos(),
      (error) => {
        console.error('Error al actualizar el partido:', error);
        if (error.error && error.error.errors) {
          console.error('Detalles del error:', error.error.errors);
        }
        this.snackBar.open('Error al actualizar el partido. Revisa consola para detalles.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    );
  }

  deletePartido(matchId: number): void {
    if (!confirm('¿Estás seguro que deseas eliminar este partido?')) return;

    this.sportsMatchesService.deleteSportsMatch(matchId).subscribe(
      () => {
        this.loadPartidos();
        this.snackBar.open('Partido eliminado exitosamente.', 'Cerrar', {
          duration: 3000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-success']
        });
      },
      (error) => {
        console.error('Error al eliminar el partido:', error);
        this.snackBar.open('Error al eliminar el partido. Revisa consola para detalles.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error']
        });
      }
    );
  }
}
