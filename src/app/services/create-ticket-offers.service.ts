import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, catchError, of } from 'rxjs';
import { AuthService } from './login.user.service';

export interface Partido {
  matchId?: number;    // Opcional para crear
  awayClubId: number;
  stadiumId: number;
  year: number;
  season: number;
  matchDate: string;
}



@Injectable({
  providedIn: 'root'
})

export class CreateTicketOffersService{

  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/';
  private clubsUrl = 'http://localhost:4200/fpc/club-admin/match/all';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }
  
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


  // Obtener lista de clubes
  getClubs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.clubsUrl}/list`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching clubs:', error);
        return of([]);
      })
    );
  }


}


