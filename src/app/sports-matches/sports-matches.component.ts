// src/app/sports-matches/sports-matches.component.ts
import { Component, OnInit } from '@angular/core';
import { SportsMatchesService } from '../sports-matches.service';

@Component({
  selector: 'app-sports-matches',
  templateUrl: './sports-matches.component.html',
  styleUrls: ['./sports-matches.component.css']
})
export class SportsMatchesComponent implements OnInit {
  matches: any[] = [];
  newMatch = { name: '', date: '', stadium: '', teams: '' };  // Ajusta el modelo según sea necesario

  constructor(private sportsMatchesService: SportsMatchesService) {}

  ngOnInit(): void {
    this.loadSportsMatches();
  }

  loadSportsMatches(): void {
    this.sportsMatchesService.getSportsMatches().subscribe(data => {
      this.matches = data;
    });
  }

  createSportsMatch(): void {
    this.sportsMatchesService.createSportsMatch(this.newMatch).subscribe(() => {
      this.loadSportsMatches();  // Recarga los encuentros después de crear uno nuevo.
    });
  }

  deleteSportsMatch(id: number): void {
    this.sportsMatchesService.deleteSportsMatch(id).subscribe(() => {
      this.loadSportsMatches();  // Recarga la lista después de eliminar uno.
    });
  }
}
