export interface Partido {
  matchId?: number;    // Opcional para crear
  awayClubId: number;
  stadiumId: number;
  year: number;
  season: number;
  matchDate: string;
}