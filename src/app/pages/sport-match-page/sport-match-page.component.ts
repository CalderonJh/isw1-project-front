import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';  // Asegúrate de importar CommonModule
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SportsMatchesService } from '../../services/sports-matches.service';
import { Partido } from '../../Models/Partido.model';
import { SportMatchDialog } from './sport-match-dialog.component';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-sport-match-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSnackBarModule,
    FormsModule,
  ],
  templateUrl: './sport-match-page.component.html',
  styleUrls: ['./sport-match-page.component.css'],
})
export class SportMatchPageComponent implements OnInit {
  partidos: any[] = [];
  displayedColumns: string[] = ['visitante', 'estadio', 'temporada', 'fecha', 'acciones'];

  // Agregando dataSource y pageSize
  dataSource = new MatTableDataSource<any>(this.partidos);
  pageSize = 10; // Número de partidos por página

   @ViewChild(MatPaginator) paginator: MatPaginator | null = null;


  constructor(
    private router: Router,
    private dialog: MatDialog,
    private sportsMatchesService: SportsMatchesService,
    private snackBar: MatSnackBar
  ) {}

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
          visitante: partido.awayClub?.description || 'Club no encontrado',
          estadio: partido.stadium?.description || 'Estadio no disponible',
          temporada: `${partido.year} - ${partido.season}`,
          fecha: partido.matchDate
            ? new Date(partido.matchDate).toLocaleDateString()
            : 'Fecha no disponible',
        };
      });

      this.dataSource = new MatTableDataSource(this.partidos);
      this.dataSource.paginator = this.paginator;
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
      width: '600px',
      height: 'auto',
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

    const provisionalMatchId = this.generateProvisionalMatchId();

    const partidoToSave = {
      matchId: provisionalMatchId,
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
        this.snackBar.open('Error al guardar partido. Revisa consola para detalles.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      }
    );
  }

  generateProvisionalMatchId(): number {
    return Date.now();
  }

  updatePartido(partido: any): void {
    const matchId = partido.matchId || this.generateProvisionalMatchId();

    const partidoToUpdate: Partido = {
      matchId,
      awayClubId: parseInt(partido.awayClubId, 10),
      stadiumId: parseInt(partido.stadiumId, 10),
      year: parseInt(partido.year, 10),
      season: parseInt(partido.season, 10),
      matchDate: partido.matchDate,
    };

    console.log('Datos a enviar:', partidoToUpdate);

    this.sportsMatchesService.updateSportsMatch(matchId, partidoToUpdate).subscribe(
      () => this.loadPartidos(),
      (error) => {
        console.error('Error al actualizar el partido:', error);
        this.snackBar.open('Error al actualizar el partido. Revisa consola para detalles.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
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
          panelClass: ['snackbar-success'],
        });
      },
      (error) => {
        console.error('Error al eliminar el partido:', error);
        this.snackBar.open('Error al eliminar el partido. Revisa consola para detalles.', 'Cerrar', {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['snackbar-error'],
        });
      }
    );
  }

  pageEvent(event: PageEvent) {
    console.log('Evento de página', event);
  }
}
