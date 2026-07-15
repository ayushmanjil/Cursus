import { useMemo, useState } from 'react';
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
  BookText,
  ChevronLeft,
  ChevronRight,
  Target,
} from 'lucide-react';
import type { Book, ViewKey } from '../types/book';
import { formatDate, calculateStreaks, getHighestPagesRecord } from '../utils/helpers';
import { StatusBadge } from './ui/Badge';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface DashboardProps {
  books: Book[];
  onOpen: (book: Book) => void;
  onSelectView?: (view: ViewKey) => void;
  streakLog?: Record<string, { read: boolean; pages?: number; hours?: number }>;
}

export function Dashboard({ books, onOpen, onSelectView, streakLog = {} }: DashboardProps) {
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

  // Compute streaks
  const { currentStreak, highestStreak } = calculateStreaks(streakLog);
  const { maxPages, recordDate } = getHighestPagesRecord(streakLog);

  // Reading goal
  const [goal, setGoal] = useLocalStorage<number>('my-library:yearly-goal', 24);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(String(goal));
  const currentYear = new Date().getFullYear();
  const readThisYear = useMemo(
    () =>
      books.filter(
        (b) => b.status === 'read' && b.dateFinished && new Date(b.dateFinished).getFullYear() === currentYear
      ).length,
    [books, currentYear]
  );
  const goalPct = goal > 0 ? Math.min(100, Math.round((readThisYear / goal) * 100)) : 0;

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


  const stats = [
    { label: 'Total Books', value: total, icon: Library, tone: 'ink' as const },
    { label: 'On Shelf', value: onShelf, icon: BookMarked, tone: 'brass' as const },
    { label: 'The Hunt List', value: wishlist, icon: ShoppingBag, tone: 'purple' as const },
    { label: 'Currently Reading', value: reading, icon: BookOpen, tone: 'forest' as const },
    { label: 'Read', value: read, icon: CheckCircle2, tone: 'ink' as const },
    { label: 'Favorites', value: favorites, icon: Heart, tone: 'burgundy' as const },
  ];

  const toneClasses: Record<string, string> = {
    ink: 'bg-ink text-paper dark:bg-paper/10 dark:text-paper',
    brass: 'bg-brass-500 text-white',
    purple: 'bg-purple-500 text-white',
    forest: 'bg-forest-500 text-white',
    burgundy: 'bg-burgundy-500 text-white',
  };

  return (
    <div className="space-y-8">
      {/* Stat Cards Grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, delay: i * 0.04 }}
            className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark"
          >
            <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${toneClasses[s.tone]}`}>
              <s.icon size={16} />
            </div>
            <p className="font-display text-2xl font-semibold text-ink dark:text-paper">{s.value}</p>
            <p className="mt-0.5 text-xs text-ink-muted dark:text-paper/50">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Main Grid: Row 1 - Active Reads, Reading Streaks & Pages Read */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Card 1: Currently Reading (Active Read) */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="mb-4 font-display text-base font-medium text-ink dark:text-paper">
              Currently Reading
            </h3>
            {activeBook ? (
              <div className="space-y-4">
                <div className="flex gap-4">
                  {/* Book Cover */}
                  <div
                    role="button"
                    tabIndex={0}
                    onClick={() => onOpen(activeBook)}
                    onKeyDown={(e) => e.key === 'Enter' && onOpen(activeBook)}
                    className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-paper-soft dark:bg-bgdark-soft shadow-sm cursor-pointer hover:opacity-90 transition-opacity"
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
                  {/* Book Info */}
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
                      <button
                        onClick={() => onOpen(activeBook)}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-brass-600 hover:text-brass-500 dark:text-brass-400 dark:hover:text-brass-300 transition-colors"
                      >
                        Update progress <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Progress bar */}
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
                        onClick={() => onOpen(activeBook)}
                        className="text-brass-600 hover:underline dark:text-brass-400 font-medium"
                      >
                        Set total pages
                      </button>
                    </div>
                  )}
                </div>

                {/* Carousel Navigation at the Bottom */}
                {readingBooks.length > 1 && (
                  <div className="flex items-center justify-between pt-3 border-t border-ink/5 dark:border-paper/5 mt-4">
                    <span className="text-[11px] text-ink-faint dark:text-paper/40 font-medium">
                      Book {activeIndex + 1} of {readingBooks.length}
                    </span>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReadingIndex((prev) =>
                            prev === 0 ? readingBooks.length - 1 : prev - 1
                          )
                        }
                        className="rounded-lg border border-ink/10 p-1 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 transition-colors text-ink dark:text-paper"
                        aria-label="Previous reading book"
                      >
                        <ChevronLeft size={14} />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setActiveReadingIndex((prev) =>
                            prev === readingBooks.length - 1 ? 0 : prev + 1
                          )
                        }
                        className="rounded-lg border border-ink/10 p-1 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 transition-colors text-ink dark:text-paper"
                        aria-label="Next reading book"
                      >
                        <ChevronRight size={14} />
                      </button>
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
                  <button
                    onClick={() => onSelectView('on-shelf')}
                    className="mt-4 rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-paper hover:bg-ink/90 dark:bg-brass-500 dark:text-bgdark dark:hover:bg-brass-400 transition-colors shadow-sm"
                  >
                    Browse Books
                  </button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Reading Streaks */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="mb-4 font-display text-base font-medium text-ink dark:text-paper">
              Reading Streak
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-brass-500 text-white shadow-sm">
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
              Check/manage calendar
            </span>
            {onSelectView && (
              <button
                onClick={() => onSelectView('streaks')}
                className="text-xs font-semibold text-brass-600 hover:underline dark:text-brass-400"
              >
                Open Calendar →
              </button>
            )}
          </div>
        </div>

        {/* Card 3: Pages Read till Date */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between min-h-[250px]">
          <div>
            <h3 className="mb-4 font-display text-base font-medium text-ink dark:text-paper">
              Pages Read
            </h3>
            <div className="flex items-center gap-4">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-forest-500 text-white shadow-sm">
                <BookText size={32} />
              </div>
              <div>
                <p className="font-display text-3xl font-bold text-ink dark:text-paper">
                  {totalPagesRead.toLocaleString()}
                </p>
                <p className="text-xs text-ink-muted dark:text-paper/50 mt-0.5">
                  Total pages read till date
                </p>
              </div>
            </div>
            <p className="text-[11px] text-ink-faint dark:text-paper/40 mt-4 leading-normal">
              Calculates all pages of completed books plus current pages read in books you're reading.
            </p>
          </div>

          <div className="mt-5 flex items-center gap-2.5 rounded-lg bg-paper-soft px-3 py-2.5 dark:bg-paper/5">
            <span className="text-xs text-ink-muted dark:text-paper/60">
              Happy reading! Keep the numbers growing.
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Recently Finished (2/3) + Reading Goal (1/3) — same grid as Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Recently Finished — 2 cols */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark lg:col-span-2">
          <h3 className="mb-3 flex items-center gap-1.5 font-display text-base font-medium text-ink dark:text-paper">
            <CheckCircle2 size={15} className="text-forest-500" /> Recently Finished
          </h3>
          <ActivityList books={recentlyFinished} onOpen={onOpen} />
        </div>

        {/* Reading Goal — 1 col */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark lg:col-span-1 flex flex-col justify-between">
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h3 className="flex items-center gap-1.5 font-display text-base font-medium text-ink dark:text-paper">
                <Target size={15} className="text-brass-500" /> {currentYear} Goal
              </h3>
              <button
                onClick={() => {
                  setEditingGoal((v) => !v);
                  setGoalInput(String(goal));
                }}
                className="text-xs font-medium text-brass-600 hover:underline dark:text-brass-300"
              >
                {editingGoal ? 'Close' : 'Edit'}
              </button>
            </div>

            {editingGoal ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const n = Math.max(1, Number(goalInput) || 1);
                  setGoal(n);
                  setEditingGoal(false);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="number"
                  min={1}
                  value={goalInput}
                  onChange={(e) => setGoalInput(e.target.value)}
                  className="w-24 rounded-lg border border-ink/10 bg-paper px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
                />
                <button
                  type="submit"
                  className="rounded-lg bg-ink px-3 py-1.5 text-xs font-medium text-paper dark:bg-brass-500 dark:text-bgdark"
                >
                  Save
                </button>
              </form>
            ) : (
              <>
                <p className="font-display text-3xl font-bold text-ink dark:text-paper">
                  {readThisYear}
                  <span className="text-base font-normal text-ink-faint dark:text-paper/40"> / {goal} books</span>
                </p>
                <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                  <div className="h-full rounded-full bg-brass-500 transition-all" style={{ width: `${goalPct}%` }} />
                </div>
                <p className="mt-2 text-xs text-ink-muted dark:text-paper/50">
                  {goalPct}% of your {currentYear} goal.
                </p>
              </>
            )}
          </div>

          <div className="mt-5 rounded-lg bg-paper-soft px-3 py-2.5 dark:bg-paper/5">
            <p className="text-xs text-ink-muted dark:text-paper/60">
              {readThisYear >= goal
                ? '🎉 Goal reached! Set a new one.'
                : `${goal - readThisYear} more book${goal - readThisYear === 1 ? '' : 's'} to go.`}
            </p>
          </div>
        </div>
      </div>
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
    return <p className="text-sm text-ink-faint dark:text-paper/40 py-4">Nothing here yet.</p>;
  }
  return (
    <ul className="space-y-2.5">
      {books.map((b) => (
        <li key={b.id}>
          <button
            onClick={() => onOpen(b)}
            className="flex w-full items-center justify-between gap-2 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-ink/5 dark:hover:bg-paper/5"
          >
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink dark:text-paper">{b.title}</p>
              <p className="truncate text-xs text-ink-faint dark:text-paper/40 mt-0.5">{b.author}</p>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <StatusBadge status={b.status} />
              <span className="text-[11px] text-ink-faint dark:text-paper/40 font-mono">
                {formatDate(b.dateFinished)}
              </span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  );
}
