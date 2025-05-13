import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'sport-match-dialog',
  template: `
    <h2 mat-dialog-title>Nuevo Partido</h2>
    <mat-dialog-content>
      <mat-form-field>
        <mat-label>Equipo Visitante</mat-label>
        <input matInput [(ngModel)]="equipoVisitante" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Estadio</mat-label>
        <input matInput [(ngModel)]="estadio" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Temporada Año</mat-label>
        <input matInput [(ngModel)]="temporadaAnio" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Temporada Periodo</mat-label>
        <input matInput [(ngModel)]="temporadaPeriodo" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Fecha</mat-label>
        <input matInput [(ngModel)]="fecha" required />
      </mat-form-field>

      <mat-form-field>
        <mat-label>Hora</mat-label>
        <input matInput [(ngModel)]="hora" required />
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button (click)="onSave()">Guardar</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
})

export class DialogOverviewExampleDialog {
  equipoVisitante: string = '';
  estadio: string = '';
  temporadaAnio: string = '';  // Corregido: 'temporalAnio' -> 'temporadaAnio'
  temporadaPeriodo: string = '';  // Corregido: 'temporalPeriodo' -> 'temporadaPeriodo'
  fecha: string = '';
  hora: string = '';

  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
  if (!this.equipoVisitante || !this.estadio || !this.temporadaAnio || !this.temporadaPeriodo || !this.fecha || !this.hora) {
    alert('Por favor, complete todos los campos');
    return;
  }

  // Asignación de datos desde el formulario
  const partido = {
    awayClubId: parseInt(this.equipoVisitante, 10),  // Convertimos 'equipoVisitante' a número
    estadioId: parseInt(this.estadio, 10),  // Convertimos 'estadio' a número
    year: this.temporadaAnio,  // Año de la temporada
    season: this.temporadaPeriodo,  // Temporada
    matchDate: new Date(this.fecha + 'T' + this.hora).toISOString(),  // Concatenamos fecha y hora
  };
  
  // Verifica que los datos estén correctos antes de cerrar el diálogo
  console.log('Datos del partido:', partido);

  this.dialogRef.close(partido); // Cerrar el dialogo y pasar el objeto partido
    }
    
}
