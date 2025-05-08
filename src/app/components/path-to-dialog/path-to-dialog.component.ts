import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'path-to-dialog',
  templateUrl: './path-to-dialog.component.html',
})
export class DialogOverviewExampleDialog {
  partidoForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder
  ) {
    this.partidoForm = this.fb.group({
      equipoVisitante: ['', Validators.required],
      estadio: ['', Validators.required],
      anio: ['', Validators.required],
      periodo: ['', Validators.required],
      fecha: ['', Validators.required],
      hora: ['', Validators.required],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onGuardar(): void {
    if (this.partidoForm.valid) {
      this.dialogRef.close(this.partidoForm.value); // Envia los valores del formulario
    } else {
      console.log('Formulario no válido');
    }
  }
}
