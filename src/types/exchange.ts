export enum ExchangeStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Exchange {
  id: string;
  requesterId: string;
  ownerId: string;
  requestedBookId: string;
  offeredBookId: string;
  status: ExchangeStatus;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExchangeWithRelations extends Exchange {
  requester: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  owner: {
    id: string;
    name: string;
    avatar?: string | null;
  };
  requestedBook: {
    id: string;
    title: string;
    author: string;
  };
  offeredBook: {
    id: string;
    title: string;
    author: string;
  };
}
