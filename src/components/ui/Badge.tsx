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
    'bg-brass-100/90 text-brass-900 border border-brass-300/50 dark:bg-brass-900/90 dark:text-brass-100 dark:border-brass-700/50 backdrop-blur-md',
  wishlist:
    'bg-purple-100/90 text-purple-900 border border-purple-300/50 dark:bg-purple-900/90 dark:text-purple-100 dark:border-purple-700/50 backdrop-blur-md',
  reading:
    'bg-forest-100/90 text-forest-900 border border-forest-300/50 dark:bg-forest-900/90 dark:text-forest-100 dark:border-forest-700/50 backdrop-blur-md',
  read:
    'bg-burgundy-100/90 text-burgundy-900 border border-burgundy-300/50 dark:bg-burgundy-900/90 dark:text-burgundy-100 dark:border-burgundy-700/50 backdrop-blur-md',
};

export function StatusBadge({ status, className }: { status: BookStatus; className?: string }) {
  return (
    <span
      className={classNames(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide shadow-sm',
        statusStyles[status],
        className
      )}
    >
      {STATUS_LABELS[status]}
    </span>
  );
}
