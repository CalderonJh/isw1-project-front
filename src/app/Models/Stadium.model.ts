import { SafeUrl } from '@angular/platform-browser';

export interface Stadium {
  id: number;
  name: string;
  stands: Stand[];
  imageId: string; // Public ID
}

export interface StadiumWithImage extends Stadium {
  imageUrl: SafeUrl; // Sanitized URL
}

export interface Stand {
  id: number;
  name: string;
  capacity: number;
  price: number;
  isEnabled?: boolean;
}

export interface StandPricedialog{
  stands: Stand[];
  offerid: number;
}

