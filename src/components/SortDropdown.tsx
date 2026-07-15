import { ArrowDownAZ, ArrowUpAZ } from 'lucide-react';
import type { SortField, SortState } from '../types/book';

interface SortDropdownProps {
  sort: SortState;
  onChange: (s: SortState) => void;
}

const fieldLabels: Record<SortField, string> = {
  title: 'Title',
  author: 'Author',
  dateFinished: 'Date finished',
  rating: 'Rating',
};

export function SortDropdown({ sort, onChange }: SortDropdownProps) {
  return (
    <div className="flex items-center gap-1.5">
      <select
        value={sort.field}
        onChange={(e) => onChange({ ...sort, field: e.target.value as SortField })}
        className="rounded-lg border border-ink/10 bg-surface px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-surface-dark dark:text-paper"
      >
        {(Object.keys(fieldLabels) as SortField[]).map((f) => (
          <option key={f} value={f}>
            Sort: {fieldLabels[f]}
          </option>
        ))}
      </select>
      <button
        onClick={() => onChange({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}
        title={sort.order === 'asc' ? 'Ascending' : 'Descending'}
        className="rounded-lg border border-ink/10 bg-surface p-2 text-ink-muted hover:bg-ink/5 dark:border-paper/10 dark:bg-surface-dark dark:text-paper/70 dark:hover:bg-paper/10"
      >
        {sort.order === 'asc' ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />}
      </button>
    </div>
  );
}
