import { SafeUrl } from '@angular/platform-browser';

export interface CreateSeasonPass {
  description: string;
  year: number;
  season: number;
  matchIds: number[];
  standPrices: StandPrice[];
  startDate: string;
  endDate: string;
}

export interface StandPrice {
  standId: number;
  price: number;
}

export interface GetSeasonPass {
  id: number;
  description: string;
  year: number;
  season: number;
  offerPeriod: {
    start: string;
    end: string;
  };
  stadium: {
    id: number;
    description: string;
  };
  imageId: string;
  isPaused: boolean;
}

export interface SeasonPassWithImage extends GetSeasonPass {
  imageUrl: SafeUrl;
}

export interface SeasonPassDetails {
  prices: [
    {
      saleId: 0;
      stand: {
        id: 0;
        description: 'string';
      };
      price: 0;
      available: true;
    },
  ];
  games: ['string'];
  stadium: {
    id: 0;
    description: 'string';
  };
  stadiumImageId: 'string';
}
