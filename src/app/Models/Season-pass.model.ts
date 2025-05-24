export interface SeasonPass {
  description: string;
  year: number;
  season: number;
  matchIds: number[];
  standPrices: {
        standId: number;
        price: number;
        isDisabled: boolean;
  }[];
  startDate: string;
  endDate: string;
}

