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
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from '../../services/login.user.service';

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
  templateUrl: './stadium-page.component.html',
  styleUrls: ['./stadium-page.component.css'],
})
export class StadiumPageComponent implements OnInit {
  stadiums: Stadium[] = [];
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium/all';

  constructor(private http: HttpClient, public dialog: MatDialog, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadStadiums();
  }

  loadStadiums() {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
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

  openAddStadiumDialog() {
    const dialogRef = this.dialog.open(StadiumDialog, {
      width: '500px',
      data: { name: '', image: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.name) {
        const token = this.authService.getToken();

        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const formData = new FormData();

        // Crear tribuna por defecto
        const defaultStand = {
          name: 'Tribuna Principal',
          capacity: 1000  // Capacidad por defecto
        };

        // Crear objeto stadium con tribuna incluida
        const stadiumData = {
          name: result.name,
          image: result.image ? result.image.name : null,
          stands: [defaultStand]  // Incluir la tribuna por defecto
        };

        formData.append('stadium', new Blob([JSON.stringify(stadiumData)], {
          type: 'application/json'
        }));

        // Si hay imagen, añadirla al FormData
        if (result.image) {
          formData.append('image', result.image);
        }

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });

        this.http.post<any>('http://100.26.187.163/fpc/api/club-admin/stadium/create', formData, { headers })
          .subscribe(() => {
            this.loadStadiums();
          }, error => {
            console.error('Error al crear estadio', error);
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
        const token = this.authService.getToken();

        if (!token) {
          console.error('No se encontró el token');
          return;
        }

        const formData = new FormData();
        formData.append('name', result.nombre);
        formData.append('capacity', result.capacidad);

        const headers = new HttpHeaders({
          'Authorization': `Bearer ${token}`,
        });

        this.http.post<any>(`${this.apiUrl}/${stadium.id}/stands`, formData, { headers })
          .subscribe(() => {
            this.loadStadiums();
          });
      }
    });
  }

  deleteTribuna(stadium: Stadium, tribuna: Stand) {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    this.http.delete<any>(`${this.apiUrl}/${stadium.id}/stands/${tribuna.id}`, { headers })
      .subscribe(() => {
        this.loadStadiums();
      });
  }

  deleteStadium(stadium: Stadium) {
    const token = this.authService.getToken();

    if (!token) {
      console.error('No se encontró el token');
      return;
    }

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
    });

    this.http.delete<any>(`http://100.26.187.163/fpc/api/club-admin/stadium/delete/${stadium.id}`, { headers })
      .subscribe(() => {
        this.loadStadiums();
      });
  }

  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }
}

@Component({
  selector: 'stadium-dialog',
  template: `
    <h2 mat-dialog-title>Agregar Estadio</h2>
    <mat-dialog-content>
      <mat-form-field appearance="fill">
        <mat-label>Nombre del Estadio</mat-label>
        <input matInput [(ngModel)]="data.name" />
      </mat-form-field>
      <input type="file" (change)="onFileSelected($event)" accept="image/*">
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button [mat-dialog-close]="data">Agregar</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
})
export class StadiumDialog {
  constructor(
    public dialogRef: MatDialogRef<StadiumDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      this.data.image = file;
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

@Component({
  selector: 'tribuna-dialog',
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
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
  ],
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