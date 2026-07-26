import { useState } from 'react';
import type { Book } from '../types/book';
import type { RecommendedBook } from '../types/recommendations';
import { UMBRELLA_GENRES } from '../types/recommendations';
import { useRecommendations } from '../hooks/useRecommendations';
import { Button } from './ui/Button';
import { GenreBadge } from './ui/Badge';
import { Modal } from './ui/Modal';
import {
  Sparkles,
  Compass,
  Tag,
  RefreshCw,
  Plus,
  X,
  BookText,
  CheckCircle,
  BookMarked,
  AlertCircle,
  Star,
  Search,
} from 'lucide-react';
import { classNames } from '../utils/helpers';

interface RecommendationsPageProps {
  userBooks: Book[];
  userId?: string;
  onAddToHuntList: (input: {
    title: string;
    author: string;
    genre: string;
    coverUrl?: string;
    totalPages?: number;
    notes: string;
    status: 'wishlist';
  }) => Promise<any>;
}

export function RecommendationsPage({
  userBooks,
  userId = 'guest',
  onAddToHuntList,
}: RecommendationsPageProps) {
  const {
    mode,
    setMode,
    selectedGenre,
    setSelectedGenre,
    searchQuery,
    setSearchQuery,
    searchResults,
    activityBooks,
    unexploredSections,
    genreBooks,
    loading,
    error,
    dismissBook,
    refresh,
  } = useRecommendations(userBooks, userId);

  const [addedBookIds, setAddedBookIds] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal state for viewing full book details on click across ALL tabs
  const [selectedBookForDetails, setSelectedBookForDetails] = useState<RecommendedBook | null>(null);

  const handleAdd = async (book: RecommendedBook, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (addedBookIds.includes(book.id)) return;

    try {
      await onAddToHuntList({
        title: book.title,
        author: book.author,
        genre: book.genre || 'General',
        coverUrl: book.coverUrl,
        totalPages: book.pageCount,
        notes: `Recommended: ${book.reason}`,
        status: 'wishlist',
      });

      setAddedBookIds((prev) => [...prev, book.id]);
      setToastMessage(`"${book.title}" added to The Hunt List!`);
      setTimeout(() => setToastMessage(null), 3500);
    } catch (err) {
      console.error('Error adding recommended book to wishlist:', err);
    }
  };

  /**
   * Universal book card renderer shared across Activity, Explore Unexplored, Genre, and Search tabs
   */
  const renderBookCard = (book: RecommendedBook) => {
    const isAdded = addedBookIds.includes(book.id);

    return (
      <div
        key={book.id}
        onClick={() => setSelectedBookForDetails(book)}
        className="group relative flex flex-col overflow-hidden rounded-xl2 border border-ink/10 bg-surface shadow-card transition-shadow hover:shadow-cardHover cursor-pointer dark:border-paper/10 dark:bg-surface-dark"
      >
        {/* Top Right Overlay Action Buttons */}
        <div className="absolute right-2 top-2 z-10 flex items-center gap-1">
          <button
            onClick={(e) => handleAdd(book, e)}
            disabled={isAdded}
            className={classNames(
              'rounded-full p-1.5 shadow-sm backdrop-blur transition-colors',
              isAdded
                ? 'bg-emerald-500/90 text-paper dark:bg-emerald-500/90 dark:text-paper'
                : 'bg-surface/90 text-ink-muted hover:bg-surface dark:bg-surface-dark/90 dark:hover:bg-surface-dark dark:text-paper/60'
            )}
            title={isAdded ? 'On The Hunt List' : 'Add to Hunt List'}
            aria-label={isAdded ? 'On The Hunt List' : 'Add to Hunt List'}
          >
            {isAdded ? (
              <CheckCircle size={15} className="text-paper" />
            ) : (
              <Plus size={15} className="text-ink-muted dark:text-paper/60" />
            )}
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              dismissBook(book.id);
            }}
            className="rounded-full bg-surface/90 p-1.5 shadow-sm backdrop-blur transition-colors hover:bg-surface dark:bg-surface-dark/90 dark:hover:bg-surface-dark text-ink-muted dark:text-paper/60"
            title="Dismiss recommendation"
            aria-label="Dismiss recommendation"
          >
            <X size={15} />
          </button>
        </div>

        {/* Cover Image (Matches standard shelf BookCard h-44 aspect ratio 100%) */}
        <div className="relative h-44 w-full overflow-hidden bg-paper-soft dark:bg-bgdark-soft">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              loading="lazy"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookText size={30} className="text-ink/15 dark:text-paper/15" />
            </div>
          )}

          {/* Top Left Genre Tag */}
          <div className="absolute left-2 top-2">
            <GenreBadge genre={book.genre} />
          </div>
        </div>

        {/* Compact Book Info */}
        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-display text-[15px] font-medium leading-snug text-ink line-clamp-2 dark:text-paper group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors">
            {book.title}
          </h3>
          <p className="text-xs text-ink-muted dark:text-paper/50 line-clamp-1">{book.author}</p>
        </div>
      </div>
    );
  };

  const renderSkeletons = (count: number = 8) => (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="flex h-64 flex-col justify-between overflow-hidden rounded-xl2 border border-ink/5 bg-paper-soft/40 p-4 dark:border-paper/5 dark:bg-bgdark-soft/40 animate-pulse"
        >
          <div className="h-44 w-full rounded-lg bg-ink/10 dark:bg-paper/10 mb-3" />
          <div className="space-y-2">
            <div className="h-4 w-3/4 rounded bg-ink/10 dark:bg-paper/10" />
            <div className="h-3 w-1/2 rounded bg-ink/10 dark:bg-paper/10" />
          </div>
        </div>
      ))}
    </div>
  );

  const quickSearchPills = [
    'Romance and Murder',
    'Stephen King',
    'Agatha Christie',
    'Psychological Thriller',
    'Cyberpunk Space',
    'Habits & Growth',
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-lg border border-emerald-500/30 bg-emerald-950/90 px-4 py-3 text-sm font-medium text-emerald-200 shadow-xl backdrop-blur-md animate-in fade-in duration-200">
          <CheckCircle size={16} className="text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Book Details Modal displaying numeric average rating & synopsis across ALL recommendation tabs */}
      {selectedBookForDetails && (
        <Modal
          open={!!selectedBookForDetails}
          onClose={() => setSelectedBookForDetails(null)}
          title="Book Details"
          maxWidth="max-w-md"
        >
          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="h-36 w-24 shrink-0 overflow-hidden rounded-lg border border-ink/10 bg-paper-soft shadow-inner dark:border-paper/10 dark:bg-bgdark-soft">
                {selectedBookForDetails.coverUrl ? (
                  <img
                    src={selectedBookForDetails.coverUrl}
                    alt={selectedBookForDetails.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-ink-muted dark:text-paper/40">
                    <BookText size={24} />
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col justify-center space-y-1">
                <GenreBadge genre={selectedBookForDetails.genre} />
                <h3 className="font-display text-base font-medium text-ink dark:text-paper leading-snug">
                  {selectedBookForDetails.title}
                </h3>
                <p className="text-xs text-ink-muted dark:text-paper/60">
                  {selectedBookForDetails.author}
                </p>

                {/* Clear Numeric Average Reader Rating */}
                {typeof selectedBookForDetails.averageRating === 'number' && (
                  <div className="flex items-center gap-1 text-xs font-medium text-amber-700 dark:text-amber-400 pt-1">
                    <Star size={13} className="fill-amber-400 text-amber-400" />
                    <span>{selectedBookForDetails.averageRating.toFixed(1)} / 5 (Average User Rating)</span>
                  </div>
                )}

                {typeof selectedBookForDetails.pageCount === 'number' && (
                  <p className="text-[11px] text-ink-faint dark:text-paper/40">
                    {selectedBookForDetails.pageCount} pages
                  </p>
                )}
              </div>
            </div>

            {/* Recommendation Context Reason */}
            {selectedBookForDetails.reason && (
              <p className="rounded-lg border border-brass-500/20 bg-brass-50/50 p-2.5 text-xs text-brass-800 dark:border-brass-500/20 dark:bg-brass-500/10 dark:text-brass-300 font-medium">
                {selectedBookForDetails.reason}
              </p>
            )}

            {/* Synopsis Section */}
            <div className="space-y-1 pt-2 border-t border-ink/5 dark:border-paper/5">
              <p className="text-xs font-semibold text-ink-muted dark:text-paper/60 uppercase tracking-wider">
                Synopsis
              </p>
              {Boolean(selectedBookForDetails.description && selectedBookForDetails.description.trim().length > 0) ? (
                <p className="text-xs text-ink dark:text-paper/80 leading-relaxed max-h-48 overflow-y-auto">
                  {selectedBookForDetails.description}
                </p>
              ) : (
                <p className="text-xs text-ink-muted/70 dark:text-paper/50 italic">
                  No synopsis available for this title.
                </p>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="flex items-center justify-end gap-2 pt-4 border-t border-ink/5 dark:border-paper/5">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedBookForDetails(null)}
              >
                Close
              </Button>
              <Button
                variant={addedBookIds.includes(selectedBookForDetails.id) ? 'secondary' : 'primary'}
                size="sm"
                disabled={addedBookIds.includes(selectedBookForDetails.id)}
                onClick={() => handleAdd(selectedBookForDetails)}
              >
                {addedBookIds.includes(selectedBookForDetails.id) ? (
                  <>
                    <CheckCircle size={14} className="text-emerald-500" />
                    <span>On Hunt List</span>
                  </>
                ) : (
                  <>
                    <Plus size={14} />
                    <span>Add to Hunt List</span>
                  </>
                )}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Clean Mode Switcher Navigation Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-ink/10 pb-4 dark:border-paper/10">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-ink/5 p-1 dark:bg-paper/5">
          <button
            onClick={() => setMode('activity')}
            className={classNames(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'activity'
                ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper font-semibold'
                : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
            )}
          >
            <Sparkles size={14} />
            <span>Based on Activity</span>
          </button>

          <button
            onClick={() => setMode('explore')}
            className={classNames(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'explore'
                ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper font-semibold'
                : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
            )}
          >
            <Compass size={14} />
            <span>Explore Unexplored</span>
          </button>

          <button
            onClick={() => setMode('genre')}
            className={classNames(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'genre'
                ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper font-semibold'
                : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
            )}
          >
            <Tag size={14} />
            <span>Browse by Genre</span>
          </button>

          <button
            onClick={() => setMode('search')}
            className={classNames(
              'flex items-center gap-2 rounded-md px-3 py-1.5 text-xs font-medium transition-colors',
              mode === 'search'
                ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper font-semibold'
                : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
            )}
          >
            <Search size={14} />
            <span>Search Recommendations</span>
          </button>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={refresh}
          disabled={loading}
          className="gap-1.5 text-xs text-ink-muted dark:text-paper/60"
        >
          <RefreshCw size={14} className={classNames(loading && 'animate-spin')} />
          <span>Refresh</span>
        </Button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="flex items-center gap-3 rounded-lg border border-burgundy-500/20 bg-burgundy-50/50 p-3 text-xs text-burgundy-700 dark:border-burgundy-500/20 dark:bg-burgundy-500/10 dark:text-burgundy-300">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={refresh} className="ml-auto text-xs underline">
            Try again
          </Button>
        </div>
      )}

      {/* MODE 1: BASED ON MY ACTIVITY */}
      {mode === 'activity' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-medium text-ink dark:text-paper">
              Tailored for Your Taste
            </h3>
            <span className="text-xs text-ink-faint dark:text-paper/40">
              {activityBooks.length} recommendations
            </span>
          </div>

          {loading ? (
            renderSkeletons(8)
          ) : activityBooks.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {activityBooks.map(renderBookCard)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 py-12 text-center dark:border-paper/10">
              <BookMarked size={32} className="mb-2 text-ink-faint dark:text-paper/20" />
              <h4 className="text-sm font-medium text-ink dark:text-paper">
                No recommendations yet
              </h4>
              <p className="mt-1 max-w-xs text-xs text-ink-muted dark:text-paper/60">
                Rate more books or mark favorites in your library to unlock personalized suggestions.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODE 2: EXPLORE UNEXPLORED GENRES */}
      {mode === 'explore' && (
        <div className="space-y-8">
          {loading ? (
            renderSkeletons(4)
          ) : unexploredSections.length > 0 ? (
            unexploredSections.map((section) => (
              <div
                key={section.genre.id}
                className="rounded-2xl border border-ink/10 bg-surface/50 p-5 dark:border-paper/10 dark:bg-surface-dark/50 shadow-sm space-y-4"
              >
                {/* Genre Section Header with Badge and Description */}
                <div className="flex flex-col gap-1 border-b border-ink/10 pb-3 dark:border-paper/10">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-brass-500/10 px-2 py-0.5 text-[11px] font-semibold text-brass-700 dark:bg-brass-500/20 dark:text-brass-400 uppercase tracking-wider">
                      Unexplored
                    </span>
                    <h4 className="font-display text-base font-medium text-ink dark:text-paper">
                      {section.genre.label}
                    </h4>
                  </div>
                  <p className="text-xs text-ink-muted dark:text-paper/60">
                    {section.genre.description}
                  </p>
                </div>

                {/* Genre Book Grid */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-1">
                  {section.books.map(renderBookCard)}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 py-12 text-center dark:border-paper/10">
              <Compass size={32} className="mb-2 text-ink-faint dark:text-paper/20" />
              <h4 className="text-sm font-medium text-ink dark:text-paper">
                All genres explored!
              </h4>
              <p className="mt-1 max-w-xs text-xs text-ink-muted dark:text-paper/60">
                You already have books across all major categories in your library.
              </p>
            </div>
          )}
        </div>
      )}

      {/* MODE 3: BROWSE BY GENRE */}
      {mode === 'genre' && (
        <div className="space-y-6">
          {/* Category Selector Pills matching Cursus filter style */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
              Category
            </p>
            <div className="flex flex-wrap gap-2">
              {UMBRELLA_GENRES.map((g) => {
                const isSelected = selectedGenre.id === g.id;
                return (
                  <button
                    key={g.id}
                    onClick={() => setSelectedGenre(g)}
                    className={classNames(
                      'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                      isSelected
                        ? 'bg-ink text-paper dark:bg-brass-500 dark:text-bgdark'
                        : 'bg-ink/5 text-ink-muted hover:bg-ink/10 hover:text-ink dark:bg-paper/5 dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper'
                    )}
                  >
                    {g.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between border-t border-ink/5 pt-4 dark:border-paper/5">
              <h3 className="font-display text-base font-medium text-ink dark:text-paper">
                Top Books in {selectedGenre.label}
              </h3>
              <span className="text-xs text-ink-faint dark:text-paper/40">
                {genreBooks.length} results
              </span>
            </div>

            {loading ? (
              renderSkeletons(8)
            ) : genreBooks.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {genreBooks.map(renderBookCard)}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 py-12 text-center dark:border-paper/10">
                <Tag size={32} className="mb-2 text-ink-faint dark:text-paper/20" />
                <h4 className="text-sm font-medium text-ink dark:text-paper">
                  No books found in this category
                </h4>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODE 4: FREEFORM SEARCH RECOMMENDATION ENGINE */}
      {mode === 'search' && (
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-muted dark:text-paper/40"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by author, genre, or keywords (e.g., 'Romance and Murder', 'Stephen King', 'Cyberpunk')..."
                className="w-full rounded-xl border border-ink/10 bg-surface pl-10 pr-10 py-2.5 text-sm text-ink placeholder-ink-muted/60 focus:border-brass-500 focus:outline-none focus:ring-1 focus:ring-brass-500 dark:border-paper/10 dark:bg-surface-dark dark:text-paper dark:placeholder-paper/40"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted hover:text-ink dark:text-paper/40 dark:hover:text-paper"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* Quick Suggestion Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-ink-faint dark:text-paper/40 font-medium">
                Try searching:
              </span>
              {quickSearchPills.map((pill) => (
                <button
                  key={pill}
                  onClick={() => setSearchQuery(pill)}
                  className="rounded-full bg-ink/5 px-2.5 py-1 text-[11px] font-medium text-ink-muted transition-colors hover:bg-ink/10 hover:text-ink dark:bg-paper/5 dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper"
                >
                  {pill}
                </button>
              ))}
            </div>
          </div>

          {/* Results Grid */}
          <div className="space-y-4 pt-2">
            {searchQuery.trim() ? (
              <>
                <div className="flex items-center justify-between border-t border-ink/5 pt-4 dark:border-paper/5">
                  <h3 className="font-display text-base font-medium text-ink dark:text-paper">
                    Recommendations for "{searchQuery}"
                  </h3>
                  <span className="text-xs text-ink-faint dark:text-paper/40">
                    {searchResults.length} results
                  </span>
                </div>

                {loading ? (
                  renderSkeletons(8)
                ) : searchResults.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {searchResults.map(renderBookCard)}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 py-12 text-center dark:border-paper/10">
                    <Search size={32} className="mb-2 text-ink-faint dark:text-paper/20" />
                    <h4 className="text-sm font-medium text-ink dark:text-paper">
                      No books found for "{searchQuery}"
                    </h4>
                    <p className="mt-1 max-w-xs text-xs text-ink-muted dark:text-paper/60">
                      Try searching with different keywords like an author name, genre, or topic.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-ink/10 py-12 text-center dark:border-paper/10">
                <Search size={32} className="mb-2 text-ink-faint dark:text-paper/20" />
                <h4 className="text-sm font-medium text-ink dark:text-paper">
                  Type to Search Recommendations
                </h4>
                <p className="mt-1 max-w-sm text-xs text-ink-muted dark:text-paper/60">
                  Enter an author name, a specific sub-genre, or keywords like "Romance and Murder" to generate instant recommendations.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
