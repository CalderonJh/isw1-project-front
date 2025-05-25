export interface Ticket {
    id: number,
    homeClub: {
      id: number,
      description: string
    },
    awayClub: {
      id: number,
      description: string
    },
    stadium: {
      id: number,
      description: string
    },
    matchDay: string,
    offerPeriod: {
      start: string,
      end: string
    },
    imageId: string,
    isPaused: boolean
}