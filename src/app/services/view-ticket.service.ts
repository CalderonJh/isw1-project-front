import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './login.user.service';
import { Ticket } from '../Models/Ticket.model';
import { tick } from '@angular/core/testing';


@Injectable({
  providedIn: 'root',
})

export class ViewTicketService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/ticket/all';
  private imageBaseUrl = 'https://res.cloudinary.com/demo/image/upload/';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  getTicketOffers(): Observable<any> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
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
