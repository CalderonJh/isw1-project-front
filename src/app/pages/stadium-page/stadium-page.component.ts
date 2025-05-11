import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { MatDialogModule } from '@angular/material/dialog'; // Importar MatDialogModule correctamente

// Definir las interfaces para los datos del estadio
interface Stand {
  id: number;
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
  standalone: true,
  imports: [
    CommonModule, // Necesario para *ngFor
    MatDialogModule, // Asegúrate de que MatDialogModule esté importado aquí
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Necesario para usar ngModel
  ],
  templateUrl: './stadium-page.component.html',
  styleUrls: ['./stadium-page.component.css'],
})
export class StadiumPageComponent implements OnInit {
  stadiums: Stadium[] = [];
  token = 'tu_token_aqui'; // Token de autenticación
  private apiUrl = 'http://100.26.187.163/fpc/api/stadiums'; // URL base

  constructor(private http: HttpClient, public dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadStadiums();
  }

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

  openAddStadiumDialog() {
    const dialogRef = this.dialog.open(StadiumDialog, {
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

  openAddTribunaDialog(stadium: Stadium) {
    const dialogRef = this.dialog.open(TribunaDialog, {
      width: '400px',
      data: { estadioId: stadium.id, nombre: '', capacidad: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const tribuna: Stand = {
          id: Math.floor(Math.random() * 1000),
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

  deleteTribuna(stadium: Stadium, tribuna: Stand) {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
    this.http.delete<any>(`${this.apiUrl}/${stadium.id}/stands/${tribuna.id}`, { headers })
      .subscribe(() => {
        this.loadStadiums();
      });
  }
}

// Diálogo para agregar estadio
@Component({
  selector: 'stadium-dialog',
  imports: [
    CommonModule, // Necesario para *ngFor
    MatDialogModule, // Asegúrate de que MatDialogModule esté importado aquí
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Necesario para usar ngModel
  ],
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
export class StadiumDialog {
  constructor(
    public dialogRef: MatDialogRef<StadiumDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

// Diálogo para agregar tribuna
@Component({
  selector: 'tribuna-dialog',
  imports: [
    CommonModule, // Necesario para *ngFor
    MatDialogModule, // Asegúrate de que MatDialogModule esté importado aquí
    MatCardModule,
    MatTableModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule, // Necesario para usar ngModel
  ],
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
export class TribunaDialog {
  constructor(
    public dialogRef: MatDialogRef<TribunaDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
