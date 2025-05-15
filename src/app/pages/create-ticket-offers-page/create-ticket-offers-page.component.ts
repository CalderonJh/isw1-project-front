import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CreateTicketOffersDialog } from './create-ticket-offers-dialog.component';
import { CreateTicketOffersService } from '../../services/create-ticket-offers.service';

@Component({
  selector: 'app-create-ticket-offers-page',
  standalone: true,
  imports: [
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
  ],
  templateUrl: './create-ticket-offers-page.component.html',
  styleUrls: ['./create-ticket-offers-page.component.css'],
})
export class CreateTicketOffersPageComponent {
  partidoSeleccionadoId?: number;
  estadioSeleccionadoId?: number;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private crea: CreateTicketOffersService
  ) {}

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  /** Abre el diálogo de selección */
  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTicketOffersDialog, {
      width: '600px',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.partidoSeleccionadoId = result.matchId;
      }
    });
  }
}
