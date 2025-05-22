import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';  // Necesario para *ngFor
import { FormsModule } from '@angular/forms';  // Necesario para ngModel
import { SeasonPassService } from '../../../services/season-pass.service';

@Component({
  selector: 'app-create-season-pass-page',
  standalone: true,  // Esto hace que el componente sea standalone
  imports: [CommonModule, FormsModule],  // Importa los módulos necesarios
  templateUrl: './create-season-pass-page.component.html',
  styleUrls: ['./create-season-pass-page.component.css']
})
export class CreateSeasonPassPageComponent {
  seasonPassData = {
    price: 0,
    image: '',
    startDate: '',
    endDate: '',
    selectedMatches: [] as number[]  // Asegúrate de que sea un arreglo de números
  };

 // Definimos los partidos disponibles para la selección
  availableMatches = [
    { id: 1, name: 'Partido 1' },
    { id: 2, name: 'Partido 2' },
    { id: 3, name: 'Partido 3' },
    // Si los partidos provienen del backend, puedes cargarlos aquí
  ];

  constructor(
    private seasonPassService: SeasonPassService,
    private router: Router
  ) {}

  // Método para manejar la selección de partidos
  onMatchSelect(event: any): void {
    const matchId = event.target.value;
    if (event.target.checked) {
      // Si el partido es seleccionado, lo añadimos a la lista
      this.seasonPassData.selectedMatches.push(matchId);
    } else {
      // Si el partido es deseleccionado, lo eliminamos de la lista
      this.seasonPassData.selectedMatches = this.seasonPassData.selectedMatches.filter(id => id !== matchId);
    }
  }

  // Método para crear un nuevo abono
  createSeasonPass(): void {
    this.seasonPassService.createSeasonPass(this.seasonPassData).subscribe(
      (response) => {
        console.log('Abono creado con éxito', response);
        this.router.navigate(['/season-pass']);  // Redirige al listado de abonos
      },
      (error) => {
        console.error('Error creando el abono', error);
      }
    );
  }
}