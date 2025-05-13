import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
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
import { forkJoin, map } from 'rxjs';


@Component({
  selector: 'app-sport-match-page',
  imports: [
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

  loadPartidos() {
    this.sportsMatchesService.getSportsMatches().subscribe((data: Partido[]) => {
      console.log('Datos recibidos:', data);

      const partidoObservables = data.map((partido: Partido) => {
        const visitante$ = this.sportsMatchesService.getClubNameById(partido.awayClubId);
        const estadio$ = this.sportsMatchesService.getStadiumNameById(partido.estadioId);

        return forkJoin([visitante$, estadio$]).pipe(
          map(([clubName, stadiumName]) => ({
            ...partido,
            visitante: clubName,  // Asignar el nombre del club
            estadio: stadiumName, // Asignar el nombre del estadio
            temporada: `${partido.year} - ${partido.season}`,
            fecha: partido.matchDate ? new Date(partido.matchDate).toLocaleDateString() : 'Fecha no disponible',
          }))
        );
      });

      // Espera a que todos los observables terminen antes de actualizar la lista de partidos
      forkJoin(partidoObservables).subscribe((partidosConNombre) => {
        this.partidos = partidosConNombre;
      });
    });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(SportMatchDialog);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.createPartido(result);
      }
    });
  }

  createPartido(partido: any): void {
    console.log('Nuevo partido creado:', partido);
  }

  ngOnInit(): void {
    this.loadPartidos();
  }
}