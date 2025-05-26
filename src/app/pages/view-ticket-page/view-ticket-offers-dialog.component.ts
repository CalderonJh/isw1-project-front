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
    MatNativeDateModule
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-CO' }
  ],
  template: `
    <mat-dialog-content class="dialog-content" style="min-width: 400px;">
      <div class="image-upload" style="text-align: center; margin-bottom: 12px;">
        <label>Imagen:</label><br />
        <input type="file" (change)="onFileSelected($event)" accept="image/*" />
        <div *ngIf="previewImage" class="preview-container" style="margin-top: 8px; display: inline-block;">
          <img
            [src]="previewImage"
            alt="Preview"
            class="preview-image"
            style="max-width: 100%; max-height: 150px; border-radius: 4px;"
          />
        </div>
      </div>

      <!-- Fecha y Hora Inicio -->
      <mat-form-field appearance="fill" class="full-width" style="display: inline-block; width: 48%; margin-right: 4%;">
        <mat-label>Fecha inicio de venta</mat-label>
        <input matInput type="date" [(ngModel)]="dateStart" />
      </mat-form-field>
      
      <!-- Fecha y Hora Fin -->
      <mat-form-field appearance="fill" class="full-width" style="display: inline-block; width: 48%; margin-right: 4%;">
        <mat-label>Fecha fin de venta</mat-label>
        <input matInput type="date" [(ngModel)]="dateEnd" />
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
    .preview-image {
      max-width: 100%;
      max-height: 150px;
      border-radius: 4px;
    }
  `]
})

export class ViewTicketOffersDialog {

  previewImage: string | ArrayBuffer | null = null;
  selectedImageFile?: File;

  dateStart: Date | null = null;
  timeStart: string = '00:00';

  dateEnd: Date | null = null;
  timeEnd: string = '00:00';

  constructor(
    public dialogRef: MatDialogRef<ViewTicketOffersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    if (data.imageUrl) {
      this.previewImage = data.imageUrl;
    }

    if (data.dates?.start) {
      const startDate = new Date(data.dates.start);
      this.dateStart = startDate;
      this.timeStart = this.formatTime(startDate);
    }

    if (data.dates?.end) {
      const endDate = new Date(data.dates.end);
      this.dateEnd = endDate;
      this.timeEnd = this.formatTime(endDate);
    }
  }

  formatTime(date: Date): string {
    const h = date.getHours().toString().padStart(2, '0');
    const m = date.getMinutes().toString().padStart(2, '0');
    return `${h}:${m}`;
  }

  combineDateTime(date: Date | null, time: string): string | null {
    if (!date) return null;
    const [hours, minutes] = time.split(':').map(Number);
    const combined = new Date(Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      hours,
      minutes,
      0,
      0
    ));
    return combined.toISOString();
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
        start: this.combineDateTime(this.dateStart, this.timeStart),
        end: this.combineDateTime(this.dateEnd, this.timeEnd),
      },
      imageFile: this.selectedImageFile || null,
    });
  }
}
