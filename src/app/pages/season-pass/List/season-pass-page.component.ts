import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common'; // <-- Para ngIf, ngFor, pipe date
import { MatToolbarModule } from '@angular/material/toolbar'; // <-- Para mat-toolbar
import { MatIconModule } from '@angular/material/icon'; // <-- Para mat-icon
import { MatButtonModule } from '@angular/material/button'; // <-- Para botones material
import { SeasonPassService } from '../../../services/season-pass.service';
import { Router } from '@angular/router';
import { GetSeasonPass } from '../../../Models/Season-pass.model';

@Component({
  selector: 'app-season-pass-page',
  standalone: true,
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule
  ], // <--- Importa aquí los módulos que usa el template
  templateUrl: './season-pass-page.component.html',
  styleUrls: ['./season-pass-page.component.css']
})
export class SeasonPassPageComponent implements OnInit {
  seasonPasses: GetSeasonPass[] = [];

  constructor(
    private seasonPassService: SeasonPassService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadSeasonPasses();
  }

  loadSeasonPasses(): void {
    this.seasonPassService.getAllSeasonPasses().subscribe(
      (data: GetSeasonPass[]) => { 
        console.log(data);
      },
      (error: GetSeasonPass) => { // También puedes especificar el tipo aquí
        console.error(error);
      }
    );

  }

  createNewSeasonPass(): void {
    this.router.navigate(['create-season-pass']);
  }

  toggleStatus(id: number): void {
    this.seasonPassService.toggleStatus(id).subscribe(
      () => this.loadSeasonPasses(),
      (error) => console.error('Error cambiando el estado', error)
    );
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
