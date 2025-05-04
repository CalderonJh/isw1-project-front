import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';  // Importa FormsModule si usas ngModel
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { RouterModule } from '@angular/router';  // Asegúrate de importar RouterModule

import { AppComponent } from './app.component';
import { CrearPartidoComponent } from './crear-partido/crear-partido.component';  // Importa el componente CrearPartido

@NgModule({
  declarations: [
    AppComponent,  // Declara AppComponent
    CrearPartidoComponent  // Declara CrearPartidoComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,  // Asegúrate de importar FormsModule aquí si usas ngModel
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatIconModule,
    RouterModule.forRoot([  // Configuración de rutas (si las necesitas)
      { path: '', component: AppComponent },  // Ruta por defecto
      { path: 'crear-partido', component: CrearPartidoComponent }  // Ruta para CrearPartidoComponent
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]  // Componente raíz
})
export class AppModule { }
