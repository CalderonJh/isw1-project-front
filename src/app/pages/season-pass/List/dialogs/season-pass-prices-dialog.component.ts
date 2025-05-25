import { Component, Inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SeasonPassService } from '../../../../services/season-pass.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { StandPriceComponent } from '../../../../components/stand-price-component/stand-price.component';
import { forkJoin } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Stand } from '../../../../Models/Stadium.model';

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
      <app-stand-price [tribunas]="data"></app-stand-price>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="cancel()">Cancelar</button>
      <button mat-button color="primary" type="submit">
        Guardar cambios
      </button>
    </mat-dialog-actions>
  `,
  standalone: true,
  styles: [],
})
export class SeasonPassPricesDialogComponent {
  stands: any; // Se inicializa en el constructor

  // Variable para guardar precios por tribunas desde el componente app-stand-price
  tribunePrices: any;

  constructor(
    private dialogRef: MatDialogRef<SeasonPassPricesDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Stand[],
    private seasonPassService: SeasonPassService,
  ) {
    this.stands = []; // Inicialización segura aquí
  }

  saveChanges() {
    const observables = [];

    // Comparar y actualizar precios si cambiaron
    if (this.tribunePricesChanged()) {
      observables.push(
        this.seasonPassService.updatePrice(
          1,
          this.data.map((s) => ({ standId: s.id, price: s.price })),
        ),
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

  tribunePricesChanged(): boolean {
    return true; // No hay cambios en los precios
  }

  onPricesChange(prices: any) {
    this.tribunePrices = prices;
  }

  cancel() {
    this.dialogRef.close();
  }
}
