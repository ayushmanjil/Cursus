import { useState } from 'react';
import { X, Plus, ScrollText, Heart, Bookmark, CheckCircle2 } from 'lucide-react';
import { Button } from './ui/Button';
import type { Poem } from '../types/poem';
import { getPoemId } from '../services/poetryService';

interface AddPoemModalProps {
  open: boolean;
  onClose: () => void;
  onAddPoem: (poem: Poem, options: { saveForLater: boolean; favorite: boolean; markRead: boolean }) => void;
}

export function AddPoemModal({ open, onClose, onAddPoem }: AddPoemModalProps) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [linesText, setLinesText] = useState('');
  const [saveForLater, setSaveForLater] = useState(true);
  const [favorite, setFavorite] = useState(false);
  const [markRead, setMarkRead] = useState(false);
  const [error, setError] = useState('');

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Poem title is required');
      return;
    }
    if (!author.trim()) {
      setError('Poet / Author name is required');
      return;
    }
    if (!linesText.trim()) {
      setError('Please enter poem verses');
      return;
    }
    if (!saveForLater && !favorite && !markRead) {
      setError('Please select at least one destination (Saved, Favorites, or Read)');
      return;
    }

    const lines = linesText
      .split('\n')
      .map((l) => l.trimRight());

    const linecount = lines.filter((l) => l.trim().length > 0).length;

    const newPoem: Poem = {
      id: getPoemId(author, title) + '_' + Date.now(),
      title: title.trim(),
      author: author.trim(),
      lines,
      linecount,
    };

    onAddPoem(newPoem, { saveForLater, favorite, markRead });

    // Reset fields
    setTitle('');
    setAuthor('');
    setLinesText('');
    setSaveForLater(true);
    setFavorite(false);
    setMarkRead(false);
    setError('');
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg overflow-hidden rounded-2xl border border-ink/10 bg-surface shadow-2xl dark:border-paper/10 dark:bg-surface-dark"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-4 dark:border-paper/10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brass-500/10 text-brass-600 dark:bg-brass-500/20 dark:text-brass-400">
              <ScrollText size={18} />
            </div>
            <div>
              <h2 className="font-display text-lg font-bold text-ink dark:text-paper">Add Custom Poem</h2>
              <p className="text-xs text-ink-muted dark:text-paper/50">Add a poem to your collection</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/50 dark:hover:bg-paper/5 dark:hover:text-paper"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[78vh] overflow-y-auto scrollbar-thin">
          {error && (
            <div className="rounded-xl border border-burgundy-500/20 bg-burgundy-50/50 p-3 text-xs text-burgundy-600 dark:bg-burgundy-500/10 dark:text-burgundy-300">
              {error}
            </div>
          )}

          {/* Poem Title */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Poem Title <span className="text-burgundy-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Hope is the thing with feathers, The Road Not Taken..."
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/30"
              autoFocus
            />
          </div>

          {/* Poet / Author Name */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Poet / Author Name <span className="text-burgundy-500">*</span>
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => {
                setAuthor(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. Emily Dickinson, Robert Frost, Maya Angelou..."
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-faint focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/30"
            />
          </div>

          {/* Poem Lines / Verses */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Poem Lines / Verses <span className="text-burgundy-500">*</span>
            </label>
            <textarea
              value={linesText}
              onChange={(e) => {
                setLinesText(e.target.value);
                if (error) setError('');
              }}
              rows={6}
              placeholder="Enter poem verses here...&#10;Line 1&#10;Line 2&#10;&#10;Stanza 2 line 1..."
              className="w-full rounded-xl border border-ink/15 bg-paper-soft/40 px-3.5 py-2.5 text-sm font-serif text-ink placeholder:text-ink-faint placeholder:font-sans focus:border-brass-500 focus:outline-none dark:border-paper/15 dark:bg-bgdark-soft/50 dark:text-paper dark:placeholder:text-paper/30 resize-y"
            />
          </div>

          {/* Destination Checkboxes */}
          <div className="pt-2 border-t border-ink/10 dark:border-paper/10 space-y-2">
            <label className="block text-xs font-semibold uppercase tracking-wider text-ink-muted dark:text-paper/60 mb-1">
              Add Poem To:
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSaveForLater(!saveForLater)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 font-medium text-xs transition-all duration-200 cursor-pointer ${
                  saveForLater
                    ? 'border-brass-500 bg-brass-500/15 text-brass-800 dark:text-brass-300 font-semibold shadow-xs'
                    : 'border-ink/10 bg-paper-soft/30 text-ink-muted hover:border-ink/20 dark:border-paper/10 dark:bg-bgdark-soft/30 dark:text-paper/60'
                }`}
              >
                <Bookmark size={14} className={saveForLater ? 'fill-current text-brass-600 dark:text-brass-400' : ''} />
                <span>Save for Later</span>
              </button>

              <button
                type="button"
                onClick={() => setFavorite(!favorite)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 font-medium text-xs transition-all duration-200 cursor-pointer ${
                  favorite
                    ? 'border-burgundy-500 bg-burgundy-500/15 text-burgundy-800 dark:text-burgundy-300 font-semibold shadow-xs'
                    : 'border-ink/10 bg-paper-soft/30 text-ink-muted hover:border-ink/20 dark:border-paper/10 dark:bg-bgdark-soft/30 dark:text-paper/60'
                }`}
              >
                <Heart size={14} className={favorite ? 'fill-current text-burgundy-600 dark:text-burgundy-400' : ''} />
                <span>Favorites</span>
              </button>

              <button
                type="button"
                onClick={() => setMarkRead(!markRead)}
                className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 font-medium text-xs transition-all duration-200 cursor-pointer ${
                  markRead
                    ? 'border-forest-500 bg-forest-500/15 text-forest-800 dark:text-forest-300 font-semibold shadow-xs'
                    : 'border-ink/10 bg-paper-soft/30 text-ink-muted hover:border-ink/20 dark:border-paper/10 dark:bg-bgdark-soft/30 dark:text-paper/60'
                }`}
              >
                <CheckCircle2 size={14} className={markRead ? 'text-forest-600 dark:text-forest-400' : ''} />
                <span>Mark as Read</span>
              </button>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-ink/10 dark:border-paper/10">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              <Plus size={14} /> Add Poem
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
