import { Component, Inject, OnInit } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { SeasonPassWithImage } from '../../../../Models/Season-pass.model';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SeasonPassService } from '../../../../services/season-pass.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StandPriceComponent } from '../../../../components/stand-price-component/stand-price.component';
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
    ReactiveFormsModule
  ],
  providers: [MatNativeDateModule],
  template: `
<h2 mat-dialog-title>Editar Imagen del Abono</h2>

<form [formGroup]="form" (ngSubmit)="saveChanges()">
  <mat-dialog-content class="content-container">
    <div class="file-upload">
      <label for="fileInput">Subir Imagen</label>
      <input
        id="fileInput"
        type="file"
        (change)="onFileSelected($event)"
      />
    </div>

    <div class="image-preview">
      <img
        *ngIf="currentImageUrl; else noImage"
        [src]="currentImageUrl"
        alt="Imagen actual"
      />
      <ng-template #noImage><span>No hay imagen</span></ng-template>
    </div>
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
  align-items: center;
  gap: 16px;
  min-width: 400px;
}

.file-upload {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 8px;
  margin-bottom: 16px;
  width: 100%;
}

.file-upload label {
  font-weight: 600;
  margin-bottom: 4px;
}

.file-upload input[type='file'] {
  cursor: pointer;
  width: 100%;
  max-width: 300px;
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

    `,
  ],
})
export class SeasonPassImageDialogComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null; // Guardar archivo seleccionado
  currentImageUrl: SafeUrl | null = null;

  constructor(
    private dialogRef: MatDialogRef<SeasonPassImageDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SeasonPassWithImage,
    private fb: FormBuilder,
    private seasonPassService: SeasonPassService,
  ) {
    // Form solo para control de imagen (puede omitirse si no requieres otros datos)
    this.form = this.fb.group({
      imageFile: [null, Validators.required],
    });
  }

  ngOnInit(): void {
    this.currentImageUrl = this.data.imageUrl || null;
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.form.patchValue({ imageFile: this.selectedFile });

      const reader = new FileReader();
      reader.onload = () => {
        this.currentImageUrl = reader.result as string;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  saveChanges() {
    if (this.form.invalid || !this.selectedFile) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    this.seasonPassService.updateImage(this.data.id, this.selectedFile).subscribe({
      next: () => {
        alert('Imagen actualizada correctamente');
        this.dialogRef.close('updated');
      },
      error: (error) => {
        alert('Error al actualizar la imagen');
        console.error(error);
      },
    });
  }

  cancel() {
    this.dialogRef.close();
  }
}
