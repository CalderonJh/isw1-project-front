import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './login.user.service';  // Importa el servicio de autenticación
import { Partido } from '..//pages/sport-match-page/partido.interface';  

@Injectable({
  providedIn: 'root',
})
export class SportsMatchesService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match';  // URL de la API de partidos

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener todos los partidos (usando la interfaz Partido)
  getSportsMatches(): Observable<Partido[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, // Asegúrate de que tu AuthService tenga el método getToken()
    });
    return this.http.get<Partido[]>(`${this.apiUrl}/all`, { headers });
  }

  // Método para crear un partido
  createSportsMatch(partido: any): Observable<any> {
  const headers = new HttpHeaders({
    'Authorization': `Bearer ${this.authService.getToken()}`, // Asegúrate de que tu AuthService tenga el método getToken()
  });
  return this.http.post<any>(`${this.apiUrl}/save`, partido, { headers });
  }
  
  // Método para actualizar un partido
  updateSportsMatch(id: number, partido: Partido): Observable<Partido> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, // Asegúrate de que tu AuthService tenga el método getToken()
    });
    return this.http.put<Partido>(`${this.apiUrl}/update/${id}`, partido, { headers });
  }

  // Método para eliminar un partido
  deleteSportsMatch(id: number): Observable<void> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`, // Asegúrate de que tu AuthService tenga el método getToken()
    });
    return this.http.delete<void>(`${this.apiUrl}/delete/${id}`, { headers });
  }
}
