import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Para ngIf, ngFor, pipe date
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- Para mat-toolbar
import { MatIconModule } from '@angular/material/icon'; // <-- Para mat-icon
import { MatButtonModule } from '@angular/material/button'; // <-- Para botones material
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SeasonPassService } from '../../../services/season-pass.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { Router } from '@angular/router';
import {
  SeasonPassDetails,
  SeasonPassWithImage,
} from '../../../Models/Season-pass.model';
import { MatMenuModule } from '@angular/material/menu';
import { SeasonPassDatesDialogComponent } from './dialogs/season-pass-dates-dialog.component';
import { SeasonPassPricesDialogComponent } from './dialogs/season-pass-prices-dialog.component';
import { map } from 'rxjs';
import {SeasonPassImageDialogComponent} from './dialogs/season-pass-image-dialog.component';

@Component({
  selector: 'app-season-pass-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatButtonModule,
    MatMenuModule,
  ], // <--- Importa aquí los módulos que usa el template
  templateUrl: './season-pass-page.component.html',
  styleUrls: ['./season-pass-page.component.css'],
})
export class SeasonPassPageComponent implements OnInit {
  seasonPasses: SeasonPassWithImage[] = [];
  passDetails!: SeasonPassDetails;

  constructor(
    private seasonPassService: SeasonPassService,
    private dialog: MatDialog,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadSeasonPasses();
  }

  loadSeasonPasses(): void {
    this.seasonPassService.getAllSeasonPasses().subscribe(
      (data: SeasonPassWithImage[]) => {
        console.log(data);
        this.seasonPasses = data;
      },
      (error: SeasonPassWithImage) => {
        // También puedes especificar el tipo aquí
        console.error(error);
      },
    );
  }

  createNewSeasonPass(): void {
    this.router.navigate(['create-season-pass']);
  }

  toggleStatus(id: number): void {
    this.seasonPassService.toggleStatus(id).subscribe({
      next: () => this.loadSeasonPasses(),
      error: (error) => console.error('Error cambiando el estado', error),
    });
  }

  openSeasonPassDatesDialog(pass: SeasonPassWithImage): void {
    const dialogRef = this.dialog.open(SeasonPassDatesDialogComponent, {
      width: '600px',
      data: pass, // Pasar la información del abono al diálogo
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'updated') {
        this.loadSeasonPasses(); // Recargar lista si hubo actualización
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  protected readonly onpause = onpause;

  openSeasonPassImageDialog(pass: SeasonPassWithImage) {
        const dialogRef = this.dialog.open(SeasonPassImageDialogComponent, {
          width: '600px',
          data: pass
        });

        dialogRef.afterClosed().subscribe((result: string) => {
          if (result === 'updated') {
            this.loadSeasonPasses(); // Recargar lista si hubo actualización
          }
        });
  }

  openSeasonPassPricesDialog(pass: SeasonPassWithImage) {
    this.seasonPassService
      .getDetails(pass.id)
      .pipe(map((response) => response.body as SeasonPassDetails))
      .subscribe((details) => {
        this.passDetails = details; // Aquí sí puedes asignarlo a una variable del tipo SeasonPassDetails
        const dialogRef = this.dialog.open(SeasonPassPricesDialogComponent, {
          width: '600px',
          data: this.passDetails.prices, // Pasar la información del abono al diálogo
        });

        dialogRef.afterClosed().subscribe((result: string) => {
          if (result === 'updated') {
            this.loadSeasonPasses(); // Recargar lista si hubo actualización
          }
        });
      });
  }
}
