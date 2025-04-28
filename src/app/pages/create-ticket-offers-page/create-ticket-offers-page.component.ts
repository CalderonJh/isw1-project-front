import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { StandPriceComponent } from '../../components/stand-price-component/stand-price.component';

@Component({
  selector: 'app-create-ticket-offers-page',
  imports: [RouterOutlet, StandPriceComponent],
  templateUrl: './create-ticket-offers-page.component.html',
  standalone: true,
  styleUrl: './create-ticket-offers-page.component.css',
})
export class CreateTicketOffersPageComponent {}
