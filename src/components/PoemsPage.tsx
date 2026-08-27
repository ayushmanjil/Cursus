import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  CheckCircle2,
  Bookmark,
  Heart,
  Loader2,
  AlertCircle,
  Sparkles,
  Shuffle,
  BookOpen,
  Trash2,
  ExternalLink,
  Plus,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import type { Poem, ReadPoem, SavedPoem } from '../types/poem';
import { searchPoems, getPoemDetails, getRandomPoems } from '../services/poetryService';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { Modal } from './ui/Modal';
import { AddPoemModal } from './AddPoemModal';
import { classNames } from '../utils/helpers';
import { createPortal } from 'react-dom';
import BookLoader from './ui/BookLoader';

export interface PoemsPageProps {
  readPoems: ReadPoem[];
  savedPoems: SavedPoem[];
  favoritePoems: Poem[];
  onMarkAsRead: (poem: Poem) => Promise<void>;
  onRemoveFromRead: (poemId: string) => Promise<void>;
  isRead: (poemId: string) => boolean;
  onSaveForLater: (poem: Poem) => Promise<void>;
  onRemoveFromSaved: (poemId: string) => Promise<void>;
  isSaved: (poemId: string) => boolean;
  isFavorite: (poemId: string) => boolean;
  onToggleRead: (poem: Poem) => Promise<void>;
  onToggleSaved: (poem: Poem) => Promise<void>;
  onToggleFavorite: (poem: Poem) => Promise<void>;
}

type TabKey = 'search' | 'read' | 'saved';

// Helper to group poem lines into stanzas
function getStanzas(lines: string[]): string[][] {
  const stanzas: string[][] = [];
  let current: string[] = [];

  for (const line of lines) {
    if (line.trim() === '') {
      if (current.length > 0) {
        stanzas.push(current);
        current = [];
      }
    } else {
      current.push(line);
    }
  }
  if (current.length > 0) {
    stanzas.push(current);
  }
  return stanzas;
}

