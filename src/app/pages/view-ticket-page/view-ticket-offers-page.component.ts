import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ViewTicketService } from '../../services/view-ticket.service';
import { Ticket } from '../../Models/Ticket.model';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { forkJoin, of } from 'rxjs';
import { switchMap, map, concatMap } from 'rxjs/operators';
import { MatDialog } from '@angular/material/dialog';
import { ViewTicketOffersDialog } from '../view-ticket-page/view-ticket-offers-dialog.component';

@Component({
  selector: 'view-ticket-offers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  templateUrl: './view-ticket-page.component.html',
  styleUrls: ['./view-ticket-page.component.css']
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
    this.viewService.getAllOffers().pipe(
      switchMap((tickets) => {
        if (!tickets.length) return of([]);

        const requests = tickets.map(ticket =>
          this.viewService.getImageUrl(ticket.imageId).pipe(
            map(imageUrl => ({
              ...ticket,
              imageUrl
            }))
          )
        );

        return forkJoin(requests);
      })
    ).subscribe({
      next: (ticketsWithImages) => {
        this.ofertas = ticketsWithImages;
      },
      error: (err) => {
        console.error('Error cargando ofertas con imágenes', err);
      }
    });
  }

  openEditDialog(oferta: any) {
    const dialogRef = this.dialog.open(ViewTicketOffersDialog, {
      width: '600px',
      data: {
        id: oferta.id,
        dates: {
          start: oferta.offerPeriod.start,
          end: oferta.offerPeriod.end,
        },
        imageUrl: oferta.imageUrl,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.saveChanges(oferta.id, result);
      }
    });
  }

  saveChanges(ticketId: number, changes: any) {
    this.viewService.updateDates(ticketId, changes.dates).pipe(
      concatMap(() => changes.imageFile
        ? this.viewService.updateImage(ticketId, changes.imageFile)
        : of(null)
      )
    ).subscribe({
      next: () => this.reloadOffers(),
      error: err => console.error('Error actualizando boleta:', err)
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
