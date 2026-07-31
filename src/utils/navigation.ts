import type { ViewKey } from '../types/book';

export const VIEW_TO_PATH: Record<ViewKey, string> = {
  dashboard: '/',
  'on-shelf': '/on-shelf',
  wishlist: '/wishlist',
  reading: '/reading',
  read: '/read',
  favorites: '/favorites',
  stats: '/stats',
  streaks: '/streaks',
  profile: '/profile',
  'daily-goals': '/daily-goals',
  'yearly-goals': '/yearly-goals',
  'word-library': '/word-library',
  timer: '/timer',
  recommendations: '/recommendations',
  poems: '/poems',
};

export const PATH_TO_VIEW: Record<string, ViewKey> = {
  '/': 'dashboard',
  '/dashboard': 'dashboard',
  '/on-shelf': 'on-shelf',
  '/wishlist': 'wishlist',
  '/reading': 'reading',
  '/read': 'read',
  '/favorites': 'favorites',
  '/stats': 'stats',
  '/streaks': 'streaks',
  '/profile': 'profile',
  '/daily-goals': 'daily-goals',
  '/yearly-goals': 'yearly-goals',
  '/word-library': 'word-library',
  '/timer': 'timer',
  '/recommendations': 'recommendations',
  '/poems': 'poems',
};

export interface NavigationState {
  view: ViewKey;
  selectedBookId: string | null;
  addOpen: boolean;
}

export function getNavigationStateFromUrl(): NavigationState {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const view = PATH_TO_VIEW[pathname] || 'dashboard';

  const searchParams = new URLSearchParams(window.location.search);
  const selectedBookId = searchParams.get('book') || null;
  const addOpen = searchParams.get('action') === 'add-book';

  return { view, selectedBookId, addOpen };
}

export function buildUrl(
  view: ViewKey,
  selectedBookId: string | null = null,
  addOpen: boolean = false
): string {
  const basePath = VIEW_TO_PATH[view] || '/';
  const params = new URLSearchParams();
  if (selectedBookId) {
    params.set('book', selectedBookId);
  } else if (addOpen) {
    params.set('action', 'add-book');
  }
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
