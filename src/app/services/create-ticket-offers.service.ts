import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './login.user.service';
import { Partido } from '../Models/Partido.model';

@Injectable({
  providedIn: 'root',
})
export class CreateTicketOffersService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match/all?toOffer=ticket';
  private apiUrlCreateTicket = 'http://100.26.187.163/fpc/api/club-admin/ticket/create';

  constructor(private http: HttpClient, private authService: AuthService) { }

  private getHeadersJson(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  private getHeadersFormData(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      // NO 'Content-Type' porque Angular la maneja automáticamente para FormData
    });
  }

  getAllMatches(): Observable<Partido[]> {
    return this.http
      .get<any[]>(`${this.apiUrl}`, { headers: this.getHeadersJson() })
      .pipe(
        map((data: any[]) => {
          if (!data || data.length === 0) return [];

          return data.map((partido: any) => ({
            matchId: partido.matchId,
            // Aquí construimos los objetos completos para awayClub y stadium
            awayClub: { id: partido.awayClub?.id, description: partido.awayClub?.description || 'Club no encontrado' },
            stadium: { id: partido.stadium?.id, description: partido.stadium?.description || 'Estadio no disponible' },
            year: partido.year,
            season: partido.season,
            matchDate: partido.matchDate,
            visitante: partido.awayClub?.description || 'Club no encontrado', // También se puede asignar aquí directamente
            estadio: partido.stadium?.description || 'Estadio no disponible', // Lo mismo para el estadio
            temporada: `${partido.year} - ${partido.season}`,
            fecha: partido.matchDate ? new Date(partido.matchDate).toLocaleDateString() : 'Fecha no disponible',
          }));
        }),
        catchError((error) => {
          console.error('Error fetching matches:', error);
          return of([]); // En caso de error, retornamos un array vacío
        })
      );
  }

  createTicketOffer(matchId: number, formData: FormData): Observable<any> {
    const url = `${this.apiUrlCreateTicket}?matchId=${matchId}`;
    return this.http.post<any>(url, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        // NO Content-Type para que Angular lo maneje solo
      }),
    });
  }

}
