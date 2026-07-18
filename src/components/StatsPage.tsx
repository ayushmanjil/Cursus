import { useMemo, useState } from 'react';
import { Target, TrendingUp } from 'lucide-react';
import type { Book } from '../types/book';
import { useLocalStorage } from '../hooks/useLocalStorage';

interface StatsPageProps {
  books: Book[];
}

const palette = [
  'bg-brass-500',
  'bg-forest-500',
  'bg-burgundy-500',
  'bg-ink',
  'bg-brass-300',
  'bg-forest-300',
  'bg-burgundy-300',
];

export function StatsPage({ books }: StatsPageProps) {
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

  const genreBreakdown = useMemo(() => {
    const counts = new Map<string, number>();
    for (const b of books) {
      counts.set(b.genre || 'Uncategorized', (counts.get(b.genre || 'Uncategorized') ?? 0) + 1);
    }
    const total = books.length || 1;
    return Array.from(counts.entries())
      .map(([genre, count]) => ({ genre, count, pct: Math.round((count / total) * 100) }))
      .sort((a, b) => b.count - a.count);
  }, [books]);

  const ratingBreakdown = useMemo(() => {
    const counts = [0, 0, 0, 0, 0];
    for (const b of books) {
      if (b.status === 'read' && b.rating) counts[b.rating - 1]++;
    }
    const max = Math.max(1, ...counts);
    return counts.map((c, i) => ({ stars: i + 1, count: c, pct: Math.round((c / max) * 100) }));
  }, [books]);

  const avgRating = useMemo(() => {
    const rated = books.filter((b) => b.status === 'read' && b.rating);
    if (rated.length === 0) return 0;
    return (rated.reduce((sum, b) => sum + (b.rating ?? 0), 0) / rated.length).toFixed(1);
  }, [books]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark lg:col-span-1">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 font-display text-base font-medium text-ink dark:text-paper">
              <Target size={15} className="text-brass-500" /> {currentYear} reading goal
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
                const val = parseInt(goalInput, 10);
                const n = Math.max(1, isNaN(val) ? 12 : val);
                setGoal(n);
                setEditingGoal(false);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                min={1}
                step="1"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value.replace(/[^0-9]/g, ''))}
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
              <p className="font-display text-3xl font-semibold text-ink dark:text-paper">
                {readThisYear}
                <span className="text-base font-normal text-ink-faint dark:text-paper/40"> / {goal} books</span>
              </p>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                <div className="h-full rounded-full bg-brass-500 transition-all" style={{ width: `${goalPct}%` }} />
              </div>
              <p className="mt-2 text-xs text-ink-muted dark:text-paper/50">
                {goalPct}% of the way to your goal.
              </p>
            </>
          )}
        </div>

        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark lg:col-span-2">
          <h3 className="mb-4 flex items-center gap-1.5 font-display text-base font-medium text-ink dark:text-paper">
            <TrendingUp size={15} className="text-forest-500" /> Rating distribution
          </h3>
          <div className="space-y-2.5">
            {ratingBreakdown
              .slice()
              .reverse()
              .map((r) => (
                <div key={r.stars} className="flex items-center gap-3">
                  <span className="w-10 shrink-0 text-xs text-ink-muted dark:text-paper/50">
                    {r.stars}★
                  </span>
                  <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/5 dark:bg-paper/10">
                    <div className="h-full rounded-full bg-brass-500" style={{ width: `${r.pct}%` }} />
                  </div>
                  <span className="w-6 shrink-0 text-right text-xs text-ink-faint dark:text-paper/40">
                    {r.count}
                  </span>
                </div>
              ))}
          </div>
          <p className="mt-4 text-xs text-ink-muted dark:text-paper/50">
            Average rating across finished books:{' '}
            <span className="font-medium text-ink dark:text-paper">{avgRating || '—'}</span>
          </p>
        </div>
      </div>

      <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
        <h3 className="mb-4 font-display text-base font-medium text-ink dark:text-paper">Genre breakdown</h3>
        {genreBreakdown.length === 0 ? (
          <p className="text-sm text-ink-faint dark:text-paper/40">Add some books to see genre stats.</p>
        ) : (
          <div className="space-y-2.5">
            {genreBreakdown.map((g, i) => (
              <div key={g.genre} className="flex items-center gap-3">
                <span className="w-28 shrink-0 truncate text-xs text-ink-muted dark:text-paper/50">
                  {g.genre}
                </span>
                <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-ink/5 dark:bg-paper/10">
                  <div
                    className={`h-full rounded-full ${palette[i % palette.length]}`}
                    style={{ width: `${g.pct}%` }}
                  />
                </div>
                <span className="w-10 shrink-0 text-right text-xs text-ink-faint dark:text-paper/40">
                  {g.count}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
