import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config'; // Asegúrate de que la ruta sea correcta
import { AppComponent } from './app/app.component';

// Arranca la aplicación usando appConfig
bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
