import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Para ngIf, ngFor, pipe date
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- Para mat-toolbar
import { MatIconModule } from '@angular/material/icon'; // <-- Para mat-icon
import { MatButtonModule } from '@angular/material/button'; // <-- Para botones material
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { SeasonPassService } from '../../../services/season-pass.service';
import { Router } from '@angular/router';
import { SeasonPassWithImage } from '../../../Models/Season-pass.model';
import { SeasonPassDialogComponent } from './season-pass-dialog.component';

@Component({
  selector: 'app-season-pass-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule  
  ], // <--- Importa aquí los módulos que usa el template
  templateUrl: './season-pass-page.component.html',
  styleUrls: ['./season-pass-page.component.css']
})
export class SeasonPassPageComponent implements OnInit {
  seasonPasses: SeasonPassWithImage[] = [];

  constructor(
    private seasonPassService: SeasonPassService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSeasonPasses();
  }

  loadSeasonPasses(): void {
    this.seasonPassService.getAllSeasonPasses().subscribe(
      (data: SeasonPassWithImage[]) => { 
        console.log(data);
        this.seasonPasses = data;
      },
      (error: SeasonPassWithImage) => { // También puedes especificar el tipo aquí
        console.error(error);
      }
    );

  }

  createNewSeasonPass(): void {
    this.router.navigate(['create-season-pass']);
  }

  toggleStatus(id: number, isPaused: boolean): void {
    this.seasonPassService.toggleStatus(id, isPaused).subscribe(
      () => this.loadSeasonPasses(),
      (error) => console.error('Error cambiando el estado', error)
    );
  }

  openSeasonPassDialog(pass: SeasonPassWithImage): void {
    const dialogRef = this.dialog.open(SeasonPassDialogComponent, {
      width: '600px',
      data: pass  // Pasar la información del abono al diálogo
    });

    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === 'updated') {
        this.loadSeasonPasses();  // Recargar lista si hubo actualización
      }
    });
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  
  logout(): void {
    this.router.navigate(['']);
  }
}
