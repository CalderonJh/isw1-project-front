import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SeasonPassService } from '../../../../services/season-pass.service';
import { StandPriceDialogData } from '../../../../Models/Season-pass.model';


@Component({
  selector: 'season-pass-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>Editar precios por tribuna</h2>
    <mat-dialog-content style="max-height: 400px; overflow-y: auto;">
      <div *ngFor="let price of stands; let i = index" style="margin-bottom: 1rem; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
        <div><strong>{{ price.stand.description }}</strong></div>
        <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
          <mat-label>Precio</mat-label>
          <input matInput type="number" [(ngModel)]="stands[i].price" min="0" />
        </mat-form-field>
        <mat-checkbox [(ngModel)]="stands[i].available" style="margin-top: 8px;">Disponible</mat-checkbox>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-button color="primary" (click)="saveChanges()">Guardar cambios</button>
    </mat-dialog-actions>
  `,
})
export class SeasonPassPricesDialogComponent {
  stands: StandPriceDialogData['stands'];

  constructor(
    private dialogRef: MatDialogRef<SeasonPassPricesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StandPriceDialogData,
    private seasonPassService: SeasonPassService,
  ) {
    // Clonamos el arreglo para evitar modificar el objeto externo antes de guardar
    this.stands = data.stands.map(s => ({ ...s }));
  }

  saveChanges() {
    const pricesToSave = this.stands.map(p => ({
      saleId: p.saleId,
      standId: p.stand.id,
      price: p.price,
      available: p.available,
    }));

    this.seasonPassService.updatePrice(this.data.offerid, pricesToSave).subscribe({
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
