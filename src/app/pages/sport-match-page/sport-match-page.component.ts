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
import { DialogOverviewExampleDialog } from './dialog-overview-example-dialog.component';
import { Partido } from './partido.interface';  // Asegúrate de que la ruta sea correcta

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
  partidos: [] = [];
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
    this.loadPartidos(); // Cargar partidos cuando se inicia el componente
  }
  
  loadPartidos() {
  this.sportsMatchesService.getSportsMatches().subscribe((data: any) => {
    console.log('Datos recibidos:', data);
    // Asegúrate de que cada partido tenga un valor válido en 'matchDate'
    this.partidos = data.map((partido: any) => ({
      ...partido,
      visitante: partido.awayClubId,  // Mostrar el ID del equipo visitante
      estadio: partido.estadioId,      // Mostrar el ID del estadio
      temporada: `${partido.year} - ${partido.season}`,  // Mostrar la temporada
      fecha: partido.matchDate ? partido.matchDate.split('T')[0] : 'Fecha no disponible',  // Extraer solo la fecha
    }));
  });
  }


  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('El dialogo fue cerrado');
      if (result) {
        this.createPartido(result); // Crear el partido después de cerrar el dialog
      }
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './ dialog-overview-example-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  standalone: true,
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
