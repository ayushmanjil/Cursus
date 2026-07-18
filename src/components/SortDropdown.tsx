import { useState, useRef, useEffect } from 'react';
import { ArrowDownAZ, ArrowUpAZ, ChevronDown, Check } from 'lucide-react';
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
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative flex items-center gap-1.5" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center justify-between gap-2 rounded-lg border border-brass-500/20 bg-paper-soft/40 px-3 py-2 text-sm font-medium text-ink shadow-sm transition-all hover:bg-brass-50 dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-paper dark:hover:bg-brass-950/20 focus:outline-none focus:ring-2 focus:ring-brass-400"
      >
        <span>Sort: {fieldLabels[sort.field]}</span>
        <ChevronDown size={14} className={`text-brass-500 dark:text-brass-400 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-auto left-0 top-full z-20 mt-1.5 w-44 overflow-hidden rounded-lg border border-brass-500/20 bg-paper py-1 shadow-modal dark:border-brass-500/10 dark:bg-bgdark-soft">
          {(Object.keys(fieldLabels) as SortField[]).map((f) => {
            const isSelected = sort.field === f;
            return (
              <button
                key={f}
                type="button"
                onClick={() => {
                  onChange({ ...sort, field: f });
                  setOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors ${
                  isSelected
                    ? 'bg-brass-50 text-brass-700 dark:bg-brass-500/10 dark:text-brass-300 font-semibold'
                    : 'text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-paper/10'
                }`}
              >
                <span>{fieldLabels[f]}</span>
                {isSelected && <Check size={14} className="text-brass-500 dark:text-brass-400" />}
              </button>
            );
          })}
        </div>
      )}

      <button
        onClick={() => onChange({ ...sort, order: sort.order === 'asc' ? 'desc' : 'asc' })}
        title={sort.order === 'asc' ? 'Ascending' : 'Descending'}
        className="rounded-lg border border-brass-500/20 bg-paper-soft/40 p-2 text-brass-500 shadow-sm hover:bg-brass-50 dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-brass-400 dark:hover:bg-brass-950/20 transition-colors"
      >
        {sort.order === 'asc' ? <ArrowUpAZ size={16} /> : <ArrowDownAZ size={16} />}
      </button>
    </div>
  );
}

