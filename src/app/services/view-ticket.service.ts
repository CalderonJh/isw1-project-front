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
  private imageBaseUrl = 'http://100.26.187.163/fpc/api/images/';
  private detailsUrl = 'http://100.26.187.163/fpc/api/offer/ticket/details'; // Nuevo endpoint detalles precios

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private sanitizer: DomSanitizer
  ) {}

  private getHeaders(contentTypeJson = true): HttpHeaders {
    const headersConfig: { [key: string]: string } = {
      Authorization: `Bearer ${this.authService.getToken()}`,
    };
    if (contentTypeJson) {
      headersConfig['Content-Type'] = 'application/json';
    }
    return new HttpHeaders(headersConfig);
  }

  getAllOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, {
      headers: this.getHeaders(),
    });
  }

  getTicketOffers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching ticket offers:', error);
        return of([]);
      })
    );
  }

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

  updateImage(id: number, imageFile: File): Observable<any> {
    const url = `${this.baseUrl}/${id}/update/image`;
    const formData = new FormData();
    formData.append('file', imageFile, imageFile.name);
    return this.http.patch(url, formData, {
      headers: this.getHeaders(false), // no Content-Type explícito para FormData
    });
  }

  updateDates(id: number, dates: { start: string; end: string }): Observable<any> {
    const url = `${this.baseUrl}/${id}/update/dates`;
    return this.http.patch(url, dates, { headers: this.getHeaders() });
  }

  // Actualizar precios como array de objetos [{standId, price, isDisabled}, ...]
  updatePrices(id: number, prices: any[]): Observable<any> {
    const url = `${this.baseUrl}/${id}/update/price`;
    return this.http.patch(url, prices, {
      headers: this.getHeaders(),
    }).pipe(catchError(this.handleError));
  }

  // Obtener detalles de precios por tribuna para un ticket específico
  getPricesDetails(ticketId: number): Observable<Array<{
    saleId: number;
    stand: { id: number; description: string };
    price: number;
    available: boolean;
  }>> {
    const url = `${this.detailsUrl}/${ticketId}`;
    return this.http.get<Array<{
      saleId: number;
      stand: { id: number; description: string };
      price: number;
      available: boolean;
    }>>(url, { headers: this.getHeaders() }).pipe(
      catchError((error) => {
        console.error('Error fetching price details:', error);
        return of([]);
      })
    );
  }

  // Cambiar estado (status) boleta como {status: 'ENABLED' | 'DISABLED'}
  toggleStatus(id: number, status: 'ENABLED' | 'DISABLED'): Observable<any> {
    const url = `${this.baseUrl}/${id}/toggle-status`;
    return this.http.patch(url, { status }, {
      headers: this.getHeaders(),
    }).pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
