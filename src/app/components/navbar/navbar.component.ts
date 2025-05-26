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
export class NavbarComponent {
  shortName = '';
  clubImageUrl = '';
  isLoading = false;
  club: any = {};

  ngOnInit(): void {
    this.cargarDatosClub();
  }

  constructor(private http: HttpClient, private authService: AuthService, private router: Router) {}

 cargarDatosClub(): void {
    this.isLoading = true;
    this.authService.getClub().subscribe(club => {
      if (club) {
        this.club = club;
        this.shortName = club.shortName;
        if (club.imageId) {
          this.authService.getImageUrl(club.imageId).subscribe(imageUrl => {
            this.clubImageUrl = imageUrl;
          });
        }
      }
      this.isLoading = false;
    });
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
