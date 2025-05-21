import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './login.user.service';
import { Stadium, StadiumWithImage } from '../Models/Stadium.model';

@Injectable({
    providedIn: 'root'
})
export class StadiumService {
    private baseUrl = 'http://100.26.187.163/fpc/api';
    private stadiumEndpoint = '/club-admin/stadium';
    private imageEndpoint = '/images/';

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private sanitizer: DomSanitizer
    ) { }

    private getHeaders(): HttpHeaders {
        const token = this.authService.getToken();
        return new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });
    }

    // Obtiene todos los estadios con la URL de la imagen
    getAllStadiums(): Observable<StadiumWithImage[]> {
        const headers = this.getHeaders();

        return this.http.get<Stadium[]>(`${this.baseUrl}${this.stadiumEndpoint}/all`, { headers }).pipe(
            switchMap(stadiums => {
                if (!stadiums.length) return of([]);

                console.log('Stadiums data:', stadiums);

                // Verificamos los estadios y sus imágenes
                stadiums.forEach(stadium => {
                    console.log('Stadium image:', stadium.imageId);  // Verifica el valor de image
                });

                // Mapeamos cada estadio para incluir la URL de la imagen
                const requests = stadiums.map(stadium =>
                    this.getImageUrl(stadium.imageId).pipe(
                        map(imageUrl => ({
                            ...stadium,
                            imageUrl  // Agregamos la imagen sanitizada al estadio
                        }))
                    )
                );

                return forkJoin(requests);  // Esperamos todas las peticiones de las imágenes
            })
        );
    }


    // Método para obtener la URL de la imagen desde el backend
    private getImageUrl(imageId: string): Observable<SafeUrl> {
        console.log('Image ID:', imageId);
        if (!imageId) {
            console.error('No imageId provided, returning default image');
            return of(this.sanitizer.bypassSecurityTrustUrl('assets/img/defecto.jpg'));
        }

        const headers = this.getHeaders();

        // Imprimir el imageId y la URL construida para verificar si son correctos
        console.log(`Fetching image with ID: ${imageId}`);
        const url = `${this.baseUrl}${this.imageEndpoint}${imageId}`;
        console.log(`API URL for image: ${url}`);

        return this.http.get(`${url}`, {
            headers,
            responseType: 'text'  // Obtenemos la respuesta como texto
        }).pipe(
            map(urlString => {
                // Aquí parseamos el string JSON manualmente
                console.log(`Raw URL from API for imageId ${imageId}:`, urlString);

                try {
                    const parsed = JSON.parse(urlString);  // Convertimos el string JSON en un objeto
                    const realUrl = parsed.url || 'assets/img/error.jpg';  // Si no hay URL, usamos una por defecto
                    console.log(`Parsed Image URL: ${realUrl}`);
                    return this.sanitizer.bypassSecurityTrustUrl(realUrl);  // Sanitizamos la URL para evitar vulnerabilidades
                } catch (e) {
                    console.error('Error parsing JSON for image URL:', e);
                    return this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg');  // Usamos una imagen por defecto si falla el parseo
                }
            }),
            catchError(() => {
                console.error('Error fetching image URL.');
                return of(this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg'));  // En caso de error, usamos una imagen por defecto
            })
        );
    }



    // Método para crear un estadio
    createStadium(stadiumData: any, image?: File): Observable<any> {
        const headers = this.getHeaders();
        const formData = new FormData();
        formData.append('stadium', new Blob([JSON.stringify(stadiumData)], { type: 'application/json' }));
        if (image) formData.append('image', image);

        return this.http.post(`${this.baseUrl}${this.stadiumEndpoint}/create`, formData, { headers });
    }

    // Método para actualizar un estadio
    updateStadium(stadium: Stadium): Observable<any> {
        const headers = this.getHeaders();
        const payload = {
            id: stadium.id,
            name: stadium.name,
            stands: stadium.stands,
            imageId: stadium.imageId
        };

        return this.http.put(`${this.baseUrl}${this.stadiumEndpoint}/update/${stadium.id}`, payload, { headers });
    }

    // Método para actualizar la imagen de un estadio
    updateStadiumImage(stadiumId: number, image: File): Observable<any> {
        const headers = this.getHeaders();
        const formData = new FormData();
        formData.append('image', image);

        return this.http.put(`${this.baseUrl}${this.stadiumEndpoint}/update/${stadiumId}/image`, formData, { headers });
    }

    // Método para eliminar un estadio
    deleteStadium(stadiumId: number): Observable<any> {
        const headers = this.getHeaders();
        return this.http.delete(`${this.baseUrl}${this.stadiumEndpoint}/delete/${stadiumId}`, { headers });
    }
}