import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, catchError, of } from 'rxjs';
import { AuthService } from './login.user.service';
import { Partido } from '../Models/Partido.model';

@Injectable({
  providedIn: 'root',
})

export class SportsMatchesService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match';
  private clubsUrl = 'http://100.26.187.163/fpc/api/su/club';
  private stadiumsUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium';

  constructor(private http: HttpClient, private authService: AuthService) { }

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

  // Obtener lista de clubes
  getClubs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.clubsUrl}/list`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching clubs:', error);
        return of([]);
      })
    );
  }

  // Obtener lista de estadios
  getStadiums(): Observable<any[]> {
    return this.http.get<any[]>(`${this.stadiumsUrl}/all`, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching stadiums:', error);
        return of([]);
      })
    );
  }

  // Función para obtener los partidos válidos para la creación de un abono (season pass)
  getMatchesForSeasonOffer(stadiumId: number): Observable<Partido[]> {
    const url = `${this.apiUrl}/all?stadium=${stadiumId}&toOffer=season`;
    return this.http.get<Partido[]>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching valid matches for season offer:', error);
        return of([]); // Retorna un array vacío si hay error
      })
    );
  }
}
