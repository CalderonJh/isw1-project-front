import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  selector: 'app-admin-home-page',
  imports: [MatFormFieldModule, MatInputModule, MatSelectModule],
  templateUrl: './admin-home-page.component.html',
  standalone: true,
  styleUrl: './admin-home-page.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AdminHomePageComponent {}
