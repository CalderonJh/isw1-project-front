import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SeasonPassService } from '../../../services/season-pass.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-season-pass-page',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],  // Necesario para *ngFor
  templateUrl: './season-pass-page.component.html',
  styleUrls: ['./season-pass-page.component.css']
})
export class SeasonPassPageComponent implements OnInit {
  seasonPasses: any[] = [];  // Aquí almacenamos todos los abonos disponibles

  constructor(
    private seasonPassService: SeasonPassService,  // Servicio que interactúa con el backend
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSeasonPasses();
  }

  // Cargar los abonos desde el servicio
  loadSeasonPasses(): void {
    this.seasonPassService.getAllSeasonPasses().subscribe(
      (data) => {
        this.seasonPasses = data;  // Almacena los abonos obtenidos en seasonPasses
      },
      (error) => {
        console.error('Error al cargar los abonos', error);
      }
    );
  }

  // Redirige a la página de creación de un nuevo abono
  createNewSeasonPass(): void {
    this.router.navigate(['create-season-pass']);  // Redirige a la ruta de creación de abono
  }
  
  // Método para cambiar el estado de un abono (activar/desactivar)
  toggleStatus(id: string): void {
    this.seasonPassService.toggleStatus(id).subscribe(
      (response) => {
        console.log('Estado actualizado', response);
        this.loadSeasonPasses();  // Recargar los abonos para reflejar el cambio
      },
      (error) => {
        console.error('Error cambiando el estado', error);
      }
    );
  }

  // Función para redirigir a la página de inicio (adminhome)
  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']);
  }  

}
