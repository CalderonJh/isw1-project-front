export interface Stand {
    name: string;
    capacity: number;
}

export interface StandPrice {
  standId: number;
  price: number;
  isDisabled: boolean;
}