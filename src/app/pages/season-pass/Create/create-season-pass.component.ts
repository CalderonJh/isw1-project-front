import { Component, OnInit } from '@angular/core';
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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StadiumService } from '../../../services/stadium.service';
import { SeasonPassService } from '../../../services/season-pass.service';
import { Stadium } from '../../../Models/Stadium.model';
import { Partido } from '../../../Models/Partido.model';

@Component({
  selector: 'app-create-season-pass-page',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule, MatSelectModule, MatOptionModule, MatIconModule, MatButtonModule, MatToolbarModule, MatDatepickerModule, MatNativeDateModule, MatFormFieldModule, MatInputModule],
  templateUrl: './create-season-pass-page.component.html',
  styleUrls: ['./create-season-pass-page.component.css']
})
export class CreateSeasonPassComponent implements OnInit {
  stadiums: Stadium[] = [];
  matches: Partido[] = [];
  selectedStadium: number | undefined;
  selectedMatch: number | undefined;
  selectedStand: number | undefined;
  standPrice: number | undefined;
  startDateValue: Date | undefined;
  endDateValue: Date | undefined;
  selectedImage: File | undefined;


  constructor(
    private seasonPassService: SeasonPassService,
    private stadiumService: StadiumService,
    private snackBar: MatSnackBar,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStadiums();
  }

  loadStadiums() {
    this.stadiumService.getAllStadiums().subscribe(
      (data) => {
        this.stadiums = data;
      },
      (error) => {
        this.snackBar.open('Error al cargar los estadios', '', { duration: 3000 });
      }
    );
  }

  loadMatches() {
    if (!this.selectedStadium) {
      return;
    }
    this.seasonPassService.getMatches(this.selectedStadium).subscribe(
      (data) => {
        this.matches = data;
      },
      (error) => {
        this.snackBar.open('Error al cargar los partidos', '', { duration: 3000 });
      }
    );
  }

  onImageSelect(event: any) {
    this.selectedImage = event.target.files[0];
  }

  submitOffer() {
    if (!this.selectedMatch || !this.selectedStand || !this.standPrice || !this.startDateValue || !this.endDateValue) {
      this.snackBar.open('Todos los campos son obligatorios', '', { duration: 3000 });
      return;
    }

    const offerData = {
      description: 'string',
      year: new Date().getFullYear(),
      season: 1,
      matchIds: [this.selectedMatch],
      standPrices: [
        {
          standId: this.selectedStand,
          price: this.standPrice,
          isDisabled: false
        }
      ],
      startDate: this.startDateValue.toISOString(),
      endDate: this.endDateValue.toISOString()
    };

    if (!this.selectedImage) {
      this.snackBar.open('Por favor, selecciona una imagen', '', { duration: 3000 });
      return;
    }


    this.seasonPassService.createOffer(offerData, this.selectedImage).subscribe(
      (response) => {
        this.snackBar.open('Abono creado con éxito', '', { duration: 3000 });
      },
      (error) => {
        this.snackBar.open('Error al crear el abono', '', { duration: 3000 });
      }
    );
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
}
