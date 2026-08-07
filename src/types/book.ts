export type BookStatus = 'on-shelf' | 'wishlist' | 'reading' | 'read';

export interface BookQuote {
  id: string;
  quote: string;
  page?: number;
  chapter?: string;
  note?: string;
  dateAdded: string; // ISO date string
}

export interface Book {
  id: string;
  title: string;
  author: string;
  coverUrl?: string;
  /** Focal point X (0–100). Used for object-position in cards. Defaults to 50. */
  coverFocusX?: number;
  /** Focal point Y (0–100). Used for object-position in cards. Defaults to 50. */
  coverFocusY?: number;
  genre: string;
  status: BookStatus;
  rating?: number; // 1-5, only meaningful when status === 'read'
  dateAdded: string; // ISO date
  dateStarted?: string; // ISO date — set when status becomes 'reading'
  dateFinished?: string; // ISO date
  notes: string;
  favorite: boolean;
  totalPages?: number; // total pages in the book
  currentPage?: number; // page the reader is currently on
  quotes?: BookQuote[]; // Literary Marginalia / quotes
}

export type SortField =
  | 'title'
  | 'author'
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
  | 'streaks'
  | 'profile'
  | 'daily-goals'
  | 'yearly-goals'
  | 'word-library'
  | 'timer'
  | 'recommendations'
  | 'poems';

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

export interface FavoriteAuthor {
  id: string;
  name: string;
  photoUrl?: string;
  bio?: string;
  notes?: string;
  addedAt: string; // ISO date string
}
