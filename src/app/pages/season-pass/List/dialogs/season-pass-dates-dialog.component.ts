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
          <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
          <mat-datepicker #pickerStart></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="fill" class="full-width">
          <mat-label>Fecha Fin</mat-label>
          <input
            matInput
            [matDatepicker]="pickerEnd"
            formControlName="endDate"
          />
          <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
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
  styles: [
    `
      .content-container {
        display: flex;
        flex-direction: column;
        gap: 16px;
        min-width: 300px;
      }
      .full-width {
        width: 100%;
      }
    `,
  ],
})
export class SeasonPassDatesDialogComponent {
  form: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<SeasonPassDatesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SeasonPassWithImage,
    private fb: FormBuilder,
    private seasonPassService: SeasonPassService,
  ) {
    // Inicializar fechas como objetos Date para el Datepicker
    this.form = this.fb.group({
      startDate: [new Date(data.offerPeriod.start), Validators.required],
      endDate: [new Date(data.offerPeriod.end), Validators.required],
    });
  }

  saveChanges() {
    if (!this.form.valid) {
      return;
    }

    const startDateForm = new Date(this.form.value.startDate);
    const endDateForm = new Date(this.form.value.endDate);

    const originalStart = new Date(this.data.offerPeriod.start);
    const originalEnd = new Date(this.data.offerPeriod.end);

    const isStartChanged = startDateForm.getTime() !== originalStart.getTime();
    const isEndChanged = endDateForm.getTime() !== originalEnd.getTime();

    if (!isStartChanged && !isEndChanged) {
      alert('No hay cambios para guardar.');
      return;
    }

    const datesPayload = {
      start: startDateForm.toISOString(),
      end: endDateForm.toISOString(),
    };

    this.seasonPassService.updateDates(this.data.id, datesPayload).subscribe({
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
