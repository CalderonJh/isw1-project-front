import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SeasonPassWithImage } from '../../../Models/Season-pass.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SeasonPassService } from '../../../services/season-pass.service';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';
import { StandPriceComponent } from "../../../components/stand-price-component/stand-price.component";
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
        StandPriceComponent
    ],
    providers: [
        MatNativeDateModule
    ],
    template: `
<h2 mat-dialog-title>Editar Abono - {{ data.description }}</h2>

<form [formGroup]="form" (ngSubmit)="saveChanges()">
  <mat-dialog-content class="content-container">
    <div class="form-section">
      <div>
        <app-stand-price [tribunas]="stands" (pricesChange)="onPricesChange($event)"></app-stand-price>
      </div>

      <div class="file-upload">
        <label for="fileInput">Subir Imagen</label>
        <input id="fileInput" type="file" (change)="onFileSelected($event)" />
      </div>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Fecha Inicio</mat-label>
        <input matInput [matDatepicker]="pickerStart" formControlName="startDate" />
        <mat-datepicker-toggle matSuffix [for]="pickerStart"></mat-datepicker-toggle>
        <mat-datepicker #pickerStart></mat-datepicker>
      </mat-form-field>

      <mat-form-field appearance="fill" class="full-width">
        <mat-label>Fecha Fin</mat-label>
        <input matInput [matDatepicker]="pickerEnd" formControlName="endDate" />
        <mat-datepicker-toggle matSuffix [for]="pickerEnd"></mat-datepicker-toggle>
        <mat-datepicker #pickerEnd></mat-datepicker>
      </mat-form-field>
    </div>

    <div class="image-preview">
      <img *ngIf="currentImageUrl; else noImage" [src]="currentImageUrl" alt="Imagen actual" />
      <ng-template #noImage><span>No hay imagen</span></ng-template>
    </div>
  </mat-dialog-content>

  <mat-dialog-actions align="end">
    <button mat-button type="button" (click)="cancel()">Cancelar</button>
    <button mat-button color="primary" type="submit" [disabled]="!form.valid">Guardar cambios</button>
  </mat-dialog-actions>
</form>
  `,
    styles: [`
.full-width {
  width: 100%;
}

.content-container {
  display: flex;
  gap: 24px;
  min-width: 400px;
  align-items: flex-start;
}

.form-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-upload {
  display: flex;
  flex-direction: column;
  margin-top: 8px;
  margin-bottom: 16px;
}

.file-upload label {
  font-weight: 600;
  margin-bottom: 4px;
}

.file-upload input[type="file"] {
  cursor: pointer;
}

.image-preview {
  width: 200px;
  height: 200px;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  border-radius: 4px;
  background-color: #fafafa;
}

.image-preview img {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
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
    stands: any; // Se inicializa en el constructor

    // Variable para guardar precios por tribunas desde el componente app-stand-price
    tribunePrices: any;

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
        this.stands = []; // Inicialización segura aquí
    }

    currentImageUrl: SafeUrl | null = null;

    ngOnInit() {
        this.currentImageUrl = this.data.imageUrl || null;
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input.files && input.files.length > 0) {
            const file = input.files[0];
            // Puedes hacer algo con el archivo, por ejemplo:
            this.form.patchValue({ imageFile: file });

            // Para vista previa local (opcional)
            const reader = new FileReader();
            reader.onload = () => {
                this.currentImageUrl = reader.result as string;
            };
            reader.readAsDataURL(file);
        }
    }


    saveChanges() {
        if (!this.form.valid) {
            return;
        }

        const observables = [];

        // Comparar y actualizar precios si cambiaron
        if (this.tribunePricesChanged()) {
            observables.push(this.seasonPassService.updatePrice(this.data.id, this.tribunePrices));
        }

        // Comparar y actualizar imagen si cambió
        if (this.imageChanged()) {
            observables.push(this.seasonPassService.updateImage(this.data.id, this.form.value.imageId));
        }

        // Comparar y actualizar fechas si cambiaron
        const startDateForm = new Date(this.form.value.startDate).toISOString();
        const endDateForm = new Date(this.form.value.endDate).toISOString();

        if (startDateForm !== this.data.offerPeriod.start || endDateForm !== this.data.offerPeriod.end) {
            const datesPayload = { start: startDateForm, end: endDateForm };
            observables.push(this.seasonPassService.updateDates(this.data.id, datesPayload));
        }

        if (observables.length === 0) {
            alert('No hay cambios para guardar.');
            return;
        }

        forkJoin(observables).subscribe({
            next: () => {
                alert('Cambios guardados correctamente');
                this.dialogRef.close('updated');
            },
            error: (error) => {
                alert('Error al guardar los cambios');
                console.error(error);
            }
        });
    }

    tribunePricesChanged(): boolean {
        return true; // No hay cambios en los precios
    }

    imageChanged(): boolean {
        return this.form.value.imageId !== this.data.imageId;
    }
    
    onPricesChange(prices: any) {
        this.tribunePrices = prices;
    }

    cancel() {
        this.dialogRef.close();
    }
}
