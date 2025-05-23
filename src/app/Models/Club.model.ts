export interface Club {
  clubId?: number;
  name?: string;
  shortName?: string;
  imageId?: string;
}

export interface ClubMatch extends Club {
  id : number;
  description : string;
}
