import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  ChevronLeft,
  Check,
  X,
  Edit2,
  BookOpen,
  Award,
  Calendar,
  Star,
  Sparkles,
} from 'lucide-react';
import type { Book } from '../types/book';

interface YearlyGoalsPageProps {
  books: Book[];
  yearlyGoal: number | null;
  yearlyGoalHistory: Record<string, number>;
  onUpdateYearlyGoal: (newGoal: number, yearVal?: number) => Promise<void> | void;
  onBack: () => void;
  onOpenBook?: (book: Book) => void;
  onOpenWrapped?: () => void;
}

export function YearlyGoalsPage({
  books,
  yearlyGoal,
  yearlyGoalHistory,
  onUpdateYearlyGoal,
  onBack,
  onOpenBook,
  onOpenWrapped,
}: YearlyGoalsPageProps) {
  const currentYear = new Date().getFullYear();

  // Find all finished books and extract their completion years
  const booksFinishedByYear = useMemo(() => {
    const map = new Map<number, Book[]>();
    books.forEach((b) => {
      if (b.status === 'read' && b.dateFinished) {
        const year = new Date(b.dateFinished).getFullYear();
        if (!Number.isNaN(year)) {
          const list = map.get(year) || [];
          list.push(b);
          map.set(year, list);
        }
      }
    });
    return map;
  }, [books]);

  // Derive the list of all years to display
  const yearsList = useMemo(() => {
    const years = new Set<number>();
    years.add(currentYear);
    Array.from(booksFinishedByYear.keys()).forEach((y) => years.add(y));
    Object.keys(yearlyGoalHistory).forEach((yStr) => {
      const y = parseInt(yStr, 10);
      if (!Number.isNaN(y)) years.add(y);
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [booksFinishedByYear, yearlyGoalHistory, currentYear]);

  // Open years (collapsible state) – for expanded detail view
  const [expandedYear, setExpandedYear] = useState<number | null>(null);

  // Editing state for goals
  const [editingYear, setEditingYear] = useState<number | null>(null);
  const [editGoalInput, setEditGoalInput] = useState<string>('');

  const handleStartEdit = (year: number, currentGoal: number) => {
    setEditingYear(year);
    setEditGoalInput(String(currentGoal));
  };

  const handleSaveGoal = async (year: number) => {
    const newGoal = Math.max(1, parseInt(editGoalInput, 10) || 12);
    await onUpdateYearlyGoal(newGoal, year);
    setEditingYear(null);
  };

  // Overall statistics
  const stats = useMemo(() => {
    const totalFinished = books.filter((b) => b.status === 'read').length;
    
    let bestYear = currentYear;
    let maxBooksInYear = 0;
    let metGoalsCount = 0;
    let totalYearsEvaluated = 0;

    yearsList.forEach((y) => {
      const count = booksFinishedByYear.get(y)?.length || 0;
      if (count > maxBooksInYear) {
        maxBooksInYear = count;
        bestYear = y;
      }

      const goalForYear = yearlyGoalHistory[String(y)] ?? (y === currentYear ? yearlyGoal : null);
      if (goalForYear !== null && goalForYear > 0) {
        totalYearsEvaluated++;
        if (count >= goalForYear) {
          metGoalsCount++;
        }
      }
    });

    const successRate = totalYearsEvaluated > 0 ? Math.round((metGoalsCount / totalYearsEvaluated) * 100) : 0;

    return {
      totalFinished,
      bestYear,
      maxBooksInYear,
      successRate,
    };
  }, [books, yearsList, booksFinishedByYear, yearlyGoal, yearlyGoalHistory, currentYear]);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-ink/5 pb-4 dark:border-paper/5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-500/20 hover:border-purple-500/30 active:bg-purple-600 active:text-white dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20 dark:active:bg-purple-500 dark:active:text-bgdark transition-all duration-75"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>

        {onOpenWrapped && (
          <button
            onClick={onOpenWrapped}
            className="inline-flex items-center gap-1.5 rounded-full border border-brass-500/30 bg-brass-500/10 px-3.5 py-1.5 text-xs font-medium text-brass-800 hover:bg-brass-500/20 hover:border-brass-500/45 dark:border-brass-500/30 dark:bg-brass-500/10 dark:text-brass-300 dark:hover:bg-brass-500/20 transition-all shadow-sm"
          >
            <Sparkles size={13} className="text-brass-500" />
            <span>Reading Wrapped</span>
          </button>
        )}
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brass-500 text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/30">
              Total Books Finished
            </p>
            <p className="font-display text-xl font-bold text-ink dark:text-paper">
              {stats.totalFinished} books
            </p>
          </div>
        </div>

        <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/30">
              Goal Success Rate
            </p>
            <p className="font-display text-xl font-bold text-ink dark:text-paper">
              {stats.successRate}% of years
            </p>
          </div>
        </div>

        <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-500 text-white">
            <Calendar size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/30">
              Best Reading Year
            </p>
            <p className="font-display text-xl font-bold text-ink dark:text-paper">
              {stats.bestYear} ({stats.maxBooksInYear} books)
            </p>
          </div>
        </div>
      </div>

      {/* ─── All Years: Square Card Grid ─────────────────────────── */}
      <div>
        <h3 className="font-display text-base font-medium text-ink dark:text-paper mb-3 flex items-center gap-2">
          <Calendar size={16} className="text-brass-500" />
          Year by Year
        </h3>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {yearsList.map((year, i) => {
            const finishedBooks = booksFinishedByYear.get(year) || [];
            const goalForYear: number | null = yearlyGoalHistory[String(year)] ?? (year === currentYear ? yearlyGoal : null);
            const pct = goalForYear !== null && goalForYear > 0
              ? Math.min(100, Math.round((finishedBooks.length / goalForYear) * 100))
              : 0;
            const hasGoal = goalForYear !== null;
            const goalMet = hasGoal && pct >= 100;
            const isCurrent = year === currentYear;
            const isSelected = expandedYear === year;

            return (
              <motion.div
                key={year}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: i * 0.04 }}
                onClick={() => setExpandedYear(isSelected ? null : year)}
                className={`rounded-xl2 border bg-surface shadow-card dark:bg-surface-dark p-4 cursor-pointer hover:shadow-cardHover transition-all flex flex-col ${
                  isCurrent
                    ? 'border-brass-500/30 border-t-[3px] border-t-brass-500 hover:border-brass-500/50 dark:border-brass-500/25 dark:hover:border-brass-500/40'
                    : 'border-ink/10 hover:border-ink/15 dark:border-paper/10 dark:hover:border-paper/15'
                } ${isSelected ? 'ring-2 ring-brass-500/30 dark:ring-brass-500/20' : ''}`}
              >
                {/* Year + Badge */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="font-display text-2xl font-bold text-ink dark:text-paper">
                      {year}
                    </p>
                    {isCurrent && (
                      <span className="rounded-full bg-brass-500/10 px-1.5 py-0.5 text-[8px] font-bold uppercase tracking-wider text-brass-600 dark:text-brass-400">
                        Now
                      </span>
                    )}
                  </div>
                  {hasGoal && (
                    <div className="mt-2">
                      <div className="h-1 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                        <div
                          className={`h-full rounded-full transition-all ${goalMet ? 'bg-forest-500' : 'bg-brass-500'}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Stats */}
                <div className="mt-3">
                  <p className="font-display text-lg font-bold text-ink dark:text-paper">
                    {finishedBooks.length}
                  </p>
                  <p className="text-[10px] text-ink-muted dark:text-paper/50 font-medium">
                    {finishedBooks.length === 1 ? 'book finished' : 'books finished'}
                  </p>
                  {hasGoal && (
                    <p className={`text-[10px] font-semibold mt-0.5 ${goalMet ? 'text-forest-600 dark:text-forest-400' : 'text-brass-600 dark:text-brass-400'}`}>
                      {pct}% of goal ({goalForYear})
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Expanded detail for any year */}
        {expandedYear !== null && (
          <ExpandedYearPanel
            year={expandedYear}
            books={booksFinishedByYear.get(expandedYear) || []}
            goal={yearlyGoalHistory[String(expandedYear)] ?? (expandedYear === currentYear ? yearlyGoal : null)}
            isCurrentYear={expandedYear === currentYear}
            isEditing={editingYear === expandedYear}
            editGoalInput={editGoalInput}
            setEditGoalInput={setEditGoalInput}
            onStartEdit={(g) => handleStartEdit(expandedYear, g)}
            onSaveGoal={() => handleSaveGoal(expandedYear)}
            onCancelEdit={() => setEditingYear(null)}
            onSetNewGoal={() => { setEditingYear(expandedYear); setEditGoalInput(''); }}
            onClose={() => setExpandedYear(null)}
            onOpenBook={onOpenBook}
          />
        )}
      </div>
    </div>
  );
}

/* ─── Expanded Year Panel ────────────────────────────────────── */
function ExpandedYearPanel({
  year,
  books,
  goal,
  isCurrentYear,
  isEditing,
  editGoalInput,
  setEditGoalInput,
  onStartEdit,
  onSaveGoal,
  onCancelEdit,
  onSetNewGoal,
  onClose,
  onOpenBook,
}: {
  year: number;
  books: Book[];
  goal: number | null;
  isCurrentYear: boolean;
  isEditing: boolean;
  editGoalInput: string;
  setEditGoalInput: (v: string) => void;
  onStartEdit: (g: number) => void;
  onSaveGoal: () => void;
  onCancelEdit: () => void;
  onSetNewGoal: () => void;
  onClose: () => void;
  onOpenBook?: (book: Book) => void;
}) {
  const hasGoal = goal !== null;
  const pct = hasGoal && goal > 0
    ? Math.min(100, Math.round((books.length / goal) * 100))
    : 0;
  const goalMet = hasGoal && pct >= 100;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.2 }}
      className="mt-3 rounded-xl2 border border-ink/10 bg-surface shadow-card dark:border-paper/10 dark:bg-surface-dark overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-ink/5 dark:border-paper/5">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-3">
            <h4 className="font-display text-base font-bold text-ink dark:text-paper">
              {year}
            </h4>
            {isCurrentYear && (
              <span className="rounded-full bg-brass-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brass-600 dark:text-brass-400">
                Current Year
              </span>
            )}
          </div>

          {/* Goal display / editing */}
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2">
              <label className="text-xs font-semibold text-ink-muted dark:text-paper/40">Target:</label>
              <input
                type="number"
                min={1}
                step="1"
                value={editGoalInput}
                onChange={(e) => setEditGoalInput(e.target.value.replace(/[^0-9]/g, ''))}
                className="w-16 rounded-md border border-ink/10 bg-paper px-2 py-1 text-xs font-semibold text-ink dark:border-paper/10 dark:bg-bgdark dark:text-paper"
              />
              <button
                onClick={onSaveGoal}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brass-500 text-white hover:bg-brass-600 transition-colors shadow-sm"
              >
                <Check size={12} />
              </button>
              <button
                onClick={onCancelEdit}
                className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-ink/10 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 text-ink dark:text-paper transition-colors"
              >
                <X size={12} />
              </button>
            </div>
          ) : hasGoal ? (
            <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 flex items-center gap-1.5 flex-wrap">
              <span>
                Finished <span className="font-semibold text-ink dark:text-paper">{books.length}</span> of{' '}
                <span className="font-semibold text-ink dark:text-paper">{goal}</span> books
                <span className={`ml-1.5 font-semibold ${goalMet ? 'text-forest-600 dark:text-forest-400' : 'text-brass-600 dark:text-brass-400'}`}>
                  ({pct}%)
                </span>
              </span>
              <button
                onClick={() => onStartEdit(goal as number)}
                className="inline-flex items-center p-0.5 text-ink-faint hover:text-ink dark:hover:text-paper transition-colors"
                title="Edit Target Goal"
              >
                <Edit2 size={11} />
              </button>
            </p>
          ) : (
            <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 flex items-center gap-2">
              <span>{books.length} book{books.length !== 1 ? 's' : ''} finished</span>
              <button
                onClick={onSetNewGoal}
                className="text-[10px] font-semibold text-brass-600 hover:text-brass-500 dark:text-brass-400 dark:hover:text-brass-300 underline underline-offset-2 transition-colors"
              >
                + Set Goal
              </button>
            </p>
          )}
        </div>

        <button
          onClick={onClose}
          className="rounded-full p-1.5 text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors shrink-0"
        >
          <X size={15} />
        </button>
      </div>

      {/* Progress Bar */}
      {hasGoal && !isEditing && (
        <div className="px-5 py-3 border-b border-ink/5 dark:border-paper/5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
            <div
              className={`h-full rounded-full transition-all ${goalMet ? 'bg-forest-500' : 'bg-brass-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Books */}
      <div className="px-5 py-4">
        <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40 mb-3.5">
          Books Finished in {year}
        </h4>

        {books.length === 0 ? (
          <p className="text-xs text-ink-faint italic dark:text-paper/40 py-2 text-center">
            No books logged as read in {year}.
          </p>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <BookMiniCard key={book.id} book={book} onOpen={() => onOpenBook?.(book)} />
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}

/* ─── Shared Book Mini Card ──────────────────────────────────── */
function BookMiniCard({ book, onOpen }: { book: Book; onOpen?: () => void }) {
  return (
    <div
      onClick={onOpen}
      className="flex gap-3 rounded-lg border border-ink/5 bg-surface p-2.5 shadow-sm dark:border-paper/5 dark:bg-surface-dark hover:shadow-cardHover hover:border-ink/10 dark:hover:border-paper/10 transition-all cursor-pointer group"
    >
      <div className="h-16 w-11 shrink-0 overflow-hidden rounded-md bg-paper-soft dark:bg-bgdark-soft shadow-sm">
        {book.coverUrl ? (
          <img
            src={book.coverUrl}
            alt={book.title}
            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-200"
            style={{ objectPosition: `${book.coverFocusX ?? 50}% ${book.coverFocusY ?? 50}%` }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <BookOpen size={14} className="text-ink/15 dark:text-paper/15" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h5 className="font-display text-xs font-bold text-ink line-clamp-1 dark:text-paper group-hover:text-brass-500 transition-colors">
            {book.title}
          </h5>
          <p className="text-[10px] text-ink-muted truncate dark:text-paper/50 mt-0.5">
            {book.author}
          </p>
        </div>

        <div className="flex items-center justify-between gap-1 mt-1">
          <div className="flex items-center gap-0.5">
            {book.rating ? (
              Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  size={8}
                  className={
                    i < (book.rating ?? 0)
                      ? 'fill-brass-400 text-brass-400'
                      : 'text-ink/10 dark:text-paper/10'
                  }
                />
              ))
            ) : (
              <span className="text-[9px] text-ink-faint dark:text-paper/30 italic">Unrated</span>
            )}
          </div>
          {book.dateFinished && (
            <span className="text-[9px] text-ink-faint dark:text-paper/30 font-mono">
              {new Date(book.dateFinished).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              })}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
