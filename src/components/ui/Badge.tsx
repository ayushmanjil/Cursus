import { classNames } from '../../utils/helpers';
import type { BookStatus } from '../../types/book';
import { STATUS_LABELS } from '../../types/book';

export function GenreBadge({ genre }: { genre: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-ink/10 bg-paper-soft px-2.5 py-0.5 text-[11px] font-medium text-ink-muted dark:border-paper/10 dark:bg-paper/5 dark:text-paper/60">
      {genre}
    </span>
  );
}

const statusStyles: Record<BookStatus, string> = {
  'on-shelf':
    'bg-brass-50 text-brass-700 dark:bg-brass-500/15 dark:text-brass-300',
  wishlist:
    'bg-purple-50 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300',
  reading:
    'bg-forest-50 text-forest-600 dark:bg-forest-500/15 dark:text-forest-300',
  read: 'bg-ink/5 text-ink-muted dark:bg-paper/10 dark:text-paper/70',
};

export function StatusBadge({ status, className }: { status: BookStatus; className?: string }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide',
        statusStyles[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
