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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { ReactiveFormsModule } from '@angular/forms';
import { Stadium } from '../../Models/Stadium.model';
import { StadiumService } from '../../services/stadium.service';

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
    ReactiveFormsModule,
  ],
  templateUrl: './create-ticket-offers-page.component.html',
  styleUrls: ['./create-ticket-offers-page.component.css'],
})
export class CreateTicketOffersPageComponent implements OnInit {
  partidos: Partido[] = [];
  stadiums: Stadium[] = [];
  partidoSeleccionado: Partido | null = null;

  standPrices: { standId: number; standName: string; price: number; isDisabled: boolean }[] = [];

  saleStartDate: Date | null = null;
  saleEndDate: Date | null = null;
  fileSeleccionado: File | null = null;

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private crea: CreateTicketOffersService,
    private stadiumService: StadiumService
  ) { }

  ngOnInit(): void {
    this.loadMatches();
    this.loadStadiums();
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

  loadStadiums(): void {
    this.stadiumService.getAllStadiums().subscribe({
      next: (data) => {
        this.stadiums = data;
      },
      error: (err) => {
        console.error('Error cargando estadios', err);
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

        if (this.partidoSeleccionado) {
          // Cambiar stadiumId a stadium.id
          const stadium = this.stadiums.find(s => s.id === this.partidoSeleccionado!.stadium.id); // Cambié aquí
          if (stadium) {
            this.standPrices = stadium.stands.map((stand, index) => ({
              standId: index,
              standName: stand.name,
              price: 0,
              isDisabled: false,
            }));
          } else {
            this.standPrices = [];
          }
        }
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
    if (!this.saleStartDate) {
      alert('Por favor ingrese la fecha de inicio de venta');
      return;
    }
    if (!this.saleEndDate) {
      alert('Por favor ingrese la fecha de fin de venta');
      return;
    }

    const validStands = this.standPrices.filter(sp => sp.price > 0);
    if (validStands.length === 0) {
      alert('Por favor configure al menos un stand con precio válido');
      return;
    }

    const offer = {
      standPrices: validStands,
      saleStartDate: this.saleStartDate.toISOString(),
      saleEndDate: this.saleEndDate.toISOString(),
    };

    const formData = new FormData();
    formData.append('offer', new Blob([JSON.stringify(offer)], { type: 'application/json' }));
    formData.append('file', this.fileSeleccionado);

    this.crea.createTicketOffer(this.partidoSeleccionado.matchId!, formData).subscribe({
      next: () => {
        alert('Oferta creada exitosamente');
        this.resetForm();
        // Aquí redireccionas a la ruta deseada
        this.router.navigate(['']);
      },
      error: (error) => {
        console.error('Error creando oferta:', error);
        alert('Hubo un error al crear la oferta');
      }
    });
  }

  cancelarOferta() {
    this.resetForm();
  }

  private resetForm() {
    this.partidoSeleccionado = null;
    this.saleStartDate = null;
    this.saleEndDate = null;
    this.fileSeleccionado = null;
    this.standPrices = [];
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
