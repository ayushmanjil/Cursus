import { useState, useRef, useCallback, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  X,
  BookPlus,
  Check,
  Loader2,
  AlertCircle,
  Volume2,
  BookOpenText,
  Library,
  Sparkles,
} from 'lucide-react';
import { Button } from './ui/Button';
import { EmptyState } from './ui/EmptyState';
import { WordDetailModal } from './WordDetailModal';
import { WordOfTheDayView } from './WordOfTheDayView';
import BookLoader from './ui/BookLoader';
import type { DictionaryEntry, SavedWord } from '../types/dictionary';
import { classNames } from '../utils/helpers';
import { playPronunciation, getAudioUrlFromEntry } from '../utils/speech';
import { fetchWordDefinition, prefetchWordDefinition } from '../services/dictionaryService';

interface WordLibraryPageProps {
  savedWords: SavedWord[];
  addWord: (entries: DictionaryEntry[]) => Promise<void>;
  removeWord: (wordId: string) => Promise<void>;
  isWordSaved: (word: string) => boolean;
  addUserExample?: (wordId: string, sentence: string) => Promise<void>;
  removeUserExample?: (wordId: string, index: number) => Promise<void>;
  initialTab?: Tab;
  onTabChange?: (tab: Tab) => void;
}

type Tab = 'search' | 'wotd' | 'library';

