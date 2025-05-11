import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; // Necesario para *ngFor
import { MatDialogModule } from '@angular/material/dialog'; // Asegúrate de importar MatDialogModule correctamente
import { Router } from '@angular/router'; // Asegúrate de importar Router
import { AuthService } from '../../services/login.user.service';

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
    MatToolbarModule,
    MatInputModule,
    MatIconModule,
    FormsModule, // Necesario para usar ngModel
  ],
  templateUrl: './stadium-page.component.html',
  styleUrls: ['./stadium-page.component.css'],
})
export class StadiumPageComponent implements OnInit {
  stadiums: Stadium[] = [];

  // URL de la API para obtener todos los estadios
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium/all';

  constructor(private http: HttpClient, public dialog: MatDialog, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadStadiums();
  }

  loadStadiums() {
    const token = this.authService.getToken(); // Obtener el token del AuthService

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, // Usar el token del AuthService
      'Content-Type': 'application/json'  // Asegúrate de que el tipo de contenido esté correcto
    });

    this.http.get<Stadium[]>(this.apiUrl, { headers })
      .subscribe(
        data => {
          this.stadiums = data;
        },
        error => {
          console.error('Error cargando estadios', error);
          if (error.status === 403) {
            alert('No tienes permiso para acceder a esta información. Verifica tu token.');
          }
        }
      );
  }

  // Método para crear un estadio
  openAddStadiumDialog() {
    const dialogRef = this.dialog.open(StadiumDialog, {
      width: '400px',
      data: { nombre: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const token = this.authService.getToken(); // Obtener el token del AuthService

        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        const newStadium = {
          stadium: {
            id: 0,
            name: result,
            stands: []
          },
          image: ''
        };

        // Ruta para crear un nuevo estadio
        this.http.post<any>('http://100.26.187.163/fpc/api/club-admin/stadium/create', newStadium, { headers })
          .subscribe(() => {
            this.loadStadiums(); // Recarga la lista de estadios
          });
      }
    });
  }

  // Método para agregar una tribuna
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

        const token = this.authService.getToken(); // Obtener el token del AuthService

        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        });

        // Ruta para agregar una tribuna a un estadio
        this.http.post<any>(`${this.apiUrl}/${stadium.id}/stands`, tribuna, { headers })
          .subscribe(() => {
            this.loadStadiums(); // Recarga la lista de estadios
          });
      }
    });
  }

  // Método para eliminar una tribuna
  deleteTribuna(stadium: Stadium, tribuna: Stand) {
    const token = this.authService.getToken(); // Obtener el token del AuthService

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Ruta para eliminar una tribuna
    this.http.delete<any>(`${this.apiUrl}/${stadium.id}/stands/${tribuna.id}`, { headers })
      .subscribe(() => {
        this.loadStadiums(); // Recarga la lista de estadios
      });
  }

  // Método para eliminar un estadio
  deleteStadium(stadium: Stadium) {
    const token = this.authService.getToken(); // Obtener el token del AuthService

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    // Ruta para eliminar un estadio
    this.http.delete<any>(`http://100.26.187.163/fpc/api/club-admin/stadium/delete/${stadium.id}`, { headers })
      .subscribe(() => {
        this.loadStadiums(); // Recarga la lista de estadios
      });
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']);
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
  ) { }

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
  ) { }

  onNoClick(): void {
    this.dialogRef.close();
  }
}