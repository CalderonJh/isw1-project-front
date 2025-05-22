import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { SeasonPassService } from '../../../services/season-pass.service';

@Component({
  selector: 'app-create-season-pass-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],  // Asegúrate de que todos los módulos estén importados
  templateUrl: './create-season-pass-page.component.html',
  styleUrls: ['./create-season-pass-page.component.css']
})
export class CreateSeasonPassPageComponent {
  seasonPassData = {
    price: 0,
    image: '',
    startDate: '',
    endDate: '',
    selectedMatches: [] as number[]
  };

  // Propiedades para los partidos y fechas
  partidoSeleccionado: any = null;
  saleStartDate: Date | null = null;
  saleEndDate: Date | null = null;
  standPrices: any[] = [];

  availableMatches = [
    { id: 1, name: 'Partido 1' },
    { id: 2, name: 'Partido 2' },
    { id: 3, name: 'Partido 3' }
  ];

  constructor(
    private seasonPassService: SeasonPassService,
    private router: Router
  ) { }

  // Maneja la selección de partidos
  onMatchSelect(event: any): void {
    const matchId = event.target.value;
    if (event.target.checked) {
      this.seasonPassData.selectedMatches.push(matchId);
    } else {
      this.seasonPassData.selectedMatches = this.seasonPassData.selectedMatches.filter(id => id !== matchId);
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.seasonPassData.image = file;
      console.log('Archivo seleccionado:', file);
    }
  }

  guardarOferta(): void {
    // Lógica para guardar la oferta
    console.log('Oferta guardada');
    // Llamar a un servicio o realizar alguna acción aquí
  }

  cancelarOferta(): void {
    // Lógica para cancelar la oferta
    console.log('Oferta cancelada');
    // Resetear o redirigir a alguna página, si es necesario
  }

  // Crea el nuevo abono
  createSeasonPass(): void {
    this.seasonPassService.createSeasonPass(this.seasonPassData).subscribe(
      (response) => {
        console.log('Abono creado con éxito', response);
        this.router.navigate(['/season-pass']);
      },
      (error) => {
        console.error('Error creando el abono', error);
      }
    );
  }

  // Redirige a la página de inicio (adminhome)
  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  // Cierra sesión
  logout(): void {
    this.router.navigate(['']);
  }
}
