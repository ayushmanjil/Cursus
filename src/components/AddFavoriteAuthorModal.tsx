import { useState } from 'react';
import { X, UserPlus } from 'lucide-react';
import { Button } from './ui/Button';

interface AddFavoriteAuthorModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (authorData: { name: string; bio?: string; notes?: string }) => void;
  existingLibraryAuthors?: string[];
}

export function AddFavoriteAuthorModal({
  open,
  onClose,
  onAdd,
  existingLibraryAuthors = [],
}: AddFavoriteAuthorModalProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Author name is required');
      return;
    }

    onAdd({
      name: name.trim(),
      bio: bio.trim() || undefined,
      notes: notes.trim() || undefined,
    });

    setName('');
    setBio('');
    setNotes('');
    setError('');
    onClose();
  };

  const handleSelectQuickAuthor = (authorName: string) => {
    setName(authorName);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div
        className="w-full max-w-md overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-2xl dark:border-paper/10 dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 dark:border-paper/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-burgundy-500/10 text-burgundy-600 dark:bg-burgundy-500/20 dark:text-burgundy-400">
              <UserPlus size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink dark:text-paper">Add Favorite Author</h2>
              <p className="text-xs text-ink-muted dark:text-paper/50">Add an author to your collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/50 dark:hover:bg-paper/5 dark:hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {existingLibraryAuthors.length > 0 && !name && (
            <div className="rounded-xl border border-brass-500/20 bg-brass-50/50 p-3 dark:bg-brass-500/10">
              <p className="text-xs font-medium text-brass-700 dark:text-brass-300 mb-2">
                Authors from your library:
              </p>
              <div className="flex flex-wrap gap-1.5 max-h-24 overflow-y-auto pr-1">
                {existingLibraryAuthors.slice(0, 8).map((author) => (
                  <button
                    key={author}
                    type="button"
                    onClick={() => handleSelectQuickAuthor(author)}
                    className="rounded-full border border-brass-500/30 bg-surface px-2.5 py-0.5 text-[11px] font-medium text-ink transition-colors hover:border-brass-500 hover:bg-brass-100 dark:bg-surface-dark dark:text-paper dark:hover:bg-brass-500/20"
                  >
                    + {author}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Author Name <span className="text-burgundy-500">*</span>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Virginia Woolf, Haruki Murakami..."
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/30"
              autoFocus
            />
            {error && <p className="mt-1 text-xs text-burgundy-500">{error}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Bio / Known Works <span className="text-ink-faint text-[10px] font-normal lowercase">(optional)</span>
            </label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="e.g. Classic literature, magical realism..."
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Personal Note <span className="text-ink-faint text-[10px] font-normal lowercase">(optional)</span>
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              placeholder="Why you love this author..."
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/30 resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-ink/10 dark:border-paper/10">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Add Author
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
