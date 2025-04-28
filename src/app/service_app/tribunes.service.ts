// src/app/tribunes.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TribunesService {
  private apiUrl = 'http://localhost:8080/api/tribunes';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  getTribunes(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createTribune(tribune: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, tribune);
  }

  updateTribune(id: number, tribune: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, tribune);
  }

  deleteTribune(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
