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
