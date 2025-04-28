// src/app/subscription-offers/subscription-offers.component.ts
import { Component, OnInit } from '@angular/core';
import { SubscriptionOffersService } from '../service_app/subscription-offers.service';

@Component({
  selector: 'app-subscription-offers',
  templateUrl: './subscription-offers.component.html',
  styleUrls: ['./subscription-offers.component.css']
})
export class SubscriptionOffersComponent implements OnInit {
  offers: any[] = [];
  newOffer = { name: '', price: '' };  // Ajusta el modelo según tu API

  constructor(private subscriptionOffersService: SubscriptionOffersService) {}

  ngOnInit(): void {
    this.loadSubscriptionOffers();
  }

  loadSubscriptionOffers(): void {
    this.subscriptionOffersService.getSubscriptionOffers().subscribe(data => {
      this.offers = data;
    });
  }

  createSubscriptionOffer(): void {
    this.subscriptionOffersService.createSubscriptionOffer(this.newOffer).subscribe(() => {
      this.loadSubscriptionOffers();  // Recarga la lista después de crear una nueva oferta.
    });
  }

  deleteSubscriptionOffer(id: number): void {
    this.subscriptionOffersService.deleteSubscriptionOffer(id).subscribe(() => {
      this.loadSubscriptionOffers();  // Recarga la lista después de eliminar una oferta.
    });
  }

  toggleOfferPublication(id: number, status: boolean): void {
    this.subscriptionOffersService.toggleOfferPublication(id, status).subscribe(() => {
      this.loadSubscriptionOffers();  // Recarga la lista después de cambiar el estado.
    });
  }
}
