// src/app/stadiums/stadiums.component.ts
import { Component, OnInit } from '@angular/core';
import { StadiumsService } from '../service_app/stadiums.service';

@Component({
  selector: 'app-stadiums',
  templateUrl: './stadiums.component.html',
  styleUrls: ['./stadiums.component.css']
})
export class StadiumsComponent implements OnInit {
  stadiums: any[] = [];
  newStadium = { name: '' };  // Ajusta el modelo según tu API

  constructor(private stadiumsService: StadiumsService) {}

  ngOnInit(): void {
    this.loadStadiums();
  }

  loadStadiums(): void {
    this.stadiumsService.getStadiums().subscribe(data => {
      this.stadiums = data;
    });
  }

  createStadium(): void {
    this.stadiumsService.createStadium(this.newStadium).subscribe(() => {
      this.loadStadiums();  // Recarga la lista después de crear uno nuevo.
    });
  }

  deleteStadium(id: number): void {
    this.stadiumsService.deleteStadium(id).subscribe(() => {
      this.loadStadiums();  // Recarga la lista después de eliminar uno.
    });
  }
}
