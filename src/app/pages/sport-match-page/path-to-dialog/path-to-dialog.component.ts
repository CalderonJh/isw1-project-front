import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'path-to-dialog',
  templateUrl: './path-to-dialog.component.html',  // Este es el archivo donde está el contenido del diálogo
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any  // Recibe el formulario como datos
  ) {}

  // Cierra el diálogo sin guardar
  onNoClick(): void {
    this.dialogRef.close();
  }

  // Guarda los datos del formulario y cierra el diálogo
  onGuardar(): void {
    this.dialogRef.close(this.data.partidoForm.value); // Pasa los datos del formulario
  }
}
