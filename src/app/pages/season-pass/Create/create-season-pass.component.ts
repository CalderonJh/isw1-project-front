import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { MatInputModule } from '@angular/material/input';
import { StadiumService } from '../../../services/stadium.service';
import { SeasonPassService } from '../../../services/season-pass.service';
import { SportsMatchesService } from '../../../services/sports-matches.service';
import { Stadium, Stand } from '../../../Models/Stadium.model';
import { Partido } from '../../../Models/Partido.model';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SelectionModel } from '@angular/cdk/collections';
import { StandPriceComponent } from '../../../components/stand-price-component/stand-price.component';
import { CreateSeasonPass } from '../../../Models/Season-pass.model';

@Component({
  selector: 'app-create-season-pass-page',
  standalone: true,
  imports: [
    CommonModule,
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
    MatInputModule,
    MatTableModule,
    MatCheckboxModule,
    StandPriceComponent,
  ],
  templateUrl: './create-season-pass-page.component.html',
  styleUrls: ['./create-season-pass-page.component.css'],
})
export class CreateSeasonPassComponent implements OnInit {
  stadiums: Stadium[] = [];
  matches: Partido[] = [];
  form!: FormGroup;
  selectedImage: File | undefined;
  stands: Stand[] = []; // Inicializar como array vacío
  displayedColumns: string[] = [
    'select',
    'visitante',
    'temporada',
    'fecha',
    'hora',
  ];
  dataSource = new MatTableDataSource<Partido>();
  selection = new SelectionModel<Partido>(true, []);

  constructor(
    private fb: FormBuilder,
    private sportsMatchesService: SportsMatchesService,
    private stadiumService: StadiumService,
    private seasonPassService: SeasonPassService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.loadStadiums();
    this.initializeForm();
  }

  // Inicializar el formulario reactivo
  initializeForm() {
    this.form = this.fb.group({
      description: [null, Validators.required],
      selectedStadium: [null, Validators.required],
      year: [null, Validators.required],
      season: [null, Validators.required],
      selectedMatches: [[], Validators.required],
      selectedStands: [[], Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      selectedImage: [null, Validators.required],
    });
  }

  // Obtener los estadios
  loadStadiums() {
    this.stadiumService.getAllStadiums().subscribe((data: Stadium[]) => {
      this.stadiums = data;
    });
  }

  // Cambiar estadio seleccionado
  onStadiumChange(stadium: any) {
    console.log(stadium);
    this.sportsMatchesService
      .getMatchesForSeasonOffer(stadium.id)
      .subscribe((data: Partido[]) => {
        this.matches = data;
        this.dataSource.data = data;
      });
    this.stands = stadium.stands;
  }

  // Manejar carga de imagen
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files?.length) {
      this.selectedImage = input.files[0];
      // Actualizar el control del formulario
      this.form.patchValue({ selectedImage: this.selectedImage });
    }
  }

  // Crear el abono
  createSeasonPass() {
    console.log(this.stands);
    const formValue = this.form.value;

    console.log(this.selection.selected);
    // Validar que hay partidos seleccionados
    if (!this.selection.selected || this.selection.selected.length === 0) {
      alert('Debe seleccionar al menos un partido.');
      return;
    }

    const selectedMatches = this.selection.selected;

    const offerData: CreateSeasonPass = {
      description: formValue.description,
      year: formValue.year,
      season: formValue.season,
      matchIds: selectedMatches.map((m) => m.matchId),
      standPrices: this.stands.map((stand: Stand) => ({
        standId: stand.id,
        price: stand.price ?? 0,
      })),
      startDate: formValue.startDate?.toISOString(),
      endDate: formValue.endDate?.toISOString(),
    };

    // Llamar al servicio para crear la oferta (abono)
    if (this.selectedImage) {
      this.seasonPassService
        .createOffer(offerData, this.selectedImage)
        .subscribe({
          next: () => {
            alert('Abono creado exitosamente');
            this.router.navigate(['boletas']);
          },
          error: (error) => {
            alert('Error al crear el abono');
            console.error(error);
          },
        });
    } else {
      alert('Debe seleccionar una imagen.');
    }
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  toggleAllRows() {
    if (this.isAllSelected()) {
      this.selection.clear();
      return;
    }

    this.selection.select(...this.dataSource.data);
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: Partido): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.matchId + 1}`;
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

  today() {
    return new Date();
  }

  startDate() {
    // tomorrow

    return this.form.get('startDate')?.value ?? this.today();
  }
}
