import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose } from '@angular/material/dialog';

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

export class SportMatchDialog {
  equipoVisitante: string = '';
  estadio: string = '';
  temporadaAnio: string = '';
  temporadaPeriodo: string = '';
  fecha: string = '';
  hora: string = '';

  readonly dialogRef = inject(MatDialogRef<SportMatchDialog>);

  onNoClick(): void {
    this.dialogRef.close();  // Cerrar sin enviar datos
  }

  onSave(): void {
    if (!this.equipoVisitante || !this.estadio || !this.temporadaAnio || !this.temporadaPeriodo || !this.fecha || !this.hora) {
      alert('Por favor, complete todos los campos');
      return;
    }

    // Verificar que la fecha y la hora sean válidas
    const fechaHora = this.fecha + 'T' + this.hora;
    const matchDate = new Date(fechaHora);

    if (isNaN(matchDate.getTime())) {
      alert('La fecha o la hora proporcionada no es válida');
      return;
    }

    // Crear el objeto partido con los datos del formulario
    const partido = {
      awayClubId: parseInt(this.equipoVisitante, 10),
      estadioId: parseInt(this.estadio, 10),
      year: this.temporadaAnio,
      season: this.temporadaPeriodo,
      matchDate: matchDate.toISOString(),  // Guardar la fecha correctamente formateada
    };

    console.log('Datos del partido:', partido);

    // Cerrar el diálogo y pasar el objeto partido al componente principal
    this.dialogRef.close(partido);  // Asegúrate de que este objeto sea pasado correctamente
  }
}