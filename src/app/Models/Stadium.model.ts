import { Stand } from './Stand.model';
import { SafeUrl } from '@angular/platform-browser';

export interface Stadium {
    id?: number;
    name?: string;
    stands?: Stand[];
    imageId?: string;           // Public ID
}

export interface StadiumWithImage extends Stadium {
    imageUrl: SafeUrl;       // Sanitized URL
}

export interface StadiumMatch extends Stadium {
  id : number;
  description : string;
}