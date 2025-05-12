import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'stadium-dialog',
  standalone: true,
  template: `
    <h2 mat-dialog-title>Agregar Estadio</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Nombre del Estadio</mat-label>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
      <input type="file" (change)="onFileSelected($event)" accept="image/*">
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
export class StadiumDialog {
  constructor(
    public dialogRef: MatDialogRef<StadiumDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.data.image = file;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