// ─── Poem Detail Modal / Card Viewer Component ─────────────────────
export function PoemDetailModal({
  poem,
  loadingDetails,
  onClose,
  isRead,
  isSaved,
  isFavorite,
  onToggleRead,
  onToggleSaved,
  onToggleFavorite,
  relatedPoems = [],
  onSelectPoem,
}: {
  poem: Poem | null;
  loadingDetails?: boolean;
  onClose: () => void;
  isRead: boolean;
  isSaved: boolean;
  isFavorite: boolean;
  onToggleRead: () => void;
  onToggleSaved: () => void;
  onToggleFavorite: () => void;
  /** Poems shown in the fullscreen left sidebar (same author + discovery) */
  relatedPoems?: Poem[];
  /** Called when the user clicks a related poem in the sidebar */
  onSelectPoem?: (poem: Poem) => void;
}) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Reset fullscreen when poem changes or closes
  useEffect(() => {
    if (!poem) setIsFullscreen(false);
  }, [poem]);

  // Escape key handler for fullscreen
  useEffect(() => {
    if (!isFullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  if (!poem) return null;

  const stanzas = poem.lines ? getStanzas(poem.lines) : [];
  const totalLines = poem.lines?.length ?? 0;
  const useColumns = totalLines > 22;

  // Shared header content
  const headerContent = (
    <>
      {/* Title + linecount */}
      <div className="flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h2 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-ink dark:text-paper leading-snug">
            {poem.title}
          </h2>
          {/* On mobile, hide badge here — it reappears below the author line */}
          {poem.linecount && (
            <span className="hidden sm:inline-flex shrink-0 rounded-full bg-brass-50 px-2.5 py-0.5 text-xs font-semibold text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
              {poem.linecount} lines
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <p className="font-display text-sm font-medium italic text-brass-600 dark:text-brass-400 truncate">
            by {poem.author}
          </p>
          {poem.linecount && (
            <span className="sm:hidden inline-flex shrink-0 rounded-full bg-brass-50 px-2 py-0.5 text-xs font-semibold text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
              {poem.linecount} lines
            </span>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div className="mt-3 flex flex-wrap items-center gap-1.5 sm:gap-2">
        <Button
          variant={isFavorite ? 'primary' : 'secondary'}
          size="sm"
          onClick={onToggleFavorite}
          className={isFavorite ? 'bg-burgundy-600 text-white dark:bg-burgundy-500 hover:bg-burgundy-700' : ''}
        >
          <Heart size={14} className={isFavorite ? 'fill-current' : ''} />
          {isFavorite ? 'Favorited' : 'Favorite'}
        </Button>

        <Button
          variant={isRead ? 'primary' : 'secondary'}
          size="sm"
          onClick={onToggleRead}
          className={isRead ? 'bg-forest-600 text-white dark:bg-forest-500 hover:bg-forest-700' : ''}
        >
          <CheckCircle2 size={14} />
          {isRead ? 'Marked as Read' : 'Mark as Read'}
        </Button>

        <Button
          variant={isSaved ? 'primary' : 'secondary'}
          size="sm"
          onClick={onToggleSaved}
          className={isSaved ? 'bg-brass-600 text-white dark:bg-brass-500 hover:bg-brass-700' : ''}
        >
          <Bookmark size={14} className={isSaved ? 'fill-current' : ''} />
          {isSaved ? 'Saved for Later' : 'Save for Later'}
        </Button>
      </div>
    </>
  );

  // Shared poem body content
  const poemBody = loadingDetails ? (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <BookLoader size="md" color="brown" />
      <p className="mt-3 text-sm text-ink-muted dark:text-paper/60">Loading full poem lines…</p>
    </div>
  ) : poem.lines && poem.lines.length > 0 ? (
    <div
      className={classNames(
        'font-serif text-base leading-relaxed text-ink dark:text-paper/95',
        isFullscreen && useColumns
          ? 'columns-2 gap-12 space-y-6'
          : 'space-y-6'
      )}
    >
      {stanzas.map((stanza, sIdx) => (
        <div key={sIdx} className="space-y-1.5 pl-3 border-l-2 border-brass-500/20 dark:border-brass-500/30 break-inside-avoid">
          {stanza.map((line, lIdx) => (
            <p key={lIdx} className="select-text whitespace-pre-wrap">
              {line}
            </p>
          ))}
        </div>
      ))}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <p className="text-sm text-ink-muted dark:text-paper/60">Poem lines preview not available.</p>
    </div>
  );

  // ── Fullscreen View ──
  if (isFullscreen) {
    // Split related poems: same-author first, then others
    const sameAuthor = relatedPoems.filter(
      (p) => p.author === poem.author && p.title !== poem.title
    );
    const otherPoems = relatedPoems.filter(
      (p) => p.author !== poem.author
    ).slice(0, 6 - sameAuthor.length);

    return createPortal(
      <AnimatePresence>
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-surface dark:bg-surface-dark overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {/* Backdrop on mobile */}
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm lg:hidden pointer-events-none"
          />

          {/* ── Unified Fullscreen Header (Continuous horizontal line across entire screen) ── */}
          <div className="shrink-0 flex items-stretch border-b border-ink/10 dark:border-paper/10 bg-surface dark:bg-surface-dark z-10">
            {/* Left Header section (matches sidebar width w-64) */}
            <div className="hidden lg:flex flex-col justify-center w-64 shrink-0 px-5 py-4 bg-paper-soft dark:bg-surface-dark border-r border-ink/10 dark:border-paper/10">
              <div className="flex items-center gap-1.5">
                <BookOpen size={13} className="text-brass-600 dark:text-brass-400" />
                <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-faint dark:text-paper/40">Reading Room</span>
              </div>
              <p className="text-xs text-ink-muted dark:text-paper/60 leading-relaxed mt-0.5">
                Discover & related poems
              </p>
            </div>

            {/* Main Header section */}
            <div className="flex-1 flex items-center justify-between px-4 py-4 sm:px-8 bg-surface dark:bg-surface-dark min-w-0">
              <div className="min-w-0 flex-1 pr-4">
                {headerContent}
              </div>

              {/* Controls */}
              <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="flex items-center gap-1.5 rounded-lg bg-ink/5 px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-ink/10 hover:text-ink dark:bg-paper/5 dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors"
                  title="Exit fullscreen (Esc)"
                >
                  <Minimize2 size={14} />
                  <span>Exit</span>
                </button>
                <button
                  onClick={() => { setIsFullscreen(false); onClose(); }}
                  aria-label="Close"
                  className="rounded-full p-1.5 text-ink-muted hover:bg-ink/10 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors"
                >
                  <X size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* ── Main Body Row ── */}
          <div className="flex-1 flex overflow-hidden">
            {/* Left Sidebar (lg+) */}
            <motion.div
              className="relative hidden lg:flex flex-col w-64 shrink-0 bg-paper-soft dark:bg-surface-dark border-r border-ink/10 dark:border-paper/10 overflow-hidden"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -20, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
            >
              {/* Scrollable list */}
              <div className="flex-1 overflow-y-auto scrollbar-thin py-3">
                {/* Same-author poems */}
                {sameAuthor.length > 0 && (
                  <div className="mb-4">
                    <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-brass-600 dark:text-brass-500">
                      More by {poem.author}
                    </p>
                    {sameAuthor.map((p) => (
                      <button
                        key={p.title}
                        onClick={() => { onSelectPoem?.(p); }}
                        className="w-full text-left px-5 py-2.5 hover:bg-ink/5 dark:hover:bg-paper/5 transition-colors group"
                      >
                        <p className="text-sm font-medium text-ink/80 dark:text-paper/80 group-hover:text-ink dark:group-hover:text-paper leading-snug line-clamp-2 transition-colors">
                          {p.title}
                        </p>
                        {p.linecount && (
                          <p className="text-[10px] text-ink-faint dark:text-paper/30 mt-0.5">{p.linecount} lines</p>
                        )}
                      </button>
                    ))}
                  </div>
                )}

                {/* Divider + Discover section */}
                {otherPoems.length > 0 && (
                  <div>
                    {sameAuthor.length > 0 && (
                      <div className="mx-5 mb-3 h-px bg-ink/10 dark:bg-paper/8" />
                    )}
                    <p className="px-5 mb-2 text-[10px] font-semibold uppercase tracking-widest text-ink-faint dark:text-paper/30">
                      Discover
                    </p>
                    {otherPoems.map((p) => (
                      <button
                        key={p.title}
                        onClick={() => { onSelectPoem?.(p); }}
                        className="w-full text-left px-5 py-2.5 hover:bg-ink/5 dark:hover:bg-paper/5 transition-colors group"
                      >
                        <p className="text-sm font-medium text-ink-muted dark:text-paper/60 group-hover:text-ink dark:group-hover:text-paper/90 leading-snug line-clamp-2 transition-colors">
                          {p.title}
                        </p>
                        <p className="text-[10px] text-ink-faint dark:text-paper/25 mt-0.5 italic">{p.author}</p>
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {sameAuthor.length === 0 && otherPoems.length === 0 && (
                  <div className="px-5 py-8 text-center">
                    <p className="text-xs text-ink-faint dark:text-paper/30">No suggestions available</p>
                  </div>
                )}
              </div>

              {/* Close shortcut at bottom */}
              <div className="shrink-0 p-4 border-t border-ink/10 dark:border-paper/10">
                <button
                  onClick={() => setIsFullscreen(false)}
                  className="w-full flex items-center justify-center gap-2 rounded-lg py-2 text-xs font-medium text-ink-faint dark:text-paper/40 hover:text-ink-muted dark:hover:text-paper/70 hover:bg-ink/5 dark:hover:bg-paper/5 transition-colors"
                >
                  <Minimize2 size={12} />
                  Exit fullscreen
                </button>
              </div>
            </motion.div>

            {/* Right Scrollable poem body */}
            <div className="flex-1 bg-surface dark:bg-surface-dark overflow-y-auto px-4 py-6 sm:px-8 scrollbar-thin">
              <div className="mx-auto max-w-4xl">
                {poemBody}
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    );
  }

  // ── Normal Modal View ──
  return (
    <Modal open={!!poem} onClose={onClose} title="" hideHeader maxWidth="max-w-2xl">
      <div className="flex flex-col max-h-[80vh]">
        {/* Compact Header (Title, Author, Actions) */}
        <div className="shrink-0 border-b border-ink/10 pb-3.5 pr-8 dark:border-paper/10">
          {headerContent}
          {/* Fullscreen toggle */}
          <div className="mt-2 flex items-center">
            <button
              onClick={() => setIsFullscreen(true)}
              className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors"
              title="View fullscreen"
            >
              <Maximize2 size={13} />
              Fullscreen
            </button>
          </div>
        </div>

        {/* Scrollable Poem Lines Section ONLY */}
        <div className="flex-1 overflow-y-auto pt-4 pr-2 scrollbar-thin max-h-[62vh]">
          {poemBody}
        </div>
      </div>
    </Modal>
  );
}

// ─── Poem Summary Card Component ──────────────────────────────────
export function PoemCard({
  poem,
  onClick,
  isRead,
  isSaved,
  isFavorite,
  onToggleRead,
  onToggleSaved,
  onToggleFavorite,
  onRemove,
  actionContext: _actionContext,
}: {
  poem: Poem;
  onClick: () => void;
  isRead: boolean;
  isSaved: boolean;
  isFavorite: boolean;
  onToggleRead: (e: React.MouseEvent) => void;
  onToggleSaved: (e: React.MouseEvent) => void;
  onToggleFavorite: (e: React.MouseEvent) => void;
  onRemove?: (e: React.MouseEvent) => void;
  actionContext?: 'search' | 'read' | 'saved';
}) {
  const linePreview = useMemo(() => {
    if (!poem.lines || poem.lines.length === 0) return null;
    const nonBlank = poem.lines.filter((l) => l.trim() !== '').slice(0, 3);
    return nonBlank.join(' / ');
  }, [poem.lines]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group relative flex flex-col justify-between rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card transition-all duration-200 hover:shadow-cardHover hover:border-brass-400/40 dark:border-paper/10 dark:bg-surface-dark dark:hover:border-brass-500/40 cursor-pointer"
    >
      <div>
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="font-display text-lg font-semibold text-ink group-hover:text-brass-600 dark:text-paper dark:group-hover:text-brass-400 transition-colors line-clamp-1">
              {poem.title}
            </h3>
            <p className="mt-0.5 text-sm font-medium italic text-ink-muted dark:text-paper/60 truncate">
              by {poem.author}
            </p>
          </div>
          {poem.linecount && (
            <span className="shrink-0 rounded-full bg-paper-soft px-2 py-0.5 text-[11px] font-semibold text-ink-muted dark:bg-bgdark-soft dark:text-paper/50">
              {poem.linecount} lines
            </span>
          )}
        </div>

        {linePreview && (
          <p className="mt-3 text-xs italic text-ink-faint dark:text-paper/50 line-clamp-2 border-t border-ink/5 pt-2.5 dark:border-paper/5">
            "{linePreview}…"
          </p>
        )}
      </div>

      <div className="mt-4 flex items-center justify-between gap-2 border-t border-ink/5 pt-3 dark:border-paper/5">
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Favorite button */}
          <button
            type="button"
            onClick={onToggleFavorite}
            className={classNames(
              'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
              isFavorite
                ? 'bg-burgundy-50 text-burgundy-700 dark:bg-burgundy-500/20 dark:text-burgundy-300'
                : 'text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper'
            )}
            title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          >
            <Heart size={13} className={isFavorite ? 'fill-current text-burgundy-600 dark:text-burgundy-400' : ''} />
            {isFavorite ? 'Favorite' : 'Favorite'}
          </button>

          {/* Read button */}
          <button
            type="button"
            onClick={onToggleRead}
            className={classNames(
              'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
              isRead
                ? 'bg-forest-50 text-forest-700 dark:bg-forest-500/20 dark:text-forest-300'
                : 'text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper'
            )}
            title={isRead ? 'Marked as read' : 'Mark as read'}
          >
            <CheckCircle2 size={13} className={isRead ? 'text-forest-600 dark:text-forest-400' : ''} />
            {isRead ? 'Read' : 'Mark as Read'}
          </button>

          {/* Saved button */}
          <button
            type="button"
            onClick={onToggleSaved}
            className={classNames(
              'flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium transition-colors',
              isSaved
                ? 'bg-brass-50 text-brass-700 dark:bg-brass-500/20 dark:text-brass-300'
                : 'text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper'
            )}
            title={isSaved ? 'Saved for later' : 'Save for later'}
          >
            <Bookmark size={13} className={isSaved ? 'fill-current text-brass-600 dark:text-brass-400' : ''} />
            {isSaved ? 'Saved' : 'Save for Later'}
          </button>
        </div>

        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-md p-1 text-ink-faint hover:bg-burgundy-50 hover:text-burgundy-600 dark:text-paper/40 dark:hover:bg-burgundy-500/20 dark:hover:text-burgundy-300 transition-colors"
            title="Remove"
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main PoemsPage Component ──────────────────────────────────────
export function PoemsPage({
  readPoems,
  savedPoems,
  favoritePoems: _favoritePoems,
  onMarkAsRead,
  onRemoveFromRead,
  isRead,
  onSaveForLater,
  onRemoveFromSaved,
  isSaved,
  isFavorite,
  onToggleRead,
  onToggleSaved,
  onToggleFavorite,
}: PoemsPageProps) {
  const [activeTab, setActiveTab] = useState<TabKey>('search');

  // Search tab state
  const [query, setQuery] = useState('');
  const [searchBy, setSearchBy] = useState<'title' | 'author' | 'all'>('all');
  const [searchResults, setSearchResults] = useState<Poem[]>([]);
  const [randomFeed, setRandomFeed] = useState<Poem[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingRandom, setLoadingRandom] = useState(false);

  // Selected poem detail modal state
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);
  const [loadingPoemDetails, setLoadingPoemDetails] = useState(false);

  // Filter state for Read/Saved tabs
  const [filterText, setFilterText] = useState('');

  // Add Custom Poem modal state
  const [addModalOpen, setAddModalOpen] = useState(false);

  // Fetch initial random poems for discovery feed
  const fetchRandomFeed = useCallback(async () => {
    setLoadingRandom(true);
    try {
      const feed = await getRandomPoems(8);
      setRandomFeed(feed);
    } catch {
      // silent catch for random feed
    } finally {
      setLoadingRandom(false);
    }
  }, []);

  useEffect(() => {
    fetchRandomFeed();
  }, [fetchRandomFeed]);

  // Handle Search Submission
  const handleSearch = useCallback(
    async (overrideQuery?: string) => {
      const q = (overrideQuery ?? query).trim();
      if (!q) return;

      setLoading(true);
      setHasSearched(true);
      setError(null);

      try {
        const results = await searchPoems(q, searchBy);
        setSearchResults(results);
      } catch {
        setError('Network error while searching for poems. Please check your connection and try again.');
      } finally {
        setLoading(false);
      }
    },
    [query, searchBy]
  );

  // Handle Click on Poem Card to fetch full details
  const handleOpenPoem = useCallback(
    async (poem: Poem) => {
      setSelectedPoem(poem);
      if (!poem.lines || poem.lines.length === 0) {
        setLoadingPoemDetails(true);
        try {
          const fullPoem = await getPoemDetails(poem.author, poem.title);
          if (fullPoem && fullPoem.lines) {
            setSelectedPoem(fullPoem);
          }
        } finally {
          setLoadingPoemDetails(false);
        }
      }
    },
    []
  );

  // Handle adding custom user poem
  const handleAddCustomPoem = useCallback(
    (poem: Poem, options: { saveForLater: boolean; favorite: boolean; markRead: boolean }) => {
      if (options.saveForLater) {
        onSaveForLater(poem);
      }
      if (options.favorite) {
        onToggleFavorite(poem);
      }
      if (options.markRead) {
        onMarkAsRead(poem);
      }
      if (options.saveForLater) {
        setActiveTab('saved');
      } else if (options.markRead) {
        setActiveTab('read');
      }
    },
    [onSaveForLater, onToggleFavorite, onMarkAsRead]
  );

  // Filtered lists for Read & Saved tabs
  const filteredReadList = useMemo(() => {
    if (!filterText.trim()) return readPoems;
    const q = filterText.trim().toLowerCase();
    return readPoems.filter(
      (p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    );
  }, [readPoems, filterText]);

  const filteredSavedList = useMemo(() => {
    if (!filterText.trim()) return savedPoems;
    const q = filterText.trim().toLowerCase();
    return savedPoems.filter(
      (p) => p.title.toLowerCase().includes(q) || p.author.toLowerCase().includes(q)
    );
  }, [savedPoems, filterText]);

  const tabs: { key: TabKey; label: string; count?: number; icon: React.ElementType }[] = [
    { key: 'search', label: 'Search', icon: Search },
    { key: 'read', label: 'Read', count: readPoems.length, icon: CheckCircle2 },
    { key: 'saved', label: 'Saved', count: savedPoems.length, icon: Bookmark },
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header & Tab Navigation */}
      <div className="flex items-center justify-between gap-3">
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 rounded-xl bg-paper-soft/60 p-1.5 dark:bg-bgdark-soft/60 w-full sm:w-fit">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={classNames(
                  'flex items-center justify-center gap-1.5 sm:gap-2 rounded-lg px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper font-semibold'
                    : 'text-ink-muted hover:text-ink dark:text-paper/50 dark:hover:text-paper/90'
                )}
              >
                <Icon size={16} className={isActive ? 'text-brass-600 dark:text-brass-400' : ''} />
                <span>{tab.label}</span>
                {typeof tab.count === 'number' && (
                  <span
                    className={classNames(
                      'rounded-full px-1.5 sm:px-2 py-0.5 text-[10px] sm:text-xs font-semibold tabular-nums',
                      isActive
                        ? 'bg-brass-50 text-brass-700 dark:bg-brass-500/20 dark:text-brass-300'
                        : 'bg-ink/5 text-ink-faint dark:bg-paper/10 dark:text-paper/50'
                    )}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="relative group shrink-0">
          <button
            type="button"
            onClick={() => setAddModalOpen(true)}
            title="Add poem of your choice"
            aria-label="Add poem of your choice"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-brass-500 text-bgdark hover:bg-brass-600 dark:bg-brass-400 dark:hover:bg-brass-300 transition-all duration-200 shadow-sm hover:shadow hover:scale-105 active:scale-95"
          >
            <Plus size={20} strokeWidth={2.5} />
          </button>
          <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:flex items-center whitespace-nowrap rounded-md bg-ink px-2.5 py-1 text-xs font-medium text-paper shadow-md dark:bg-paper dark:text-ink z-50 pointer-events-none">
            Add poem of your choice
          </span>
        </div>
      </div>

      {/* ─── TAB 1: SEARCH ────────────────────────────────────────── */}
      {activeTab === 'search' && (
        <div className="space-y-6">
          {/* Search Input Bar */}
          <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark space-y-3">
            <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
              <div className="relative flex-1">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brass-500 dark:text-brass-400"
                />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="Search poems by title or author name…"
                  className="w-full rounded-lg border border-brass-500/20 bg-paper-soft/40 py-2.5 pl-10 pr-9 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400/30 focus:border-brass-400 focus:bg-paper dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-paper dark:placeholder:text-paper/30 dark:focus:bg-bgdark transition-all duration-200"
                />
                {query && (
                  <button
                    onClick={() => {
                      setQuery('');
                      setSearchResults([]);
                      setError(null);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-faint hover:bg-ink/5 dark:text-paper/40 dark:hover:bg-paper/10"
                    title="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              {/* Search By Filter Dropdown / Selector */}
              <div className="grid grid-cols-3 sm:flex items-center gap-1 bg-paper-soft/60 dark:bg-bgdark-soft/60 rounded-lg p-1 shrink-0">
                {(['all', 'title', 'author'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setSearchBy(type)}
                    className={classNames(
                      'px-3 py-1.5 text-xs font-medium rounded-md capitalize transition-colors text-center',
                      searchBy === type
                        ? 'bg-surface text-ink shadow-xs dark:bg-surface-dark dark:text-paper font-semibold'
                        : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>

              <Button
                variant="primary"
                size="md"
                onClick={() => handleSearch()}
                disabled={!query.trim() || loading}
                className="shrink-0"
              >
                {loading ? <Loader2 size={16} className="animate-spin" /> : <Search size={16} />}
                Search
              </Button>
            </div>
          </div>

          {/* Loading Indicator */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <BookLoader size="md" color="brown" />
              <p className="mt-3 text-sm text-ink-muted dark:text-paper/60">Searching our library for "{query}"…</p>
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl border border-burgundy-300/30 bg-burgundy-50/50 p-4 dark:border-burgundy-500/20 dark:bg-burgundy-500/10"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-burgundy-500 dark:text-burgundy-300" />
              <p className="text-sm text-burgundy-600 dark:text-burgundy-300">{error}</p>
            </motion.div>
          )}

          {/* Search Results Grid */}
          {searchResults.length > 0 && !loading && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                  Search Results ({searchResults.length})
                </h3>
                <span className="text-xs text-ink-muted dark:text-paper/50">
                  Click a poem card to read full verses
                </span>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {searchResults.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    onClick={() => handleOpenPoem(poem)}
                    isRead={isRead(poem.id)}
                    isSaved={isSaved(poem.id)}
                    isFavorite={isFavorite(poem.id)}
                    onToggleRead={(e) => {
                      e.stopPropagation();
                      onToggleRead(poem);
                    }}
                    onToggleSaved={(e) => {
                      e.stopPropagation();
                      onToggleSaved(poem);
                    }}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(poem);
                    }}
                    actionContext="search"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Friendly No Results State */}
          {hasSearched && searchResults.length === 0 && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center justify-center rounded-2xl border border-ink/10 bg-surface p-8 text-center shadow-card dark:border-paper/10 dark:bg-surface-dark space-y-4 my-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brass-50 dark:bg-brass-500/10 text-brass-600 dark:text-brass-400">
                <Search size={22} />
              </div>
              <div className="max-w-md space-y-1.5">
                <h4 className="font-display text-lg font-semibold text-ink dark:text-paper">
                  Poem Not Found in Library
                </h4>
                <p className="text-sm text-ink-muted dark:text-paper/70 leading-relaxed">
                  Sorry, we couldn't find that poem in our library. You can try searching for it online or explore another classic poem below.
                </p>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    window.open(
                      `https://www.google.com/search?q=${encodeURIComponent(query + ' poem')}`,
                      '_blank',
                      'noopener,noreferrer'
                    );
                  }}
                >
                  <ExternalLink size={14} /> Search on Google
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setQuery('');
                    setHasSearched(false);
                    setSearchResults([]);
                  }}
                >
                  Clear Search
                </Button>
              </div>

              <div className="mt-2 flex flex-col items-center gap-2 pt-4 border-t border-ink/10 dark:border-paper/10 w-full max-w-md">
                <span className="text-xs text-ink-muted dark:text-paper/60">
                  Can't find it in our collection? You can add it to your library:
                </span>
                <button
                  type="button"
                  onClick={() => setAddModalOpen(true)}
                  className="inline-flex items-center gap-2 rounded-full border border-brass-500/30 bg-brass-50/80 px-4 py-1.5 text-xs font-semibold text-brass-700 hover:bg-brass-100 hover:border-brass-500/50 dark:border-brass-500/30 dark:bg-brass-500/15 dark:text-brass-300 dark:hover:bg-brass-500/25 transition-all duration-200 shadow-2xs hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Plus size={14} className="text-brass-600 dark:text-brass-400" />
                  <span>Add your favorite poem</span>
                </button>
              </div>
            </motion.div>
          )}

          {/* Initial State / Discover Random Feed */}
          {searchResults.length === 0 && !loading && (
            <div className="space-y-5 pt-2">
              <div className="flex items-center justify-between border-b border-ink/10 pb-3 dark:border-paper/10">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-brass-500 dark:text-brass-400" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                    Discover Timeless Poems
                  </h3>
                </div>
                <button
                  onClick={fetchRandomFeed}
                  disabled={loadingRandom}
                  className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-medium text-brass-700 hover:bg-brass-50 dark:text-brass-300 dark:hover:bg-brass-500/15 transition-colors"
                >
                  <Shuffle size={13} className={loadingRandom ? 'animate-spin' : ''} />
                  Refresh
                </button>
              </div>

              {loadingRandom ? (
                <div className="flex items-center justify-center py-12">
                  <BookLoader size="md" color="brown" />
                </div>
              ) : randomFeed.length > 0 ? (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {randomFeed.map((poem) => (
                    <PoemCard
                      key={poem.id}
                      poem={poem}
                      onClick={() => handleOpenPoem(poem)}
                      isRead={isRead(poem.id)}
                      isSaved={isSaved(poem.id)}
                      isFavorite={isFavorite(poem.id)}
                      onToggleRead={(e) => {
                        e.stopPropagation();
                        onToggleRead(poem);
                      }}
                      onToggleSaved={(e) => {
                        e.stopPropagation();
                        onToggleSaved(poem);
                      }}
                      onToggleFavorite={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(poem);
                      }}
                      actionContext="search"
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-10 text-sm text-ink-muted dark:text-paper/50">
                  Search above for any poem title or author to get started.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 2: READ ─────────────────────────────────────────── */}
      {activeTab === 'read' && (
        <div className="space-y-5">
          {/* Header & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl2 border border-forest-500/20 bg-forest-50/40 p-4 dark:border-forest-500/15 dark:bg-forest-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-forest-500 text-white shadow-xs">
                <CheckCircle2 size={20} />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                  Finished Poems Archive
                </h3>
                <p className="text-xs text-ink-muted dark:text-paper/60">
                  Poems you have read and marked as completed.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="rounded-full bg-forest-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                Total Read: {readPoems.length} {readPoems.length === 1 ? 'poem' : 'poems'}
              </span>
            </div>
          </div>

          {/* Filter Bar if items exist */}
          {readPoems.length > 0 && (
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brass-500" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter read poems by title or author…"
                className="w-full rounded-lg border border-brass-500/20 bg-paper-soft/40 py-2 pl-9 pr-8 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400/30 dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-paper"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-faint hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Read Poems Grid */}
          {filteredReadList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredReadList.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    onClick={() => handleOpenPoem(poem)}
                    isRead={true}
                    isSaved={isSaved(poem.id)}
                    isFavorite={isFavorite(poem.id)}
                    onToggleRead={(e) => {
                      e.stopPropagation();
                      onRemoveFromRead(poem.id);
                    }}
                    onToggleSaved={(e) => {
                      e.stopPropagation();
                      onToggleSaved(poem);
                    }}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(poem);
                    }}
                    onRemove={(e) => {
                      e.stopPropagation();
                      onRemoveFromRead(poem.id);
                    }}
                    actionContext="read"
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : readPoems.length === 0 ? (
            <EmptyState
              icon={BookOpen}
              title="No read poems yet"
              description="Explore classic poems in the Search tab and mark them as read to build your archive."
              action={
                <Button variant="primary" size="sm" onClick={() => setActiveTab('search')}>
                  <Search size={14} /> Search Poems
                </Button>
              }
            />
          ) : (
            <div className="py-12 text-center text-sm text-ink-muted dark:text-paper/50">
              No read poems match "{filterText}".
            </div>
          )}
        </div>
      )}

      {/* ─── TAB 3: SAVED ────────────────────────────────────────── */}
      {activeTab === 'saved' && (
        <div className="space-y-5">
          {/* Header & Counter */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl2 border border-brass-500/20 bg-brass-50/40 p-4 dark:border-brass-500/15 dark:bg-brass-500/10">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brass-500 text-bgdark shadow-xs">
                <Bookmark size={20} className="fill-current" />
              </div>
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                  Saved for Later
                </h3>
                <p className="text-xs text-ink-muted dark:text-paper/60">
                  Your curated reading list of saved poems.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="rounded-full bg-brass-600 px-3 py-1 text-xs font-bold text-white shadow-xs">
                Saved: {savedPoems.length} {savedPoems.length === 1 ? 'poem' : 'poems'}
              </span>
            </div>
          </div>

          {/* Filter Bar if items exist */}
          {savedPoems.length > 0 && (
            <div className="relative">
              <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brass-500" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filter saved poems by title or author…"
                className="w-full rounded-lg border border-brass-500/20 bg-paper-soft/40 py-2 pl-9 pr-8 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400/30 dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-paper"
              />
              {filterText && (
                <button
                  onClick={() => setFilterText('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-faint hover:text-ink"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Saved Poems Grid */}
          {filteredSavedList.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredSavedList.map((poem) => (
                  <PoemCard
                    key={poem.id}
                    poem={poem}
                    onClick={() => handleOpenPoem(poem)}
                    isRead={isRead(poem.id)}
                    isSaved={true}
                    isFavorite={isFavorite(poem.id)}
                    onToggleRead={(e) => {
                      e.stopPropagation();
                      onToggleRead(poem);
                    }}
                    onToggleSaved={(e) => {
                      e.stopPropagation();
                      onRemoveFromSaved(poem.id);
                    }}
                    onToggleFavorite={(e) => {
                      e.stopPropagation();
                      onToggleFavorite(poem);
                    }}
                    onRemove={(e) => {
                      e.stopPropagation();
                      onRemoveFromSaved(poem.id);
                    }}
                    actionContext="saved"
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : savedPoems.length === 0 ? (
            <EmptyState
              icon={Bookmark}
              title="No saved poems"
              description="Save poems you want to read later when searching classic poetry."
              action={
                <Button variant="primary" size="sm" onClick={() => setActiveTab('search')}>
                  <Search size={14} /> Search Poems
                </Button>
              }
            />
          ) : (
            <div className="py-12 text-center text-sm text-ink-muted dark:text-paper/50">
              No saved poems match "{filterText}".
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      <PoemDetailModal
        poem={selectedPoem}
        loadingDetails={loadingPoemDetails}
        onClose={() => setSelectedPoem(null)}
        isRead={selectedPoem ? isRead(selectedPoem.id) : false}
        isSaved={selectedPoem ? isSaved(selectedPoem.id) : false}
        isFavorite={selectedPoem ? isFavorite(selectedPoem.id) : false}
        onToggleRead={() => selectedPoem && onToggleRead(selectedPoem)}
        onToggleSaved={() => selectedPoem && onToggleSaved(selectedPoem)}
        onToggleFavorite={() => selectedPoem && onToggleFavorite(selectedPoem)}
        relatedPoems={randomFeed}
        onSelectPoem={handleOpenPoem}
      />

      {/* Add Custom Poem Modal */}
      <AddPoemModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onAddPoem={handleAddCustomPoem}
      />
    </div>
  );
}
