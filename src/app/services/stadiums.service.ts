import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private apiUrl = 'http://localhost:8080/api/stadiums';
  private token = 'tu_token_aqui';  // Asegúrate de obtener el token desde un lugar seguro

  constructor(private http: HttpClient) {}

  // Obtener la lista de estadios
  getStadiums(): Observable<any[]> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Agregar un nuevo estadio
  addStadium(stadium: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const stadiumData = {
      stadium: {
        id: 0,  // El backend debe asignar el ID
        name: stadium.nombre,
        stands: stadium.tribunas  // Asegúrate de que el estadio tenga tribunas ya definidas
      },
      image: stadium.imagen  // Si hay una imagen asociada, agrega aquí
    };

    return this.http.post<any>(this.apiUrl, stadiumData, { headers });
  }

  // Eliminar un estadio
  deleteStadium(id: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers });
  }

  // Agregar tribuna a un estadio
  addTribuna(stadiumId: number, tribuna: any): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    const tribunaData = {
      name: tribuna.nombre,
      capacity: tribuna.capacidad
    };

    return this.http.post<any>(`${this.apiUrl}/${stadiumId}/stands`, tribunaData, { headers });
  }

  // Eliminar una tribuna de un estadio
  deleteTribuna(stadiumId: number, tribunaId: number): Observable<any> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    return this.http.delete<any>(`${this.apiUrl}/${stadiumId}/stands/${tribunaId}`, { headers });
  }
}
