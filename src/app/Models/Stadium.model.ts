import { SafeUrl } from '@angular/platform-browser';

export interface Stadium {
    id: number;
    name: string;
    stands: {
        standId: number;
        name: string;
        capacity: number;
    }[];
    imageId: string;           // Public ID
}

export interface StadiumWithImage extends Stadium {
    imageUrl: SafeUrl;       // Sanitized URL
}