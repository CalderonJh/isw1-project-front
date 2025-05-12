import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
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
  image: string;
  imageUrl?: string;
}

@Injectable({
  providedIn: 'root'
})
export class StadiumService {
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders(): HttpHeaders | null {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ 'Authorization': `Bearer ${token}` }) : null;
  }

  getAllStadiums(): Observable<Stadium[]> {
    const headers = this.getHeaders();
    if (!headers) return of([]);

    return this.http.get<Stadium[]>(`${this.apiUrl}/all`, { headers }).pipe(
      switchMap(stadiums => {
        const requests = stadiums.map(stadium => {
          if (stadium.image) {
            return this.http.get<{ url: string }>(`http://100.26.187.163/fpc/api/images/${stadium.image}`, { headers })
              .pipe(
                map(res => ({ ...stadium, imageUrl: res.url })),
                catchError(() => of({ ...stadium, imageUrl: 'assets/img/error.jpg' }))
              );
          } else {
            return of({ ...stadium, imageUrl: 'assets/img/defecto.jpg' });
          }
        });
        return forkJoin(requests);
      })
    );
  }

  createStadium(stadiumData: any, image?: File): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const formData = new FormData();
    formData.append('stadium', new Blob([JSON.stringify(stadiumData)], { type: 'application/json' }));
    if (image) formData.append('image', image);

    return this.http.post(`${this.apiUrl}/create`, formData, { headers });
  }

  updateStadium(stadium: Stadium): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const payload = {
      id: stadium.id,
      name: stadium.name,
      stands: stadium.stands,
      imageId: stadium.image
    };

    return this.http.put(`${this.apiUrl}/update/${stadium.id}`, payload, { headers });
  }

  updateStadiumImage(stadiumId: number, image: File): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    const formData = new FormData();
    formData.append('image', image);

    return this.http.put(`${this.apiUrl}/update/${stadiumId}/image`, formData, { headers });
  }

  deleteStadium(stadiumId: number): Observable<any> {
    const headers = this.getHeaders();
    if (!headers) return of(null);

    return this.http.delete(`${this.apiUrl}/delete/${stadiumId}`, { headers });
  }
}
