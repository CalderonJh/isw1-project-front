export interface Partido {
    matchId: number;
    awayClub: { 
        id: number;
        description: string;
    };
    stadium: { 
        id: number;
        description: string;
    }; 
    year: number;
    season: number;
    matchDate: string;
}
