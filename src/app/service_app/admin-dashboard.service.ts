// src/app/admin-dashboard.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AdminDashboardService {
  private apiUrl = 'http://localhost:8080/api/dashboard';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  // Método para obtener información general para el dashboard
  getDashboardInfo(): Observable<any> {
    return this.http.get<any>(this.apiUrl).pipe(
      catchError((error) => {                                                  // Manejo de errores en la solicitud HTTP
        console.error('Error loading dashboard info', error);
        return throwError(() => new Error('Error loading dashboard info'));
      })
    );
  }

  // Si necesitas obtener estadísticas específicas, puedes añadir más métodos
  getTotalSportsEvents(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/sports-events`);
  }

  getTotalSubscriptions(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/subscriptions`);
  }
}
