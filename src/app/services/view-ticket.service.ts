import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './login.user.service';

export interface TicketOffer {
  id: number;
  homeClub: string;
  awayClub: string;
  matchDay: string;
  saleStart: string;
  saleEnd: string;
  imageUrl: string;
  isPaused: boolean;
}

@Injectable({
  providedIn: 'root',
})

export class ViewTicketService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/match/all';
  private imageBaseUrl = 'https://res.cloudinary.com/demo/image/upload/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }
  getTicketOffers(): Observable<TicketOffer[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      map((data) => {
        return data.map((item) => ({
          id: item.id,
          homeClub: item.homeClub?.description || 'No disponible',
          awayClub: item.awayClub?.description || 'No disponible',
          matchDay: item.matchDay,
          saleStart: item.offerPeriod?.start || '',
          saleEnd: item.offerPeriod?.end || '',
          imageUrl: `${this.imageBaseUrl}${item.imageId}.jpg`,
          isPaused: item.isPaused,
        }));
      }),
      catchError((error) => {
        console.error('Error fetching ticket offers:', error);
        return of([]);
      })
    );
  }

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }
}
