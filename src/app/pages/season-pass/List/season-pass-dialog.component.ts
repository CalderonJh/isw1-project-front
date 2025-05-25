import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeasonPassWithImage } from '../../../Models/Season-pass.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeasonPassService } from '../../../services/season-pass.service';

import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-season-pass-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  template: `
    <h2 mat-dialog-title>Editar Abono - {{ data.description }}</h2>

    <form [formGroup]="form">
      <mat-dialog-content>
        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Precio</mat-label>
          <input matInput type="number" formControlName="price" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Image ID</mat-label>
          <input matInput formControlName="imageId" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Fecha Inicio</mat-label>
          <input matInput type="date" formControlName="startDate" />
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Fecha Fin</mat-label>
          <input matInput type="date" formControlName="endDate" />
        </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
        <button mat-button type="button" (click)="updatePrice()" [disabled]="!form.valid">Actualizar Precio</button>
        <button mat-button type="button" (click)="updateImage()" [disabled]="!form.valid">Actualizar Imagen</button>
        <button mat-button type="button" (click)="updateDates()" [disabled]="!form.valid">Actualizar Fechas</button>
      </mat-dialog-actions>
    </form>
  `,
  styles: [`
    .full-width {
      width: 100%;
    }

    mat-dialog-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
      min-width: 300px;
    }

    mat-dialog-actions {
      margin-top: 20px;
    }

    button[mat-button] {
      margin-left: 10px;
    }
  `]
})
export class SeasonPassDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SeasonPassDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SeasonPassWithImage,
    private fb: FormBuilder,
    private seasonPassService: SeasonPassService
  ) {
    this.form = this.fb.group({
      price: [null, Validators.required],
      imageId: [data.imageId, Validators.required],
      startDate: [data.offerPeriod.start, Validators.required],
      endDate: [data.offerPeriod.end, Validators.required],
    });
  }

  updatePrice() {
    if (this.form.valid) {
      this.seasonPassService.updatePrice(this.data.id, this.form.value.price).subscribe(() => {
        alert('Precio actualizado');
        this.dialogRef.close('updated');
      });
    }
  }

  updateImage() {
    if (this.form.valid) {
      this.seasonPassService.updateImage(this.data.id, this.form.value.imageId).subscribe(() => {
        alert('Imagen actualizada');
        this.dialogRef.close('updated');
      });
    }
  }

  updateDates() {
    if (this.form.valid) {
      const dates = {
        start: this.form.value.startDate,
        end: this.form.value.endDate
      };
      this.seasonPassService.updateDates(this.data.id, this.data.offerPeriod).subscribe(() => {
        alert('Fechas actualizadas');
        this.dialogRef.close('updated');
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }
}
