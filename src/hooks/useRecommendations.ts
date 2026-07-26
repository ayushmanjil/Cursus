import { useState, useEffect, useCallback, useRef } from 'react';
import type { Book } from '../types/book';
import type { RecommendedBook, RecommendationMode, UmbrellaGenre } from '../types/recommendations';
import { UMBRELLA_GENRES } from '../types/recommendations';
import {
  getRecommendationsByActivity,
  getRecommendationsForUnexplored,
  getRecommendationsByGenre,
  getRecommendationsBySearch,
  dismissBook,
  getDismissedBookIds,
} from '../services/recommendationService';

export function useRecommendations(userBooks: Book[], userId: string = 'guest') {
  const [mode, setMode] = useState<RecommendationMode>('activity');
  const [selectedGenre, setSelectedGenre] = useState<UmbrellaGenre>(UMBRELLA_GENRES[0]);

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<RecommendedBook[]>([]);

  const [activityBooks, setActivityBooks] = useState<RecommendedBook[]>([]);
  const [unexploredSections, setUnexploredSections] = useState<{ genre: UmbrellaGenre; books: RecommendedBook[] }[]>([]);
  const [genreBooks, setGenreBooks] = useState<RecommendedBook[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dismissedIds, setDismissedIds] = useState<string[]>(() => getDismissedBookIds());

  const abortControllerRef = useRef<AbortController | null>(null);
  const userBooksHash = userBooks.map((b) => `${b.id}_${b.rating}`).join('|');
  const prevHashRef = useRef(userBooksHash);

  useEffect(() => {
    if (prevHashRef.current !== userBooksHash) {
      prevHashRef.current = userBooksHash;
      try {
        Object.keys(localStorage).forEach((key) => {
          if (key.startsWith('cursus_rec_')) {
            localStorage.removeItem(key);
          }
        });
      } catch (_) {}
    }
  }, [userBooksHash]);

  const fetchRecommendations = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'activity') {
        const books = await getRecommendationsByActivity(userBooks, controller.signal, userId);
        if (!controller.signal.aborted) {
          setActivityBooks(books);
        }
      } else if (mode === 'explore') {
        const sections = await getRecommendationsForUnexplored(userBooks, controller.signal, userId);
        if (!controller.signal.aborted) {
          setUnexploredSections(sections);
        }
      } else if (mode === 'genre') {
        const books = await getRecommendationsByGenre(selectedGenre, userBooks, controller.signal, userId);
        if (!controller.signal.aborted) {
          setGenreBooks(books);
        }
      } else if (mode === 'search' && searchQuery.trim()) {
        const books = await getRecommendationsBySearch(searchQuery, userBooks, controller.signal);
        if (!controller.signal.aborted) {
          setSearchResults(books);
        }
      }
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        console.error('Error fetching recommendations:', err);
        setError('Could not load recommendations. Please check your internet connection.');
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false);
      }
    }
  }, [mode, selectedGenre, searchQuery, userBooks, userId]);

  useEffect(() => {
    fetchRecommendations();
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [fetchRecommendations]);

  const handleDismiss = useCallback((bookId: string) => {
    dismissBook(bookId);
    setDismissedIds(getDismissedBookIds());
  }, []);

  const handleRefresh = useCallback(() => {
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith('cursus_rec_')) {
          localStorage.removeItem(key);
        }
      });
    } catch (_) {}
    fetchRecommendations();
  }, [fetchRecommendations]);

  return {
    mode,
    setMode,
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    searchResults: searchResults.filter((b) => !dismissedIds.includes(b.id)),
    activityBooks: activityBooks.filter((b) => !dismissedIds.includes(b.id)),
    unexploredSections: unexploredSections.map((sec) => ({
      ...sec,
      books: sec.books.filter((b) => !dismissedIds.includes(b.id)),
    })).filter((sec) => sec.books.length > 0),
    genreBooks: genreBooks.filter((b) => !dismissedIds.includes(b.id)),
    loading,
    error,
    dismissBook: handleDismiss,
    refresh: handleRefresh,
  };
}
