import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SeasonPassService {
  private baseUrl = 'http://100.26.187.163/fpc/api/club-admin/season-pass';  // URL base para los endpoints de los abonos

  constructor(private http: HttpClient) {}

  // Obtener todos los abonos
  getAllSeasonPasses(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/all`);
  }

  // Crear un nuevo abono
  createSeasonPass(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/create`, data);
  }

  // Actualizar el precio de un abono
  updatePrice(id: string, price: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/update/price`, { price });
  }

  // Actualizar la imagen de un abono
  updateImage(id: string, image: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/update/image`, { image });
  }

  // Actualizar las fechas de un abono
  updateDates(id: string, startDate: string, endDate: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/update/dates`, { startDate, endDate });
  }

  // Cambiar el estado de un abono (activo/desactivado)
  toggleStatus(id: string): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}/toggle-status`, {});
  }
}
