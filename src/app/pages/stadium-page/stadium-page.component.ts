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
import { forkJoin, of } from 'rxjs';
import { switchMap, map, catchError } from 'rxjs/operators';
import { AuthService } from '../../services/login.user.service';

interface Stand {
  name: string;
  capacity: number;
}

interface Stadium {
  id: number;
  name: string;
  stands: Stand[];
  image: string; // Este es el publicId
  imageUrl?: string; // Esta es la URL real que se mostrará
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
  private apiUrl = 'http://100.26.187.163/fpc/api/club-admin/stadium';

  constructor(private http: HttpClient, public dialog: MatDialog, private router: Router, private authService: AuthService) { }

  ngOnInit(): void {
    this.loadStadiums();
  }

  loadStadiums() {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.get<Stadium[]>(`${this.apiUrl}/all`, { headers })
      .pipe(
        switchMap((stadiums) => {
          const requests = stadiums.map(stadium => {
            if (stadium.image) {
              return this.http
                .get<{ url: string }>(`http://100.26.187.163/fpc/api/images/${stadium.image}`, { headers })
                .pipe(
                  map(response => ({ ...stadium, imageUrl: response.url })),
                  catchError(() => of({ ...stadium, imageUrl: 'assets/img/error.jpg' })) // Imagen de error
                );
            } else {
              return of({ ...stadium, imageUrl: 'assets/img/defecto.jpg' }); // Imagen por defecto
            }
          });

          return forkJoin(requests);
        })
      )
      .subscribe((finalStadiums: Stadium[]) => {
        this.stadiums = finalStadiums;
      });
  }


  openAddStadiumDialog() {
    const dialogRef = this.dialog.open(StadiumDialog, {
      width: '500px',
      data: { name: '', image: null }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.name) {
        const token = this.authService.getToken();
        if (!token) return;

        const formData = new FormData();
        const defaultStand = { name: 'Tribuna Principal', capacity: 1000 };

        const stadiumData = {
          name: result.name,
          stands: [defaultStand],
          imageId: ''
        };

        formData.append('stadium', new Blob([JSON.stringify(stadiumData)], { type: 'application/json' }));
        if (result.image) formData.append('image', result.image);

        const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

        this.http.post(`${this.apiUrl}/create`, formData, { headers })
          .subscribe(() => this.loadStadiums());
      }
    });
  }

  openAddTribunaDialog(stadium: Stadium) {
    const dialogRef = this.dialog.open(TribunaDialog, {
      width: '400px',
      data: { nombre: '', capacidad: '' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.nombre && result?.capacidad) {
        stadium.stands.push({ name: result.nombre, capacity: +result.capacidad });
        this.updateStadium(stadium);
      }
    });
  }

  updateStadium(stadium: Stadium) {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    });

    const payload = {
      id: stadium.id,
      name: stadium.name,
      stands: stadium.stands,
      imageId: stadium.image
    };

    this.http.put(`${this.apiUrl}/update/${stadium.id}`, payload, { headers })
      .subscribe(() => this.loadStadiums());
  }

  updateStadiumImage(stadiumId: number, image: File) {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });
    const formData = new FormData();
    formData.append('image', image);

    this.http.put(`${this.apiUrl}/update/${stadiumId}/image`, formData, { headers })
      .subscribe(() => this.loadStadiums());
  }

  deleteStadium(stadium: Stadium) {
    const token = this.authService.getToken();
    if (!token) return;

    const headers = new HttpHeaders({ 'Authorization': `Bearer ${token}` });

    this.http.delete(`${this.apiUrl}/delete/${stadium.id}`, { headers })
      .subscribe(() => this.loadStadiums());
  }

  deleteTribuna(stadium: Stadium, tribuna: Stand) {
    stadium.stands = stadium.stands.filter(t => t.name !== tribuna.name);
    this.updateStadium(stadium);
  }

  editTribunaDialog(stadium: Stadium, tribuna: Stand) {
    const dialogRef = this.dialog.open(TribunaDialog, {
      width: '400px',
      data: { nombre: tribuna.name, capacidad: tribuna.capacity }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        tribuna.name = result.nombre;
        tribuna.capacity = +result.capacidad;
        this.updateStadium(stadium);
      }
    });
  }


  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  logout(): void {
    this.router.navigate(['']);
  }

  onImageSelected(event: Event, stadiumId: number) {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.updateStadiumImage(stadiumId, file);
    }
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