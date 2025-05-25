import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { Observable, of } from 'rxjs';
import { CreateTicketOffersService } from '../../services/create-ticket-offers.service';



@Component({
  selector: 'app-create-ticket-offers-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    CommonModule,
    MatSelectModule,
    MatOptionModule
  ],
  template: `
    <h2 mat-dialog-title class="text-center text-xl font-semibold text-[#2e74be] mb-5">
      Selecciona Partido
    </h2>

    <mat-dialog-content class="dialog-content p-5" style="display: flex; justify-content: center;">
      <mat-form-field appearance="outline" style="width: 100%; max-width: 600px;">
        <mat-label>Partido</mat-label>
        <mat-select [(ngModel)]="matchId" required>
          <mat-option *ngFor="let match of matches$ | async" [value]="match.matchId">
            VS {{ match.awayClub.description }} - Fecha: {{ match.matchDate | date:'short' }}
          </mat-option>
        </mat-select>
      </mat-form-field>
    </mat-dialog-content>

    <mat-dialog-actions class="flex justify-end p-4 bg-[#f9f9f9]">
      <button mat-button (click)="onNoClick()">Cancelar</button>
      <button mat-button color="primary" [disabled]="!matchId" (click)="onSave()">Guardar</button>
    </mat-dialog-actions>

  `,
  styleUrls: ['./create-ticket-offers-dialog.component.css'],
})
export class CreateTicketOffersDialog implements OnInit {
  
  matches$: Observable<any[]> = of([]);
  matchId!: number;

  constructor(
    public dialogRef: MatDialogRef<CreateTicketOffersDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private createTicketOffersService: CreateTicketOffersService
  ) {}

  ngOnInit(): void {
    this.matches$ = this.createTicketOffersService.getAllMatches();   // Partidos ya creados
    this.matches$.subscribe(data => console.log('Partidos:', data));
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
  console.log('Seleccionado matchId:', this.matchId);
  this.dialogRef.close({ matchId: this.matchId });
}
}
