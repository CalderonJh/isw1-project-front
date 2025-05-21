import { Component, OnInit } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { CreateTicketOffersDialog } from './create-ticket-offers-dialog.component';
import { CreateTicketOffersService } from '../../services/create-ticket-offers.service';
import { Partido } from '../../Models/Partido.model';
import { Club } from '../../Models/Club.model';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'


@Component({
  selector: 'app-create-ticket-offers-page',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,

    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
  ],
  templateUrl: './create-ticket-offers-page.component.html',
  styleUrls: ['./create-ticket-offers-page.component.css'],
})

export class CreateTicketOffersPageComponent implements OnInit {
  partidos: Partido[] = [];
  clubs: Club[] = [];
  partidoSeleccionado?: Partido;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private crea: CreateTicketOffersService
  ) {}

  ngOnInit(): void {
    this.loadMatches();
    this.loadClubs();
  }

  loadMatches(): void {
    this.crea.getAllMatches().subscribe({
      next: (data) => {
        this.partidos = data;
      },
      error: (err) => {
        console.error('Error cargando partidos', err);
      }
    });
  }

  loadClubs(): void {
  this.crea.getClubs().subscribe({
    next: data => this.clubs = data,
    error: err => console.error('Error cargando clubes', err)
  });
  }

  getClubName(id: number): string {
  const club = this.clubs.find(c => c.clubId === id);
  return club ? club.name : 'Desconocido';
  }

  openDialog(): void {
  const dialogRef = this.dialog.open(CreateTicketOffersDialog, {
    width: '700px',  // más ancho para que se vea mejor
    maxWidth: '90vw', // para que no se salga en pantallas pequeñas
    data: null
  });

  dialogRef.afterClosed().subscribe(result => {
    if (result && result.matchId) {
      this.partidoSeleccionado = this.partidos.find(p => p.matchId === result.matchId);
    }
  });
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
  boletasActivadas: boolean = true;
  fechaProgramada: Date | null = null;
  horaProgramada: string = '';

}
