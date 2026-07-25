import { useState, useRef, useEffect, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { CoverUpload } from './ui/CoverUpload';
import type { BookStatus } from '../types/book';
import type { NewBookInput } from '../hooks/useBooks';
import { STATUS_LABELS } from '../types/book';
import { Search, Sparkles, Loader2, BookOpen, Check, X, AlertCircle } from 'lucide-react';
import { classNames } from '../utils/helpers';

interface AddBookModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (input: NewBookInput) => void;
  defaultStatus?: BookStatus;
}

export interface BookSearchResult {
  id: string;
  title: string;
  author: string;
  genre?: string;
  totalPages?: number;
  coverUrl?: string;
  year?: string;
  source: 'openlibrary' | 'googlebooks';
}

const initialForm = (status: BookStatus = 'on-shelf'): NewBookInput => ({
  title: '',
  author: '',
  genre: '',
  coverUrl: '',
  notes: '',
  status,
});

async function fetchOnlineBooks(query: string): Promise<BookSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];
  const results: BookSearchResult[] = [];

  // Provider 1: Open Library (Reliable, no key limits)
  try {
    const olRes = await fetch(
      `https://openlibrary.org/search.json?q=${encodeURIComponent(trimmed)}&limit=6`
    );
    if (olRes.ok) {
      const olData = await olRes.json();
      if (Array.isArray(olData.docs)) {
        for (const doc of olData.docs) {
          if (!doc.title) continue;
          const coverUrl = doc.cover_i
            ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
            : doc.cover_edition_key
            ? `https://covers.openlibrary.org/b/olid/${doc.cover_edition_key}-M.jpg`
            : undefined;

          results.push({
            id: `ol-${doc.key || doc.cover_i || doc.title}-${Math.random()}`,
            title: doc.title,
            author: Array.isArray(doc.author_name) ? doc.author_name.join(', ') : doc.author_name || '',
            genre: Array.isArray(doc.subject) ? doc.subject[0] : undefined,
            totalPages: doc.number_of_pages_median || doc.number_of_pages,
            coverUrl,
            year: doc.first_publish_year ? String(doc.first_publish_year) : undefined,
            source: 'openlibrary',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Open Library search error:', err);
  }

  if (results.length > 0) {
    return results;
  }

  // Provider 2: Google Books API (Fallback)
  try {
    const gbRes = await fetch(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(trimmed)}&maxResults=6`
    );
    if (gbRes.ok) {
      const gbData = await gbRes.json();
      if (Array.isArray(gbData.items)) {
        for (const item of gbData.items) {
          const info = item.volumeInfo || {};
          if (!info.title) continue;
          const cover = (info.imageLinks?.thumbnail || info.imageLinks?.smallThumbnail || '').replace(
            /^http:\/\//i,
            'https://'
          );

          results.push({
            id: `gb-${item.id}`,
            title: info.title,
            author: Array.isArray(info.authors) ? info.authors.join(', ') : '',
            genre: Array.isArray(info.categories) ? info.categories[0] : undefined,
            totalPages: info.pageCount,
            coverUrl: cover || undefined,
            year: info.publishedDate ? info.publishedDate.slice(0, 4) : undefined,
            source: 'googlebooks',
          });
        }
      }
    }
  } catch (err) {
    console.warn('Google Books search error:', err);
  }

  return results;
}

export function AddBookModal({ open, onClose, onAdd, defaultStatus = 'on-shelf' }: AddBookModalProps) {
  const [form, setForm] = useState<NewBookInput>(initialForm(defaultStatus));
  const [error, setError] = useState('');

  // Online search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<BookSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [autofilledTitle, setAutofilledTitle] = useState<string | null>(null);

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Sync initial form status when modal opens or defaultStatus changes
  useEffect(() => {
    if (open) {
      setForm(initialForm(defaultStatus));
      setError('');
      setSearchQuery('');
      setSearchResults([]);
      setHasSearched(false);
      setShowDropdown(false);
      setAutofilledTitle(null);
    }
  }, [open, defaultStatus]);

  const executeSearch = useCallback(async (queryToSearch: string) => {
    const q = queryToSearch.trim();
    if (q.length < 2) return;

    setSearching(true);
    setHasSearched(true);
    setError('');

    const books = await fetchOnlineBooks(q);
    setSearchResults(books);
    setShowDropdown(true);
    setSearching(false);
  }, []);

  // Debounced auto-search on typing
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    const q = searchQuery.trim();
    if (q.length < 2) {
      setSearchResults([]);
      setHasSearched(false);
      setShowDropdown(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      executeSearch(q);
    }, 350);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [searchQuery, executeSearch]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        searchInputRef.current &&
        !searchInputRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectBook = useCallback((item: BookSearchResult) => {
    setForm((prev) => ({
      ...prev,
      title: item.title || prev.title,
      author: item.author || prev.author,
      genre: item.genre || prev.genre,
      totalPages: item.totalPages ?? prev.totalPages,
      coverUrl: item.coverUrl || prev.coverUrl,
    }));

    setAutofilledTitle(item.title);
    setShowDropdown(false);
    setSearchResults([]);
    setSearchQuery('');
  }, []);

  const [submitting, setSubmitting] = useState(false);

  const close = () => {
    setForm(initialForm(defaultStatus));
    setError('');
    setSearchQuery('');
    setSearchResults([]);
    setHasSearched(false);
    setShowDropdown(false);
    setAutofilledTitle(null);
    setSubmitting(false);
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.author.trim()) {
      setError('Title and author are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      await onAdd(form);
      close();
    } catch (err: any) {
      console.error('Failed to add book:', err);
      setError(err?.message || 'Failed to add book. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal open={open} onClose={close} title="Add a book">
      {/* Online Book Search Section */}
      <div className="mb-5 rounded-xl border border-brass-500/25 bg-brass-50/40 p-3.5 dark:border-brass-500/15 dark:bg-brass-500/5">
        <div className="mb-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-brass-700 dark:text-brass-400">
            <Sparkles size={14} className="text-brass-500" />
            Auto-fill with Online Search
          </label>
          {autofilledTitle && (
            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-forest-600 dark:text-forest-300">
              <Check size={12} /> Auto-filled
            </span>
          )}
        </div>
        <div className="relative">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={15}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brass-500 dark:text-brass-400"
              />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) setShowDropdown(true);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (searchQuery.trim().length >= 2) {
                      executeSearch(searchQuery);
                    }
                  }
                }}
                placeholder="Search by title or author (e.g. Atomic Habits)…"
                className="w-full rounded-lg border border-brass-500/20 bg-paper py-2 pl-9 pr-8 text-sm text-ink placeholder:text-ink-faint focus:border-brass-400 focus:outline-none focus:ring-2 focus:ring-brass-400/30 dark:border-paper/10 dark:bg-bgdark dark:text-paper dark:placeholder:text-paper/30"
              />
              {searching && (
                <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                  <Loader2 size={15} className="animate-spin text-brass-500" />
                </div>
              )}
              {searchQuery && !searching && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                    setHasSearched(false);
                    setShowDropdown(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-ink-faint hover:text-ink dark:text-paper/40 dark:hover:text-paper"
                  title="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
            <Button
              type="button"
              variant="primary"
              size="sm"
              onClick={() => executeSearch(searchQuery)}
              disabled={searchQuery.trim().length < 2 || searching}
            >
              {searching ? <Loader2 size={14} className="animate-spin" /> : <Search size={14} />}
              Search
            </Button>
          </div>

          {/* Search Results / Status Dropdown */}
          {showDropdown && (
            <div
              ref={dropdownRef}
              className="absolute left-0 right-0 top-full z-30 mt-1.5 max-h-72 overflow-y-auto rounded-lg border border-ink/10 bg-surface shadow-modal dark:border-paper/10 dark:bg-surface-dark"
            >
              {searching ? (
                <div className="flex items-center justify-center gap-2 p-4 text-xs text-ink-muted dark:text-paper/50">
                  <Loader2 size={15} className="animate-spin text-brass-500" />
                  Searching online book databases…
                </div>
              ) : searchResults.length > 0 ? (
                searchResults.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectBook(item)}
                    className="flex w-full items-center gap-3 border-b border-ink/5 p-2.5 text-left transition-colors hover:bg-brass-50/60 dark:border-paper/5 dark:hover:bg-brass-500/10 last:border-b-0"
                  >
                    {item.coverUrl ? (
                      <img
                        src={item.coverUrl}
                        alt={item.title}
                        className="h-12 w-8 shrink-0 rounded object-cover shadow-sm"
                        onError={(e) => {
                          // Hide image on broken URL
                          (e.target as HTMLElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex h-12 w-8 shrink-0 items-center justify-center rounded bg-brass-50 text-brass-600 dark:bg-brass-500/15 dark:text-brass-400">
                        <BookOpen size={16} />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-ink dark:text-paper">
                        {item.title}
                      </p>
                      <p className="truncate text-xs text-ink-muted dark:text-paper/60">
                        {item.author || 'Unknown author'}
                      </p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-2 text-[10px] text-ink-faint dark:text-paper/40">
                        {item.genre && <span>{item.genre}</span>}
                        {item.genre && (item.year || item.totalPages) && <span>•</span>}
                        {item.year && <span>{item.year}</span>}
                        {item.year && item.totalPages && <span>•</span>}
                        {item.totalPages && <span>{item.totalPages} pages</span>}
                      </div>
                    </div>
                  </button>
                ))
              ) : hasSearched ? (
                <div className="flex items-center gap-2 p-4 text-xs text-ink-muted dark:text-paper/50">
                  <AlertCircle size={15} className="shrink-0 text-brass-500" />
                  No books found for "{searchQuery}". You can enter the details manually below.
                </div>
              ) : null}
            </div>
          )}
        </div>
      </div>

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
          <Button type="button" variant="secondary" onClick={close} disabled={submitting}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" disabled={submitting}>
            {submitting ? <Loader2 size={15} className="animate-spin" /> : null}
            {submitting ? 'Adding...' : 'Add book'}
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
