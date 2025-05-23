export interface Stand {
    name: string;
    capacity: number;
}

export interface StandPrice extends Stand {
  standId: number;
  price: number;
  isDisabled: boolean;
}