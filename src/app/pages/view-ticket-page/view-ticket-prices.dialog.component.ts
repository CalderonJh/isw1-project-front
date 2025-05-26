import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ViewTicketService } from '../../services/view-ticket.service';

@Component({
  selector: 'view-ticket-prices-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
  ],
  template: `
    <h2 mat-dialog-title>Editar Precios por Tribuna</h2>
    <mat-dialog-content style="max-height: 400px; overflow-y: auto;">
      <div *ngFor="let price of prices; let i = index" style="margin-bottom: 1rem; border: 1px solid #ccc; padding: 1rem; border-radius: 8px;">
        <div><strong>{{ price.stand.description }}</strong></div>
        <mat-form-field appearance="fill" style="width: 100%; margin-top: 8px;">
          <mat-label>Precio</mat-label>
          <input matInput type="number" [(ngModel)]="prices[i].price" min="0" />
        </mat-form-field>
        <mat-checkbox [(ngModel)]="prices[i].available" style="margin-top: 8px;">
          Disponible
        </mat-checkbox>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="cancel()">Cancelar</button>
      <button mat-button color="primary" (click)="saveChanges()">Guardar cambios</button>
    </mat-dialog-actions>
  `
})
export class ViewTicketPricesDialog {
  prices: Array<{
    saleId: number;
    stand: { id: number; description: string };
    price: number;
    available: boolean;
  }>;

  offerId: number;

  constructor(
    private dialogRef: MatDialogRef<ViewTicketPricesDialog>,
    @Inject(MAT_DIALOG_DATA) public data: { offerId: number; prices: any[] },
    private viewTicketService: ViewTicketService
  ) {
    this.offerId = data.offerId;
    // Clonar para evitar mutaciones externas
    this.prices = data.prices.map(p => ({ ...p }));
  }

  saveChanges() {
    const pricesToSave = this.prices.map(p => ({
      standId: p.stand.id,
      price: p.price,
      isDisabled: !p.available // Invertir la lógica para isDisabled según la API
    }));

    this.viewTicketService.updatePrices(this.offerId, pricesToSave).subscribe({
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

  cancel() {
    this.dialogRef.close();
  }
}
