// src/app/tickets.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TicketsService {
  private apiUrl = 'http://localhost:8080/api/tickets';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  getTickets(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticket);
  }

  updateTicket(id: number, ticket: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, ticket);
  }

  deleteTicket(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  toggleTicketPublication(id: number, status: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/toggle`, { status });
  }
}
