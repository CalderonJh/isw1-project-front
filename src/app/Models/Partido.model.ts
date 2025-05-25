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

export interface PartidoSave {
    awayClubId: number,
    stadiumId: number,
    year: number,
    season: number,
    matchDate: string
}
