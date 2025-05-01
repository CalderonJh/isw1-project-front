import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http'; // Importa el HttpClient
import { Observable } from 'rxjs'; // Para manejar las respuestas asincrónicas

@Injectable({
  providedIn: 'root'
})
export class AbonoPageService {

  // La URL base de tu API (ajústala a la de tu backend)
  private apiUrl = 'https://mi-api.com/abonos';

  constructor(private http: HttpClient) { }

  // Método para obtener todos los abonos
  getAbonos(): Observable<any> {
    return this.http.get<any>(this.apiUrl); // Realiza una solicitud GET a la API
  }

  // Método para crear un nuevo abono
  createAbono(abonoData: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, abonoData); // Realiza una solicitud POST con los datos del nuevo abono
  }

  // Método para actualizar un abono existente
  updateAbono(abonoId: number, abonoData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${abonoId}`, abonoData); // Realiza una solicitud PUT para actualizar un abono específico
  }

  // Método para eliminar un abono
  deleteAbono(abonoId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${abonoId}`); // Realiza una solicitud DELETE para eliminar un abono
  }
}
