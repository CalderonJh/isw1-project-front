import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from './login.user.service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root',
})

export class ViewTicketService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/ticket/all';
  private baseUrl = 'http://100.26.187.163/fpc/api/club-admin/ticket';
  private imageBaseUrl = 'http://100.26.187.163/fpc/api/images/'; // Ruta base para las imágenes

  constructor(
    private http: HttpClient, 
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json',
    });
  }

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
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

  // Obtiene la URL real de la imagen a partir del imageId
  getImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) {
      return of(this.sanitizer.bypassSecurityTrustUrl('assets/img/defecto.jpg'));
    }

    const url = `${this.imageBaseUrl}${imageId}`;
    return this.http.get(url, {
      headers: this.getHeaders(),
      responseType: 'text',
    }).pipe(
      map((response) => {
        try {
          const parsed = JSON.parse(response);
          const realUrl = parsed.url || 'assets/img/defecto.jpg';
          return this.sanitizer.bypassSecurityTrustUrl(realUrl);
        } catch {
          return this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg');
        }
      }),
      catchError(() => {
        return of(this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg'));
      })
    );
  }
  
  toggleStatus(id: number, status: 'ENABLED' | 'DISABLED'): Observable<any> {
  const url = `${this.baseUrl}/${id}/toggle-status`;
  return this.http.post(url, { status }, { headers: this.getHeaders() });
}


  updateDates(id: number, dates: { start: string; end: string }): Observable<any> {
    const url = `${this.baseUrl}/${id}/update/dates`;
    return this.http.put(url, dates, { headers: this.getHeaders() });
  }

  updatePrices(id: number, prices: any[]): Observable<any> {
    const url = `${this.baseUrl}/${id}/update/price`;
    return this.http.put(url, prices, { headers: this.getHeaders() });
  }

  updateImage(id: number, imageFile: File): Observable<any> {
    const url = `${this.baseUrl}/${id}/update/image`;
    const formData = new FormData();
    formData.append('image', imageFile);
    return this.http.put(url, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        // No Content-Type para que el navegador lo establezca automáticamente
      }),
    });
  }
  
}
