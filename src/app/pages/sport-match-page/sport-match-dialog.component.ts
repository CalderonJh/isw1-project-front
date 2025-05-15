import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'sport-match-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule
  ],
  template: `
    <h2 mat-dialog-title class="text-center text-xl font-semibold text-[#2e74be] mb-5">
      {{ data ? 'Editar Partido' : 'Nuevo Partido' }}
    </h2>
    <mat-dialog-content class="dialog-content p-5">
      <mat-form-field appearance="outline" class="form-field w-full mb-5">
        <mat-label>Equipo Visitante (ID)</mat-label>
        <input matInput [(ngModel)]="awayClubId" required type="number" />
      </mat-form-field>

      <mat-form-field appearance="outline" class="form-field w-full mb-5">
        <mat-label>Estadio (ID)</mat-label>
        <input matInput [(ngModel)]="stadiumId" required type="number" />
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
  awayClubId!: number;
  stadiumId!: number;
  year!: number;
  season!: number;
  fecha: string = '';
  hora: string = '';

  constructor(
    public dialogRef: MatDialogRef<SportMatchDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
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
