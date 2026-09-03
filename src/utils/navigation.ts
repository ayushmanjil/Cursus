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
  tab?: string | null;
}

export function getNavigationStateFromUrl(): NavigationState {
  const pathname = window.location.pathname.replace(/\/+$/, '') || '/';
  const view = PATH_TO_VIEW[pathname] || 'dashboard';

  const searchParams = new URLSearchParams(window.location.search);
  const selectedBookId = searchParams.get('book') || null;
  const addOpen = searchParams.get('action') === 'add-book';
  const tab = searchParams.get('tab') || null;

  return { view, selectedBookId, addOpen, tab };
}

export function buildUrl(
  view: ViewKey,
  selectedBookId: string | null = null,
  addOpen: boolean = false,
  tab: string | null = null
): string {
  const basePath = VIEW_TO_PATH[view] || '/';
  const params = new URLSearchParams();
  if (selectedBookId) {
    params.set('book', selectedBookId);
  } else if (addOpen) {
    params.set('action', 'add-book');
  }
  if (tab) {
    params.set('tab', tab);
  }
  const queryString = params.toString();
  return queryString ? `${basePath}?${queryString}` : basePath;
}
