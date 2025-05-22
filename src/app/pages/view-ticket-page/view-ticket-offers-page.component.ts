import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ViewTicketService } from '../../services/view-ticket.service';

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
  ofertas: any[] = [];

  constructor(
    private router: Router,
    private viewService: ViewTicketService
  ) {}

  ngOnInit(): void {
    this.viewService.getTicketOffers().subscribe((data) => {
      this.ofertas = data;
    });
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


