import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { Observable, of, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { AuthService } from './login.user.service';

export interface Stand {
  name: string;
  capacity: number;
}

export interface Stadium {
  id: number;
  name: string;
  stands: Stand[];
  image: string;           // Public ID
}

export interface StadiumWithImage extends Stadium {
  imageUrl: SafeUrl;       // Sanitized URL
}

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
  ) {}

  private getHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getAllStadiums(): Observable<StadiumWithImage[]> {
    const headers = this.getHeaders();

    return this.http.get<Stadium[]>(`${this.baseUrl}${this.stadiumEndpoint}/all`, { headers }).pipe(
      switchMap(stadiums => {
        if (!stadiums.length) return of([]);

        const requests = stadiums.map(stadium =>
          this.getImageUrl(stadium.image).pipe(
            map(imageUrl => ({
              ...stadium,
              imageUrl
            }))
          )
        );

        return forkJoin(requests);
      })
    );
  }

  private getImageUrl(imageId: string): Observable<SafeUrl> {
    if (!imageId) {
      return of(this.sanitizer.bypassSecurityTrustUrl('assets/img/defecto.jpg'));
    }

    return this.http.get(`${this.baseUrl}${this.imageEndpoint}${imageId}`, {
      headers: this.getHeaders(),
      responseType: 'text'
    }).pipe(
      map(response => {
        try {
          const parsed = JSON.parse(response);
          const realUrl = parsed.url || 'assets/img/error.jpg';
          return this.sanitizer.bypassSecurityTrustUrl(realUrl);
        } catch (e) {
          console.error('Error parsing image URL:', e);
          return this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg');
        }
      }),
      catchError(() => of(this.sanitizer.bypassSecurityTrustUrl('assets/img/error.jpg')))
    );
  }

  createStadium(stadiumData: any, image?: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('stadium', new Blob([JSON.stringify(stadiumData)], { type: 'application/json' }));
    if (image) formData.append('image', image);

    return this.http.post(`${this.baseUrl}${this.stadiumEndpoint}/create`, formData, { headers });
  }

  updateStadium(stadium: Stadium): Observable<any> {
    const headers = this.getHeaders();
    const payload = {
      id: stadium.id,
      name: stadium.name,
      stands: stadium.stands,
      imageId: stadium.image
    };

    return this.http.put(`${this.baseUrl}${this.stadiumEndpoint}/update/${stadium.id}`, payload, { headers });
  }

  updateStadiumImage(stadiumId: number, image: File): Observable<any> {
    const headers = this.getHeaders();
    const formData = new FormData();
    formData.append('image', image);

    return this.http.put(`${this.baseUrl}${this.stadiumEndpoint}/update/${stadiumId}/image`, formData, { headers });
  }

  deleteStadium(stadiumId: number): Observable<any> {
    const headers = this.getHeaders();
    return this.http.delete(`${this.baseUrl}${this.stadiumEndpoint}/delete/${stadiumId}`, { headers });
  }
}
