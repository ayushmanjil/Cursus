import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  UserCheck,
  Plus,
  Trash2,
  BookOpen,
  BookMarked,
  Search,
  Quote,
  ChevronDown,
  ChevronUp,
  ScrollText,
} from 'lucide-react';
import type { Book, BookStatus } from '../types/book';
import type { Poem } from '../types/poem';
import { BookGrid } from './BookGrid';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { AddFavoriteAuthorModal } from './AddFavoriteAuthorModal';
import { useFavoriteAuthors } from '../hooks/useFavoriteAuthors';
import { PoemCard, PoemDetailModal } from './PoemsPage';
import { getPoemDetails } from '../services/poetryService';

interface FavoritesViewProps {
  books: Book[];
  onOpenBook: (book: Book) => void;
  onToggleFavoriteBook: (id: string) => void;
  onSetStatus: (id: string, status: BookStatus) => void;
  onDeleteBook: (id: string) => void;
  onOpenAddBook: () => void;
  favoritePoems?: Poem[];
  isFavoritePoem?: (poemId: string) => boolean;
  isReadPoem?: (poemId: string) => boolean;
  isSavedPoem?: (poemId: string) => boolean;
  onToggleFavoritePoem?: (poem: Poem) => void;
  onToggleReadPoem?: (poem: Poem) => void;
  onToggleSavedPoem?: (poem: Poem) => void;
  onNavigateToPoems?: () => void;
}

