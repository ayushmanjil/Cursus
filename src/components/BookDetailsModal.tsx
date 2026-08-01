import { useEffect, useRef, useState } from 'react';
import { Heart, BookOpen, CheckCircle2, BookMarked, Trash2, ShoppingBag, Pencil, X, Plus, Quote } from 'lucide-react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { StarRating } from './ui/StarRating';
import { CoverUpload } from './ui/CoverUpload';
import { ConfirmDialog } from './ui/ConfirmDialog';
import type { Book, BookStatus, BookQuote } from '../types/book';
import { STATUS_LABELS } from '../types/book';
import { formatDate, classNames, todayIso } from '../utils/helpers';

interface BookDetailsModalProps {
  book: Book | null;
  onClose: () => void;
  onUpdate: (id: string, patch: Partial<Book>) => void;
  onSetStatus: (id: string, status: BookStatus) => void;
  onDelete: (id: string) => void;
}

const inputClass =
  'w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper dark:placeholder:text-paper/30';

const readonlyClass =
  'w-full rounded-lg border border-transparent bg-ink/5 px-3 py-2 text-sm text-ink dark:bg-paper/5 dark:text-paper cursor-default select-text';

export function BookDetailsModal({
  book,
  onClose,
  onUpdate,
  onSetStatus,
  onDelete,
}: BookDetailsModalProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<BookStatus | null>(null);
  const [local, setLocal] = useState<Book | null>(book);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Literary Marginalia states
  const [newQuoteText, setNewQuoteText] = useState('');
  const [newQuotePage, setNewQuotePage] = useState('');
  const [newQuoteNote, setNewQuoteNote] = useState('');
  const [showAddQuote, setShowAddQuote] = useState(false);

  useEffect(() => {
    setLocal(book);
    setError('');
    setIsEditing(false);
  }, [book]);

  if (!book || !local) return null;

  const handleAddQuote = () => {
    if (!newQuoteText.trim()) return;
    const pageNum = parseInt(newQuotePage, 10);
    const newQuote: BookQuote = {
      id: `q_${Date.now()}`,
      quote: newQuoteText.trim(),
      page: !isNaN(pageNum) && pageNum > 0 ? pageNum : undefined,
      note: newQuoteNote.trim() || undefined,
      dateAdded: new Date().toISOString(),
    };
    const updatedQuotes = [...(local.quotes || []), newQuote];
    commitLocal({ quotes: updatedQuotes });
    onUpdate(book.id, { quotes: updatedQuotes });
    setNewQuoteText('');
    setNewQuotePage('');
    setNewQuoteNote('');
    setShowAddQuote(false);
  };

  const handleDeleteQuote = (quoteId: string) => {
    const updatedQuotes = (local.quotes || []).filter((q) => q.id !== quoteId);
    commitLocal({ quotes: updatedQuotes });
    onUpdate(book.id, { quotes: updatedQuotes });
  };

  const commitLocal = (patch: Partial<Book>) => {
    setLocal((prev) => (prev ? { ...prev, ...patch } : prev));
  };

  const handleCancelEdit = () => {
    setLocal(book); // discard changes
    setError('');
    setIsEditing(false);
  };

  const handleSetStatusLocal = (status: BookStatus) => {
    const patch: Partial<Book> = { status };
    if (status === 'read') {
      patch.dateFinished = local.dateFinished || todayIso();
      patch.currentPage = local.totalPages || local.currentPage;
    } else if (status === 'reading') {
      patch.dateFinished = undefined;
      patch.currentPage = local.currentPage && local.currentPage > 0 ? local.currentPage : 0;
    } else if (status === 'on-shelf' || status === 'wishlist') {
      patch.dateFinished = undefined;
      patch.rating = undefined;
      patch.currentPage = undefined;
    }
    commitLocal(patch);
    // commit status change immediately (no edit mode required)
    onSetStatus(book.id, status);
  };

  const handleSave = () => {
    if (!book || !local) return;
    if (!local.title.trim() || !local.author.trim()) {
      setError('Title and author are required.');
      return;
    }

    const patch: Partial<Book> = {};
    (Object.keys(local) as Array<keyof Book>).forEach((key) => {
      // @ts-ignore
      if (local[key] !== book[key]) {
        // @ts-ignore
        patch[key] = local[key];
      }
    });

    if (Object.keys(patch).length > 0) {
      onUpdate(book.id, patch);
    }
    setIsEditing(false);
    onClose();
  };

  return (
    <>
      <Modal open={!!book} onClose={onClose} title="Book details" maxWidth="max-w-2xl">
        <div className="flex flex-col gap-6 sm:flex-row">
          <div className="flex sm:w-40 sm:flex-col sm:items-stretch gap-3">
            {/* Cover with focal-point picker overlay in edit mode */}
            <div className="relative">
              <CoverUpload
                value={local.coverUrl ?? ''}
                onChange={(dataUrl) => isEditing && commitLocal({ coverUrl: dataUrl, coverFocusX: 50, coverFocusY: 50 })}
                heightClass="h-40 sm:h-52"
                disabled={!isEditing}
              />
              {isEditing && local.coverUrl && (
                <FocalPointPicker
                  x={local.coverFocusX ?? 50}
                  y={local.coverFocusY ?? 50}
                  onChange={(x, y) => commitLocal({ coverFocusX: x, coverFocusY: y })}
                />
              )}
            </div>
            <button
              onClick={() => isEditing && commitLocal({ favorite: !local.favorite })}
              disabled={!isEditing}
              className={classNames(
                'flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-medium transition-colors',
                local.favorite
                  ? 'border-burgundy-300 bg-burgundy-50 text-burgundy-500 dark:border-burgundy-500/40 dark:bg-burgundy-500/10'
                  : 'border-ink/10 text-ink-muted hover:bg-ink/5 dark:border-paper/10 dark:text-paper/60 dark:hover:bg-paper/10',
                !isEditing && 'opacity-60 cursor-default pointer-events-none'
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
                onChange={(v) => commitLocal({ title: v })}
                readOnly={!isEditing}
              />
              <LabeledInput
                label="Author"
                value={local.author}
                onChange={(v) => commitLocal({ author: v })}
                readOnly={!isEditing}
              />
              <LabeledInput
                label="Genre"
                value={local.genre}
                onChange={(v) => commitLocal({ genre: v })}
                readOnly={!isEditing}
              />
              <LabeledInput
                label="Date finished"
                type="date"
                value={local.dateFinished ?? ''}
                onChange={(v) => commitLocal({ dateFinished: v })}
                disabled={local.status !== 'read'}
                readOnly={!isEditing}
              />
            </div>

            {local.status === 'read' && (
              <div>
                <FieldLabel>Rating</FieldLabel>
                <StarRating
                  value={local.rating ?? 0}
                  onChange={(v) => isEditing && commitLocal({ rating: v })}
                  size={20}
                  readOnly={!isEditing}
                />
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <FieldLabel>Total pages</FieldLabel>
                {isEditing ? (
                  <input
                    type="number"
                    min={1}
                    step="1"
                    value={local.totalPages ?? ''}
                    onChange={(e) => {
                      const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                      commitLocal({ totalPages: isNaN(val) ? undefined : val });
                    }}
                    placeholder="e.g. 320"
                    className={inputClass}
                  />
                ) : (
                  <div className={readonlyClass}>
                    {local.totalPages ? local.totalPages : <span className="text-ink-faint dark:text-paper/30">—</span>}
                  </div>
                )}
              </div>
              {local.status === 'reading' && (
                <div>
                  <FieldLabel>Current page</FieldLabel>
                  {isEditing ? (
                    <input
                      type="number"
                      min={0}
                      max={local.totalPages || undefined}
                      step="1"
                      value={local.currentPage ?? ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                        commitLocal({ currentPage: isNaN(val) ? undefined : val });
                      }}
                      placeholder="0"
                      className={inputClass}
                    />
                  ) : (
                    <div className={readonlyClass}>
                      {local.currentPage ?? <span className="text-ink-faint dark:text-paper/30">—</span>}
                    </div>
                  )}
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

            {local.status === 'read' && (
              <div>
                <FieldLabel>Review</FieldLabel>
                {isEditing ? (
                  <textarea
                    value={local.notes}
                    onChange={(e) => commitLocal({ notes: e.target.value })}
                    placeholder="Write your review of this book..."
                    rows={5}
                    className={inputClass}
                  />
                ) : (
                  <div className={classNames(readonlyClass, 'min-h-[80px] whitespace-pre-wrap')}>
                    {local.notes || <span className="text-ink-faint dark:text-paper/30">No review yet.</span>}
                  </div>
                )}
              </div>
            )}

            <div>
              {error && <p className="text-sm text-burgundy-500 mt-2">{error}</p>}
              {local.status === 'read' && local.dateFinished && (
                <p className="mt-1.5 text-[11px] text-ink-faint dark:text-paper/40">
                  Finished {formatDate(local.dateFinished)}
                </p>
              )}
            </div>

            {/* Literary Marginalia (Quotes & Passages) */}
            <div className="pt-3 border-t border-ink/10 dark:border-paper/10 space-y-3">
              <div className="flex items-center justify-between">
                <FieldLabel className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-brass-600 dark:text-brass-400">
                  <Quote size={14} className="text-brass-500" />
                  Marginalia & Key Quotes ({local.quotes?.length || 0})
                </FieldLabel>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddQuote(!showAddQuote)}
                  className="text-xs text-brass-600 dark:text-brass-400 hover:bg-brass-500/10"
                >
                  <Plus size={13} /> {showAddQuote ? 'Cancel' : 'Add Quote'}
                </Button>
              </div>

              {/* Add Quote Form */}
              {showAddQuote && (
                <div className="rounded-lg border border-brass-500/20 bg-brass-50/40 p-3 dark:border-brass-500/10 dark:bg-bgdark-soft/50 space-y-2.5">
                  <textarea
                    value={newQuoteText}
                    onChange={(e) => setNewQuoteText(e.target.value)}
                    placeholder="Enter memorable quote or passage..."
                    rows={2}
                    className={inputClass}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newQuotePage}
                      onChange={(e) => setNewQuotePage(e.target.value)}
                      placeholder="Page # (optional)"
                      className={inputClass}
                    />
                    <input
                      type="text"
                      value={newQuoteNote}
                      onChange={(e) => setNewQuoteNote(e.target.value)}
                      placeholder="Note / thought (optional)"
                      className={inputClass}
                    />
                  </div>
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleAddQuote}
                    disabled={!newQuoteText.trim()}
                    className="w-full bg-brass-500 text-bgdark hover:bg-brass-400"
                  >
                    Save Quote
                  </Button>
                </div>
              )}

              {/* Quotes Cards Grid */}
              {local.quotes && local.quotes.length > 0 ? (
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                  {local.quotes.map((q) => (
                    <div
                      key={q.id}
                      className="group relative rounded-lg border border-ink/5 bg-paper-soft/60 p-3 text-xs dark:border-paper/5 dark:bg-bgdark-soft/40 space-y-1"
                    >
                      <button
                        onClick={() => handleDeleteQuote(q.id)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 p-1 text-burgundy-500 hover:bg-burgundy-500/10 rounded transition-opacity"
                        title="Delete quote"
                      >
                        <Trash2 size={12} />
                      </button>
                      <p className="font-serif italic text-ink dark:text-paper leading-relaxed pr-6">
                        &ldquo;{q.quote}&rdquo;
                      </p>
                      <div className="flex items-center justify-between text-[10px] text-ink-faint dark:text-paper/40 font-mono pt-1">
                        {q.page ? <span>Page {q.page}</span> : <span />}
                        {q.note && <span className="font-sans italic text-brass-600 dark:text-brass-400">{q.note}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                !showAddQuote && (
                  <p className="text-xs text-ink-faint dark:text-paper/30 italic">
                    No quotes logged yet. Save your favorite lines here!
                  </p>
                )
              )}
            </div>
          </div>
        </div>

        {/* ── Footer ─────────────────────────────────────────────────────── */}
        <div className="mt-6 border-t border-ink/10 pt-4 dark:border-paper/10 space-y-3">

          {/* Row 1: Move / status buttons */}
          <div className="flex flex-wrap gap-2">
            {local.status !== 'on-shelf' && (
              <Button variant="secondary" size="sm" onClick={() => setPendingStatus('on-shelf')}>
                <BookMarked size={14} /> Move to On Shelf
              </Button>
            )}
            {local.status !== 'wishlist' && (
              <Button variant="secondary" size="sm" onClick={() => setPendingStatus('wishlist')}>
                <ShoppingBag size={14} /> Move to Hunt List
              </Button>
            )}
            {local.status !== 'reading' && (
              <Button variant="secondary" size="sm" onClick={() => setPendingStatus('reading')}>
                <BookOpen size={14} /> Mark as Reading
              </Button>
            )}
            {local.status !== 'read' && (
              <Button variant="secondary" size="sm" onClick={() => setPendingStatus('read')}>
                <CheckCircle2 size={14} /> Mark as Read
              </Button>
            )}
          </div>

          {/* Divider */}
          <div className="border-t border-ink/10 dark:border-paper/10" />

          {/* Row 2: Edit / Delete / Cancel / Save */}
          <div className="flex items-center justify-between gap-2">
            <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
              <Trash2 size={14} /> Delete
            </Button>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Button variant="secondary" size="sm" onClick={handleCancelEdit}>
                    <X size={14} /> Discard
                  </Button>
                  <Button variant="primary" size="sm" onClick={handleSave}>
                    Save changes
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="sm" onClick={onClose}>
                    Close
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="border-brass-400 text-brass-600 hover:bg-brass-50 dark:border-brass-400/40 dark:text-brass-300 dark:hover:bg-brass-400/10"
                  >
                    <Pencil size={14} /> Edit
                  </Button>
                </>
              )}
            </div>
          </div>
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
            handleSetStatusLocal(pendingStatus);
            setPendingStatus(null);
          }
        }}
        onCancel={() => setPendingStatus(null)}
      />
    </>
  );
}

function FieldLabel({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span className={classNames("mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-faint dark:text-paper/40", className)}>
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
  readOnly,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  disabled?: boolean;
  readOnly?: boolean;
}) {
  const ro = readOnly || disabled;
  return (
    <label className="block">
      <FieldLabel>{label}</FieldLabel>
      <input
        type={type}
        value={value}
        readOnly={ro}
        onChange={(e) => !ro && onChange(e.target.value)}
        className={classNames(
          ro
            ? 'w-full rounded-lg border border-transparent bg-ink/5 px-3 py-2 text-sm text-ink dark:bg-paper/5 dark:text-paper cursor-default select-text'
            : inputClass,
          disabled && !readOnly && 'opacity-50'
        )}
      />
    </label>
  );
}

/** Drag-to-reposition focal point overlay. Renders on top of the cover image. */
function FocalPointPicker({
  x,
  y,
  onChange,
}: {
  x: number;
  y: number;
  onChange: (x: number, y: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  const getPos = (clientX: number, clientY: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const nx = Math.round(Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100)));
    const ny = Math.round(Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100)));
    onChange(nx, ny);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    getPos(e.clientX, e.clientY);

    const onMove = (ev: MouseEvent) => { if (isDragging.current) getPos(ev.clientX, ev.clientY); };
    const onUp = () => { isDragging.current = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const t = e.touches[0];
    getPos(t.clientX, t.clientY);
  };
  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault();
    const t = e.touches[0];
    getPos(t.clientX, t.clientY);
  };

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      className="absolute inset-0 cursor-crosshair rounded-lg overflow-hidden"
      style={{ touchAction: 'none' }}
      title="Drag to set focal point"
    >
      {/* Dark vignette so the overlay is readable */}
      <div className="absolute inset-0 bg-ink/30 rounded-lg" />

      {/* Focal point crosshair */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${x}%`, top: `${y}%` }}
      >
        {/* Outer ring */}
        <div className="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center">
          {/* Inner dot */}
          <div className="w-1.5 h-1.5 rounded-full bg-white" />
        </div>
      </div>

      {/* Horizontal guide line */}
      <div
        className="absolute left-0 right-0 h-px bg-white/40 pointer-events-none"
        style={{ top: `${y}%` }}
      />
      {/* Vertical guide line */}
      <div
        className="absolute top-0 bottom-0 w-px bg-white/40 pointer-events-none"
        style={{ left: `${x}%` }}
      />

      {/* Label */}
      <div className="absolute bottom-2 left-0 right-0 flex justify-center pointer-events-none">
        <span className="rounded-full bg-ink/70 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur">
          Drag to reposition
        </span>
      </div>
    </div>
  );
}
