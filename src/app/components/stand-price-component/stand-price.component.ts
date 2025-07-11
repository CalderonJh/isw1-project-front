import { Component, Input } from '@angular/core';
import { Stand } from '../../Models/Stadium.model';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import {MatCheckboxModule} from '@angular/material/checkbox';

@Component({
  selector: 'app-stand-price',
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatCheckboxModule
  ],
  templateUrl: './stand-price.component.html',
  standalone: true,
})
export class StandPriceComponent {
  @Input() tribunas: Stand[] = [];

  onToggleHabilitada(tribuna: Stand): void {
    if (!tribuna.isEnabled) {
      tribuna.price = 0;
    }
  }
}
