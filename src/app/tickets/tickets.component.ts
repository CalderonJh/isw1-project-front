// src/app/tickets/tickets.component.ts
import { Component, OnInit } from '@angular/core';
import { TicketsService } from '../service_app/tickets.service';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.component.html',
  styleUrls: ['./tickets.component.css']
})
export class TicketsComponent implements OnInit {
  tickets: any[] = [];
  newTicket = { matchId: '', price: '' };  // Ajusta el modelo según tu API

  constructor(private ticketsService: TicketsService) {}

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketsService.getTickets().subscribe(data => {
      this.tickets = data;
    });
  }

  createTicket(): void {
    this.ticketsService.createTicket(this.newTicket).subscribe(() => {
      this.loadTickets();  // Recarga la lista después de crear una nueva boleta.
    });
  }

  deleteTicket(id: number): void {
    this.ticketsService.deleteTicket(id).subscribe(() => {
      this.loadTickets();  // Recarga la lista después de eliminar una boleta.
    });
  }

  toggleTicketPublication(id: number, status: boolean): void {
    this.ticketsService.toggleTicketPublication(id, status).subscribe(() => {
      this.loadTickets();  // Recarga la lista después de cambiar el estado.
    });
  }
}

