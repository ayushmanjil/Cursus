import { useMemo, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Library,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Heart,
  Flame,
  ShoppingBag,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Target,
  ScrollText,
  BookA,
  Bookmark,
  CalendarDays,
  BarChart3,
  History,
  TrendingUp,
  BookCheck,
  BookOpenCheck,
  Sparkles,
  Feather,
  Trophy,
} from 'lucide-react';
import type { Book, ViewKey } from '../types/book';
import type { SavedWord } from '../types/dictionary';
import type { Poem } from '../types/poem';
import { formatDate, calculateStreaks, getHighestPagesRecord, getLocalDateString } from '../utils/helpers';
import { StatusBadge } from './ui/Badge';
import { PoemDetailModal } from './PoemsPage';
import { WordDetailModal } from './WordDetailModal';
import { UpdateProgressModal } from './UpdateProgressModal';

interface DashboardProps {
  books: Book[];
  onOpen: (book: Book) => void;
  onSelectView?: (view: ViewKey) => void;
  onUpdateBook?: (id: string, updates: Partial<Book>) => void;
  streakLog?: Record<string, { read: boolean; pages?: number; hours?: number }>;
  dailyGoal: number | null;
  setDailyGoal: (g: number) => Promise<void>;
  yearlyGoal: number | null;
  setYearlyGoal: (g: number) => Promise<void>;
  readPoemsCount?: number;
  savedPoemsCount?: number;
  favoritePoemsCount?: number;
  favoritePoems?: Poem[];
  savedWordsCount?: number;
  savedWords?: SavedWord[];
  isFavoritePoem?: (id: string) => boolean;
  isReadPoem?: (id: string) => boolean;
  isSavedPoem?: (id: string) => boolean;
  onToggleFavoritePoem?: (poem: Poem) => void;
  onToggleReadPoem?: (poem: Poem) => void;
  onToggleSavedPoem?: (poem: Poem) => void;
  onRemoveWord?: (wordId: string) => void;
  onAddWordExample?: (wordId: string, sentence: string) => void;
  onRemoveWordExample?: (wordId: string, index: number) => void;
}

function getWordDetails(w: any) {
  if (!w) return { word: '', phonetic: '', definition: '' };
  const word = w.entries?.[0]?.word || w.word || w.id || '';
  const phonetic = w.entries?.[0]?.phonetic || w.phonetic || '';
  const definition =
    w.entries?.[0]?.meanings?.[0]?.definitions?.[0]?.definition ||
    w.definition ||
    '';
  return { word, phonetic, definition };
}

