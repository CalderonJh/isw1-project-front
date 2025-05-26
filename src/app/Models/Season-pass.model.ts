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
  isDisabled?: boolean;
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
      saleId: number;
      stand: {
        id: number;
        description: string;
      };
      price: number;
      available: true;
    },
  ];
  games: string[];
  stadium: {
    id: number;
    description: string;
  };
  stadiumImageId: string;
}

export interface StandPriceDialogData {
  stands: {
    saleId: number;
    stand: { id: number; description: string };
    price: number;
    available: boolean;
  }[];
  offerid: number;
}