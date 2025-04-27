// src/app/stadiums.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StadiumsService {
  private apiUrl = 'http://localhost:8080/api/stadiums';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  getStadiums(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createStadium(stadium: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, stadium);
  }

  updateStadium(id: number, stadium: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, stadium);
  }

  deleteStadium(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
