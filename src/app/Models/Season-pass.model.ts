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
   id: number,
    description: string,
    year: number,
    season: number,
    offerPeriod: {
      start: string,
      end: string
    },
    stadium: {
      id: number,
      description: string
    },
    imageId: string,
    isPaused: boolean
}
