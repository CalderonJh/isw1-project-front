import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importar CommonModule
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SportsMatchesService } from '../../services/sports-matches.service';
import { SportMatchDialog } from './sport-match-dialog.component';
import { Partido } from '../../services/sports-matches.service';
import { forkJoin, map, of } from 'rxjs';


@Component({
  selector: 'app-sport-match-page',
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
  ],
  templateUrl: './sport-match-page.component.html',
  styleUrls: ['./sport-match-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class SportMatchPageComponent {
  partidoForm: FormGroup;
  partidos: Partido[] = [];
  displayedColumns: string[] = ['visitante', 'estadio', 'temporada', 'fecha'];
  apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match/all';

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private sportsMatchesService: SportsMatchesService // Inyectamos el servicio de partidos
  ) {
    this.partidoForm = this.fb.group({
      equipoVisitante: [''],
      estadio: [''],
      inicio: this.fb.group({
        fecha: [''],
        hora: [''],
      }),
    });
  }

  ngOnInit(): void {
    this.loadPartidos();
  }


  loadPartidos() {
    this.sportsMatchesService.getSportsMatches().subscribe((data: Partido[]) => {
      console.log('Datos recibidos:', data);

      const partidoObservables = data.map((partido: Partido) => {
        const visitante$ = this.sportsMatchesService.getClubNameById(partido.awayClubId);

        // Verificar si estadioId está definido antes de hacer la llamada
        const estadio$ = partido.stadiumId
          ? this.sportsMatchesService.getStadiumNameById(partido.stadiumId)
          : of('Estadio no disponible');

        return forkJoin([visitante$, estadio$]).pipe(
          map(([clubName, stadiumName]) => ({
            ...partido,
            visitante: clubName,
            estadio: stadiumName,
            temporada: `${partido.year} - ${partido.season}`,
            // Asegurarse de que la fecha no sea nula
            fecha: partido.matchDate
              ? new Date(partido.matchDate).toLocaleDateString()
              : 'Fecha no disponible',
          }))
        );
      });

      forkJoin(partidoObservables).subscribe((partidosConNombre) => {
        this.partidos = partidosConNombre;
        console.log('Partidos cargados:', this.partidos);  // Verifica si los partidos están bien cargados
      });
    });
  }


  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SportMatchDialog);

    dialogRef.afterClosed().subscribe((result) => {

      if (result) {
        this.createPartido(result);  // Llamar al método para guardar el partido
      }
    });
  }

  createPartido(partidos: any): void {

    // Modificar el objeto para que coincida con el formato esperado
    const partidoToSave = {
      awayClubId: parseInt(partidos.awayClubId, 10),
      stadiumId: parseInt(partidos.estadioId, 10),
      year: partidos.year,
      season: partidos.season,
      // Usamos directamente el toISOString() que ya incluye la zona horaria y los milisegundos
      matchDate: new Date(partidos.matchDate).toISOString(),
    };

    console.log('Datos del partido listos para guardar:', partidoToSave);

    // Llamada al servicio para guardar el partido
    this.sportsMatchesService.createSportsMatch(partidoToSave).subscribe(
      (response) => {
        console.log('Partido guardado exitosamente:', response);
        this.loadPartidos();  // Recargar los partidos
      },
      (error) => {
        console.error('Error al guardar el partido:', error);
      }
    );
  }
}