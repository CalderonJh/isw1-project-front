import { ClubMatch } from "./Club.model";
import { StadiumMatch } from "./Stadium.model";

export interface Partido {
  matchId?: number;    // Opcional para crear
  awayClub: ClubMatch;
  stadium: StadiumMatch;
  year: number;
  season: number;
  matchDate: string;
}
