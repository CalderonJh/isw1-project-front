import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTableModule } from '@angular/material/table';
import { MatDialogModule } from '@angular/material/dialog';
import { Stadium, StadiumWithImage } from '../../Models/Stadium.model';
import { StadiumService } from '../../services/stadium.service';
import { StadiumDialog } from './stadium-dialog.component';
import { TribunaDialog } from './tribuna-dialog.component';

@Component({
  selector: 'app-stadium-page',
  standalone: true,
  templateUrl: './stadium-page.component.html',
  styleUrls: ['./stadium-page.component.css'],
  imports: [
    CommonModule,
    MatDialogModule,
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
  ],
})
export class StadiumPageComponent implements OnInit {
  stadiums: StadiumWithImage[] = [];

  constructor(
    private stadiumService: StadiumService,
    private dialog: MatDialog,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadStadiums();
  }

  loadStadiums(): void {
    this.stadiumService.getAllStadiums().subscribe(data => this.stadiums = data);
  }

  openAddStadiumDialog(): void {
    const dialogRef = this.dialog.open(StadiumDialog, {
      width: '500px',
      data: { name: '', image: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.name) {
        const stadiumData = {
          name: result.name,
          stands: [{ name: 'Tribuna Principal', capacity: 1000 }],
          imageId: ''
        };
        this.stadiumService.createStadium(stadiumData, result.image).subscribe(() => this.loadStadiums());
      }
    });
  }

  openAddTribunaDialog(stadium: Stadium): void {
    const dialogRef = this.dialog.open(TribunaDialog, {
      width: '400px',
      data: { nombre: '', capacidad: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.nombre && result?.capacidad) {
        const newStandId = stadium.stands.length ? Math.max(...stadium.stands.map(s => s.id)) + 1 : 1; // Assign a new unique standId
        stadium.stands.push({
          id: newStandId,
          name: result.nombre,
          capacity: +result.capacidad
        });
        this.stadiumService.updateStadium(stadium).subscribe(() => this.loadStadiums());
      }
    });
  }

  deleteTribuna(stadium: Stadium): void {
    stadium.stands = stadium.stands.filter(stand => stand.name !== 'Tribuna Principal'); // Ensure you're filtering by stand properties
    this.updateStadium(stadium);
  }

  updateStadium(stadium: Stadium): void {
    this.stadiumService.updateStadium(stadium).subscribe(() => this.loadStadiums());
  }

  updateStadiumImage(stadiumId: number, image: File): void {
    this.stadiumService.updateStadiumImage(stadiumId, image).subscribe(() => this.loadStadiums());
  }

  deleteStadium(stadium: Stadium): void {
    this.stadiumService.deleteStadium(stadium.id).subscribe(() => this.loadStadiums());
  }

  openEditTribunaDialog(stadium: Stadium, standId: number): void {
    const standToEdit = stadium.stands.find(stand => stand.id === standId); // Buscar el stand por su ID

    if (standToEdit) {
      const dialogRef = this.dialog.open(TribunaDialog, {
        width: '400px',
        data: { nombre: standToEdit.name, capacidad: standToEdit.capacity }
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          standToEdit.name = result.nombre;  // Modifica el 'name' del stand
          standToEdit.capacity = +result.capacidad;  // Modifica el 'capacity' del stand
          this.updateStadium(stadium);  // Actualiza el estadio
        }
      });
    }
  }


  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  onImageSelected(event: Event, stadiumId: number): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.updateStadiumImage(stadiumId, input.files[0]);
    }
  }
}
