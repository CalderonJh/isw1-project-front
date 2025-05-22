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
  partidoSeleccionado: Partido | null = null;

  boletasActivadas: boolean = true;
  fechaProgramada: Date | null = null;
  horaProgramada: string = '';

  fileSeleccionado: File | null = null; // Para guardar el archivo seleccionado

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private crea: CreateTicketOffersService
  ) {}

  ngOnInit(): void {
    this.loadMatches();
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

  openDialog(): void {
    const dialogRef = this.dialog.open(CreateTicketOffersDialog, {
      width: '700px',
      maxWidth: '90vw',
      data: null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.matchId) {
        this.partidoSeleccionado = this.partidos.find(p => p.matchId === result.matchId) || null;
      }
    });
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.fileSeleccionado = file;
    }
  }

  guardarOferta() {
  if (!this.partidoSeleccionado) {
    alert('Por favor seleccione un partido antes de guardar');
    return;
  }
  if (!this.fileSeleccionado) {
    alert('Por favor seleccione un archivo para la oferta');
    return;
  }

  // No envíes matchId en el cuerpo, solo en la URL
  const offer = {
    awayClubDescription: this.partidoSeleccionado.visitante,
    matchDate: this.partidoSeleccionado.matchDate,
    fecha: this.fechaProgramada,
    hora: this.horaProgramada,
    activa: this.boletasActivadas,
  };

  const formData = new FormData();
  formData.append('offer', new Blob([JSON.stringify(offer)], { type: 'application/json' }));
  formData.append('file', this.fileSeleccionado);

  this.crea.createTicketOffer(this.partidoSeleccionado.matchId!, formData).subscribe({
    next: () => {
      alert('Oferta creada exitosamente');
      this.partidoSeleccionado = null;
      this.fechaProgramada = null;
      this.horaProgramada = '';
      this.fileSeleccionado = null;
    },
    error: (error) => {
      console.error('Error creando oferta:', error);
      alert('Hubo un error al crear la oferta');
    }
  });
  }

  cancelarOferta() {
    this.partidoSeleccionado = null;
    this.fechaProgramada = null;
    this.horaProgramada = '';
    this.fileSeleccionado = null;
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
}