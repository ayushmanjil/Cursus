import { useEffect, useState, useCallback } from 'react';
import type { SavedWord, DictionaryEntry } from '../types/dictionary';
import { db } from '../firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

export function useWordLibrary(userId: string | undefined) {
  const [savedWords, setSavedWords] = useState<SavedWord[]>([]);

  // Sync with Firestore
  useEffect(() => {
    if (!userId) {
      setSavedWords([]);
      return;
    }
    const docRef = doc(db, 'users', userId, 'settings', 'wordLibrary');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setSavedWords(Array.isArray(data.words) ? data.words : []);
      } else {
        setSavedWords([]);
      }
    });
    return unsubscribe;
  }, [userId]);

  const persist = useCallback(
    async (nextWords: SavedWord[]) => {
      if (!userId) return;
      const docRef = doc(db, 'users', userId, 'settings', 'wordLibrary');
      await setDoc(docRef, { words: nextWords }, { merge: true });
    },
    [userId]
  );

  const addWord = useCallback(
    async (entries: DictionaryEntry[]) => {
      if (!entries.length) return;
      const wordKey = entries[0].word.toLowerCase();
      // Prevent duplicates
      if (savedWords.some((w) => w.id === wordKey)) return;
      const newWord: SavedWord = {
        id: wordKey,
        entries,
        savedAt: new Date().toISOString(),
      };
      const next = [...savedWords, newWord];
      await persist(next);
    },
    [savedWords, persist]
  );

  const removeWord = useCallback(
    async (wordId: string) => {
      const next = savedWords.filter((w) => w.id !== wordId);
      await persist(next);
    },
    [savedWords, persist]
  );

  const isWordSaved = useCallback(
    (word: string) => savedWords.some((w) => w.id === word.toLowerCase()),
    [savedWords]
  );

  return { savedWords, addWord, removeWord, isWordSaved };
}
