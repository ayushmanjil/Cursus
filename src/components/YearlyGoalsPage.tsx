import { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Check,
  X,
  Edit2,
  BookOpen,
  Award,
  Calendar,
  Star,
} from 'lucide-react';
import type { Book } from '../types/book';

interface YearlyGoalsPageProps {
  books: Book[];
  yearlyGoal: number | null;
  yearlyGoalHistory: Record<string, number>;
  onUpdateYearlyGoal: (newGoal: number, yearVal?: number) => Promise<void> | void;
  onBack: () => void;
  onOpenBook?: (book: Book) => void;
}

export function YearlyGoalsPage({
  books,
  yearlyGoal,
  yearlyGoalHistory,
  onUpdateYearlyGoal,
  onBack,
  onOpenBook,
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
    years.add(currentYear); // Always show current year

    // Add years from finished books
    Array.from(booksFinishedByYear.keys()).forEach((y) => years.add(y));

    // Add years from history
    Object.keys(yearlyGoalHistory).forEach((yStr) => {
      const y = parseInt(yStr, 10);
      if (!Number.isNaN(y)) {
        years.add(y);
      }
    });

    return Array.from(years).sort((a, b) => b - a); // Sort in descending order
  }, [booksFinishedByYear, yearlyGoalHistory, currentYear]);

  // Open years (collapsible state)
  const [expandedYears, setExpandedYears] = useState<Record<number, boolean>>({
    [currentYear]: true, // Expand current year by default
  });

  const toggleYear = (year: number) => {
    setExpandedYears((prev) => ({
      ...prev,
      [year]: !prev[year],
    }));
  };

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
      <div className="border-b border-ink/5 pb-4 dark:border-paper/5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 rounded-full border border-purple-500/20 bg-purple-500/10 px-3.5 py-1.5 text-xs font-semibold text-purple-700 hover:bg-purple-500/20 hover:border-purple-500/30 active:bg-purple-600 active:text-white dark:border-purple-500/20 dark:bg-purple-500/10 dark:text-purple-300 dark:hover:bg-purple-500/20 dark:active:bg-purple-500 dark:active:text-bgdark transition-all duration-75"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Total Finished */}
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

        {/* Success Rate */}
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

        {/* Best Year */}
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

      {/* Years Timeline list */}
      <div className="space-y-4">
        {yearsList.map((year) => {
          const finishedBooks = booksFinishedByYear.get(year) || [];
          const goalForYear: number | null = yearlyGoalHistory[String(year)] ?? (year === currentYear ? yearlyGoal : null);
          const isExpanded = !!expandedYears[year];
          const pct = goalForYear !== null && goalForYear > 0
            ? Math.min(100, Math.round((finishedBooks.length / goalForYear) * 100))
            : 0;
          const isEditing = editingYear === year;
          const hasGoal = goalForYear !== null;
          const hasBooksButNoGoal = !hasGoal && finishedBooks.length > 0 && year !== currentYear;

          // Color coded badges
          let badgeColor = 'bg-ink/5 text-ink-faint dark:bg-paper/5';
          if (finishedBooks.length > 0) {
            badgeColor = pct >= 100 
              ? 'bg-forest-50 text-forest-600 dark:bg-forest-950/20 dark:text-forest-400' 
              : 'bg-brass-50 text-brass-600 dark:bg-brass-950/20 dark:text-brass-400';
          }

          return (
            <div
              key={year}
              className="rounded-xl2 border border-ink/10 bg-surface shadow-card dark:border-paper/10 dark:bg-surface-dark overflow-hidden transition-all"
            >
              {/* Year Card Header */}
              <div className="flex items-center justify-between p-5">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-lg font-bold text-ink dark:text-paper">
                      {year} Achievements
                    </h3>
                    {year === currentYear && (
                      <span className="rounded-full bg-brass-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brass-600 dark:text-brass-400">
                        Current Year
                      </span>
                    )}
                  </div>

                  {/* Goal and Progress summary */}
                  {isEditing ? (
                    <div className="flex items-center gap-2 mt-2">
                      <label className="text-xs font-semibold text-ink-muted dark:text-paper/40">
                        Target goal:
                      </label>
                      <input
                        type="number"
                        min={1}
                        step="1"
                        value={editGoalInput}
                        onChange={(e) => setEditGoalInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-16 rounded-md border border-ink/10 bg-paper px-2 py-1 text-xs font-semibold text-ink dark:border-paper/10 dark:bg-bgdark dark:text-paper"
                      />
                      <button
                        onClick={() => handleSaveGoal(year)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-brass-500 text-white hover:bg-brass-600 transition-colors shadow-sm"
                      >
                        <Check size={12} />
                      </button>
                      <button
                        onClick={() => setEditingYear(null)}
                        className="inline-flex h-6 w-6 items-center justify-center rounded-md border border-ink/10 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 text-ink dark:text-paper transition-colors"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ) : hasGoal ? (
                    <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 flex items-center gap-1.5 flex-wrap">
                      <span>
                        Finished <span className="font-semibold text-ink dark:text-paper">{finishedBooks.length}</span> of{' '}
                        <span className="font-semibold text-ink dark:text-paper">{goalForYear}</span> books
                      </span>
                      <button
                        onClick={() => handleStartEdit(year, goalForYear as number)}
                        className="inline-flex items-center p-0.5 text-ink-faint hover:text-ink dark:hover:text-paper transition-colors"
                        title="Edit Target Goal"
                      >
                        <Edit2 size={11} />
                      </button>
                    </p>
                  ) : hasBooksButNoGoal ? (
                    <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 flex items-center gap-2">
                      <span>{finishedBooks.length} book{finishedBooks.length !== 1 ? 's' : ''} read</span>
                      <button
                        onClick={() => { setEditingYear(year); setEditGoalInput(''); }}
                        className="text-[10px] font-semibold text-brass-600 hover:text-brass-500 dark:text-brass-400 dark:hover:text-brass-300 underline underline-offset-2 transition-colors"
                      >
                        + Add Goal
                      </button>
                    </p>
                  ) : (
                    <p className="text-xs text-ink-faint dark:text-paper/30 mt-1 italic">
                      No goal set
                    </p>
                  )}
                </div>

                {/* Right side stats and expand toggle */}
                <div className="flex items-center gap-4 shrink-0">
                  {hasGoal && (
                    <span className={`rounded-md px-2 py-0.5 text-xs font-bold ${badgeColor}`}>
                      {pct}%
                    </span>
                  )}

                  <button
                    onClick={() => toggleYear(year)}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-ink/10 text-ink-muted hover:bg-ink/5 hover:text-ink dark:border-paper/10 dark:text-paper/60 dark:hover:bg-paper/5 dark:hover:text-paper transition-all"
                  >
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                </div>
              </div>

              {/* Progress Bar — only shown when a goal is set */}
              {hasGoal && !isEditing && (
                <div className="px-5 pb-4">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 100 ? 'bg-forest-500' : 'bg-brass-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Expanded Books List */}
              {isExpanded && (
                <div className="border-t border-ink/5 bg-paper-soft/20 px-5 py-4 dark:border-paper/5 dark:bg-bgdark-soft/20">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40 mb-3.5">
                    Books Finished in {year}
                  </h4>

                  {finishedBooks.length === 0 ? (
                    <p className="text-xs text-ink-faint italic dark:text-paper/40 py-2">
                      No books logged as read in this year yet.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {finishedBooks.map((book) => (
                        <div
                          key={book.id}
                          onClick={() => onOpenBook?.(book)}
                          className="flex gap-3 rounded-lg border border-ink/5 bg-surface p-2.5 shadow-sm dark:border-paper/5 dark:bg-surface-dark hover:shadow-cardHover hover:border-ink/10 dark:hover:border-paper/10 transition-all cursor-pointer group"
                        >
                          {/* Mini book cover */}
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

                          {/* Mini book info */}
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
                              {/* Rating display */}
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
                              {/* Finished date */}
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
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
