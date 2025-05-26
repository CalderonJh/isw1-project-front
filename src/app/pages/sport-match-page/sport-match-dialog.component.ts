import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';  // Agregar MatSelectModule
import { MatOptionModule } from '@angular/material/core';  // Agregar MatOptionModule
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, NativeDateAdapter, DateAdapter, MAT_DATE_LOCALE, MAT_DATE_FORMATS, MAT_NATIVE_DATE_FORMATS } from '@angular/material/core';
import { SportsMatchesService } from '../../services/sports-matches.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'sport-match-dialog',
  standalone: true,
  imports: [
    MatSnackBarModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: DateAdapter, useClass: NativeDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: MAT_NATIVE_DATE_FORMATS },
  ],
  template: `
<h2 mat-dialog-title class="text-center text-xl font-semibold text-[#2e74be] mb-5">
  {{ data ? 'Editar Partido' : 'Nuevo Partido' }}
</h2>

<mat-dialog-content class="dialog-content p-5">
  <div class="form-row">
    <mat-form-field appearance="outline" class="form-field mb-5">
      <mat-label>Equipo Visitante</mat-label>
      <mat-select [(ngModel)]="awayClubId" required>
        <mat-option *ngFor="let club of clubs$ | async" [value]="club.id">
          {{ club.shortName }}
        </mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field appearance="outline" class="form-field mb-5">
      <mat-label>Estadio</mat-label>
      <mat-select [(ngModel)]="stadiumId" required>
        <mat-option *ngFor="let stadium of stadiums$ | async" [value]="stadium.id">
          {{ stadium.name }}
        </mat-option>
      </mat-select>
    </mat-form-field>
  </div>

  <div class="form-row">
    <mat-form-field appearance="outline" class="form-field mb-5">
      <mat-label>Año</mat-label>
      <input matInput [(ngModel)]="year" required type="number" />
    </mat-form-field>

    <mat-form-field appearance="outline" class="form-field mb-5">
      <mat-label>Temporada (periodo)</mat-label>
      <input matInput [(ngModel)]="season" required type="number" />
    </mat-form-field>
  </div>

  <div class="form-row">
    <mat-form-field appearance="outline" class="form-field mb-5">
      <mat-label>Fecha</mat-label>
      <input matInput [matDatepicker]="picker" [(ngModel)]="fecha" [min]="minDate" required>
      <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
      <mat-datepicker #picker></mat-datepicker>
    </mat-form-field>


    <mat-form-field appearance="outline" class="form-field mb-5">
      <mat-label>Hora</mat-label>
      <input matInput [(ngModel)]="hora" type="time" />
    </mat-form-field>
  </div>

</mat-dialog-content>

<mat-dialog-actions class="flex justify-end p-4 bg-[#f9f9f9]">
  <button mat-button (click)="onNoClick()">Cancelar</button>
  <button mat-button color="primary" (click)="onSave()">Guardar</button>
</mat-dialog-actions>
  `,
  styles: [`
.form-row {
  display: flex;
  justify-content: space-between;
  gap: 16px; /* Espacio entre las columnas */
}

.form-field {
  flex: 1;
  min-width: 200px; /* Asegura que cada campo tenga un tamaño mínimo */
}

.mat-dialog-content {
  display: flex;
  flex-direction: column;
}

.snackbar-error {
  background-color: #f44336; /* rojo para error */
  color: white;
}
  `],
})
export class SportMatchDialog implements OnInit {
  clubs$: Observable<any[]> = of([]);  // Observable para los clubes
  stadiums$: Observable<any[]> = of([]); // Observable para los estadios
  minDate: Date = new Date();

  awayClubId!: number;
  stadiumId!: number;
  year!: number;
  season!: number;
  fecha: Date | null = null;
  hora: string = '';

  constructor(
    public dialogRef: MatDialogRef<SportMatchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sportsMatchesService: SportsMatchesService,  // Servicio para obtener clubes y estadios
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // Cargar los clubes y estadios
    // Verificar los datos antes de asignarlos
    this.clubs$ = this.sportsMatchesService.getClubs();
    this.stadiums$ = this.sportsMatchesService.getStadiums();

    this.clubs$.subscribe(clubs => {
      console.log('Clubs:', clubs);  // Verifica qué datos llegan
    });

    this.stadiums$.subscribe(stadiums => {
      console.log('Stadiums:', stadiums);  // Verifica qué datos llegan
    });

    // Si estamos editando un partido, cargar los datos en los campos
    if (this.data) {
      this.awayClubId = this.data.awayClub?.id || this.data.awayClubId;
      this.stadiumId = this.data.stadium?.id || this.data.stadiumId;
      this.year = this.data.year;
      this.season = this.data.season;

      if (this.data.matchDate) {
        this.fecha = new Date(this.data.matchDate);
        const dt = this.fecha;
        this.hora = dt.toISOString().slice(11, 16);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.awayClubId || !this.stadiumId || !this.year || !this.season) {
      this.snackBar.open('Por favor, complete todos los campos obligatorios.', 'Cerrar', {
        duration: 3000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
        panelClass: ['snackbar-error'] // Puedes personalizar el estilo con esta clase
      });
      return;
    }

    let matchDateISO: string | null = null;
    if (this.fecha) {
      const year = this.fecha.getFullYear();
      const month = String(this.fecha.getMonth() + 1).padStart(2, '0');
      const day = String(this.fecha.getDate()).padStart(2, '0');
      const horaParte = this.hora ? this.hora : '00:00';
      matchDateISO = `${year}-${month}-${day}T${horaParte}:00`;
    }

    const partidoToReturn = {
      matchId: this.data?.matchId,
      awayClubId: this.awayClubId,
      stadiumId: this.stadiumId,
      year: this.year,
      season: this.season,
      matchDate: matchDateISO,
    };

    this.dialogRef.close(partidoToReturn);
  }
}
