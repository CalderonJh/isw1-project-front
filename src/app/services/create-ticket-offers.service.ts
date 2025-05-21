import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from './login.user.service';
import { Partido } from '../Models/Partido.model';
import { Club } from '../Models/Club.model';

@Injectable({
  providedIn: 'root',
})
export class CreateTicketOffersService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match';
  

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  getAllMatches(): Observable<Partido[]> {
    return this.http
      .get<Partido[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() })
      .pipe(
        catchError((error) => {
          console.error('Error fetching matches:', error);
          return of([]);
        })
      );
  }

  getClubs(): Observable<Club[]> {
      return this.http.get<Club[]>('http://.../club-admin/club/list', { headers: this.getHeaders() });
  }

  createMatch(match: Partido): Observable<Partido> {
    return this.http.post<Partido>(`${this.apiUrl}/save`, match, {
      headers: this.getHeaders(),
    });
  }

  updateMatch(id: number, match: Partido): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/update/${id}`, match, {
      headers: this.getHeaders(),
    });
  }

  deleteMatch(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/delete/${id}`, {
      headers: this.getHeaders(),
    });
  }
  
  // Obtener lista de clubes
}