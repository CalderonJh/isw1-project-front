import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'tribuna-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Agregar Tribuna</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Nombre de la Tribuna</mat-label>
        <input matInput [(ngModel)]="data.nombre" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Capacidad</mat-label>
        <input matInput type="number" [(ngModel)]="data.capacidad" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="data">Agregar</button>
    </mat-dialog-actions>
  `,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class TribunaDialog {
  constructor(
    public dialogRef: MatDialogRef<TribunaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
