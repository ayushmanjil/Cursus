import { useEffect, useState } from 'react';
import { Heart, BookOpen, CheckCircle2, BookMarked, Trash2, BookText, ShoppingBag } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { StarRating } from './ui/StarRating';
import { CoverUpload } from './ui/CoverUpload';
import { ConfirmDialog } from './ui/ConfirmDialog';
import type { Book, BookStatus } from '../types/book';
import { formatDate, classNames } from '../utils/helpers';

interface BookDetailsModalProps {
  book: Book | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Book>) => void;
  onSetStatus: (id: string, status: BookStatus) => void;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

const inputClass =
  'w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper dark:placeholder:text-paper/30';

export function BookDetailsModal({
  book,
  onClose,
  onUpdate,
  onSetStatus,
  onToggleFavorite,
  onDelete,
}: BookDetailsModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [local, setLocal] = useState<Book | null>(book);

  useEffect(() => {
    setLocal(book);
  }, [book]);

  if (!book || !local) return null;

  const commit = (patch: Partial<Book>) => {
    setLocal((prev) => (prev ? { ...prev, ...patch } : prev));
    onUpdate(book.id, patch);
  };

  return (
    <>
      <Modal open={!!book} onClose={onClose} title="Book details" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex sm:w-40 sm:flex-col sm:items-stretch gap-3">
            <CoverUpload
              value={local.coverUrl ?? ''}
              onChange={(dataUrl) => commit({ coverUrl: dataUrl })}
              heightClass="h-40 sm:h-52"
            />
            <button
              onClick={() => onToggleFavorite(book.id)}
              className={classNames(
                'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                local.favorite
                  ? 'border-burgundy-300 bg-burgundy-50 text-burgundy-500 dark:border-burgundy-500/40 dark:bg-burgundy-500/10'
                  : 'border-ink/10 text-ink-muted hover:bg-ink/5 dark:border-paper/10 dark:text-paper/60 dark:hover:bg-paper/10'
              )}
            >
              <Heart size={13} className={local.favorite ? 'fill-burgundy-500' : ''} />
              {local.favorite ? 'Favorited' : 'Add to favorites'}
            </button>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <LabeledInput
                label="Title"
                value={local.title}
                onChange={(v) => commit({ title: v })}
              />
              <LabeledInput
                label="Author"
                value={local.author}
                onChange={(v) => commit({ author: v })}
              />
              <LabeledInput
                label="Genre"
                value={local.genre}
                onChange={(v) => commit({ genre: v })}
              />
              <LabeledInput
                label="Date added"
                type="date"
                value={local.dateAdded}
                onChange={(v) => commit({ dateAdded: v })}
              />
              <LabeledInput
                label="Date finished"
                type="date"
                value={local.dateFinished ?? ''}
                onChange={(v) => commit({ dateFinished: v })}
                disabled={local.status !== 'read'}
              />
            </div>

            {local.status === 'read' && (
              <div>
                <FieldLabel>Rating</FieldLabel>
                <StarRating value={local.rating ?? 0} onChange={(v) => commit({ rating: v })} size={20} />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Total pages</FieldLabel>
                <input
                  type="number"
                  min={1}
                  value={local.totalPages ?? ''}
                  onChange={(e) =>
                    commit({ totalPages: e.target.value ? Number(e.target.value) : undefined })
                  }
                  placeholder="e.g. 320"
                  className={inputClass}
                />
              </div>
              {local.status === 'reading' && (
                <div>
                  <FieldLabel>Current page</FieldLabel>
                  <input
                    type="number"
                    min={0}
                    max={local.totalPages || undefined}
                    value={local.currentPage ?? ''}
                    onChange={(e) =>
                      commit({ currentPage: e.target.value ? Number(e.target.value) : undefined })
                    }
                    placeholder="0"
                    className={inputClass}
                  />
                </div>
              )}
            </div>

            {local.status === 'reading' && local.totalPages && local.totalPages > 0 && (
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <FieldLabel>Reading progress</FieldLabel>
                  <span className="text-xs font-medium text-ink-muted dark:text-paper/50">
                    {Math.round(((local.currentPage ?? 0) / local.totalPages) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                  <div
                    className="h-full rounded-full bg-forest-500 transition-all"
                    style={{ width: `${Math.min(100, Math.round(((local.currentPage ?? 0) / local.totalPages) * 100))}%` }}
                  />
                </div>
                <p className="mt-1 text-[11px] text-ink-faint dark:text-paper/40">
                  Page {local.currentPage ?? 0} of {local.totalPages}
                </p>
              </div>
            )}

            <div>
              <FieldLabel>Notes</FieldLabel>
              <textarea
                value={local.notes}
                onChange={(e) => commit({ notes: e.target.value })}
                placeholder="Summaries, favorite quotes, thoughts…"
                rows={5}
                className={inputClass}
              />
              <p className="mt-1 text-[11px] text-ink-faint dark:text-paper/40">
                Added {formatDate(local.dateAdded)}
                {local.status === 'read' ? ` · Finished ${formatDate(local.dateFinished)}` : ''}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-ink/10 pt-4 dark:border-paper/10">
          <div className="flex flex-wrap gap-2">
            {local.status !== 'on-shelf' && (
              <Button variant="secondary" size="sm" onClick={() => onSetStatus(book.id, 'on-shelf')}>
                <BookMarked size={14} /> Move to On Shelf
              </Button>
            )}
            {local.status !== 'wishlist' && (
              <Button variant="secondary" size="sm" onClick={() => onSetStatus(book.id, 'wishlist')}>
                <ShoppingBag size={14} /> Move to Hunt List
              </Button>
            )}
            {local.status !== 'reading' && (
              <Button variant="secondary" size="sm" onClick={() => onSetStatus(book.id, 'reading')}>
                <BookOpen size={14} /> Mark as Reading
              </Button>
            )}
            {local.status !== 'read' && (
              <Button variant="secondary" size="sm" onClick={() => onSetStatus(book.id, 'read')}>
                <CheckCircle2 size={14} /> Mark as Read
              </Button>
            )}
          </div>
          <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
            <Trash2 size={14} /> Delete
          </Button>
        </div>
      </Modal>

      <ConfirmDialog
        open={confirmDelete}
        title="Delete this book?"
        message={`"${book.title}" will be permanently removed from your library. This can't be undone.`}
        onCancel={() => setConfirmDelete(false)}
        onConfirm={() => {
          setConfirmDelete(false);
          onDelete(book.id);
          onClose();
        }}
      />
    </>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint dark:text-paper/40">
      {children}
    </span>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
  type = 'text',
  disabled,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
}) {
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(inputClass, disabled && 'opacity-50')}
      />
    </label>
  );
}
