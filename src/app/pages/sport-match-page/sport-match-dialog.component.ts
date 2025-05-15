import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';  // Agregar MatSelectModule
import { MatOptionModule } from '@angular/material/core';  // Agregar MatOptionModule
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { SportsMatchesService } from '../../services/sports-matches.service';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'sport-match-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,         // Importa CommonModule 
    MatSelectModule,      // Para mat-select
    MatOptionModule      // Para mat-option
  ],
  template: `
    <h2 mat-dialog-title class="text-center text-xl font-semibold text-[#2e74be] mb-5">
      {{ data ? 'Editar Partido' : 'Nuevo Partido' }}
    </h2>
    <mat-dialog-content class="dialog-content p-5">
      
      <mat-form-field appearance="outline" class="form-field w-full mb-5">
  <mat-label>Equipo Visitante</mat-label>
  <mat-select [(ngModel)]="awayClubId" required>
    <mat-option *ngFor="let club of clubs$ | async" [value]="club.id">
      {{ club.shortName }} <!-- Cambia description a shortName -->
    </mat-option>
  </mat-select>
</mat-form-field>

<mat-form-field appearance="outline" class="form-field w-full mb-5">
  <mat-label>Estadio</mat-label>
  <mat-select [(ngModel)]="stadiumId" required>
    <mat-option *ngFor="let stadium of stadiums$ | async" [value]="stadium.id">
      {{ stadium.name }} <!-- Cambia description a name -->
    </mat-option>
  </mat-select>
</mat-form-field>

      <mat-form-field appearance="outline" class="form-field w-full mb-5">
        <mat-label>Año</mat-label>
        <input matInput [(ngModel)]="year" required type="number" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field w-full mb-5">
        <mat-label>Temporada (periodo)</mat-label>
        <input matInput [(ngModel)]="season" required type="number" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field w-full mb-5">
        <mat-label>Fecha</mat-label>
        <input matInput [(ngModel)]="fecha" type="date" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field w-full mb-5">
        <mat-label>Hora</mat-label>
        <input matInput [(ngModel)]="hora" type="time" />
      </mat-form-field>

    </mat-dialog-content>

    <mat-dialog-actions class="flex justify-end p-4 bg-[#f9f9f9]">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button color="primary" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `,
})
export class SportMatchDialog implements OnInit {
  clubs$: Observable<any[]> = of([]);  // Observable para los clubes
  stadiums$: Observable<any[]> = of([]); // Observable para los estadios

  awayClubId!: number;
  stadiumId!: number;
  year!: number;
  season!: number;
  fecha: string = '';
  hora: string = '';

  constructor(
    public dialogRef: MatDialogRef<SportMatchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private sportsMatchesService: SportsMatchesService  // Servicio para obtener clubes y estadios
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
        const dt = new Date(this.data.matchDate);
        this.fecha = dt.toISOString().slice(0, 10);
        this.hora = dt.toISOString().slice(11, 16);
      }
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (!this.awayClubId || !this.stadiumId || !this.year || !this.season) {
      alert('Por favor, complete todos los campos obligatorios.');
      return;
    }

    let matchDateISO: string | null = null;
    if (this.fecha) {
      const horaParte = this.hora ? this.hora : '00:00';
      matchDateISO = `${this.fecha}T${horaParte}:00`;  // Sin toISOString ni Z
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
