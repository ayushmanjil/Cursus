import { useState, useEffect, useCallback, useMemo } from 'react';
import { db } from '../firebase';
import { collection, query, orderBy, onSnapshot, doc, setDoc, updateDoc, deleteDoc, writeBatch, deleteField } from 'firebase/firestore';
import type { Book, BookStatus } from '../types/book';
import { generateId, todayIso } from '../utils/helpers';

export type NewBookInput = Pick<
  Book,
  'title' | 'author' | 'genre' | 'coverUrl' | 'notes' | 'status' | 'totalPages'
>;

export function useBooks(userId: string | undefined) {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setBooks([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const booksRef = collection(db, 'users', userId, 'books');
    const q = query(booksRef, orderBy('dateAdded', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data()
      } as Book));
      setBooks(list);
      setLoading(false);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  const addBook = useCallback(
    async (input: NewBookInput) => {
      if (!userId) return;
      const id = generateId();
      const newBook: Record<string, any> = {
        id,
        title: input.title.trim(),
        author: input.author.trim(),
        genre: input.genre.trim() || 'Uncategorized',
        coverUrl: input.coverUrl?.trim() || '',
        notes: input.notes ?? '',
        status: input.status,
        favorite: false,
        dateAdded: todayIso(),
      };

      if (input.status === 'read') {
        newBook.dateFinished = todayIso();
      }
      if (typeof input.totalPages === 'number' && !isNaN(input.totalPages) && input.totalPages > 0) {
        newBook.totalPages = input.totalPages;
      }
      if (input.status === 'reading') {
        newBook.currentPage = 0;
        newBook.dateStarted = todayIso();
      }

      await setDoc(doc(db, 'users', userId, 'books', id), newBook);
      return newBook as Book;
    },
    [userId]
  );

  const updateBook = useCallback(
    async (id: string, patch: Partial<Book>) => {
      if (!userId) return;
      await updateDoc(doc(db, 'users', userId, 'books', id), patch);
    },
    [userId]
  );

  const deleteBook = useCallback(
    async (id: string) => {
      if (!userId) return;
      await deleteDoc(doc(db, 'users', userId, 'books', id));
    },
    [userId]
  );

  const setStatus = useCallback(
    async (id: string, status: BookStatus, rating?: number) => {
      if (!userId) return;
      const b = books.find((x) => x.id === id);
      if (!b) return;

      const patch: any = { status };
      if (status === 'read') {
        patch.dateFinished = todayIso();
        if (rating !== undefined) patch.rating = rating;
        patch.currentPage = b.totalPages || b.currentPage;
      } else if (status === 'reading') {
        patch.dateFinished = deleteField();
        patch.rating = deleteField();
        patch.currentPage = b.currentPage && b.currentPage > 0 ? b.currentPage : 0;
        // Only set dateStarted if not already set (preserve on re-reads)
        if (!b.dateStarted) {
          patch.dateStarted = todayIso();
        }
      } else if (status === 'on-shelf' || status === 'wishlist') {
        patch.dateFinished = deleteField();
        patch.rating = deleteField();
        patch.currentPage = deleteField();
        patch.dateStarted = deleteField();
      }
      await updateDoc(doc(db, 'users', userId, 'books', id), patch);
    },
    [userId, books]
  );

  const toggleFavorite = useCallback(
    async (id: string) => {
      if (!userId) return;
      const b = books.find((x) => x.id === id);
      if (!b) return;
      await updateDoc(doc(db, 'users', userId, 'books', id), { favorite: !b.favorite });
    },
    [userId, books]
  );

  const importBooks = useCallback(
    async (incoming: Book[], mode: 'merge' | 'replace') => {
      if (!userId) return;
      const batch = writeBatch(db);

      if (mode === 'replace') {
        for (const b of books) {
          batch.delete(doc(db, 'users', userId, 'books', b.id));
        }
      }

      for (const b of incoming) {
        batch.set(doc(db, 'users', userId, 'books', b.id), b);
      }

      await batch.commit();
    },
    [userId, books]
  );

  const genres = useMemo(() => {
    const set = new Set(books.map((b) => b.genre).filter(Boolean));
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [books]);

  return {
    books,
    loading,
    addBook,
    updateBook,
    deleteBook,
    setStatus,
    toggleFavorite,
    importBooks,
    genres,
  };
}
