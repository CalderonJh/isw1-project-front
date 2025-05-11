import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';  // Necesario para *ngFor


// Definir las interfaces para los datos del estadio
interface Stand {
  id: number;  // id es obligatorio
  name: string;
  capacity: number;
}

interface Stadium {
  id: number;
  name: string;
  stands: Stand[];
  image: string;
}

@Component({
  selector: 'app-stadium-page',
  templateUrl: './stadium-page.component.html',
  styleUrls: ['./stadium-page.component.css'],
  standalone: true, // Este es un componente independiente
  imports: [
    CommonModule,       // Necesario para *ngFor
    MatDialogModule,     // Para diálogos
    MatCardModule,       // Para tarjetas
    MatTableModule,      // Para tablas
    MatButtonModule,     // Para botones
    MatFormFieldModule,  // Para formularios
    MatInputModule,      // Para inputs
    FormsModule          // Para ngModel
  ]
})
export class StadiumPageComponent implements OnInit {
  stadiums: Stadium[] = [];
  token = 'tu_token_aqui'; // Token de autenticación

  private apiUrl = 'http://100.26.187.163/fpc/api/stadiums'; // URL base actualizada

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadStadiums();
  }

  // Cargar los estadios desde el backend
  loadStadiums() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.get<Stadium[]>(this.apiUrl, { headers })
      .subscribe(
        data => {
          this.stadiums = data;
        },
        error => {
          console.error('Error cargando estadios', error);
        }
      );
  }

  // Abrir diálogo para agregar estadio
  openAddStadiumDialog() {
    const dialogRef = this.dialog.open(StadiumDialogComponent, {
      width: '400px',
      data: { nombre: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        const newStadium = {
          stadium: {
            id: 0, 
            name: result, 
            stands: [] 
          },
          image: '' 
        };
        this.http.post<any>(this.apiUrl, newStadium, { headers })
          .subscribe(() => {
            this.loadStadiums();
          });
      }
    });
  }

  // Abrir diálogo para agregar tribuna
  openAddTribunaDialog(stadium: Stadium) {
    const dialogRef = this.dialog.open(TribunaDialogComponent, {
      width: '400px',
      data: { estadioId: stadium.id, nombre: '', capacidad: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tribuna: Stand = { 
          id: Math.floor(Math.random() * 1000), // Generamos un id temporal para la tribuna
          name: result.nombre,
          capacity: result.capacidad
        };
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        this.http.post<any>(`${this.apiUrl}/${stadium.id}/stands`, tribuna, { headers })
          .subscribe(() => {
            this.loadStadiums();
          });
      }
    });
  }

  // Eliminar tribuna
  deleteTribuna(stadium: Stadium, tribuna: Stand) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.delete<any>(`${this.apiUrl}/${stadium.id}/stands/${tribuna.id}`, { headers })
      .subscribe(() => {
        this.loadStadiums();
      });
  }

}

// Componente de Diálogo para agregar estadio
@Component({
  selector: 'app-stadium-dialog',
  template: `
    <h2 mat-dialog-title>Agregar Estadio</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Nombre del Estadio</mat-label>
        <input matInput [(ngModel)]="data.nombre" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="data.nombre">Agregar</button>
    </mat-dialog-actions>
  `,
})
export class StadiumDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StadiumDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// Componente de Diálogo para agregar tribuna
@Component({
  selector: 'app-tribuna-dialog',
  template: `
    <h2 mat-dialog-title>Agregar Tribuna</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Nombre de la Tribuna</mat-label>
        <input matInput [(ngModel)]="data.nombre" />
      </mat-form-field>
      <mat-form-field appearance="fill">
        <mat-label>Capacidad</mat-label>
        <input matInput type="number" [(ngModel)]="data.capacidad" />
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="data">Agregar</button>
    </mat-dialog-actions>
  `,
})
export class TribunaDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<TribunaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
