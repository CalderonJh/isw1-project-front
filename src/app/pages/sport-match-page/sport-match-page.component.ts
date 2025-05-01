import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';  // Importante para los botones de mat-icon-button
import { MatToolbarModule } from '@angular/material/toolbar';  // Para la barra de herramientas

@Component({
  selector: 'app-sport-match-page',
  imports: [MatTableModule,MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './sport-match-page.component.html',
  standalone: true,
  styleUrl: './sport-match-page.component.css',
})
export class SportMatchPageComponent {
    // Datos de los partidos
    partidos = [
      { visitante: 'Equipo A', estadio: 'Estadio A', temporada: '2023', fecha: '2023-04-01' },
      { visitante: 'Equipo B', estadio: 'Estadio B', temporada: '2023', fecha: '2023-04-02' },
      { visitante: 'Equipo C', estadio: 'Estadio C', temporada: '2023', fecha: '2023-04-03' }
    ];
  
    displayedColumns: string[] = ['visitante', 'estadio', 'temporada', 'fecha'];
  }
