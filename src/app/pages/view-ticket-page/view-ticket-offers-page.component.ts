import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatNativeDateModule } from '@angular/material/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { ViewTicketService } from '../../services/view-ticket.service';
import { Ticket } from '../../Models/Ticket.model';
import { ViewTicketOffersDialog } from '../view-ticket-page/view-ticket-offers-dialog.component';

@Component({
  selector: 'view-ticket-offers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDialogModule,
    MatNativeDateModule
  ],
  templateUrl: './view-ticket-page.component.html',
  styleUrls: ['./view-ticket-page.component.css'],
})

export class ViewTicketPageComponent implements OnInit {
  ofertas: (Ticket & { imageUrl?: SafeUrl })[] = [];

  constructor(
    private router: Router,
    private viewService: ViewTicketService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.viewService
      .getAllOffers()
      .pipe(
        switchMap((tickets) => {
          if (!tickets.length) return [];

          const requests = tickets.map((ticket) =>
            this.viewService.getImageUrl(ticket.imageId).pipe(
              map((imageUrl) => ({
                ...ticket,
                imageUrl,
              }))
            )
          );

          return forkJoin(requests);
        })
      )
      .subscribe({
        next: (ticketsWithImages) => {
          this.ofertas = ticketsWithImages;
        },
        error: (err) => {
          console.error('Error cargando ofertas con imágenes', err);
        },
      });
  }

  openEditDialog(oferta: any) {
    const dialogRef = this.dialog.open(ViewTicketOffersDialog, {
      width: '600px',
      data: {
        id: oferta.id,
        status: oferta.isPaused ? 'DISABLED' : 'ENABLED',
        dates: {
          start: oferta.offerPeriod.start,
          end: oferta.offerPeriod.end,
        },
        prices: Array.isArray(oferta.prices) ? oferta.prices : [],
        imageUrl: oferta.imageUrl,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.saveChanges(oferta.id, result);
      }
    });
  }

  saveChanges(ticketId: number, changes: any) {
    this.viewService.updateDates(ticketId, changes.dates).subscribe({
      next: () => {
        if (changes.imageFile) {
          this.viewService.updateImage(ticketId, changes.imageFile).subscribe({
            next: () => this.reloadOffers(),
            error: (err) => console.error('Error actualizando imagen:', err),
          });
        } else {
          this.reloadOffers();
        }
      },
      error: (err) => console.error('Error actualizando fechas:', err),
    });
  }

  toggleTicketStatus(oferta: any, event: MouseEvent) {
    event.stopPropagation();

    const newStatus = oferta.isPaused ? 'ENABLED' : 'DISABLED';

    this.viewService.toggleStatus(oferta.id, newStatus).subscribe({
      next: () => {
        oferta.isPaused = !oferta.isPaused;
      },
      error: (err) => {
        console.error('Error al cambiar estado de la boleta:', err);
      },
    });
  }

  reloadOffers() {
    this.ngOnInit();
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  crearOferta(): void {
    this.router.navigate(['tickets/create']);
  }
}
