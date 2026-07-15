import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal, Heart } from 'lucide-react';
import type { FilterState, BookStatus } from '../types/book';
import { emptyFilter, STATUS_LABELS } from '../types/book';
import { StarRating } from './ui/StarRating';
import { classNames } from '../utils/helpers';
import { Button } from './ui/Button';

interface FilterPopoverProps {
  filter: FilterState;
  onChange: (f: FilterState) => void;
  genres: string[];
  hideStatusFilter?: boolean;
}

export function FilterPopover({ filter, onChange, genres, hideStatusFilter }: FilterPopoverProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  const activeCount =
    (filter.genre !== 'all' ? 1 : 0) +
    (filter.favoritesOnly ? 1 : 0) +
    (filter.minRating > 0 ? 1 : 0) +
    (filter.status !== 'all' ? 1 : 0);

  const statusOptions: (BookStatus | 'all')[] = ['all', 'on-shelf', 'wishlist', 'reading', 'read'];

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className={classNames(
          'inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors',
          activeCount > 0
            ? 'border-brass-400 bg-brass-50 text-brass-700 dark:border-brass-500/50 dark:bg-brass-500/10 dark:text-brass-300'
            : 'border-ink/10 bg-surface text-ink-muted hover:bg-ink/5 dark:border-paper/10 dark:bg-surface-dark dark:text-paper/70 dark:hover:bg-paper/10'
        )}
      >
        <SlidersHorizontal size={15} />
        Filter
        {activeCount > 0 && (
          <span className="rounded-full bg-brass-500 px-1.5 text-[10px] font-semibold text-white">
            {activeCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-20 mt-2 w-72 rounded-xl border border-ink/10 bg-surface p-4 shadow-modal dark:border-paper/10 dark:bg-surface-dark">
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint dark:text-paper/40">
                Genre
              </label>
              <select
                value={filter.genre}
                onChange={(e) => onChange({ ...filter, genre: e.target.value })}
                className="w-full rounded-lg border border-ink/10 bg-paper px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
              >
                <option value="all">All genres</option>
                {genres.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            {!hideStatusFilter && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint dark:text-paper/40">
                  Status
                </label>
                <select
                  value={filter.status}
                  onChange={(e) =>
                    onChange({ ...filter, status: e.target.value as BookStatus | 'all' })
                  }
                  className="w-full rounded-lg border border-ink/10 bg-paper px-2.5 py-1.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
                >
                  <option value="all">All statuses</option>
                  {statusOptions
                    .filter((s) => s !== 'all')
                    .map((s) => (
                      <option key={s} value={s}>
                        {STATUS_LABELS[s as BookStatus]}
                      </option>
                    ))}
                </select>
              </div>
            )}

            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint dark:text-paper/40">
                Minimum rating
              </label>
              <StarRating
                value={filter.minRating}
                onChange={(v) => onChange({ ...filter, minRating: v })}
                size={18}
              />
            </div>

            <label className="flex cursor-pointer items-center gap-2 text-sm text-ink dark:text-paper">
              <input
                type="checkbox"
                checked={filter.favoritesOnly}
                onChange={(e) => onChange({ ...filter, favoritesOnly: e.target.checked })}
                className="h-4 w-4 rounded border-ink/20 text-brass-500 focus:ring-brass-400"
              />
              <Heart size={14} className="text-burgundy-500" />
              Favorites only
            </label>
          </div>

          <div className="mt-4 flex justify-end border-t border-ink/10 pt-3 dark:border-paper/10">
            <Button variant="ghost" size="sm" onClick={() => onChange(emptyFilter)}>
              Clear all
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
