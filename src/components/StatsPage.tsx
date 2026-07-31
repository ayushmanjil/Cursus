import { useMemo, useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  BookMarked,
  BarChart3,
  Search,
  BookText,
} from 'lucide-react';
import type { Book } from '../types/book';
import { StatusBadge, GenreBadge } from './ui/Badge';

interface StatsPageProps {
  books: Book[];
  onOpenBook?: (book: Book) => void;
}

function getBookPageStats(book: Book) {
  const total = book.totalPages ?? 0;
  let read = 0;

  if (book.status === 'read') {
    read = total > 0 ? total : (book.currentPage ?? 0);
  } else {
    read = book.currentPage ?? 0;
  }

  if (total > 0 && read > total) {
    read = total;
  }

  const pct =
    total > 0
      ? Math.min(100, Math.round((read / total) * 100))
      : book.status === 'read'
      ? 100
      : 0;

  return { read, total, pct };
}

export function StatsPage({ books, onOpenBook }: StatsPageProps) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'reading' | 'read'>('all');

  // ONLY include books marked as 'read' or 'reading'
  const activeBooks = useMemo(() => {
    return books.filter((b) => b.status === 'read' || b.status === 'reading');
  }, [books]);

  // Compute total pages read across all read/reading books
  const summaryStats = useMemo(() => {
    let totalPagesRead = 0;
    let completedCount = 0;
    let readingCount = 0;

    for (const b of activeBooks) {
      const { read } = getBookPageStats(b);
      totalPagesRead += read;
      if (b.status === 'read') completedCount++;
      if (b.status === 'reading') readingCount++;
    }

    const avgPagesPerBook =
      activeBooks.length > 0 ? Math.round(totalPagesRead / activeBooks.length) : 0;

    return {
      totalPagesRead,
      completedCount,
      readingCount,
      avgPagesPerBook,
      totalActiveBooks: activeBooks.length,
    };
  }, [activeBooks]);

  // Filtered & sorted book page stats
  const filteredBooks = useMemo(() => {
    let list = activeBooks.slice();

    if (statusFilter !== 'all') {
      list = list.filter((b) => b.status === statusFilter);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    // Prioritize 'reading' books at the top, then sort by pages read descending
    return list.sort((a, b) => {
      if (a.status === 'reading' && b.status !== 'reading') return -1;
      if (a.status !== 'reading' && b.status === 'reading') return 1;

      const statsA = getBookPageStats(a);
      const statsB = getBookPageStats(b);
      if (statsB.read !== statsA.read) {
        return statsB.read - statsA.read;
      }
      return a.title.localeCompare(b.title);
    });
  }, [activeBooks, search, statusFilter]);

  return (
    <div className="space-y-8">
      {/* Summary KPI Cards matching Dashboard Top Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Pages Read Card */}
        <div className="rounded-xl2 border border-brass-500/20 bg-gradient-to-br from-brass-500/10 via-surface to-surface p-5 shadow-card dark:border-brass-500/15 dark:from-brass-500/15 dark:via-surface-dark dark:to-surface-dark">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-brass-700 dark:text-brass-400">
              Total Pages Read
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brass-500 text-white shadow-sm">
              <BookOpen size={18} />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ink dark:text-paper">
            {summaryStats.totalPagesRead.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-ink-muted dark:text-paper/50">
            Across {summaryStats.totalActiveBooks} reading & finished book{summaryStats.totalActiveBooks === 1 ? '' : 's'}
          </p>
        </div>

        {/* Books Completed */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/50">
              Books Completed
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest-500 text-white shadow-sm">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ink dark:text-paper">
            {summaryStats.completedCount}
          </p>
          <p className="mt-1 text-xs text-ink-muted dark:text-paper/50">Finished read shelf</p>
        </div>

        {/* Currently Reading */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/50">
              Currently Reading
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brass-500 text-white shadow-sm">
              <BookMarked size={18} />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ink dark:text-paper">
            {summaryStats.readingCount}
          </p>
          <p className="mt-1 text-xs text-ink-muted dark:text-paper/50">Active reading shelf</p>
        </div>

        {/* Avg Pages per Book */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/50">
              Avg Pages / Book
            </span>
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy-500 text-white shadow-sm">
              <BarChart3 size={18} />
            </div>
          </div>
          <p className="mt-3 font-display text-3xl font-bold text-ink dark:text-paper">
            {summaryStats.avgPagesPerBook.toLocaleString()}
          </p>
          <p className="mt-1 text-xs text-ink-muted dark:text-paper/50">Average pages logged</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-lg font-medium text-ink dark:text-paper flex items-center gap-2">
            <BookOpen size={18} className="text-forest-500" /> Reading Progress & Pages
          </h2>
          <p className="text-xs text-ink-muted dark:text-paper/50 mt-0.5">
            Showing books currently being read or completed
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Search Input */}
          <div className="relative min-w-[220px] flex-1 sm:flex-none">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted dark:text-paper/40"
            />
            <input
              type="text"
              placeholder="Search title, author or genre..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-ink/10 bg-surface pl-8 pr-3 py-1.5 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-surface-dark dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 rounded-lg border border-ink/10 bg-surface p-1 dark:border-paper/10 dark:bg-surface-dark">
            <button
              onClick={() => setStatusFilter('all')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'all'
                  ? 'bg-ink text-paper dark:bg-brass-500 dark:text-bgdark'
                  : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              All ({activeBooks.length})
            </button>
            <button
              onClick={() => setStatusFilter('reading')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'reading'
                  ? 'bg-ink text-paper dark:bg-brass-500 dark:text-bgdark'
                  : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              Reading ({summaryStats.readingCount})
            </button>
            <button
              onClick={() => setStatusFilter('read')}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                statusFilter === 'read'
                  ? 'bg-ink text-paper dark:bg-brass-500 dark:text-bgdark'
                  : 'text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper'
              }`}
            >
              Finished ({summaryStats.completedCount})
            </button>
          </div>
        </div>
      </div>

      {/* Book Cards Grid - matching Dashboard card UI */}
      {filteredBooks.length === 0 ? (
        <div className="rounded-xl2 border border-dashed border-ink/20 p-10 text-center dark:border-paper/20 bg-surface/50 dark:bg-surface-dark/50">
          <BookText className="mx-auto mb-3 text-ink-faint dark:text-paper/30" size={36} />
          <p className="text-base font-display font-medium text-ink dark:text-paper">No books found</p>
          <p className="mt-1 text-xs text-ink-muted dark:text-paper/50">
            {search
              ? 'No reading or read books match your search query.'
              : 'Add books to your Currently Reading or Read shelf.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBooks.map((book) => {
            const { read, total, pct } = getBookPageStats(book);
            const isFinished = book.status === 'read' || (total > 0 && read >= total);

            return (
              <div
                key={book.id}
                onClick={() => onOpenBook?.(book)}
                className="group relative flex flex-col justify-between rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card transition-all duration-200 hover:border-brass-500/40 hover:shadow-cardHover dark:border-paper/10 dark:bg-surface-dark cursor-pointer min-h-[220px]"
              >
                <div className="flex gap-4">
                  {/* Book Cover Thumbnail - matching Dashboard size (h-28 w-20) */}
                  <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg border border-ink/5 bg-paper-soft shadow-sm dark:border-paper/5 dark:bg-bgdark-soft">
                    {book.coverUrl ? (
                      <img
                        src={book.coverUrl}
                        alt={book.title}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        style={{
                          objectPosition: `${book.coverFocusX ?? 50}% ${book.coverFocusY ?? 50}%`,
                        }}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-ink/15 dark:text-paper/15">
                        <BookOpen size={24} />
                      </div>
                    )}
                  </div>

                  {/* Book Metadata - matching Dashboard typography */}
                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="font-display text-[15px] font-medium leading-snug text-ink line-clamp-2 dark:text-paper group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors">
                          {book.title}
                        </h3>
                        <StatusBadge status={book.status} className="shrink-0" />
                      </div>
                      <p className="text-xs text-ink-muted dark:text-paper/50 mt-1 truncate">
                        {book.author}
                      </p>
                      {book.genre && (
                        <div className="mt-2">
                          <GenreBadge genre={book.genre} />
                        </div>
                      )}
                    </div>

                    <p className="text-[11px] font-medium text-ink-faint dark:text-paper/40 mt-2">
                      {read.toLocaleString()} {total > 0 ? `of ${total.toLocaleString()}` : ''} pages read
                    </p>
                  </div>
                </div>

                {/* Reading Progress Bar Section - matching Dashboard */}
                <div className="mt-4 pt-3 border-t border-ink/5 dark:border-paper/5">
                  <div className="flex items-center justify-between text-xs text-ink-muted dark:text-paper/50 mb-1.5">
                    <span className="font-medium flex items-center gap-1.5">
                      <BookOpen size={13} className={isFinished ? 'text-forest-500' : 'text-brass-500'} />
                      <span>Reading progress</span>
                    </span>
                    <span
                      className={`font-semibold ${
                        isFinished ? 'text-forest-600 dark:text-forest-400' : 'text-brass-600 dark:text-brass-400'
                      }`}
                    >
                      {isFinished ? '100% (Finished)' : `${pct}%`}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isFinished ? 'bg-forest-500' : 'bg-brass-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
