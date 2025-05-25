import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeasonPassWithImage } from '../../../../Models/Season-pass.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeasonPassService } from '../../../../services/season-pass.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StandPriceComponent } from "../../../../components/stand-price-component/stand-price.component";
import { forkJoin } from 'rxjs';
import { SafeUrl } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'season-pass-dialog',
  imports: [
    CommonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
  ],
  providers: [MatNativeDateModule],
  template: `
    <h2 mat-dialog-title>Editar fechas de venta</h2>

    <form [formGroup]="form" (ngSubmit)="saveChanges()">
      <mat-dialog-content class="content-container">
          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Fecha Inicio</mat-label>
            <input
              matInput
              [matDatepicker]="pickerStart"
              formControlName="startDate"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="pickerStart"
            ></mat-datepicker-toggle>
            <mat-datepicker #pickerStart></mat-datepicker>
          </mat-form-field>

          <mat-form-field appearance="fill" class="full-width">
            <mat-label>Fecha Fin</mat-label>
            <input
              matInput
              [matDatepicker]="pickerEnd"
              formControlName="endDate"
            />
            <mat-datepicker-toggle
              matSuffix
              [for]="pickerEnd"
            ></mat-datepicker-toggle>
            <mat-datepicker #pickerEnd></mat-datepicker>
          </mat-form-field>
      </mat-dialog-content>

      <mat-dialog-actions align="end">
        <button mat-button type="button" (click)="cancel()">Cancelar</button>
        <button
          mat-button
          color="primary"
          type="submit"
          [disabled]="!form.valid"
        >
          Guardar cambios
        </button>
      </mat-dialog-actions>
    </form>
  `,
  standalone: true,
  styles: [],
})
export class SeasonPassDatesDialogComponent {
  form: FormGroup;
  stands: any; // Se inicializa en el constructor

  // Variable para guardar precios por tribunas desde el componente app-stand-price
  tribunePrices: any;

  constructor(
    private dialogRef: MatDialogRef<SeasonPassDatesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SeasonPassWithImage,
    private fb: FormBuilder,
    private seasonPassService: SeasonPassService,
  ) {
    this.form = this.fb.group({
      price: [null, Validators.required],
      imageId: [data.imageId, Validators.required],
      startDate: [data.offerPeriod.start, Validators.required],
      endDate: [data.offerPeriod.end, Validators.required],
    });
    this.stands = []; // Inicialización segura aquí
  }

  currentImageUrl: SafeUrl | null = null;

  ngOnInit() {
    this.currentImageUrl = this.data.imageUrl || null;
  }

  saveChanges() {
    if (!this.form.valid) {
      return;
    }

    const observables = [];

    // Comparar y actualizar fechas si cambiaron
    const startDateForm = new Date(this.form.value.startDate).toISOString();
    const endDateForm = new Date(this.form.value.endDate).toISOString();

    if (
      startDateForm !== this.data.offerPeriod.start ||
      endDateForm !== this.data.offerPeriod.end
    ) {
      const datesPayload = { start: startDateForm, end: endDateForm };
      observables.push(
        this.seasonPassService.updateDates(this.data.id, datesPayload),
      );
    }

    forkJoin(observables).subscribe({
      next: () => {
        alert('Cambios guardados correctamente');
        this.dialogRef.close('updated');
      },
      error: (error) => {
        alert('Error al guardar los cambios');
        console.error(error);
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
