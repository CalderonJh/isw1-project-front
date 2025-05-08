// src/app/app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http'; // Importación añadida
import { AuthGuard} from './services/auth.guard.service'; // Asegúrate que la ruta es correcta
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { ReactiveFormsModule } from '@angular/forms';7
import { DialogOverviewExampleDialog } from '..//app/components/path-to-dialog/path-to-dialog.component';  // Ajusta la ruta según tu estructura


@NgModule({
  imports: [
    BrowserModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    HttpClientModule, // Importante para que funcionen las peticiones HTTP
    // ... otros módulos que necesites
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthGuard, // Corregido "uscClass" a "useClass"
      multi: true
    }
    // ... otros providers
  ],
   // Asegúrate de tener esto si usas AppComponent
})
export class AppModule { }