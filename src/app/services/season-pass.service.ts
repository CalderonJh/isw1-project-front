import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { forkJoin, Observable, of } from 'rxjs';
import { AuthService } from './login.user.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { GetSeasonPass, SeasonPassWithImage } from '../Models/Season-pass.model';

@Injectable({
  providedIn: 'root'
})
export class SeasonPassService {
  private baseUrl = 'http://100.26.187.163/fpc/api';
  private admin = '/club-admin'
  private imageEndpoint = '/images/';

  constructor(private http: HttpClient, private authService: AuthService, private sanitizer: DomSanitizer) { }

  // Método para obtener los headers con token
  private getHeadersJson(): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`,
      'Content-Type': 'application/json'
    });
  }

  // Obtener todos los abonos
  getAllSeasonPasses(): Observable<SeasonPassWithImage[]> {
    const headers = this.getHeadersJson();

    return this.http.get<GetSeasonPass[]>(`${this.baseUrl}${this.admin}/season-pass/all`, { headers }).pipe(
      switchMap(seasonPasses => {
        if (!seasonPasses.length) return of([]);

        // Mapear cada abono para obtener la URL de la imagen sanitizada
        const requests = seasonPasses.map(pass =>
          this.getImageUrl(pass.imageId).pipe(
            map(imageUrl => ({
              ...pass,
              imageUrl
            }))
          )
        );

        // Esperar que todas las peticiones de imágenes terminen
        return forkJoin(requests);
      }),
      catchError(this.handleError)
    );
  }

    private getImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) {
      return of(this.sanitizer.bypassSecurityTrustUrl('assets/img/defecto.jpg'));
    }

    const headers = this.getHeadersJson();
    const url = `${this.baseUrl}${this.imageEndpoint}${imageId}`;

    return this.http.get(`${url}`, {
      headers,
      responseType: 'text' // Recibimos el JSON en texto para parsearlo manualmente
    }).pipe(
      map(responseText => {
        try {
          const parsed = JSON.parse(responseText);
          const realUrl = parsed.url || 'assets/img/defecto.jpg';
          return this.sanitizer.bypassSecurityTrustUrl(realUrl);
        } catch (e) {
          return this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg');
        }
      }),
      catchError(() => of(this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg')))
    );
  }



  createOffer(offerData: any, image: File): Observable<any> {
    const formData: FormData = new FormData();

    // Agregar los datos de la oferta como objetos, no como cadenas JSON
    formData.append('offer', JSON.stringify(offerData));  // Mantenerlo en JSON para enviar como campo
    formData.append('file', image, image.name); // Agregar la imagen de forma separada

    console.log('offerData:', offerData); // Log para ver los datos

    return this.http.post<any>(`${this.baseUrl}${this.admin}//season-pass/create`, formData, {
      headers: new HttpHeaders({
        Authorization: `Bearer ${this.authService.getToken()}`,
        // NO 'Content-Type' ya que Angular lo maneja con FormData
      })
    });
  }

  // Actualizar el precio de un abono
  updatePrice(id: number, price: number): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}${this.admin}/season-pass/${id}/update/price`, { price }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar la imagen de un abono
  updateImage(id: number, image: string): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}${this.admin}/season-pass/${id}/update/image`, { image }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Actualizar las fechas de un abono
  updateDates(id: number, offerPeriod: any): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}${this.admin}/season-pass/${id}/update/dates`, { offerPeriod }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Cambiar el estado de un abono
  toggleStatus(id: number, isPaused: boolean): Observable<any> {
    return this.http
      .patch<any>(`${this.baseUrl}${this.admin}/season-pass/${id}/toggle-status`, { isPaused }, { headers: this.getHeadersJson() })
      .pipe(catchError(this.handleError));
  }

  // Manejo de errores en el servicio
  private handleError(error: any): Observable<any> {
    console.error('Ocurrió un error:', error);
    throw error;
  }
}
