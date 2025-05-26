import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, of } from 'rxjs';
import { AuthService } from '../../services/login.user.service';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    MatIconModule,
    MatToolbarModule,
    MatProgressSpinnerModule,
    CommonModule,  // Asegúrate de que CommonModule esté importado
  ],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent implements OnInit {
  shortName = '';  // Para mostrar el nombre corto del club
  clubImageUrl = '';  // Imagen por defecto en caso de error
  isLoading = true;  // Variable para controlar si los datos se están cargando

  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/my-club';
  private imageBaseUrl = 'http://100.26.187.163/fpc/api/images/';

  club: any = {};  // Objeto para almacenar los datos del club

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Realizar la primera petición para obtener los datos del club
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    this.http.get<{ id: number; name: string; shortName: string; imageId: string }>(this.apiUrl, { headers })
      .pipe(
        catchError(err => {
          console.error('Error fetching club:', err);
          return of(null);
        })
      )
      .subscribe(club => {
        if (club) {
          this.shortName = club.shortName; // Asignar el nombre corto
          this.club = club; // Guardar todo el objeto del club
          // Realizar la segunda petición para obtener la URL de la imagen
          if (club.imageId) {
            this.getImageUrl(club.imageId);
          }
        }
        this.isLoading = false; // Cuando los datos están listos, cambia a false
      });
  }

  // Método para obtener la URL de la imagen usando el imageId
  getImageUrl(imageId: string): void {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${this.authService.getToken()}`
    });

    const imageUrl = `${this.imageBaseUrl}${imageId}`;
    this.http.get<{ url: string }>(imageUrl, { headers }).subscribe({
      next: (response) => {
        if (response && response.url) {
          this.clubImageUrl = response.url;  // Asignar la URL de la imagen
        }
      },
      error: (err) => {
        console.error('Error fetching image:', err);
        this.clubImageUrl = 'assets/img/defecto.jpg';  // Imagen por defecto en caso de error
      }
    });
  }

  getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // Redirigir al inicio
  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  // Cerrar sesión
  logout(): void {
    this.router.navigate(['']);
  }
}
