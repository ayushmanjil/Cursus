export type BookStatus = 'on-shelf' | 'wishlist' | 'reading' | 'read';

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  genre: string;
  status: BookStatus;
  rating?: number; // 1-5, only meaningful when status === 'read'
  dateAdded: string; // ISO date
  dateFinished?: string; // ISO date
  notes: string;
  favorite: boolean;
  totalPages?: number; // total pages in the book
  currentPage?: number; // page the reader is currently on
}

export type SortField =
  | 'title'
  | 'author'
  | 'dateAdded'
  | 'dateFinished'
  | 'rating';

export type SortOrder = 'asc' | 'desc';

export interface SortState {
  field: SortField;
  order: SortOrder;
}

export interface FilterState {
  genre: string | 'all';
  favoritesOnly: boolean;
  minRating: number; // 0 = no filter
  status: BookStatus | 'all';
}

export type ViewKey =
  | 'dashboard'
  | 'on-shelf'
  | 'wishlist'
  | 'reading'
  | 'read'
  | 'favorites'
  | 'stats'
  | 'streaks';

export const STATUS_LABELS: Record<BookStatus, string> = {
  'on-shelf': 'On Shelf',
  wishlist: 'The Hunt List',
  reading: 'Reading',
  read: 'Read',
};

export const emptyFilter: FilterState = {
  genre: 'all',
  favoritesOnly: false,
  minRating: 0,
  status: 'all',
};
