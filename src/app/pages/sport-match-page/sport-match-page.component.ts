import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
} from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router } from '@angular/router';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog'; // Importa MatDialog
import { FormBuilder, FormGroup, FormsModule } from '@angular/forms'; // Importa FormBuilder y FormGroup
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-sport-match-page',
  imports: [MatTableModule, MatIconModule, MatButtonModule, MatToolbarModule],
  templateUrl: './sport-match-page.component.html',
  standalone: true,
  styleUrls: ['./sport-match-page.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SportMatchPageComponent {
  partidoForm: FormGroup; // Define el formulario reactivo

  constructor(
    private router: Router,
    private dialog: MatDialog, // Agrega el servicio MatDialog
    private fb: FormBuilder, // Agrega FormBuilder para crear el formulario reactivo
  ) {
    // Crea el formulario reactivo
    this.partidoForm = this.fb.group({
      equipoVisitante: [''],
      estadio: [''],
      temporada: this.fb.group({
        anio: [''],
        periodo: [''],
      }),
      inicio: this.fb.group({
        fecha: [''],
        hora: [''],
      }),
    });
  }

  // Función para ir al inicio
  navigateToHome(): void {
    this.router.navigate(['adminhome']); // Navega a la página principal del admin
  }

  // Función para cerrar sesión (Logout)
  logout(): void {
    this.router.navigate(['']); // Redirige a la página de login
  }

  // Abre el dialogo del partido
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result !== undefined) {
        console.log('Dialog result:', result);
      }
    });
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './dialog-overview-example-dialog.html',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
  ],
  standalone: true,
})
export class DialogOverviewExampleDialog {
  readonly dialogRef = inject(MatDialogRef<DialogOverviewExampleDialog>);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface DialogData {
  animal: string;
  name: string;
}
