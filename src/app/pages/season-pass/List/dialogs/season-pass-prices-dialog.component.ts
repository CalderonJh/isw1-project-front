import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ReactiveFormsModule } from '@angular/forms';
import { SeasonPassService } from '../../../../services/season-pass.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StandPriceComponent } from '../../../../components/stand-price-component/stand-price.component';
import { CommonModule } from '@angular/common';
import { StandPricedialog } from '../../../../Models/Stadium.model';
import { StandPrice } from '../../../../Models/Season-pass.model';

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
    StandPriceComponent,
  ],
  providers: [MatNativeDateModule],
  template: `
    <h2 mat-dialog-title>Editar precios por tribuna</h2>
    <mat-dialog-content class="content-container">
      <app-stand-price
        [tribunas]="data.stands"
        (pricesChange)="onPricesChange($event)">
      </app-stand-price>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancelar</button>
      <button mat-button color="primary" type="submit" (click)="saveChanges()">
        Guardar cambios
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  styles: [],
})
export class SeasonPassPricesDialogComponent {
  tribunePrices: StandPrice[] = [];

  constructor(
    private dialogRef: MatDialogRef<SeasonPassPricesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StandPricedialog,
    private seasonPassService: SeasonPassService,
  ) {
    this.tribunePrices = [];
  }

  saveChanges() {
    if (!this.tribunePricesChanged()) {
      alert('No hay cambios para guardar.');
      return;
    }

    this.seasonPassService.updatePrice(this.data.offerid, this.tribunePrices).subscribe({
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

  tribunePricesChanged(): boolean {
    // Aquí puedes implementar lógica para detectar cambios reales
    // Por ahora, siempre retorna true para permitir guardar siempre
    return true;
  }

  onPricesChange(prices: any[] | Event) {
    // Si prices es un evento, extraer el valor correcto
    if (prices instanceof Event && (prices.target as any)?.value) {
      prices = (prices.target as any).value;
    }
    // Aseguramos que el arreglo tenga solo las propiedades necesarias
    this.tribunePrices = Array.isArray(prices)
      ? prices.map(p => ({
          standId: p.standId,
          price: p.price
        }))
      : [];
  }

  cancel() {
    this.dialogRef.close();
  }
}
