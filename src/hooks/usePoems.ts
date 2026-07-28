import { useEffect, useState, useCallback } from 'react';
import type { Poem, ReadPoem, SavedPoem } from '../types/poem';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export function usePoems(userId: string | undefined) {
  const [readPoems, setReadPoems] = useState<ReadPoem[]>([]);
  const [savedPoems, setSavedPoems] = useState<SavedPoem[]>([]);
  const [favoritePoems, setFavoritePoems] = useState<Poem[]>([]);

  // Sync with Firestore
  useEffect(() => {
    if (!userId) {
      setReadPoems([]);
      setSavedPoems([]);
      setFavoritePoems([]);
      return;
    }
    const docRef = doc(db, 'users', userId, 'settings', 'poems');
    const unsubscribe = onSnapshot(
      docRef,
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReadPoems(Array.isArray(data.readPoems) ? data.readPoems : []);
          setSavedPoems(Array.isArray(data.savedPoems) ? data.savedPoems : []);
          setFavoritePoems(Array.isArray(data.favoritePoems) ? data.favoritePoems : []);
        } else {
          setReadPoems([]);
          setSavedPoems([]);
          setFavoritePoems([]);
        }
      },
      (error) => {
        console.error('Error listening to user poems:', error);
      }
    );
    return unsubscribe;
  }, [userId]);

  const persist = useCallback(
    async (nextRead: ReadPoem[], nextSaved: SavedPoem[], nextFavorite: Poem[]) => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId, 'settings', 'poems');
      await setDoc(
        docRef,
        {
          readPoems: nextRead,
          savedPoems: nextSaved,
          favoritePoems: nextFavorite,
        },
        { merge: true }
      );
    },
    [userId]
  );

  const markAsRead = useCallback(
    async (poem: Poem) => {
      if (readPoems.some((p) => p.id === poem.id)) return;
      const newReadPoem: ReadPoem = {
        ...poem,
        readAt: new Date().toISOString(),
      };
      const nextRead = [newReadPoem, ...readPoems];
      setReadPoems(nextRead);
      await persist(nextRead, savedPoems, favoritePoems);
    },
    [readPoems, savedPoems, favoritePoems, persist]
  );

  const removeFromRead = useCallback(
    async (poemId: string) => {
      const nextRead = readPoems.filter((p) => p.id !== poemId);
      setReadPoems(nextRead);
      await persist(nextRead, savedPoems, favoritePoems);
    },
    [readPoems, savedPoems, favoritePoems, persist]
  );

  const isRead = useCallback(
    (poemId: string) => readPoems.some((p) => p.id === poemId),
    [readPoems]
  );

  const toggleRead = useCallback(
    async (poem: Poem) => {
      if (isRead(poem.id)) {
        await removeFromRead(poem.id);
      } else {
        await markAsRead(poem);
      }
    },
    [isRead, markAsRead, removeFromRead]
  );

  const saveForLater = useCallback(
    async (poem: Poem) => {
      if (savedPoems.some((p) => p.id === poem.id)) return;
      const newSavedPoem: SavedPoem = {
        ...poem,
        savedAt: new Date().toISOString(),
      };
      const nextSaved = [newSavedPoem, ...savedPoems];
      setSavedPoems(nextSaved);
      await persist(readPoems, nextSaved, favoritePoems);
    },
    [readPoems, savedPoems, favoritePoems, persist]
  );

  const removeFromSaved = useCallback(
    async (poemId: string) => {
      const nextSaved = savedPoems.filter((p) => p.id !== poemId);
      setSavedPoems(nextSaved);
      await persist(readPoems, nextSaved, favoritePoems);
    },
    [readPoems, savedPoems, favoritePoems, persist]
  );

  const isSaved = useCallback(
    (poemId: string) => savedPoems.some((p) => p.id === poemId),
    [savedPoems]
  );

  const toggleSaved = useCallback(
    async (poem: Poem) => {
      if (isSaved(poem.id)) {
        await removeFromSaved(poem.id);
      } else {
        await saveForLater(poem);
      }
    },
    [isSaved, saveForLater, removeFromSaved]
  );

  const markAsFavorite = useCallback(
    async (poem: Poem) => {
      if (favoritePoems.some((p) => p.id === poem.id)) return;
      const nextFavorite = [poem, ...favoritePoems];
      setFavoritePoems(nextFavorite);
      await persist(readPoems, savedPoems, nextFavorite);
    },
    [readPoems, savedPoems, favoritePoems, persist]
  );

  const removeFromFavorite = useCallback(
    async (poemId: string) => {
      const nextFavorite = favoritePoems.filter((p) => p.id !== poemId);
      setFavoritePoems(nextFavorite);
      await persist(readPoems, savedPoems, nextFavorite);
    },
    [readPoems, savedPoems, favoritePoems, persist]
  );

  const isFavorite = useCallback(
    (poemId: string) => favoritePoems.some((p) => p.id === poemId),
    [favoritePoems]
  );

  const toggleFavorite = useCallback(
    async (poem: Poem) => {
      if (isFavorite(poem.id)) {
        await removeFromFavorite(poem.id);
      } else {
        await markAsFavorite(poem);
      }
    },
    [isFavorite, markAsFavorite, removeFromFavorite]
  );

  return {
    readPoems,
    savedPoems,
    favoritePoems,
    markAsRead,
    removeFromRead,
    isRead,
    saveForLater,
    removeFromSaved,
    isSaved,
    toggleRead,
    toggleSaved,
    markAsFavorite,
    removeFromFavorite,
    isFavorite,
    toggleFavorite,
  };
}
