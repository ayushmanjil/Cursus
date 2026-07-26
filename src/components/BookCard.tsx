import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreVertical,
  Heart,
  BookOpen,
  CheckCircle2,
  BookMarked,
  Trash2,
  BookText,
  ShoppingBag,
} from 'lucide-react';
import type { Book, BookStatus } from '../types/book';
import { STATUS_LABELS } from '../types/book';
import { GenreBadge, StatusBadge } from './ui/Badge';
import { ConfirmDialog } from './ui/ConfirmDialog';
import { StarRating } from './ui/StarRating';
import { classNames } from '../utils/helpers';

interface BookCardProps {
  book: Book;
  onOpen: () => void;
  onToggleFavorite: () => void;
  onSetStatus: (status: Book['status']) => void;
  onDelete: () => void;
}

export function BookCard({ book, onOpen, onToggleFavorite, onSetStatus, onDelete }: BookCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<BookStatus | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="group relative flex flex-col overflow-hidden rounded-xl2 border border-ink/10 bg-surface shadow-card transition-shadow hover:shadow-cardHover dark:border-paper/10 dark:bg-surface-dark"
    >
      <button
        onClick={onOpen}
        className="flex flex-1 flex-col text-left"
        aria-label={`Open details for ${book.title}`}
      >
        <div className="relative h-44 w-full overflow-hidden bg-paper-soft dark:bg-bgdark-soft">
          {book.coverUrl ? (
            <img
              src={book.coverUrl}
              alt={`${book.title} cover`}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
              style={{ objectPosition: `${book.coverFocusX ?? 50}% ${book.coverFocusY ?? 50}%` }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <BookText size={30} className="text-ink/15 dark:text-paper/15" />
            </div>
          )}
          <div className="absolute left-2 top-2 z-10">
            <StatusBadge status={book.status} className="shadow-sm" />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-1.5 p-4">
          <h3 className="font-display text-[15px] font-medium leading-snug text-ink line-clamp-2 dark:text-paper">
            {book.title}
          </h3>
          <p className="text-xs text-ink-muted dark:text-paper/50">{book.author}</p>
          <div className="mt-1 flex items-center gap-1.5">
            <GenreBadge genre={book.genre} />
          </div>
          {book.status === 'read' && book.rating ? (
            <div className="mt-1.5">
              <StarRating value={book.rating} readOnly size={13} />
            </div>
          ) : book.status === 'reading' && book.totalPages && book.totalPages > 0 ? (
            <div className="mt-2">
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                <div
                  className="h-full rounded-full bg-forest-500"
                  style={{ width: `${Math.min(100, Math.round(((book.currentPage ?? 0) / book.totalPages) * 100))}%` }}
                />
              </div>
              <p className="mt-1 text-[11px] text-ink-faint dark:text-paper/40">
                Page {book.currentPage ?? 0} of {book.totalPages}
              </p>
            </div>
          ) : null}
        </div>
      </button>

      <div className="absolute right-2 top-2 flex items-center gap-1">
        <button
          onClick={onToggleFavorite}
          aria-label={book.favorite ? 'Remove from favorites' : 'Add to favorites'}
          className="rounded-full bg-surface/90 p-1.5 shadow-sm backdrop-blur transition-colors hover:bg-surface dark:bg-surface-dark/90 dark:hover:bg-surface-dark"
        >
          <Heart
            size={15}
            className={classNames(
              book.favorite ? 'fill-burgundy-500 text-burgundy-500' : 'text-ink-faint dark:text-paper/40'
            )}
          />
        </button>
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label="More options"
            className="rounded-full bg-surface/90 p-1.5 shadow-sm backdrop-blur transition-colors hover:bg-surface dark:bg-surface-dark/90 dark:hover:bg-surface-dark"
          >
            <MoreVertical size={15} className="text-ink-muted dark:text-paper/60" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 z-10 mt-1 w-44 overflow-hidden rounded-lg border border-ink/10 bg-surface py-1 shadow-modal dark:border-paper/10 dark:bg-surface-dark">
              {book.status !== 'on-shelf' && (
                <MenuItem
                  icon={BookMarked}
                  label="Move to On Shelf"
                  onClick={() => {
                    setPendingStatus('on-shelf');
                    setMenuOpen(false);
                  }}
                />
              )}
              {book.status !== 'wishlist' && (
                <MenuItem
                  icon={ShoppingBag}
                  label="Move to Hunt List"
                  onClick={() => {
                    setPendingStatus('wishlist');
                    setMenuOpen(false);
                  }}
                />
              )}
              {book.status !== 'reading' && (
                <MenuItem
                  icon={BookOpen}
                  label="Mark as Reading"
                  onClick={() => {
                    setPendingStatus('reading');
                    setMenuOpen(false);
                  }}
                />
              )}
              {book.status !== 'read' && (
                <MenuItem
                  icon={CheckCircle2}
                  label="Mark as Read"
                  onClick={() => {
                    setPendingStatus('read');
                    setMenuOpen(false);
                  }}
                />
              )}
              <div className="my-1 border-t border-ink/10 dark:border-paper/10" />
              <MenuItem
                icon={Trash2}
                label="Delete book"
                danger
                onClick={() => {
                  onDelete();
                  setMenuOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>
      <ConfirmDialog
        open={!!pendingStatus}
        title={pendingStatus ? `Move to ${STATUS_LABELS[pendingStatus]}?` : ''}
        message={
          pendingStatus === 'on-shelf'
            ? `Are you sure you want to move "${book.title}" to On Shelf? Any reading progress will be lost.`
            : pendingStatus === 'wishlist'
            ? `Are you sure you want to move "${book.title}" to Hunt List?`
            : pendingStatus === 'reading'
            ? `Are you sure you want to start reading "${book.title}"?`
            : pendingStatus === 'read'
            ? `Are you sure you want to mark "${book.title}" as Read?`
            : ''
        }
        confirmLabel={pendingStatus === 'read' ? 'Mark as Read' : pendingStatus === 'reading' ? 'Start Reading' : 'Move'}
        confirmVariant="primary"
        onConfirm={() => {
          if (pendingStatus) {
            onSetStatus(pendingStatus);
            setPendingStatus(null);
          }
        }}
        onCancel={() => setPendingStatus(null)}
      />
    </motion.div>
  );
}

function MenuItem({
  icon: Icon,
  label,
  onClick,
  danger,
}: {
  icon: React.ElementType;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={classNames(
        'flex w-full items-center gap-2 px-3 py-2 text-left text-sm transition-colors',
        danger
          ? 'text-burgundy-500 hover:bg-burgundy-50 dark:hover:bg-burgundy-500/10'
          : 'text-ink hover:bg-ink/5 dark:text-paper dark:hover:bg-paper/10'
      )}
    >
      <Icon size={14} />
      {label}
    </button>
  );
}
