import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { StadiumService } from '../../../services/stadium.service';
import { SeasonPassService } from '../../../services/season-pass.service';
import { SportsMatchesService } from '../../../services/sports-matches.service';
import { Stadium } from '../../../Models/Stadium.model';
import { Partido } from '../../../Models/Partido.model';

@Component({
  selector: 'app-create-season-pass-page',
  standalone: true,
  imports: [CommonModule,
    MatCardModule,
    MatTableModule,
    MatSelectModule,
    MatOptionModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatListModule,
    MatInputModule],
  templateUrl: './create-season-pass-page.component.html',
  styleUrls: ['./create-season-pass-page.component.css']
})
export class CreateSeasonPassComponent implements OnInit {
  stadiums: Stadium[] = [];
  matches: Partido[] = [];
  form!: FormGroup;
  selectedImage: File | undefined;
  stands: any;

  constructor(
    private fb: FormBuilder,
    private sportsMatchesService: SportsMatchesService,
    private stadiumService: StadiumService,
    private seasonPassService: SeasonPassService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadStadiums();
    this.initializeForm();
  }

  // Inicializar el formulario reactivo
  initializeForm() {
    this.form = this.fb.group({
      selectedStadium: [null, Validators.required],
      selectedMatches: this.fb.array([], Validators.required),
      selectedStands: this.fb.array([], Validators.required),
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      selectedImage: [null, Validators.required]
    });
  }

  // Obtener los estadios
  loadStadiums() {
    this.stadiumService.getAllStadiums().subscribe((data: Stadium[]) => {
      this.stadiums = data;
    });
  }

  // Cambiar estadio seleccionado
  onStadiumChange(stadiumId: number) {
    this.sportsMatchesService.getMatchesForSeasonOffer(stadiumId).subscribe((data: Partido[]) => {
      this.matches = data;
    });
  }

  // Seleccionar partidos para el abono
  onMatchSelectionChange(matchId: number, event: any) {
    const matchesArray = this.form.get('selectedMatches') as FormArray;
    if (event.checked) {
      matchesArray.push(this.fb.control(matchId));
    } else {
      const index = matchesArray.controls.findIndex(x => x.value === matchId);
      if (index !== -1) {
        matchesArray.removeAt(index);
      }
    }
  }


  // Manejar tribunas seleccionadas
  get selectedStands() {
    return this.form.get('selectedStands') as FormArray;
  }

  onStandSelectionChange(standId: number, event: any) {
    if (event.checked) {
      this.selectedStands.push(this.fb.control(standId));
    } else {
      const index = this.selectedStands.controls.findIndex(x => x.value === standId);
      this.selectedStands.removeAt(index);
    }
  }

  // Manejar carga de imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedImage = input.files[0];
    }
  }

  // Crear el abono
  createSeasonPass() {
    if (this.form.invalid) {
      alert('Por favor complete todos los campos.');
      return;
    }

    const formValue = this.form.value;

    const offerData = {
      description: 'Abono para la temporada',
      year: this.matches[0].year,  // Año del primer partido seleccionado
      season: this.matches[0].season,  // Temporada del primer partido seleccionado
      matchIds: formValue.selectedMatches,  // Los partidos seleccionados
      standPrices: formValue.selectedStands.map((standId: number) => ({
        standId: standId,
        price: 0, // Aquí el precio por defecto que podemos ajustar según lo necesites
        isDisabled: false
      })),
      startDate: formValue.startDate?.toISOString(),
      endDate: formValue.endDate?.toISOString()
    };

    // Llamar al servicio para crear la oferta (abono)
    if (this.selectedImage) {
      this.seasonPassService.createOffer(offerData, this.selectedImage).subscribe(
        () => {
          alert('Abono creado exitosamente');
          this.router.navigate(['season-passes']);
        },
        (error) => {
          alert('Error al crear el abono');
          console.error(error);
        }
      );
    }
  }

  // Cancelar creación de abono y redirigir
  cancel() {
    this.router.navigate(['abonos']);
  }

  // Redirigir al inicio
  navigateToHome(): void {
    this.router.navigate(['home']);
  }

  // Cerrar sesión
  logout(): void {
    this.router.navigate(['']);
  }
}
