import { Search, Plus, Menu, Download, Upload } from 'lucide-react';
import type { FilterState, SortState } from '../types/book';
import { SortDropdown } from './SortDropdown';
import { FilterPopover } from './FilterPopover';
import { Button } from './ui/Button';

interface TopBarProps {
  title: string;
  subtitle?: string;
  search: string;
  onSearch: (v: string) => void;
  sort: SortState;
  onSort: (s: SortState) => void;
  filter: FilterState;
  onFilter: (f: FilterState) => void;
  genres: string[];
  onAddBook: () => void;
  onExport: () => void;
  onImportClick: () => void;
  onOpenMobileMenu: () => void;
  showControls?: boolean;
}

export function TopBar({
  title,
  subtitle,
  search,
  onSearch,
  sort,
  onSort,
  filter,
  onFilter,
  genres,
  onAddBook,
  onExport,
  onImportClick,
  onOpenMobileMenu,
  showControls = true,
}: TopBarProps) {
  return (
    <div className="sticky top-0 z-20 border-b border-ink/10 bg-paper/90 backdrop-blur-md dark:border-paper/10 dark:bg-bgdark/90">
      <div className="flex items-center gap-3 px-4 py-3 sm:px-6">
        <button
          onClick={onOpenMobileMenu}
          className="rounded-md p-1.5 text-ink-muted hover:bg-ink/5 lg:hidden dark:text-paper/60"
        >
          <Menu size={20} />
        </button>
        <div className="min-w-0 flex-1">
          <h1 className="truncate font-display text-xl font-semibold text-ink dark:text-paper">
            {title}
          </h1>
          {subtitle && (
            <p className="truncate text-xs text-ink-muted dark:text-paper/50">{subtitle}</p>
          )}
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Button variant="ghost" size="sm" onClick={onImportClick} title="Import JSON backup">
            <Download size={14} /> Import
          </Button>
          <Button variant="ghost" size="sm" onClick={onExport} title="Export library as JSON">
            <Upload size={14} /> Export
          </Button>
        </div>
        <Button variant="primary" size="sm" onClick={onAddBook}>
          <Plus size={15} /> Add Book
        </Button>
      </div>

      {showControls && (
        <div className="flex flex-col gap-2 px-4 pb-3 sm:flex-row sm:items-center sm:px-6">
          <div className="relative flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40"
            />
            <input
              value={search}
              onChange={(e) => onSearch(e.target.value)}
              placeholder="Search by title, author, or genre…"
              className="w-full rounded-lg border border-ink/10 bg-surface py-2 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-surface-dark dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>
          <div className="flex items-center gap-2">
            <SortDropdown sort={sort} onChange={onSort} />
            <FilterPopover filter={filter} onChange={onFilter} genres={genres} />
          </div>
        </div>
      )}
    </div>
  );
}
