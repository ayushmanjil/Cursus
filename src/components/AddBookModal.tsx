import { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { CoverUpload } from './ui/CoverUpload';
import type { BookStatus } from '../types/book';
import type { NewBookInput } from '../hooks/useBooks';
import { STATUS_LABELS } from '../types/book';

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: NewBookInput) => void;
  defaultStatus?: BookStatus;
}

const initialForm = (status: BookStatus = 'on-shelf'): NewBookInput => ({
  title: '',
  author: '',
  genre: '',
  coverUrl: '',
  notes: '',
  status,
});

export function AddBookModal({ open, onClose, onAdd, defaultStatus = 'on-shelf' }: AddBookModalProps) {
  const [form, setForm] = useState<NewBookInput>(initialForm(defaultStatus));
  const [error, setError] = useState('');

  const close = () => {
    setForm(initialForm(defaultStatus));
    setError('');
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError('Title and author are required.');
      return;
    }
    onAdd(form);
    close();
  };

  return (
    <Modal open={open} onClose={close} title="Add a book">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Field label="Title" required>
          <input
            autoFocus
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="The Night Circus"
            className={inputClass}
          />
        </Field>
        <Field label="Author" required>
          <input
            value={form.author}
            onChange={(e) => setForm({ ...form, author: e.target.value })}
            placeholder="Erin Morgenstern"
            className={inputClass}
          />
        </Field>
        <div className="grid grid-cols-3 gap-4">
          <Field label="Genre">
            <input
              value={form.genre}
              onChange={(e) => setForm({ ...form, genre: e.target.value })}
              placeholder="Fantasy"
              className={inputClass}
            />
          </Field>
          <Field label="Total pages" optionalHint="optional">
            <input
              type="number"
              min={1}
              step="1"
              value={form.totalPages ?? ''}
              onChange={(e) => {
                const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                setForm({ ...form, totalPages: isNaN(val) ? undefined : val });
              }}
              placeholder="320"
              className={inputClass}
            />
          </Field>
          <Field label="Initial status">
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value as BookStatus })}
              className={inputClass}
            >
              {(Object.keys(STATUS_LABELS) as BookStatus[]).map((s) => (
                <option key={s} value={s}>
                  {STATUS_LABELS[s]}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="Cover image" optionalHint="optional">
          <CoverUpload
            value={form.coverUrl ?? ''}
            onChange={(dataUrl) => setForm({ ...form, coverUrl: dataUrl })}
            heightClass="h-32"
          />
        </Field>
        {form.status === 'read' && (
          <Field label="Review" optionalHint="optional">
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              placeholder="Write your review of this book..."
              rows={3}
              className={inputClass}
            />
          </Field>
        )}

        {error && <p className="text-sm text-burgundy-500">{error}</p>}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="secondary" onClick={close}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Add book
          </Button>
        </div>
      </form>
    </Modal>
  );
}

const inputClass =
  'w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper dark:placeholder:text-paper/30';

function Field({
  label,
  required,
  optionalHint,
  children,
}: {
  label: string;
  required?: boolean;
  optionalHint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-ink-faint dark:text-paper/40">
        {label}
        {required && <span className="text-burgundy-500">*</span>}
        {optionalHint && <span className="font-normal normal-case text-ink-faint/70">({optionalHint})</span>}
      </span>
      {children}
    </label>
  );
}
