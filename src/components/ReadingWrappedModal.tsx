import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import {
  BookOpen,
  Award,
  Flame,
  Star,
  CheckCircle2,
  Bookmark,
  X,
} from 'lucide-react';
import type { Book } from '../types/book';
import type { StreakLog } from './StreakManager';
import { calculateStreaks } from '../utils/helpers';

interface ReadingWrappedModalProps {
  open: boolean;
  onClose: () => void;
  books: Book[];
  streakLog: StreakLog;
  userName?: string;
  earnedBadgesCount?: number;
}

export function ReadingWrappedModal({
  open,
  onClose,
  books,
  streakLog,
  userName = 'Reader',
  earnedBadgesCount = 0,
}: ReadingWrappedModalProps) {
  if (!open) return null;

  const currentYear = new Date().getFullYear();

  // Statistics calculation
  const readBooks = books.filter((b) => b.status === 'read');
  const totalBooksRead = readBooks.length;

  const totalPagesRead = books.reduce((sum, b) => {
    if (b.status === 'read') return sum + (b.totalPages || 0);
    if (b.status === 'reading') return sum + (b.currentPage || 0);
    return sum;
  }, 0);

  const { highestStreak } = calculateStreaks(streakLog);

  // Genre breakdown
  const genreCounts: Record<string, number> = {};
  readBooks.forEach((b) => {
    genreCounts[b.genre] = (genreCounts[b.genre] || 0) + 1;
  });
  const topGenreEntry = Object.entries(genreCounts).sort((a, b) => b[1] - a[1])[0];
  const topGenre = topGenreEntry ? topGenreEntry[0] : 'Literature';

  // Top rated book
  const topRatedBook = readBooks.filter((b) => b.rating && b.rating >= 4.5)[0] || readBooks[0];

  return (
    <Modal open={open} onClose={onClose} title="" maxWidth="max-w-lg" hideHeader hideCloseButton>
      <div className="relative overflow-hidden rounded-xl border-2 border-brass-500/40 bg-gradient-to-br from-[#FAF7F1] via-[#F5EFE3] to-[#EFE6D5] dark:from-[#1E1A15] dark:via-[#191511] dark:to-[#15120E] p-6 shadow-2xl">
        {/* Vintage Decorative Header Line */}
        <div className="flex items-center justify-between border-b-2 border-brass-500/30 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brass-500 text-bgdark font-bold shadow-sm">
              <BookOpen size={20} />
            </div>
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400 font-bold">
                Official Library Record
              </p>
              <h2 className="font-display text-xl font-bold tracking-tight text-ink dark:text-paper">
                Reading Wrapped {currentYear}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-brass-500/10 px-3 py-1 text-xs font-bold text-brass-700 dark:text-brass-300 border border-brass-500/20">
              {userName}
            </div>
            <button
              onClick={onClose}
              className="rounded-full p-1.5 text-brass-700 hover:bg-brass-500/20 dark:text-brass-300 dark:hover:bg-brass-400/20 transition-colors"
              title="Close card"
              aria-label="Close"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Library Card Grid Body */}
        <div className="my-5 space-y-4">
          {/* Main Stat Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg border border-brass-500/20 bg-white/60 p-3 dark:bg-bgdark-soft/60 backdrop-blur-sm text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/40 flex items-center justify-center gap-1">
                <CheckCircle2 size={12} className="text-forest-500" />
                Books Finished
              </p>
              <p className="font-display text-3xl font-bold text-ink dark:text-paper mt-1">
                {totalBooksRead}
              </p>
              <p className="text-[10px] text-ink-muted dark:text-paper/50 italic mt-0.5">
                completed titles
              </p>
            </div>

            <div className="rounded-lg border border-brass-500/20 bg-white/60 p-3 dark:bg-bgdark-soft/60 backdrop-blur-sm text-center">
              <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/40 flex items-center justify-center gap-1">
                <BookOpen size={12} className="text-purple-500" />
                Pages Read
              </p>
              <p className="font-display text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">
                {totalPagesRead.toLocaleString()}
              </p>
              <p className="text-[10px] text-ink-muted dark:text-paper/50 italic mt-0.5">
                total pages
              </p>
            </div>
          </div>

          {/* Secondary Metrics Row */}
          <div className="grid grid-cols-3 gap-2.5">
            <div className="rounded-lg border border-ink/5 bg-white/40 p-2.5 dark:bg-bgdark-soft/40 text-center">
              <Flame size={16} className="mx-auto text-brass-500 animate-pulse mb-1" />
              <p className="text-[9px] uppercase font-bold text-ink-faint dark:text-paper/40">Longest Streak</p>
              <p className="text-base font-bold text-brass-600 dark:text-brass-400">{highestStreak} days</p>
            </div>

            <div className="rounded-lg border border-ink/5 bg-white/40 p-2.5 dark:bg-bgdark-soft/40 text-center">
              <Bookmark size={16} className="mx-auto text-forest-500 mb-1" />
              <p className="text-[9px] uppercase font-bold text-ink-faint dark:text-paper/40">Top Genre</p>
              <p className="text-xs font-bold text-forest-600 dark:text-forest-400 truncate">{topGenre}</p>
            </div>

            <div className="rounded-lg border border-ink/5 bg-white/40 p-2.5 dark:bg-bgdark-soft/40 text-center">
              <Award size={16} className="mx-auto text-purple-500 mb-1" />
              <p className="text-[9px] uppercase font-bold text-ink-faint dark:text-paper/40">Badges</p>
              <p className="text-base font-bold text-purple-600 dark:text-purple-400">{earnedBadgesCount}</p>
            </div>
          </div>

          {/* Featured Favorite Title */}
          {topRatedBook && (
            <div className="rounded-lg border border-brass-500/25 bg-brass-500/10 p-3 flex items-center gap-3">
              {topRatedBook.coverUrl ? (
                <img
                  src={topRatedBook.coverUrl}
                  alt={topRatedBook.title}
                  className="h-14 w-10 object-cover rounded shadow-sm shrink-0"
                />
              ) : (
                <div className="h-14 w-10 bg-brass-500/20 rounded flex items-center justify-center shrink-0 text-brass-700 dark:text-brass-300">
                  <BookOpen size={18} />
                </div>
              )}
              <div className="min-w-0 flex-1">
                <p className="text-[9px] font-bold uppercase tracking-wider text-brass-700 dark:text-brass-400 flex items-center gap-1">
                  <Star size={10} className="fill-brass-500 text-brass-500" />
                  Crown Jewel Read
                </p>
                <p className="font-display text-sm font-bold text-ink dark:text-paper truncate mt-0.5">
                  {topRatedBook.title}
                </p>
                <p className="text-xs text-ink-muted dark:text-paper/60 truncate">
                  by {topRatedBook.author}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Vintage Stamp Footer */}
        <div className="flex items-center justify-between border-t border-brass-500/20 pt-4">
          <div className="flex items-center gap-2">
            {/* Circular Library Stamp */}
            <div className="h-10 w-10 rounded-full border-2 border-dashed border-brass-600/60 dark:border-brass-400/60 flex items-center justify-center transform -rotate-12 select-none">
              <span className="font-mono text-[8px] font-bold uppercase text-brass-600 dark:text-brass-400 text-center leading-none">
                VERIFIED<br />CURSUS
              </span>
            </div>
            <p className="font-serif italic text-[11px] text-ink-muted dark:text-paper/50">
              &ldquo;A reader lives a thousand lives before he dies.&rdquo;
            </p>
          </div>

          <Button variant="primary" size="sm" onClick={onClose} className="bg-brass-500 text-bgdark hover:bg-brass-400">
            Close Card
          </Button>
        </div>
      </div>
    </Modal>
  );
}
