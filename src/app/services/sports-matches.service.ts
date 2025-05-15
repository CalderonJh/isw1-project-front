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
  providedIn: 'root',
})
export class SportsMatchesService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match';
  private clubsUrl = 'http://100.26.187.163/fpc/api/su/club';
  private stadiumsUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
    });
  }

  getSportsMatches(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching sports matches:', error);
        return of([]);
      })
    );
  }
  
  createSportsMatch(partido: Partido): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/save`, partido, { headers: this.getHeaders() });
  }

  updateSportsMatch(id: number, partido: Partido): Observable<Partido> {
    return this.http.put<Partido>(`${this.apiUrl}/update/${id}`, partido, { headers: this.getHeaders() });
  }

  deleteSportsMatch(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers: this.getHeaders() });
  }
}