export function FavoritesView({
  books,
  onOpenBook,
  onToggleFavoriteBook,
  onSetStatus,
  onDeleteBook,
  onOpenAddBook,
  favoritePoems = [],
  isFavoritePoem = () => true,
  isReadPoem = () => false,
  isSavedPoem = () => false,
  onToggleFavoritePoem = () => {},
  onToggleReadPoem = () => {},
  onToggleSavedPoem = () => {},
  onNavigateToPoems,
}: FavoritesViewProps) {
  const [subTab, setSubTab] = useState<'books' | 'authors' | 'poems'>('books');
  const [addAuthorModalOpen, setAddAuthorModalOpen] = useState(false);
  const [authorSearch, setAuthorSearch] = useState('');
  const [poemSearch, setPoemSearch] = useState('');
  const [showLibraryAuthors, setShowLibraryAuthors] = useState(false);

  // Selected poem detail modal state inside Favorites view
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [loadingPoemDetails, setLoadingPoemDetails] = useState(false);

  const {
    favoriteAuthors,
    addFavoriteAuthor,
    removeFavoriteAuthor,
    toggleFavoriteAuthorByName,
    isFavoriteAuthor,
  } = useFavoriteAuthors();

  // Get favorite books
  const favoriteBooks = books.filter((b) => b.favorite);

  // Extract all unique authors in user's library
  const allLibraryAuthors = Array.from(
    new Set(books.map((b) => b.author.trim()).filter(Boolean))
  );

  // Authors in library that are not yet favorited
  const unfavoritedLibraryAuthors = allLibraryAuthors.filter(
    (name) => !isFavoriteAuthor(name)
  );

  // Filter favorite authors based on search
  const filteredFavoriteAuthors = favoriteAuthors.filter((author) => {
    if (!authorSearch.trim()) return true;
    const q = authorSearch.toLowerCase();
    return (
      author.name.toLowerCase().includes(q) ||
      (author.bio && author.bio.toLowerCase().includes(q)) ||
      (author.notes && author.notes.toLowerCase().includes(q))
    );
  });

  // Filter favorite poems based on search
  const filteredFavoritePoems = favoritePoems.filter((poem) => {
    if (!poemSearch.trim()) return true;
    const q = poemSearch.toLowerCase();
    return (
      poem.title.toLowerCase().includes(q) ||
      poem.author.toLowerCase().includes(q)
    );
  });

  const handleOpenPoem = useCallback(async (poem: Poem) => {
    setSelectedPoem(poem);
    if (!poem.lines || poem.lines.length === 0) {
      setLoadingPoemDetails(true);
      try {
        const fullPoem = await getPoemDetails(poem.author, poem.title);
        if (fullPoem && fullPoem.lines) {
          setSelectedPoem(fullPoem);
        }
      } catch {
        // fallback
      } finally {
        setLoadingPoemDetails(false);
      }
    }
  }, []);

  return (
    <div className="space-y-6">
      {/* Sub Navigation Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 dark:border-paper/10 pb-4">
        <div className="w-full sm:w-auto">
          <div className="grid grid-cols-3 sm:flex items-center gap-1 rounded-xl bg-paper-soft p-1 dark:bg-bgdark-soft border border-ink/5 dark:border-paper/5 w-full sm:w-fit">
            <button
              onClick={() => setSubTab('books')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'books'
                  ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
                  : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              <Heart size={14} className={subTab === 'books' ? 'fill-burgundy-500 text-burgundy-500' : ''} />
              <span className="hidden sm:inline">Favorite Books</span>
              <span className="sm:hidden">Books</span>
              <span className="ml-0.5 sm:ml-1 rounded-full bg-ink/5 px-1.5 sm:px-2 py-0.5 text-[10px] font-bold text-ink-muted dark:bg-paper/10 dark:text-paper/60">
                {favoriteBooks.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('authors')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'authors'
                  ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
                  : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              <UserCheck size={14} className={subTab === 'authors' ? 'text-burgundy-500' : ''} />
              <span className="hidden sm:inline">Favorite Authors</span>
              <span className="sm:hidden">Authors</span>
              <span className="ml-0.5 sm:ml-1 rounded-full bg-ink/5 px-1.5 sm:px-2 py-0.5 text-[10px] font-bold text-ink-muted dark:bg-paper/10 dark:text-paper/60">
                {favoriteAuthors.length}
              </span>
            </button>

            <button
              onClick={() => setSubTab('poems')}
              className={`flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 text-xs font-semibold transition-all ${
                subTab === 'poems'
                  ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
                  : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              <ScrollText size={14} className={subTab === 'poems' ? 'text-burgundy-500' : ''} />
              <span className="hidden sm:inline">Favorite Poems</span>
              <span className="sm:hidden">Poems</span>
              <span className="ml-0.5 sm:ml-1 rounded-full bg-ink/5 px-1.5 sm:px-2 py-0.5 text-[10px] font-bold text-ink-muted dark:bg-paper/10 dark:text-paper/60">
                {favoritePoems.length}
              </span>
            </button>
          </div>
        </div>

        {subTab === 'authors' && (
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-64">
              <input
                type="text"
                placeholder="Search favorite authors..."
                value={authorSearch}
                onChange={(e) => setAuthorSearch(e.target.value)}
                className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/40"
              />
              <Search size={13} className="absolute left-2.5 top-2.5 text-ink-faint dark:text-paper/40" />
            </div>
            <Button variant="primary" size="sm" onClick={() => setAddAuthorModalOpen(true)}>
              <Plus size={14} /> Add Author
            </Button>
          </div>
        )}

        {subTab === 'poems' && favoritePoems.length > 0 && (
          <div className="relative flex-1 sm:w-64">
            <input
              type="text"
              placeholder="Search favorite poems..."
              value={poemSearch}
              onChange={(e) => setPoemSearch(e.target.value)}
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/40"
            />
            <Search size={13} className="absolute left-2.5 top-2.5 text-ink-faint dark:text-paper/40" />
          </div>
        )}
      </div>

      {/* Sub Tab Contents */}
      {subTab === 'books' && (
        <BookGrid
          books={favoriteBooks}
          onOpen={onOpenBook}
          onToggleFavorite={onToggleFavoriteBook}
          onSetStatus={onSetStatus}
          onDelete={onDeleteBook}
          emptyTitle="No favorite books yet"
          emptyDescription="Click the heart icon on any book card to add it to your favorites."
          emptyAction={
            <Button variant="primary" size="sm" onClick={onOpenAddBook}>
              <Plus size={14} /> Browse & Add Books
            </Button>
          }
        />
      )}

      {subTab === 'authors' && (
        <div className="space-y-6">
          {/* Quick-Add Suggestions from Library (Collapsible) */}
          {unfavoritedLibraryAuthors.length > 0 && (
            <div className="rounded-2xl border border-brass-500/20 bg-gradient-to-r from-brass-50/60 to-paper-soft/50 p-4 dark:from-brass-500/10 dark:to-bgdark-soft/50">
              <button
                type="button"
                onClick={() => setShowLibraryAuthors((prev) => !prev)}
                className="flex w-full items-center justify-between text-left"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-brass-800 dark:text-brass-300">
                    Authors in your library ({unfavoritedLibraryAuthors.length})
                  </h3>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-medium text-brass-700 hover:text-brass-800 dark:text-brass-300 dark:hover:text-brass-200">
                  <span>{showLibraryAuthors ? 'Hide suggestions' : 'Show suggestions'}</span>
                  {showLibraryAuthors ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </div>
              </button>

              {showLibraryAuthors && (
                <div className="flex flex-wrap gap-2 pt-3 mt-2 border-t border-brass-500/15">
                  {unfavoritedLibraryAuthors.map((authorName) => {
                    const authorBookCount = books.filter(
                      (b) => b.author.trim().toLowerCase() === authorName.toLowerCase()
                    ).length;
                    return (
                      <button
                        key={authorName}
                        type="button"
                        onClick={() => toggleFavoriteAuthorByName(authorName)}
                        className="group inline-flex items-center gap-1.5 rounded-full border border-brass-500/30 bg-surface px-3 py-1 text-xs font-medium text-ink shadow-xs transition-all hover:border-burgundy-500 hover:bg-burgundy-50 hover:text-burgundy-700 dark:bg-surface-dark dark:text-paper dark:hover:bg-burgundy-500/20 dark:hover:text-burgundy-300"
                      >
                        <Heart size={12} className="text-ink-faint transition-colors group-hover:fill-burgundy-500 group-hover:text-burgundy-500 dark:text-paper/40" />
                        <span>{authorName}</span>
                        <span className="ml-0.5 rounded-full bg-ink/5 px-1.5 py-0.2 text-[10px] text-ink-muted dark:bg-paper/10 dark:text-paper/60">
                          {authorBookCount} {authorBookCount === 1 ? 'book' : 'books'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Favorite Authors Grid */}
          {filteredFavoriteAuthors.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence>
                {filteredFavoriteAuthors.map((author) => {
                  const authorBooks = books.filter(
                    (b) => b.author.trim().toLowerCase() === author.name.trim().toLowerCase()
                  );

                  return (
                    <motion.div
                      key={author.id}
                      layout
                      initial={{ opacity: 0, scale: 0.96 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-ink/10 bg-surface p-5 shadow-card transition-all hover:shadow-cardHover dark:border-paper/10 dark:bg-surface-dark"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {author.photoUrl ? (
                              <img
                                src={author.photoUrl}
                                alt={author.name}
                                className="h-12 w-12 rounded-full object-cover border-2 border-brass-500/30 shadow-sm"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-burgundy-500/20 to-brass-500/20 border border-burgundy-500/30 font-display text-base font-bold text-burgundy-600 dark:text-burgundy-400">
                                {author.name.slice(0, 2).toUpperCase()}
                              </div>
                            )}
                            <div>
                              <h4 className="font-display text-base font-bold text-ink dark:text-paper leading-snug">
                                {author.name}
                              </h4>
                              <p className="text-xs text-ink-muted dark:text-paper/50 flex items-center gap-1">
                                <BookOpen size={12} className="text-brass-500" />
                                {authorBooks.length} {authorBooks.length === 1 ? 'book' : 'books'} in library
                              </p>
                            </div>
                          </div>

                          <button
                            onClick={() => removeFavoriteAuthor(author.id)}
                            title="Remove favorite author"
                            className="rounded-lg p-1.5 text-ink-faint transition-colors hover:bg-burgundy-50 hover:text-burgundy-600 dark:text-paper/40 dark:hover:bg-burgundy-500/20 dark:hover:text-burgundy-400"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>

                        {author.bio && (
                          <p className="text-xs text-ink-muted dark:text-paper/60 line-clamp-2 italic">
                            "{author.bio}"
                          </p>
                        )}

                        {author.notes && (
                          <div className="rounded-xl bg-paper-soft/60 p-2.5 text-xs text-ink dark:bg-bgdark-soft/60 dark:text-paper/80 flex items-start gap-1.5 border border-ink/5 dark:border-paper/5">
                            <Quote size={13} className="shrink-0 text-brass-500 mt-0.5" />
                            <span className="line-clamp-2">{author.notes}</span>
                          </div>
                        )}

                        {/* Books by this Author Preview */}
                        {authorBooks.length > 0 && (
                          <div className="pt-2 border-t border-ink/5 dark:border-paper/5">
                            <p className="text-[11px] font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40 mb-1.5">
                              Books in library:
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                              {authorBooks.map((b) => (
                                <button
                                  key={b.id}
                                  onClick={() => onOpenBook(b)}
                                  className="group/book inline-flex items-center gap-1 rounded-lg border border-ink/10 bg-paper-soft/50 px-2 py-1 text-xs text-ink transition-colors hover:border-brass-500 hover:bg-brass-50 dark:border-paper/10 dark:bg-bgdark-soft/50 dark:text-paper dark:hover:bg-brass-500/10"
                                >
                                  <BookMarked size={11} className="text-brass-500" />
                                  <span className="max-w-[120px] truncate font-medium">{b.title}</span>
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-ink/15 p-12 text-center dark:border-paper/15">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-burgundy-500/10 text-burgundy-500 dark:bg-burgundy-500/20">
                <UserCheck size={24} />
              </div>
              <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                No favorite authors added yet
              </h3>
              <p className="mt-1 text-xs text-ink-muted dark:text-paper/50 max-w-sm">
                Add authors you love to keep track of their books and inspiration in your library.
              </p>
              <div className="mt-4">
                <Button variant="primary" size="sm" onClick={() => setAddAuthorModalOpen(true)}>
                  <Plus size={14} /> Add First Author
                </Button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sub Tab: Favorite Poems */}
      {subTab === 'poems' && (
        <div>
          {filteredFavoritePoems.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredFavoritePoems.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    onClick={() => handleOpenPoem(poem)}
                    isRead={isReadPoem(poem.id)}
                    isSaved={isSavedPoem(poem.id)}
                    isFavorite={true}
                    onToggleRead={(e) => {
                      e.stopPropagation();
                      onToggleReadPoem(poem);
                    }}
                    onToggleSaved={(e) => {
                      e.stopPropagation();
                      onToggleSavedPoem(poem);
                    }}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      onToggleFavoritePoem(poem);
                    }}
                    onRemove={(e) => {
                      e.stopPropagation();
                      onToggleFavoritePoem(poem);
                    }}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : favoritePoems.length === 0 ? (
            <EmptyState
              icon={ScrollText}
              title="No favorite poems yet"
              description="Click the heart icon on any poem card in the Poems section to add it to your favorites."
              action={
                onNavigateToPoems ? (
                  <Button variant="primary" size="sm" onClick={onNavigateToPoems}>
                    <ScrollText size={14} /> Browse Poems
                  </Button>
                ) : undefined
              }
            />
          ) : (
            <div className="py-12 text-center text-sm text-ink-muted dark:text-paper/50">
              No favorite poems match "{poemSearch}".
            </div>
          )}
        </div>
      )}

      {/* Poem Detail Modal */}
      <PoemDetailModal
        poem={selectedPoem}
        loadingDetails={loadingPoemDetails}
        onClose={() => setSelectedPoem(null)}
        isRead={selectedPoem ? isReadPoem(selectedPoem.id) : false}
        isSaved={selectedPoem ? isSavedPoem(selectedPoem.id) : false}
        isFavorite={selectedPoem ? isFavoritePoem(selectedPoem.id) : false}
        onToggleRead={() => selectedPoem && onToggleReadPoem(selectedPoem)}
        onToggleSaved={() => selectedPoem && onToggleSavedPoem(selectedPoem)}
        onToggleFavorite={() => selectedPoem && onToggleFavoritePoem(selectedPoem)}
      />

      {/* Add Author Modal */}
      <AddFavoriteAuthorModal
        open={addAuthorModalOpen}
        onClose={() => setAddAuthorModalOpen(false)}
        onAdd={addFavoriteAuthor}
        existingLibraryAuthors={unfavoritedLibraryAuthors}
      />
    </div>
  );
}