// ─── Search Result Card ──────────────────────────────────────────
function SearchResultCard({
  entries,
  isSaved,
  onSave,
}: {
  entries: DictionaryEntry[];
  isSaved: boolean;
  onSave: () => void;
}) {
  const entry = entries[0];
  if (!entry) return null;

  const [playingAudio, setPlayingAudio] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const phoneticText = entry.phonetic || entry.phonetics?.find((p) => p.text)?.text;

  const handlePlayAudio = useCallback(() => {
    const audioUrl = getAudioUrlFromEntry(entry);
    playPronunciation(
      entry.word,
      audioUrl,
      () => setPlayingAudio(true),
      () => setPlayingAudio(false)
    );
  }, [entry]);

  const handleSave = () => {
    onSave();
    setJustSaved(true);
    setTimeout(() => setJustSaved(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className="rounded-xl2 border border-ink/10 bg-surface shadow-card dark:border-paper/10 dark:bg-surface-dark"
    >
      {/* Card header */}
      <div className="flex items-start justify-between gap-3 border-b border-ink/5 px-5 py-4 dark:border-paper/5">
        <div className="min-w-0 flex-1">
          <h3 className="font-display text-xl font-semibold text-ink dark:text-paper">
            {entry.word}
          </h3>
          {phoneticText && (
            <p className="mt-0.5 text-sm text-ink-muted dark:text-paper/50">{phoneticText}</p>
          )}
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handlePlayAudio}
            className={classNames(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors cursor-pointer',
              playingAudio
                ? 'bg-brass-500 text-white animate-pulse'
                : 'bg-brass-50 text-brass-600 hover:bg-brass-100 dark:bg-brass-500/15 dark:text-brass-400 dark:hover:bg-brass-500/25'
            )}
            title="Play pronunciation"
            aria-label="Play pronunciation"
          >
            <Volume2 size={15} />
          </button>
          {isSaved || justSaved ? (
            <Button variant="secondary" size="sm" disabled>
              <Check size={14} /> Saved
            </Button>
          ) : (
            <Button variant="primary" size="sm" onClick={handleSave}>
              <BookPlus size={14} /> Add to Library
            </Button>
          )}
        </div>
      </div>

      {/* Meanings */}
      <div className="space-y-4 px-5 py-4">
        {entry.meanings.map((meaning, mi) => (
          <div key={mi} className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brass-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
                {meaning.partOfSpeech}
              </span>
              <div className="flex-1 border-b border-ink/5 dark:border-paper/5" />
            </div>

            <ol className="list-decimal space-y-2 pl-5 marker:text-brass-400 dark:marker:text-brass-500/60">
              {meaning.definitions.slice(0, 5).map((def, di) => (
                <li key={di} className="text-sm text-ink dark:text-paper/90 pl-1">
                  <p>{def.definition}</p>
                  {def.example && (
                    <p className="mt-0.5 text-xs italic text-ink-muted dark:text-paper/50">
                      "{def.example}"
                    </p>
                  )}
                  {def.synonyms.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-forest-500 dark:text-forest-300 font-semibold mr-0.5 self-center">
                        syn
                      </span>
                      {def.synonyms.slice(0, 6).map((s) => (
                        <span
                          key={s}
                          className="inline-flex rounded-full border border-forest-300/30 bg-forest-50/50 px-2 py-0.5 text-[11px] text-forest-600 dark:border-forest-400/20 dark:bg-forest-500/10 dark:text-forest-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {def.antonyms.length > 0 && (
                    <div className="mt-1 flex flex-wrap gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-burgundy-500 dark:text-burgundy-300 font-semibold mr-0.5 self-center">
                        ant
                      </span>
                      {def.antonyms.slice(0, 6).map((a) => (
                        <span
                          key={a}
                          className="inline-flex rounded-full border border-burgundy-300/30 bg-burgundy-50/50 px-2 py-0.5 text-[11px] text-burgundy-600 dark:border-burgundy-400/20 dark:bg-burgundy-500/10 dark:text-burgundy-300"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>

            {meaning.synonyms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] uppercase tracking-wider text-forest-500 dark:text-forest-300 font-semibold">
                  Synonyms
                </span>
                {meaning.synonyms.slice(0, 8).map((s) => (
                  <span
                    key={s}
                    className="inline-flex rounded-full border border-forest-300/30 bg-forest-50/50 px-2 py-0.5 text-[11px] text-forest-600 dark:border-forest-400/20 dark:bg-forest-500/10 dark:text-forest-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {meaning.antonyms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 pt-1">
                <span className="text-[10px] uppercase tracking-wider text-burgundy-500 dark:text-burgundy-300 font-semibold">
                  Antonyms
                </span>
                {meaning.antonyms.slice(0, 8).map((a) => (
                  <span
                    key={a}
                    className="inline-flex rounded-full border border-burgundy-300/30 bg-burgundy-50/50 px-2 py-0.5 text-[11px] text-burgundy-600 dark:border-burgundy-400/20 dark:bg-burgundy-500/10 dark:text-burgundy-300"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Source URLs */}
      {entry.sourceUrls && entry.sourceUrls.length > 0 && (
        <div className="border-t border-ink/5 px-5 py-3 dark:border-paper/5">
          {entry.sourceUrls.map((url) => (
            <a
              key={url}
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-brass-500 hover:text-brass-600 dark:text-brass-400 dark:hover:text-brass-300 underline underline-offset-2 break-all"
            >
              {url}
            </a>
          ))}
        </div>
      )}
    </motion.div>
  );
}

// ─── Saved Word Card (library grid) ──────────────────────────────
function SavedWordCard({
  word,
  onClick,
}: {
  word: SavedWord;
  onClick: () => void;
}) {
  const [playingAudio, setPlayingAudio] = useState(false);
  const entry = word.entries[0];
  if (!entry) return null;

  const phoneticText = entry.phonetic || entry.phonetics?.find((p) => p.text)?.text;
  const firstDef = entry.meanings[0]?.definitions[0]?.definition;
  const partOfSpeech = entry.meanings[0]?.partOfSpeech;

  const handlePlayAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    const audioUrl = getAudioUrlFromEntry(entry);
    playPronunciation(
      entry.word,
      audioUrl,
      () => setPlayingAudio(true),
      () => setPlayingAudio(false)
    );
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onClick={onClick}
      className="group flex flex-col items-start rounded-xl2 border border-ink/10 bg-surface p-4 text-left shadow-card transition-shadow hover:shadow-cardHover dark:border-paper/10 dark:bg-surface-dark focus:outline-none focus-visible:ring-2 focus-visible:ring-brass-400 cursor-pointer w-full"
    >
      <div className="flex w-full items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <h4 className="font-display text-base font-semibold text-ink dark:text-paper group-hover:text-brass-600 dark:group-hover:text-brass-400 transition-colors truncate">
            {entry.word}
          </h4>
          <button
            type="button"
            onClick={handlePlayAudio}
            className={classNames(
              'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer',
              playingAudio
                ? 'bg-brass-500 text-white animate-pulse'
                : 'bg-brass-50 text-brass-600 hover:bg-brass-100 dark:bg-brass-500/15 dark:text-brass-400 dark:hover:bg-brass-500/25'
            )}
            title="Play pronunciation"
            aria-label="Play pronunciation"
          >
            <Volume2 size={13} />
          </button>
        </div>
        {partOfSpeech && (
          <span className="shrink-0 inline-flex items-center rounded-full bg-brass-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
            {partOfSpeech}
          </span>
        )}
      </div>
      {phoneticText && (
        <p className="mt-0.5 text-xs text-ink-muted dark:text-paper/50">{phoneticText}</p>
      )}
      {firstDef && (
        <p className="mt-2 text-sm text-ink-muted dark:text-paper/60 line-clamp-2">{firstDef}</p>
      )}
      {word.userExamples && word.userExamples.length > 0 && (
        <div className="mt-2.5 space-y-0.5 border-t border-ink/5 pt-2 w-full dark:border-paper/5">
          {word.userExamples.slice(0, 2).map((ex, i) => (
            <p key={i} className="text-xs italic text-ink-muted dark:text-paper/50 line-clamp-1">
              "{ex}"
            </p>
          ))}
          {word.userExamples.length > 2 && (
            <p className="text-[10px] font-semibold text-brass-600 dark:text-brass-400 pt-0.5">
              +{word.userExamples.length - 2} more example{word.userExamples.length - 2 > 1 ? 's' : ''}
            </p>
          )}
        </div>
      )}
    </motion.div>
  );
}

// ─── Main Page ───────────────────────────────────────────────────
export function WordLibraryPage({
  savedWords,
  addWord,
  removeWord,
  isWordSaved,
  addUserExample,
  removeUserExample,
  initialTab = 'search',
  onTabChange,
}: WordLibraryPageProps) {
  const [activeTab, setActiveTab] = useState<Tab>(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const tabFromUrl = urlParams.get('tab') as Tab | null;
    if (tabFromUrl && ['search', 'wotd', 'library'].includes(tabFromUrl)) {
      return tabFromUrl;
    }
    return initialTab;
  });

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleTabChange = (key: Tab) => {
    setActiveTab(key);
    onTabChange?.(key);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', key);
    window.history.replaceState(window.history.state, '', url.toString());
  };

  // Search state
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<DictionaryEntry[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Autocomplete state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [highlightIndex, setHighlightIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const suggestionsRef = useRef<HTMLUListElement>(null);
  const lastSearchedWordRef = useRef<string | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Fetch suggestions from Datamuse as user types
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    const trimmed = query.trim();
    if (
      trimmed.length < 2 ||
      trimmed.toLowerCase() === lastSearchedWordRef.current?.toLowerCase()
    ) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.datamuse.com/sug?s=${encodeURIComponent(trimmed)}&max=8`,
          { signal: abortController.signal }
        );
        if (res.ok) {
          const data: { word: string; score: number }[] = await res.json();
          const words = data.map((d) => d.word);
          if (trimmed.toLowerCase() !== lastSearchedWordRef.current?.toLowerCase()) {
            setSuggestions(words);
            setShowSuggestions(words.length > 0);
            setHighlightIndex(-1);
            if (words.length > 0) {
              prefetchWordDefinition(words[0]);
            }
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          // Silently fail — suggestions are non-critical
        }
      }
    }, 160);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      abortController.abort();
    };
  }, [query]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Library filter
  const [libraryFilter, setLibraryFilter] = useState('');

  // Detail modal
  const [detailWord, setDetailWord] = useState<SavedWord | null>(null);

  const handleSearch = useCallback(async (wordOverride?: string) => {
    const trimmed = (wordOverride ?? query).trim();
    if (!trimmed) return;

    lastSearchedWordRef.current = trimmed;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (abortControllerRef.current) abortControllerRef.current.abort();

    setShowSuggestions(false);
    setSuggestions([]);
    setError(null);

    // Instant local hit if word is already saved in user's library
    const existing = savedWords.find((w) => w.id.toLowerCase() === trimmed.toLowerCase());
    if (existing && existing.entries.length > 0) {
      setSearchResult(existing.entries);
      setLoading(false);
      return;
    }

    setLoading(true);
    setSearchResult(null);

    try {
      const data = await fetchWordDefinition(trimmed);
      setSearchResult(data);
    } catch (err: any) {
      if (err.message === 'NOT_FOUND') {
        setError(`No definitions found for "${trimmed}". Check your spelling and try again.`);
      } else {
        setError('Something went wrong while fetching the definition. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, [query, savedWords]);

  const handleSelectSuggestion = useCallback(
    (word: string) => {
      lastSearchedWordRef.current = word;
      if (debounceRef.current) clearTimeout(debounceRef.current);
      if (abortControllerRef.current) abortControllerRef.current.abort();
      setQuery(word);
      setShowSuggestions(false);
      setSuggestions([]);
      handleSearch(word);
    },
    [handleSearch]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showSuggestions && suggestions.length > 0) {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev < suggestions.length - 1 ? prev + 1 : 0;
          if (suggestions[next]) prefetchWordDefinition(suggestions[next]);
          return next;
        });
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setHighlightIndex((prev) => {
          const next = prev > 0 ? prev - 1 : suggestions.length - 1;
          if (suggestions[next]) prefetchWordDefinition(suggestions[next]);
          return next;
        });
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (highlightIndex >= 0 && highlightIndex < suggestions.length) {
          handleSelectSuggestion(suggestions[highlightIndex]);
        } else {
          handleSearch();
        }
      } else if (e.key === 'Escape') {
        setShowSuggestions(false);
      }
    } else if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Filtered + sorted saved words
  const filteredWords = useMemo(() => {
    let list = [...savedWords];
    if (libraryFilter.trim()) {
      const q = libraryFilter.trim().toLowerCase();
      list = list.filter((w) => {
        const entry = w.entries[0];
        if (!entry) return false;
        return (
          entry.word.toLowerCase().includes(q) ||
          entry.meanings.some((m) =>
            m.definitions.some((d) => d.definition.toLowerCase().includes(q))
          )
        );
      });
    }
    list.sort((a, b) => a.id.localeCompare(b.id));
    return list;
  }, [savedWords, libraryFilter]);

  const tabs: { key: Tab; label: string; icon: React.ElementType }[] = [
    { key: 'search', label: 'Search', icon: Search },
    { key: 'wotd',    label: 'Word of the Day', icon: Sparkles },
    { key: 'library', label: `My Library (${savedWords.length})`, icon: Library },
  ];

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {/* Tabs */}
      <div className="flex items-center gap-1 rounded-lg bg-paper-soft/60 p-1 dark:bg-bgdark-soft/60" role="tablist">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              role="tab"
              aria-selected={isActive}
              onClick={() => handleTabChange(tab.key)}
              className={classNames(
                'flex flex-1 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
                  : 'text-ink-muted hover:text-ink dark:text-paper/50 dark:hover:text-paper/80'
              )}
            >
              <Icon size={15} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Word of the Day Tab */}
      {activeTab === 'wotd' && (
        <WordOfTheDayView
          isWordSaved={isWordSaved}
          addWord={addWord}
        />
      )}

      {/* Search Tab */}
      {activeTab === 'search' && (
        <div className="space-y-5">
          {/* Search input with autocomplete */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brass-500 dark:text-brass-400"
              />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.trim().toLowerCase() !== lastSearchedWordRef.current?.toLowerCase()) {
                    lastSearchedWordRef.current = null;
                  }
                  setQuery(val);
                  if (!val.trim()) {
                    setShowSuggestions(false);
                    setSuggestions([]);
                  }
                }}
                onFocus={() => {
                  if (
                    suggestions.length > 0 &&
                    query.trim().length >= 2 &&
                    query.trim().toLowerCase() !== lastSearchedWordRef.current?.toLowerCase()
                  ) {
                    setShowSuggestions(true);
                  }
                }}
                onKeyDown={handleKeyDown}
                placeholder="Search for an English word…"
                className="w-full rounded-lg border border-brass-500/20 bg-paper-soft/40 py-2.5 pl-9 pr-9 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400/30 focus:border-brass-400 focus:bg-paper focus:shadow-[0_0_12px_rgba(184,134,63,0.1)] dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-paper dark:placeholder:text-paper/30 dark:focus:bg-bgdark transition-all duration-200"
                role="combobox"
                aria-label="Search for a word"
                aria-expanded={showSuggestions}
                aria-autocomplete="list"
                aria-controls="word-suggestions"
                aria-activedescendant={highlightIndex >= 0 ? `suggestion-${highlightIndex}` : undefined}
                autoComplete="off"
              />
              {query && (
                <button
                  onClick={() => {
                    lastSearchedWordRef.current = null;
                    if (debounceRef.current) clearTimeout(debounceRef.current);
                    if (abortControllerRef.current) abortControllerRef.current.abort();
                    setQuery('');
                    setSearchResult(null);
                    setError(null);
                    setSuggestions([]);
                    setShowSuggestions(false);
                    inputRef.current?.focus();
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-brass-500 hover:bg-brass-500/10 hover:text-brass-600 dark:text-brass-400 dark:hover:bg-brass-500/20 dark:hover:text-brass-300 transition-colors"
                  title="Clear search"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}

              {/* Autocomplete dropdown */}
              <AnimatePresence>
                {showSuggestions && suggestions.length > 0 && (
                  <motion.ul
                    ref={suggestionsRef}
                    id="word-suggestions"
                    role="listbox"
                    initial={{ opacity: 0, y: -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -4 }}
                    transition={{ duration: 0.15 }}
                    className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-lg border border-ink/10 bg-surface shadow-card dark:border-paper/10 dark:bg-surface-dark"
                  >
                    {suggestions.map((word, i) => (
                      <li
                        key={word}
                        id={`suggestion-${i}`}
                        role="option"
                        aria-selected={i === highlightIndex}
                        onMouseEnter={() => {
                          setHighlightIndex(i);
                          prefetchWordDefinition(word);
                        }}
                        onClick={() => handleSelectSuggestion(word)}
                        className={classNames(
                          'flex cursor-pointer items-center gap-2.5 px-3 py-2 text-sm transition-colors',
                          i === highlightIndex
                            ? 'bg-brass-50 text-ink dark:bg-brass-500/15 dark:text-paper'
                            : 'text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/5'
                        )}
                      >
                        <Search size={13} className="shrink-0 text-brass-400 dark:text-brass-500/60" />
                        <span>{word}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => handleSearch()}
              disabled={!query.trim() || loading}
            >
              {loading ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />}
              Search
            </Button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-16">
              <BookLoader size="md" color="brown" />
              <p className="mt-3 text-sm text-ink-muted dark:text-paper/50">Looking up "{query}"…</p>
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-start gap-3 rounded-xl2 border border-burgundy-300/30 bg-burgundy-50/50 px-5 py-4 dark:border-burgundy-500/20 dark:bg-burgundy-500/10"
            >
              <AlertCircle size={18} className="mt-0.5 shrink-0 text-burgundy-500 dark:text-burgundy-300" />
              <p className="text-sm text-burgundy-600 dark:text-burgundy-300">{error}</p>
            </motion.div>
          )}

          {/* Result */}
          {searchResult && !loading && (
            <SearchResultCard
              entries={searchResult}
              isSaved={isWordSaved(searchResult[0]?.word ?? '')}
              onSave={() => addWord(searchResult)}
            />
          )}

          {/* Initial state hint */}
          {!searchResult && !loading && !error && (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-brass-50 dark:bg-brass-500/10">
                <BookOpenText size={26} className="text-brass-500 dark:text-brass-400" />
              </div>
              <h3 className="font-display text-lg font-medium text-ink dark:text-paper">
                Search for a word
              </h3>
              <p className="mt-1.5 max-w-xs text-sm text-ink-muted dark:text-paper/50">
                Look up definitions, phonetics, synonyms, and more. Save words to your personal library for later.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Library Tab */}
      {activeTab === 'library' && (
        <div className="space-y-4">
          {/* Filter input */}
          {savedWords.length > 0 && (
            <div className="relative">
              <Search
                size={16}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-brass-500 dark:text-brass-400"
              />
              <input
                value={libraryFilter}
                onChange={(e) => setLibraryFilter(e.target.value)}
                placeholder="Filter saved words…"
                className="w-full rounded-lg border border-brass-500/20 bg-paper-soft/40 py-2 pl-9 pr-9 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400/30 focus:border-brass-400 focus:bg-paper focus:shadow-[0_0_12px_rgba(184,134,63,0.1)] dark:border-brass-500/10 dark:bg-bgdark-soft/40 dark:text-paper dark:placeholder:text-paper/30 dark:focus:bg-bgdark transition-all duration-200"
                aria-label="Filter saved words"
              />
              {libraryFilter && (
                <button
                  onClick={() => setLibraryFilter('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-brass-500 hover:bg-brass-500/10 hover:text-brass-600 dark:text-brass-400 dark:hover:bg-brass-500/20 dark:hover:text-brass-300 transition-colors"
                  title="Clear filter"
                >
                  <X size={14} strokeWidth={2.5} />
                </button>
              )}
            </div>
          )}

          {/* Grid of saved words */}
          {filteredWords.length > 0 ? (
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <AnimatePresence mode="popLayout">
                {filteredWords.map((w) => (
                  <SavedWordCard key={w.id} word={w} onClick={() => setDetailWord(w)} />
                ))}
              </AnimatePresence>
            </div>
          ) : savedWords.length === 0 ? (
            <EmptyState
              icon={BookOpenText}
              title="No saved words yet"
              description="Search for words and add them to your library to review later."
              action={
                <Button variant="primary" size="sm" onClick={() => setActiveTab('search')}>
                  <Search size={14} /> Search Words
                </Button>
              }
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <p className="text-sm text-ink-muted dark:text-paper/50">
                No saved words match "{libraryFilter}".
              </p>
            </div>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {detailWord && (
        <WordDetailModal
          word={savedWords.find((w) => w.id === detailWord.id) || detailWord}
          onClose={() => setDetailWord(null)}
          onRemove={removeWord}
          onAddExample={addUserExample}
          onRemoveExample={removeUserExample}
        />
      )}
    </div>
  );
}
