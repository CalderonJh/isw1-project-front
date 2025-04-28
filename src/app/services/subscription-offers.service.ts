// src/app/subscription-offers.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubscriptionOffersService {
  private apiUrl = 'http://localhost:8080/api/subscription-offers';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  getSubscriptionOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createSubscriptionOffer(offer: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, offer);
  }

  updateSubscriptionOffer(id: number, offer: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, offer);
  }

  deleteSubscriptionOffer(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  toggleOfferPublication(id: number, status: boolean): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${id}/toggle`, { status });
  }
}
