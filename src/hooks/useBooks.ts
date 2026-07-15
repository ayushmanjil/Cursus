import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './useLocalStorage';
import type { Book, BookStatus } from '../types/book';
import { generateId, todayIso } from '../utils/helpers';
import { seedBooks } from '../data/seed';

const STORAGE_KEY = 'my-library:books';

export type NewBookInput = Pick<
  Book,
  'title' | 'author' | 'genre' | 'coverUrl' | 'notes' | 'status' | 'totalPages'
>;

export function useBooks(userId: string | undefined) {
  const storageKey = userId ? `my-library:books:${userId}` : 'my-library:books:guest';
  const [books, setBooks] = useLocalStorage<Book[]>(storageKey, seedBooks);

  const addBook = useCallback(
    (input: NewBookInput) => {
      const newBook: Book = {
        id: generateId(),
        title: input.title.trim(),
        author: input.author.trim(),
        genre: input.genre.trim() || 'Uncategorized',
        coverUrl: input.coverUrl?.trim() || '',
        notes: input.notes ?? '',
        status: input.status,
        favorite: false,
        dateAdded: todayIso(),
        dateFinished: input.status === 'read' ? todayIso() : undefined,
        rating: undefined,
        totalPages: input.totalPages || undefined,
        currentPage: input.status === 'reading' ? 0 : undefined,
      };
      setBooks((prev) => [newBook, ...prev]);
      return newBook;
    },
    [setBooks]
  );

  const updateBook = useCallback(
    (id: string, patch: Partial<Book>) => {
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, ...patch } : b))
      );
    },
    [setBooks]
  );

  const deleteBook = useCallback(
    (id: string) => {
      setBooks((prev) => prev.filter((b) => b.id !== id));
    },
    [setBooks]
  );

  const setStatus = useCallback(
    (id: string, status: BookStatus, rating?: number) => {
      setBooks((prev) =>
        prev.map((b) => {
          if (b.id !== id) return b;
          const patch: Partial<Book> = { status };
          if (status === 'read') {
            patch.dateFinished = todayIso();
            if (rating !== undefined) patch.rating = rating;
            patch.currentPage = b.totalPages || b.currentPage;
          } else if (status === 'reading') {
            patch.dateFinished = undefined;
            patch.currentPage = b.currentPage && b.currentPage > 0 ? b.currentPage : 0;
          } else if (status === 'on-shelf' || status === 'wishlist') {
            patch.dateFinished = undefined;
            patch.rating = undefined;
            patch.currentPage = undefined;
          }
          return { ...b, ...patch };
        })
      );
    },
    [setBooks]
  );

  const toggleFavorite = useCallback(
    (id: string) => {
      setBooks((prev) =>
        prev.map((b) => (b.id === id ? { ...b, favorite: !b.favorite } : b))
      );
    },
    [setBooks]
  );

  const importBooks = useCallback(
    (incoming: Book[], mode: 'merge' | 'replace') => {
      setBooks((prev) => {
        if (mode === 'replace') return incoming;
        const byId = new Map(prev.map((b) => [b.id, b]));
        for (const b of incoming) byId.set(b.id, b);
        return Array.from(byId.values());
      });
    },
    [setBooks]
  );

  const genres = useMemo(() => {
    const set = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [books]);

  return {
    books,
    addBook,
    updateBook,
    deleteBook,
    setStatus,
    toggleFavorite,
    importBooks,
    genres,
  };
}
