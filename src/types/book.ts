export enum BookStatus {
  AVAILABLE = 'AVAILABLE',
  RESERVED = 'RESERVED',
  EXCHANGED = 'EXCHANGED',
}

export enum BookCondition {
  NEW = 'NEW',
  GOOD = 'GOOD',
  FAIR = 'FAIR',
  POOR = 'POOR',
}

export interface BookImage {
  id: string;
  bookId: string;
  url: string;
  publicId?: string | null;
  position: number;
  isCover: boolean;
  createdAt: Date;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  language?: string | null;
  publishedYear?: number | null;
  status: BookStatus;
  condition: BookCondition;
  ownerId: string;
  genreId: string;
  images?: BookImage[];
  createdAt: Date;
  updatedAt: Date;
}

export interface BookWithOwner extends Book {
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
  };
}

export interface BookWithGenre extends Book {
  genre: {
    id: string;
    name: string;
  };
}

export interface BookWithAllRelations extends BookWithOwner, BookWithGenre {
  images: BookImage[];
}
