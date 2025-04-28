// src/app/sports-matches.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SportsMatchesService {
  private apiUrl = 'http://localhost:8080/api/sports-matches';  // Cambia la URL según tu API

  constructor(private http: HttpClient) {}

  getSportsMatches(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  createSportsMatch(match: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, match);
  }

  updateSportsMatch(id: number, match: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, match);
  }

  deleteSportsMatch(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
