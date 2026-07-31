import { useState, useEffect } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { BookOpen, CheckCircle2, Plus } from 'lucide-react';
import type { Book } from '../types/book';

interface UpdateProgressModalProps {
  open: boolean;
  book: Book | null;
  onClose: () => void;
  onUpdate: (bookId: string, updates: Partial<Book>) => void;
}

export function UpdateProgressModal({
  open,
  book,
  onClose,
  onUpdate,
}: UpdateProgressModalProps) {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [totalPages, setTotalPages] = useState<number>(0);

  useEffect(() => {
    if (book) {
      setCurrentPage(book.currentPage ?? 0);
      setTotalPages(book.totalPages ?? 0);
    }
  }, [book]);

  if (!book) return null;

  const currentTotal = totalPages > 0 ? totalPages : 0;
  const currentPct =
    currentTotal > 0 ? Math.min(100, Math.round((currentPage / currentTotal) * 100)) : 0;
  const isFinished = currentTotal > 0 && currentPage >= currentTotal;

  const handleIncrement = (amount: number) => {
    const next = Math.max(0, currentPage + amount);
    if (currentTotal > 0 && next >= currentTotal) {
      setCurrentPage(currentTotal);
    } else {
      setCurrentPage(next);
    }
  };

  const handleFinish = () => {
    if (currentTotal > 0) {
      setCurrentPage(currentTotal);
    } else if (currentPage > 0) {
      setTotalPages(currentPage);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!book) return;

    const finalCurrent = Math.max(0, currentPage);
    const finalTotal = Math.max(0, totalPages);
    const markAsFinished = finalTotal > 0 && finalCurrent >= finalTotal;

    const updates: Partial<Book> = {
      currentPage: finalCurrent,
      totalPages: finalTotal > 0 ? finalTotal : undefined,
    };

    if (markAsFinished) {
      updates.status = 'read';
      updates.dateFinished = new Date().toISOString().slice(0, 10);
    }

    onUpdate(book.id, updates);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title="Update Progress">
      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        {/* Book Preview Card */}
        <div className="flex gap-4 items-center rounded-xl border border-ink/10 bg-paper-soft/60 p-4 dark:border-paper/10 dark:bg-bgdark-soft/60">
          <div className="h-20 w-14 shrink-0 overflow-hidden rounded-md border border-ink/10 bg-paper shadow-sm dark:border-paper/10 dark:bg-bgdark">
            {book.coverUrl ? (
              <img
                src={book.coverUrl}
                alt={book.title}
                className="h-full w-full object-cover"
                style={{
                  objectPosition: `${book.coverFocusX ?? 50}% ${book.coverFocusY ?? 50}%`,
                }}
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-ink/20 dark:text-paper/20">
                <BookOpen size={20} />
              </div>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="font-display text-base font-bold text-ink dark:text-paper line-clamp-1">
              {book.title}
            </h3>
            <p className="text-xs text-ink-muted dark:text-paper/60 truncate mt-0.5">
              {book.author}
            </p>

            {/* Quick Live Progress Bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs text-ink-muted dark:text-paper/50 mb-1">
                <span>Reading progress</span>
                <span className="font-semibold text-ink dark:text-paper">{currentPct}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${
                    isFinished ? 'bg-emerald-500 dark:bg-emerald-400' : 'bg-forest-500'
                  }`}
                  style={{ width: `${currentPct}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Form Inputs */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-ink dark:text-paper mb-1.5">
              Current Page
            </label>
            <input
              type="number"
              min={0}
              max={currentTotal > 0 ? currentTotal : undefined}
              value={currentPage}
              onChange={(e) => setCurrentPage(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-ink/10 bg-paper px-3.5 py-2.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-ink dark:text-paper mb-1.5">
              Total Pages
            </label>
            <input
              type="number"
              min={0}
              placeholder="e.g. 350"
              value={totalPages || ''}
              onChange={(e) => setTotalPages(parseInt(e.target.value, 10) || 0)}
              className="w-full rounded-xl border border-ink/10 bg-paper px-3.5 py-2.5 text-sm font-medium text-ink focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
            />
          </div>
        </div>

        {/* Quick Increment Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-semibold text-ink-muted dark:text-paper/60">
            Quick Add Pages
          </label>
          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 25, 50].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleIncrement(amt)}
                className="inline-flex items-center gap-1 rounded-lg border border-ink/10 bg-paper px-3 py-1.5 text-xs font-medium text-ink hover:bg-brass-500/10 hover:text-brass-700 dark:border-paper/10 dark:bg-bgdark dark:text-paper dark:hover:bg-brass-500/20 dark:hover:text-brass-300 transition-colors"
              >
                <Plus size={12} /> {amt} pages
              </button>
            ))}
            {currentTotal > 0 && (
              <button
                type="button"
                onClick={handleFinish}
                className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500/15 px-3 py-1.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 hover:bg-emerald-500/25 transition-colors ml-auto"
              >
                <CheckCircle2 size={13} /> Mark Finished
              </button>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="sm">
            Save Progress
          </Button>
        </div>
      </form>
    </Modal>
  );
}
