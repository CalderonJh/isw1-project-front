import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable, catchError } from 'rxjs';
import { AuthService } from './login.user.service';  // Importa el servicio de autenticación

export interface Partido {
  awayClubId: number;  // ID del equipo visitante
  stadiumId: number;   // ID del estadio
  year: number;        // Año de la temporada
  season: number;      // Temporada
  matchDate: string;   // Fecha y hora del partido
}

@Injectable({
  providedIn: 'root',
})

export class SportsMatchesService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match';  // URL de la API de partidos
  private clubsUrl = 'http://100.26.187.163/fpc/api/su/club';  // URL de la API para obtener detalles del club
  private stadiumsUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium';  // URL de la API para obtener detalles del estadio

  constructor(private http: HttpClient, private authService: AuthService) { }

  // Método para obtener todos los partidos (usando la interfaz Partido)
  getSportsMatches(): Observable<Partido[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<Partido[]>(`${this.apiUrl}/all`, { headers }).pipe(
      catchError(error => {
        console.error('Error fetching sports matches:', error);
        throw error;
      })
    );
  }

  // Método para obtener el nombre del club por su ID
  getClubNameById(clubId: number): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    
    // Obtener la lista de todos los clubes
    return this.http.get<any[]>(`${this.clubsUrl}/list`, { headers }).pipe(
      map((response: any[]) => {
        // Buscar el club cuyo ID coincida con el `clubId`
        const club = response.find(c => c.id === clubId);
        return club ? club.shortName : 'Club no encontrado';  // Si no se encuentra el club, devolver un mensaje adecuado
      }),
      catchError(error => {
        console.error('Error fetching club name:', error);
        throw error;
      })
    );
  }

  // Método para obtener el nombre del estadio por su ID
  getStadiumNameById(estadioId: number): Observable<string> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.get<any>(`${this.stadiumsUrl}/${estadioId}`, { headers }).pipe(
      map((response: any) => response.name),
      catchError(error => {
        console.error('Error fetching stadium name:', error);
        throw error;
      })
    );
  }

  // Método para crear un partido
  createSportsMatch(partido: any): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.post<any>(`${this.apiUrl}/save`, partido, { headers });
  }

  // Método para actualizar un partido
  updateSportsMatch(id: number, partido: Partido): Observable<Partido> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.put<Partido>(`${this.apiUrl}/update/${id}`, partido, { headers });
  }

  // Método para eliminar un partido
  deleteSportsMatch(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`,
    });
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers });
  }
}
