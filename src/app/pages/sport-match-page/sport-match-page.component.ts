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
import { forkJoin, map, of } from 'rxjs';

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
    private sportsMatchesService: SportsMatchesService
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

      const partidoObservables = data.map((partido: any) => {
        const awayClubId = partido.awayClub?.id;
        const stadiumId = partido.stadium?.id;

        const visitante$ = awayClubId
          ? this.sportsMatchesService.getClubNameById(awayClubId)
          : of('Club no encontrado');

        const estadio$ = stadiumId
          ? this.sportsMatchesService.getStadiumNameById(stadiumId)
          : of('Estadio no disponible');

        return forkJoin([visitante$, estadio$]).pipe(
          map(([clubName, stadiumName]) => ({
            ...partido,
            visitante: clubName,
            estadio: stadiumName,
            temporada: `${partido.year} - ${partido.season}`,
            fecha: partido.matchDate
              ? new Date(partido.matchDate).toLocaleDateString()
              : 'Fecha no disponible',
          }))
        );
      });

      forkJoin(partidoObservables).subscribe((partidosConNombre) => {
        this.partidos = partidosConNombre;
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
      width: '400px',
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

    if (!awayClubId || !stadiumId || !year || !season) {
      alert('Por favor complete todos los campos obligatorios correctamente');
      return;
    }

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
        alert('Error al guardar partido. Revisa consola para detalles.');
      }
    );
  }

  // Método para generar un ID provisional (ejemplo simple)
  generateProvisionalMatchId(): number {
    // Puedes usar timestamp o un contador local (según tu lógica)
    return Date.now();  // número único basado en timestamp
  }



  updatePartido(partido: any): void {
    const partidoToUpdate: Partido = {
      awayClubId: parseInt(partido.awayClubId, 10),
      stadiumId: parseInt(partido.stadiumId, 10),
      year: parseInt(partido.year, 10),
      season: parseInt(partido.season, 10),
      matchDate: partido.matchDate,
    };

    this.sportsMatchesService.updateSportsMatch(partido.matchId, partidoToUpdate).subscribe(
      () => this.loadPartidos(),
      (error) => console.error('Error al actualizar el partido:', error)
    );
  }

  deletePartido(matchId: number): void {
    if (!confirm('¿Estás seguro que deseas eliminar este partido?')) return;

    this.sportsMatchesService.deleteSportsMatch(matchId).subscribe(
      () => this.loadPartidos(),
      (error) => console.error('Error al eliminar el partido:', error)
    );
  }
}
