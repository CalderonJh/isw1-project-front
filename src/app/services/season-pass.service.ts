import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './login.user.service';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SeasonPassService {
  private baseUrl = 'http://100.26.187.163/fpc/api/club-admin';

  constructor(private http: HttpClient, private authService: AuthService) { }

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
      .get<any>(`${this.baseUrl}/season-pass/all`, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }
  
  createOffer(offerData: any, image: File): Observable<any> {
    const formData: FormData = new FormData();

    // Agregar los datos de la oferta como objetos, no como cadenas JSON
    formData.append('offer', JSON.stringify(offerData));  // Mantenerlo en JSON para enviar como campo
    formData.append('file', image, image.name); // Agregar la imagen de forma separada

    console.log('offerData:', offerData); // Log para ver los datos

    return this.http.post<any>(`${this.baseUrl}/season-pass/create`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        // NO 'Content-Type' ya que Angular lo maneja con FormData
      })
    });
  }

  // Actualizar el precio de un abono
  updatePrice(id: string, price: number): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/season-pass/${id}/update/price`, { price }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar la imagen de un abono
  updateImage(id: string, image: string): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/season-pass/${id}/update/image`, { image }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar las fechas de un abono
  updateDates(id: number, startDate: string, endDate: string): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/season-pass/${id}/update/dates`, { startDate, endDate }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Cambiar el estado de un abono
  toggleStatus(id: number, isPaused: boolean): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}/season-pass/${id}/toggle-status`, {isPaused}, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores en el servicio
  private handleError(error: any): Observable<any> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