export function Dashboard({
  books,
  onOpen,
  onSelectView,
  streakLog = {},
  dailyGoal,
  setDailyGoal,
  yearlyGoal,
  setYearlyGoal,
  readPoemsCount = 0,
  savedPoemsCount = 0,
  favoritePoemsCount = 0,
  favoritePoems = [],
  savedWordsCount = 0,
  savedWords = [],
  isFavoritePoem = () => false,
  isReadPoem = () => false,
  isSavedPoem = () => false,
  onToggleFavoritePoem = () => {},
  onToggleReadPoem = () => {},
  onToggleSavedPoem = () => {},
  onRemoveWord = () => {},
  onAddWordExample,
  onRemoveWordExample,
  onUpdateBook,
}: DashboardProps) {
  const total = books.length;
  const onShelf = books.filter((b) => b.status === 'on-shelf').length;
  const wishlist = books.filter((b) => b.status === 'wishlist').length;
  const reading = books.filter((b) => b.status === 'reading').length;
  const read = books.filter((b) => b.status === 'read').length;
  const favorites = books.filter((b) => b.favorite).length;

  const [activeReadingIndex, setActiveReadingIndex] = useState(0);
  const readingBooks = books.filter((b) => b.status === 'reading');
  const activeIndex = Math.min(activeReadingIndex, Math.max(0, readingBooks.length - 1));
  const activeBook = readingBooks[activeIndex];

  // Modals State
  const [selectedPoemForModal, setSelectedPoemForModal] = useState<Poem | null>(null);
  const [selectedWordForModal, setSelectedWordForModal] = useState<SavedWord | null>(null);
  const [updateProgressBook, setUpdateProgressBook] = useState<Book | null>(null);

  // Compute streaks
  const { currentStreak, highestStreak } = calculateStreaks(streakLog);
  const { maxPages, recordDate } = getHighestPagesRecord(streakLog);

  // Latest favorite poem to display on dashboard
  const latestFavoritePoem = useMemo(() => {
    if (favoritePoems && favoritePoems.length > 0) {
      return favoritePoems[favoritePoems.length - 1];
    }
    return null;
  }, [favoritePoems]);

  // Local editing states
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(yearlyGoal ? String(yearlyGoal) : '');
  const [editingDailyGoal, setEditingDailyGoal] = useState(false);
  const [dailyGoalInput, setDailyGoalInput] = useState(dailyGoal ? String(dailyGoal) : '');

  const currentYear = new Date().getFullYear();
  const todayStr = getLocalDateString(new Date());

  const goal = yearlyGoal;
  const setGoal = setYearlyGoal;

  useEffect(() => {
    setGoalInput(yearlyGoal ? String(yearlyGoal) : '');
  }, [yearlyGoal]);

  useEffect(() => {
    setDailyGoalInput(dailyGoal ? String(dailyGoal) : '');
  }, [dailyGoal]);

  const pagesReadToday = streakLog[todayStr]?.pages || 0;
  const dailyGoalPct = dailyGoal && dailyGoal > 0 ? Math.min(100, Math.round((pagesReadToday / dailyGoal) * 100)) : 0;

  const readThisYear = useMemo(
    () =>
      books.filter(
        (b) => b.status === 'read' && b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear
      ).length,
    [books, currentYear]
  );
  const goalPct = goal && goal > 0 ? Math.min(100, Math.round((readThisYear / goal) * 100)) : 0;

  // Compute pages read till date
  const totalPagesRead = books.reduce((sum, b) => {
    if (b.status === 'read') {
      return sum + (b.totalPages || 0);
    } else if (b.status === 'reading') {
      return sum + (b.currentPage || 0);
    }
    return sum;
  }, 0);

  const recentlyFinished = [...books]
    .filter((b) => b.status === 'read' && b.dateFinished)
    .sort((a, b) => (b.dateFinished ?? '').localeCompare(a.dateFinished ?? ''))
    .slice(0, 5);

  // Take 2-3 most recently saved words
  const recentSavedWords = useMemo(() => {
    return [...savedWords].slice(-2).reverse();
  }, [savedWords]);

  const stats = [
    { label: 'Total Books', value: total, icon: Library, tone: 'ink' as const, viewKey: 'on-shelf' as ViewKey },
    { label: 'On Shelf', value: onShelf, icon: BookMarked, tone: 'brass' as const, viewKey: 'on-shelf' as ViewKey },
    { label: 'The Hunt List', value: wishlist, icon: ShoppingBag, tone: 'purple' as const, viewKey: 'wishlist' as ViewKey },
    { label: 'Currently Reading', value: reading, icon: BookOpen, tone: 'forest' as const, viewKey: 'reading' as ViewKey },
    { label: 'Read', value: read, icon: CheckCircle2, tone: 'ink' as const, viewKey: 'read' as ViewKey },
    { label: 'Favorites', value: favorites, icon: Heart, tone: 'burgundy' as const, viewKey: 'favorites' as ViewKey },
  ];

  const toneClasses: Record<string, string> = {
    ink: 'bg-ink text-paper dark:bg-paper/10 dark:text-paper',
    brass: 'bg-brass-500 text-white',
    purple: 'bg-brass-500 text-white',
    forest: 'bg-forest-500 text-white',
    burgundy: 'bg-burgundy-500 text-white',
  };

  return (
    <div className="space-y-8">
      {/* ─── Top 6 Stat Cards Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -3, transition: { duration: 0.15 } }}
            whileTap={onSelectView ? { scale: 0.98 } : undefined}
            onClick={() => onSelectView?.(s.viewKey)}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            className={`group rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card transition-colors dark:border-paper/10 dark:bg-surface-dark ${
              onSelectView ? 'cursor-pointer hover:border-brass-500/30' : ''
            }`}
          >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-xl transition-transform duration-200 group-hover:scale-110 ${toneClasses[s.tone]}`}>
              <s.icon size={18} />
            </div>
            <p className="font-display text-2xl font-bold text-ink dark:text-paper">{s.value}</p>
            <p className="mt-0.5 text-xs font-medium text-ink-muted dark:text-paper/50">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* ─── Row 1: Currently Reading, Streak, Pages Read ───────────── */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Currently Reading */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="mb-4 font-display text-base font-medium text-ink dark:text-paper flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BookOpen size={16} className="text-forest-500" /> Currently Reading
              </span>
              {readingBooks.length > 0 && (
                <span className="rounded-full bg-forest-50 px-2 py-0.5 text-[10px] font-bold text-forest-700 dark:bg-forest-500/15 dark:text-forest-300">
                  {readingBooks.length} active
                </span>
              )}
            </h3>
            {activeBook ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpen(activeBook)}
                    onKeyDown={(e) => e.key === 'Enter' && onOpen(activeBook)}
                    className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-paper-soft dark:bg-bgdark-soft shadow-sm cursor-pointer hover:opacity-90 transition-opacity border border-ink/5 dark:border-paper/5"
                  >
                    {activeBook.coverUrl ? (
                      <img
                        src={activeBook.coverUrl}
                        alt={activeBook.title}
                        className="h-full w-full object-cover"
                        style={{ objectPosition: `${activeBook.coverFocusX ?? 50}% ${activeBook.coverFocusY ?? 50}%` }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <BookOpen size={20} className="text-ink/15 dark:text-paper/15" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4
                      onClick={() => onOpen(activeBook)}
                      className="font-display text-[15px] font-medium leading-snug text-ink line-clamp-2 dark:text-paper cursor-pointer hover:text-brass-600 dark:hover:text-brass-400 transition-colors"
                    >
                      {activeBook.title}
                    </h4>
                    <p className="text-xs text-ink-muted dark:text-paper/50 mt-1">
                      {activeBook.author}
                    </p>
                    <div className="mt-3">
                      <motion.button
                        whileHover={{ x: 2 }}
                        whileTap={{ scale: 0.96 }}
                        onClick={() => setUpdateProgressBook(activeBook)}
                        className="group inline-flex items-center gap-1.5 text-xs font-semibold text-brass-600 hover:text-brass-500 dark:text-brass-400 dark:hover:text-brass-300 transition-colors"
                      >
                        <span>Update progress</span>
                        <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </motion.button>
                    </div>
                  </div>
                </div>

                <div>
                  {activeBook.totalPages && activeBook.totalPages > 0 ? (
                    <div>
                      <div className="flex items-center justify-between text-xs text-ink-muted dark:text-paper/50 mb-1">
                        <span>Reading progress</span>
                        <span className="font-semibold text-ink dark:text-paper">
                          {Math.round(((activeBook.currentPage || 0) / activeBook.totalPages) * 100)}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                        <div
                          className="h-full rounded-full bg-forest-500 transition-all"
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round(((activeBook.currentPage || 0) / activeBook.totalPages) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <p className="mt-1 text-[11px] text-ink-faint dark:text-paper/40">
                        Page {activeBook.currentPage || 0} of {activeBook.totalPages}
                      </p>
                    </div>
                  ) : (
                    <div className="text-xs text-ink-muted dark:text-paper/50">
                      No page count set.{' '}
                      <button
                        onClick={() => setUpdateProgressBook(activeBook)}
                        className="text-brass-600 hover:underline dark:text-brass-400 font-medium"
                      >
                        Set total pages
                      </button>
                    </div>
                  )}
                </div>

                {readingBooks.length > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-ink/5 dark:border-paper/5 mt-4">
                    <span className="text-[11px] text-ink-faint dark:text-paper/40 font-medium">
                      Book {activeIndex + 1} of {readingBooks.length}
                    </span>
                    <div className="flex gap-1.5">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() =>
                          setActiveReadingIndex((prev) =>
                            prev === 0 ? readingBooks.length - 1 : prev - 1
                          )
                        }
                        className="rounded-lg border border-ink/10 p-1 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 transition-colors text-ink dark:text-paper"
                      >
                        <ChevronLeft size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        type="button"
                        onClick={() =>
                          setActiveReadingIndex((prev) =>
                            prev === readingBooks.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="rounded-lg border border-ink/10 p-1 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 transition-colors text-ink dark:text-paper"
                      >
                        <ChevronRight size={14} />
                      </motion.button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-ink/5 dark:bg-paper/5 mb-3">
                  <BookOpen size={20} className="text-ink-faint dark:text-paper/40" />
                </div>
                <p className="text-sm font-medium text-ink dark:text-paper">No active reads right now</p>
                <p className="mt-1 text-xs text-ink-muted dark:text-paper/50 max-w-[240px]">
                  Pick a book from your shelf to start tracking your progress.
                </p>
                {onSelectView && (
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => onSelectView('on-shelf')}
                    className="mt-4 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-ink/90 dark:bg-brass-500 dark:text-bgdark dark:hover:bg-brass-400 transition-colors shadow-sm"
                  >
                    Browse Books
                  </motion.button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Reading Streak */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-medium text-ink dark:text-paper flex items-center gap-2">
                <Flame size={16} className="text-brass-500" /> Reading Streak
              </h3>
              {onSelectView && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => onSelectView('streaks')}
                  title="Open Reading Calendar"
                  aria-label="Open Reading Calendar"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/10 text-ink-muted transition-colors hover:border-brass-500 hover:bg-brass-50 hover:text-brass-600 dark:border-paper/10 dark:text-paper/60 dark:hover:border-brass-400 dark:hover:bg-brass-500/10 dark:hover:text-brass-400 shadow-xs"
                >
                  <CalendarDays size={14} />
                </motion.button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brass-500 text-white shadow-sm overflow-hidden group">
                <div className="absolute inset-0 bg-white/15 opacity-0 group-hover:opacity-100 transition-opacity" />
                <Flame size={32} className="animate-pulse" />
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-ink dark:text-paper">
                  {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
                </p>
                <p className="text-xs text-ink-muted dark:text-paper/50 mt-0.5">
                  Current active streak
                </p>
              </div>
            </div>
            <div className="mt-6 border-t border-ink/5 pt-4 dark:border-paper/5 text-xs text-ink-muted dark:text-paper/60 space-y-2">
              <div className="flex justify-between">
                <span>Personal Best Streak:</span>
                <span className="font-semibold text-ink dark:text-paper">{highestStreak} days</span>
              </div>
              {maxPages > 0 && (
                <div className="flex justify-between items-center gap-2">
                  <span>Record Pages / Day:</span>
                  <span className="font-semibold text-ink dark:text-paper truncate max-w-[150px]">
                    {maxPages} pages ({formatDate(recordDate)})
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-2.5 rounded-lg bg-paper-soft px-3.5 py-2.5 dark:bg-paper/5">
            <span className="text-xs text-ink-muted dark:text-paper/60">
              Reading calendar
            </span>
            {onSelectView && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onSelectView('streaks')}
                title="Open Reading Calendar"
                className="group flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1 text-xs font-semibold text-brass-600 shadow-sm hover:bg-brass-500/10 dark:bg-surface-dark dark:text-brass-400 dark:hover:bg-brass-500/15 border border-ink/5 dark:border-paper/5 transition-all"
              >
                <CalendarDays size={13} className="transition-transform duration-200 group-hover:scale-110 group-hover:-rotate-6" />
                <span>Calendar</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* Card 3: Pages Read till Date */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between min-h-[250px]">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-base font-medium text-ink dark:text-paper flex items-center gap-2">
                <BookOpenCheck size={16} className="text-forest-500" /> Pages Read
              </h3>
              {onSelectView && (
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  type="button"
                  onClick={() => onSelectView('stats')}
                  title="View Reading Statistics"
                  aria-label="View Reading Statistics"
                  className="flex h-7 w-7 items-center justify-center rounded-lg border border-ink/10 text-ink-muted transition-colors hover:border-forest-500 hover:bg-forest-50 hover:text-forest-600 dark:border-paper/10 dark:text-paper/60 dark:hover:border-forest-400 dark:hover:bg-forest-500/10 dark:hover:text-forest-400 shadow-xs"
                >
                  <BarChart3 size={14} />
                </motion.button>
              )}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-500 text-white shadow-sm">
                <BookOpenCheck size={30} />
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-ink dark:text-paper">
                  {totalPagesRead.toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted dark:text-paper/50 mt-0.5">
                  Total pages completed till date
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-2.5 rounded-lg bg-paper-soft px-3.5 py-2.5 dark:bg-paper/5">
            <span className="text-xs text-ink-muted dark:text-paper/60">
              Reading statistics
            </span>
            {onSelectView && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onSelectView('stats')}
                title="View Statistics"
                className="group flex items-center gap-1.5 rounded-lg bg-surface px-2.5 py-1 text-xs font-semibold text-forest-600 shadow-sm hover:bg-forest-500/10 dark:bg-surface-dark dark:text-forest-400 dark:hover:bg-forest-500/15 border border-ink/5 dark:border-paper/5 transition-all"
              >
                <TrendingUp size={13} className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                <span>Statistics</span>
              </motion.button>
            )}
          </div>
        </div>
      </div>

      {/* ─── Row 2 (Matching Designer Skeleton Image): ────────────── */}
      {/* Column 1: Recently Finished Books (Full Height)             */}
      {/* Column 2 (50/50 Split): Word Library (Top) | Daily Goal (Bottom) */}
      {/* Column 3 (50/50 Split): Poem Widget (Top)  | Yearly Goal (Bottom) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 items-stretch">
        {/* Column 1 (1/3 width): Recently Finished Books (Full Height) */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between h-full min-h-[300px]">
          <div>
            <h3 className="mb-3 flex items-center gap-1.5 font-display text-base font-medium text-ink dark:text-paper">
              <BookCheck size={16} className="text-forest-500" /> Recently Finished Books
            </h3>
            <ActivityList books={recentlyFinished} onOpen={onOpen} />
          </div>

          {onSelectView && (
            <div className="mt-4 pt-3 border-t border-ink/5 dark:border-paper/5 flex items-center justify-between">
              <span className="text-xs text-ink-muted dark:text-paper/60">View all completed</span>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => onSelectView('read')}
                title="View All Finished Books"
                className="group flex items-center gap-1.5 font-semibold text-xs text-forest-600 hover:text-forest-700 dark:text-forest-400 dark:hover:text-forest-300 transition-colors"
              >
                <CheckCircle2 size={13} className="transition-transform duration-200 group-hover:scale-110" />
                <span>All Finished</span>
              </motion.button>
            </div>
          )}
        </div>

        {/* Column 2 (1/3 width): 50/50 Split for Word Lib (Top) & Daily Goal (Bottom) */}
        <div className="flex flex-col gap-4 h-full justify-between">
          {/* Top 50%: Word Library Widget (Clicking word opens WordDetailModal directly) */}
          <div className="flex-1 rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink dark:text-paper">
                  <Sparkles size={14} className="text-brass-500" /> Word Library
                </h3>
                <span className="rounded-full bg-brass-50 px-2 py-0.5 text-[10px] font-bold text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
                  {savedWordsCount} saved
                </span>
              </div>

              {recentSavedWords.length > 0 ? (
                <div className="space-y-1.5 mt-1">
                  {recentSavedWords.map((item, idx) => {
                    const details = getWordDetails(item);
                    return (
                      <button
                        type="button"
                        key={item.id || idx}
                        onClick={() => setSelectedWordForModal(item)}
                        className="w-full text-left rounded-lg bg-paper-soft/70 p-2 dark:bg-bgdark-soft/70 border border-ink/5 dark:border-paper/5 flex items-center justify-between gap-2 hover:border-brass-500/30 hover:bg-paper-soft transition-all cursor-pointer group"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-display text-xs font-bold text-ink dark:text-paper group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors truncate block">
                            {details.word}
                          </span>
                          {details.definition && (
                            <span className="text-[10px] text-ink-muted dark:text-paper/60 line-clamp-1 block">
                              {details.definition}
                            </span>
                          )}
                        </div>
                        {details.phonetic && (
                          <span className="text-[9px] text-brass-600 dark:text-brass-400 font-mono shrink-0">
                            {details.phonetic}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 leading-relaxed">
                  Save new words and definitions while reading.
                </p>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-ink/5 dark:border-paper/5 flex items-center justify-between text-xs">
              <span className="text-ink-muted dark:text-paper/60 font-medium">Vocabulary Collection</span>
              {onSelectView && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onSelectView('word-library')}
                  title="Open Word Library"
                  className="group flex items-center gap-1.5 font-semibold text-brass-600 hover:text-brass-700 dark:text-brass-400 dark:hover:text-brass-300 transition-colors"
                >
                  <BookA size={13} className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
                  <span>Open Library</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Bottom 50%: Daily Target Widget with Forest Green Theme */}
          <div className="flex-1 rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink dark:text-paper">
                  <Target size={15} className="text-forest-500" /> Daily Target
                </h3>
                <div className="flex items-center gap-1.5">
                  {onSelectView && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => onSelectView('daily-goals')}
                      title="View Daily Goals History"
                      aria-label="View Daily Goals History"
                      className="rounded-md p-1 text-ink-muted hover:text-forest-600 hover:bg-forest-50 dark:text-paper/60 dark:hover:text-forest-400 dark:hover:bg-forest-500/10 transition-colors"
                    >
                      <History size={13} />
                    </motion.button>
                  )}
                  {dailyGoal === null && (
                    <button
                      onClick={() => {
                        setEditingDailyGoal((v) => !v);
                        setDailyGoalInput('');
                      }}
                      className="text-xs font-medium text-forest-600 hover:underline dark:text-forest-300"
                    >
                      {editingDailyGoal ? 'Close' : 'Set Goal'}
                    </button>
                  )}
                </div>
              </div>

              {editingDailyGoal ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = parseInt(dailyGoalInput, 10);
                    const n = Math.max(1, isNaN(val) ? 20 : val);
                    setDailyGoal(n);
                    setEditingDailyGoal(false);
                  }}
                  className="flex items-center gap-2 mt-1"
                >
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={dailyGoalInput}
                    onChange={(e) => setDailyGoalInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="20 pages"
                    className="w-full rounded-lg border border-ink/10 bg-paper px-2 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-forest-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-paper dark:bg-forest-500 dark:text-bgdark shrink-0"
                  >
                    Save
                  </button>
                </form>
              ) : dailyGoal === null ? (
                <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 leading-snug">
                  Set a daily page target to track reading habits.
                </p>
              ) : (
                /* Daily Goal Circular Progress Wheel Display */
                <div className="flex items-center gap-3.5 mt-1">
                  <div className="relative flex items-center justify-center shrink-0">
                    <svg height={54} width={54} className="rotate-[-90deg]">
                      <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={5}
                        r={22}
                        cx={27}
                        cy={27}
                        className="text-ink/10 dark:text-paper/10"
                      />
                      <circle
                        stroke="currentColor"
                        fill="transparent"
                        strokeWidth={5}
                        strokeDasharray={138.23}
                        strokeDashoffset={138.23 - (dailyGoalPct / 100) * 138.23}
                        strokeLinecap="round"
                        r={22}
                        cx={27}
                        cy={27}
                        className="text-forest-500 dark:text-forest-400 transition-all duration-300"
                      />
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-ink dark:text-paper">{dailyGoalPct}%</span>
                    </div>
                  </div>

                  <div className="min-w-0">
                    <p className="font-display text-lg font-bold text-ink dark:text-paper">
                      {pagesReadToday}
                      <span className="text-xs font-normal text-ink-faint dark:text-paper/40"> / {dailyGoal} pgs</span>
                    </p>
                    <p className="text-[11px] text-ink-muted dark:text-paper/50 mt-0.5">Completed today</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-ink/5 dark:border-paper/5 flex items-center justify-between text-xs">
              <span className="text-ink-muted dark:text-paper/60 font-medium">{dailyGoalPct}% done</span>
              {onSelectView && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onSelectView('daily-goals')}
                  title="View Daily Goals History"
                  className="group flex items-center gap-1.5 font-semibold text-forest-600 hover:text-forest-700 dark:text-forest-400 dark:hover:text-forest-300 transition-colors"
                >
                  <History size={13} className="transition-transform duration-300 group-hover:-rotate-45" />
                  <span>History</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>

        {/* Column 3 (1/3 width): 50/50 Split for Poem (Top) & Yearly Goal (Bottom) */}
        <div className="flex flex-col gap-4 h-full justify-between">
          {/* Top 50%: Poem Widget Opening Poem Reader Modal Directly on Click */}
          <div className="flex-1 rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink dark:text-paper">
                  <Feather size={15} className="text-brass-500" /> Poetry Corner
                </h3>
                {/* Pure Icon + Number Badges (No Text Labels) */}
                <div className="flex items-center gap-1.5">
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-forest-700 dark:text-forest-300 bg-forest-50 dark:bg-forest-500/15 px-2 py-0.5 rounded-full"
                    title={`${readPoemsCount} Read Poems`}
                  >
                    <CheckCircle2 size={12} /> {readPoemsCount}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-brass-700 dark:text-brass-300 bg-brass-50 dark:bg-brass-500/15 px-2 py-0.5 rounded-full"
                    title={`${savedPoemsCount} Saved for Later`}
                  >
                    <Bookmark size={12} /> {savedPoemsCount}
                  </span>
                  <span
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-burgundy-700 dark:text-burgundy-300 bg-burgundy-50 dark:bg-burgundy-500/15 px-2 py-0.5 rounded-full"
                    title={`${favoritePoemsCount} Favorite Poems`}
                  >
                    <Heart size={12} /> {favoritePoemsCount}
                  </span>
                </div>
              </div>

              {/* Latest Favorite Poem Card Button (Opens Poem Reader Modal directly on click!) */}
              {latestFavoritePoem ? (
                <button
                  type="button"
                  onClick={() => setSelectedPoemForModal(latestFavoritePoem)}
                  className="w-full text-left rounded-lg bg-paper-soft/70 p-2.5 dark:bg-bgdark-soft/70 border border-ink/5 dark:border-paper/5 hover:border-brass-500/30 hover:bg-paper-soft transition-all cursor-pointer group"
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-xs font-bold text-ink dark:text-paper group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors truncate">
                      {latestFavoritePoem.title}
                    </p>
                    <span className="text-[10px] italic font-serif text-brass-600 dark:text-brass-400 shrink-0">
                      by {latestFavoritePoem.author}
                    </span>
                  </div>
                  {latestFavoritePoem.lines && latestFavoritePoem.lines.length > 0 && (
                    <p className="font-serif text-[11px] italic text-ink-muted dark:text-paper/70 line-clamp-2 leading-relaxed border-l-2 border-brass-500/30 pl-2 mt-1.5">
                      "{latestFavoritePoem.lines.slice(0, 2).filter((l) => l.trim().length > 0).join(' / ')}"
                    </p>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onSelectView && onSelectView('poems')}
                  className="w-full text-left rounded-lg bg-paper-soft/40 p-2.5 dark:bg-bgdark-soft/40 border border-dashed border-ink/10 dark:border-paper/10 hover:border-brass-500/30 transition-all cursor-pointer group"
                >
                  <p className="font-display text-xs font-semibold text-ink dark:text-paper group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors">
                    No favorites added yet
                  </p>
                  <p className="text-[11px] text-ink-muted dark:text-paper/50 mt-0.5">
                    Click here to explore classic poems and add your favorites.
                  </p>
                </button>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-ink/5 dark:border-paper/5 flex items-center justify-between text-xs">
              <span className="text-ink-muted dark:text-paper/60 font-medium">Poetry Collection</span>
              {onSelectView && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onSelectView('poems')}
                  title="Explore Poetry Collection"
                  className="group flex items-center gap-1.5 font-semibold text-brass-600 hover:text-brass-700 dark:text-brass-400 dark:hover:text-brass-300 transition-colors"
                >
                  <ScrollText size={13} className="transition-transform duration-200 group-hover:scale-110 group-hover:rotate-6" />
                  <span>Explore</span>
                </motion.button>
              )}
            </div>
          </div>

          {/* Bottom 50%: Yearly Goal Widget */}
          <div className="flex-1 rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between">
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="flex items-center gap-1.5 font-display text-sm font-semibold text-ink dark:text-paper">
                  <Trophy size={15} className="text-brass-500" /> {currentYear} Goal
                </h3>
                <div className="flex items-center gap-1.5">
                  {onSelectView && (
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={() => onSelectView('yearly-goals')}
                      title="View Yearly Goals History"
                      aria-label="View Yearly Goals History"
                      className="rounded-md p-1 text-ink-muted hover:text-brass-600 hover:bg-brass-50 dark:text-paper/60 dark:hover:text-brass-400 dark:hover:bg-brass-500/10 transition-colors"
                    >
                      <History size={13} />
                    </motion.button>
                  )}
                  <button
                    onClick={() => {
                      setEditingGoal((v) => !v);
                      setGoalInput(goal ? String(goal) : '');
                    }}
                    className="text-xs font-medium text-brass-600 hover:underline dark:text-brass-300"
                  >
                    {editingGoal ? 'Close' : 'Edit'}
                  </button>
                </div>
              </div>

              {editingGoal ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const val = parseInt(goalInput, 10);
                    const n = Math.max(1, isNaN(val) ? 12 : val);
                    setGoal(n);
                    setEditingGoal(false);
                  }}
                  className="flex items-center gap-2 mt-1"
                >
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={goalInput}
                    onChange={(e) => setGoalInput(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="12 books"
                    className="w-full rounded-lg border border-ink/10 bg-paper px-2 py-1 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-ink px-2.5 py-1 text-xs font-medium text-paper dark:bg-brass-500 dark:text-bgdark shrink-0"
                  >
                    Save
                  </button>
                </form>
              ) : goal === null ? (
                <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 leading-snug">
                  Set annual book goal.
                </p>
              ) : (
                <div>
                  <p className="font-display text-xl font-bold text-ink dark:text-paper">
                    {readThisYear}
                    <span className="text-xs font-normal text-ink-faint dark:text-paper/40"> / {goal} books</span>
                  </p>
                  <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                    <div className="h-full rounded-full bg-brass-500 transition-all" style={{ width: `${goalPct}%` }} />
                  </div>
                </div>
              )}
            </div>

            <div className="mt-3 pt-2 border-t border-ink/5 dark:border-paper/5 flex items-center justify-between text-xs">
              <span className="text-ink-muted dark:text-paper/60 font-medium">{goalPct}% done</span>
              {onSelectView && (
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  onClick={() => onSelectView('yearly-goals')}
                  title="View Yearly Goals History"
                  className="group flex items-center gap-1.5 font-semibold text-brass-600 hover:text-brass-700 dark:text-brass-400 dark:hover:text-brass-300 transition-colors"
                >
                  <History size={13} className="transition-transform duration-300 group-hover:-rotate-45" />
                  <span>History</span>
                </motion.button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ─── Poem Reader Modal ────────────────────────────────────────── */}
      {selectedPoemForModal && (
        <PoemDetailModal
          poem={selectedPoemForModal}
          onClose={() => setSelectedPoemForModal(null)}
          isRead={isReadPoem(selectedPoemForModal.id)}
          isSaved={isSavedPoem(selectedPoemForModal.id)}
          isFavorite={isFavoritePoem(selectedPoemForModal.id)}
          onToggleRead={() => onToggleReadPoem(selectedPoemForModal)}
          onToggleSaved={() => onToggleSavedPoem(selectedPoemForModal)}
          onToggleFavorite={() => onToggleFavoritePoem(selectedPoemForModal)}
        />
      )}

      {/* ─── Word Detail Modal ────────────────────────────────────────── */}
      {selectedWordForModal && (
        <WordDetailModal
          word={savedWords.find((w) => w.id === selectedWordForModal.id) || selectedWordForModal}
          onClose={() => setSelectedWordForModal(null)}
          onRemove={(id) => onRemoveWord(id)}
          onAddExample={onAddWordExample}
          onRemoveExample={onRemoveWordExample}
        />
      )}

      {/* ─── Update Progress Modal ────────────────────────────────────── */}
      <UpdateProgressModal
        open={!!updateProgressBook}
        book={updateProgressBook}
        onClose={() => setUpdateProgressBook(null)}
        onUpdate={(id, updates) => {
          onUpdateBook?.(id, updates);
        }}
      />
    </div>
  );
}

function ActivityList({
  books,
  onOpen,
}: {
  books: Book[];
  onOpen: (book: Book) => void;
}) {
  if (books.length === 0) {
    return (
      <div className="py-7 flex flex-col items-center justify-center text-center">
        <p className="text-xs font-medium text-ink-muted dark:text-paper/50">
          No books completed recently.
        </p>
        <p className="text-[11px] text-ink-faint dark:text-paper/30 mt-1.5 italic">
          Keep the pages turning and watch your library grow! 📖✨
        </p>
      </div>
    );
  }
  return (
    <ul className="space-y-2.5">
      {books.map((b) => (
        <li key={b.id}>
          <motion.button
            whileHover={{ x: 2 }}
            whileTap={{ scale: 0.99 }}
            onClick={() => onOpen(b)}
            className="flex w-full items-center justify-between gap-3 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-ink/5 dark:hover:bg-paper/5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink dark:text-paper">{b.title}</p>
              <p className="truncate text-xs text-ink-faint dark:text-paper/40 mt-0.5">{b.author}</p>
            </div>
            <div className="flex shrink-0 items-center justify-end gap-2.5">
              <span className="text-[11px] text-ink-faint dark:text-paper/40 font-mono shrink-0">
                {formatDate(b.dateFinished)}
              </span>
              <div className="w-14 flex items-center justify-end shrink-0">
                <StatusBadge status={b.status} />
              </div>
            </div>
          </motion.button>
        </li>
      ))}
    </ul>
  );
}
