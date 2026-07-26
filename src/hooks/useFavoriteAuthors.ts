import { useLocalStorage } from './useLocalStorage';
import type { FavoriteAuthor } from '../types/book';

export function useFavoriteAuthors() {
  const [favoriteAuthors, setFavoriteAuthors] = useLocalStorage<FavoriteAuthor[]>(
    'cursus_favorite_authors_v2',
    []
  );

  const addFavoriteAuthor = (authorData: Omit<FavoriteAuthor, 'id' | 'addedAt'>) => {
    const newAuthor: FavoriteAuthor = {
      ...authorData,
      id: `author-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      addedAt: new Date().toISOString(),
    };
    setFavoriteAuthors((prev) => [newAuthor, ...prev]);
  };

  const removeFavoriteAuthor = (authorId: string) => {
    setFavoriteAuthors((prev) => prev.filter((a) => a.id !== authorId));
  };

  const toggleFavoriteAuthorByName = (authorName: string, bio?: string) => {
    const existing = favoriteAuthors.find(
      (a) => a.name.trim().toLowerCase() === authorName.trim().toLowerCase()
    );
    if (existing) {
      removeFavoriteAuthor(existing.id);
    } else {
      addFavoriteAuthor({
        name: authorName.trim(),
        bio: bio || `Author of books in your library`,
      });
    }
  };

  const updateFavoriteAuthor = (id: string, updates: Partial<FavoriteAuthor>) => {
    setFavoriteAuthors((prev) =>
      prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
    );
  };

  const isFavoriteAuthor = (name: string) => {
    return favoriteAuthors.some(
      (a) => a.name.trim().toLowerCase() === name.trim().toLowerCase()
    );
  };

  return {
    favoriteAuthors,
    addFavoriteAuthor,
    removeFavoriteAuthor,
    toggleFavoriteAuthorByName,
    updateFavoriteAuthor,
    isFavoriteAuthor,
  };
}
