import { Component, Inject } from '@angular/core';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'view-ticket-offers-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ],
  template: `
    <h2 mat-dialog-title>Editar Boleta</h2>

    <mat-dialog-content class="dialog-content">

      <div class="image-upload" style="text-align: center;">
        <input type="file" (change)="onFileSelected($event)" accept="image/*" />
        <div *ngIf="previewImage" class="preview-container" style="margin-top: 8px; display: inline-block;">
          <img [src]="previewImage" alt="Preview" class="preview-image" style="max-width: 100%; max-height: 150px; border-radius: 4px;" />
        </div>
      </div>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Fecha inicio de venta</mat-label>
        <input matInput [matDatepicker]="pickerStart" [(ngModel)]="dates.start" />
        <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
        <mat-datepicker #pickerStart></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Fecha fin de venta</mat-label>
        <input matInput [matDatepicker]="pickerEnd" [(ngModel)]="dates.end" />
        <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
        <mat-datepicker #pickerEnd></mat-datepicker>
      </mat-form-field>

    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button color="primary" (click)="save()">Guardar</button>
    </mat-dialog-actions>
  `,
  styles: [`
    .full-width {
      width: 100%;
      margin-bottom: 12px;
    }
    .image-upload {
      margin-bottom: 20px;
    }
    .preview-container {
      margin-top: 8px;
    }
    .preview-image {
      max-width: 100%;
      max-height: 150px;
      border-radius: 4px;
    }
  `],
})
export class ViewTicketOffersDialog {
  previewImage: string | ArrayBuffer | null = null;
  selectedImageFile?: File;

  dates = { start: null as Date | null, end: null as Date | null };

  constructor(
    public dialogRef: MatDialogRef<ViewTicketOffersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.dates.start = data.dates?.start ? new Date(data.dates.start) : null;
    this.dates.end = data.dates?.end ? new Date(data.dates.end) : null;
    if (data.imageUrl) {
      this.previewImage = data.imageUrl;
    }
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
      const reader = new FileReader();
      reader.onload = e => this.previewImage = e.target?.result as string | ArrayBuffer | null;
      reader.readAsDataURL(file);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  save(): void {
    this.dialogRef.close({
      dates: {
        start: this.dates.start ? this.dates.start.toISOString() : null,
        end: this.dates.end ? this.dates.end.toISOString() : null,
      },
      imageFile: this.selectedImageFile,
    });
  }
}
