// src/app/tribunes/tribunes.component.ts
import { Component, OnInit } from '@angular/core';
import { TribunesService } from '../service_app/tribunes.service';

@Component({
  selector: 'app-tribunes',
  templateUrl: './tribunes.component.html',
  styleUrls: ['./tribunes.component.css']
})
export class TribunesComponent implements OnInit {
  tribunes: any[] = [];
  newTribune = { name: '' };  // Ajusta el modelo según tu API

  constructor(private tribunesService: TribunesService) {}

  ngOnInit(): void {
    this.loadTribunes();
  }

  loadTribunes(): void {
    this.tribunesService.getTribunes().subscribe(data => {
      this.tribunes = data;
    });
  }

  createTribune(): void {
    this.tribunesService.createTribune(this.newTribune).subscribe(() => {
      this.loadTribunes();  // Recarga la lista después de crear una nueva tribuna.
    });
  }

  deleteTribune(id: number): void {
    this.tribunesService.deleteTribune(id).subscribe(() => {
      this.loadTribunes();  // Recarga la lista después de eliminar una tribuna.
    });
  }
}
