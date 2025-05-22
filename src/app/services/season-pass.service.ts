import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './login.user.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeasonPassService {
  private baseUrl = 'http://100.26.187.163/fpc/api/club-admin/season-pass'; 

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Método para obtener los headers con token
  private getHeadersJson(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  private getHeadersFormData(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
      // NO 'Content-Type' porque Angular lo maneja automáticamente con FormData
    });
  }

  // Obtener todos los abonos
  getAllSeasonPasses(): Observable<any> {
    return this.http
      .get<any>(`${this.baseUrl}/all`, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Crear un nuevo abono
  createSeasonPass(data: any): Observable<any> {
    return this.http
      .post<any>(`${this.baseUrl}/create`, data, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar el precio de un abono
  updatePrice(id: string, price: number): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}/update/price`, { price }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar la imagen de un abono
  updateImage(id: string, image: string): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}/update/image`, { image }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar las fechas de un abono
  updateDates(id: string, startDate: string, endDate: string): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}/update/dates`, { startDate, endDate }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Cambiar el estado de un abono
  toggleStatus(id: string): Observable<any> {
    return this.http
      .put<any>(`${this.baseUrl}/${id}/toggle-status`, {}, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores en el servicio
  private handleError(error: any): Observable<any> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
