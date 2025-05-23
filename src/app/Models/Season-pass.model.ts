import { StandPrice } from './Stand.model';

export interface SeasonPass {
  description: string;
  year: number;
  season: number;
  matchIds: number[];
  standPrices: StandPrice[];
  startDate: string;
  endDate: string;
}

