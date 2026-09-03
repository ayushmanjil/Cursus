/**
 * WordOfTheDayView.tsx
 *
 * The Word of the Day tab view inside Word Library.
 *  - Displays the curated, literary Word of the Day for the current calendar date in a clean, minimalist card.
 *  - 100% offline-first: backed by 1,000 vetted literary, poetic, and emotion-defining vocabulary words.
 *  - Calendar navigation: browse previous days' words or return to today.
 *  - Quick "Add to Library" saving directly from the card into the user's Word Library.
 */

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
} from 'lucide-react';
import { WordOfTheDayCard } from './WordOfTheDayCard';
import BookLoader from './ui/BookLoader';
import {
  fetchWordOfTheDay,
  useMidnightRefresh,
  todayKey,
  clearCacheForDate,
} from '../services/wordOfTheDayService';
import type { WordOfTheDay } from '../types/wordOfTheDay';
import type { DictionaryEntry } from '../types/dictionary';

// ─── Props ────────────────────────────────────────────────────────────────────
interface WordOfTheDayViewProps {
  isWordSaved: (word: string) => boolean;
  addWord: (entries: DictionaryEntry[]) => Promise<void>;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
function shiftDate(dateStr: string, delta: number): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(y, m - 1, d);
  dt.setDate(dt.getDate() + delta);
  const ny = dt.getFullYear();
  const nm = String(dt.getMonth() + 1).padStart(2, '0');
  const nd = String(dt.getDate()).padStart(2, '0');
  return `${ny}-${nm}-${nd}`;
}

export function WordOfTheDayView({ isWordSaved, addWord }: WordOfTheDayViewProps) {
  // ── State ──────────────────────────────────────────────────────────────────
  const [wotd, setWotd] = useState<WordOfTheDay | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [viewDate, setViewDate] = useState<string>(todayKey());

  // ── Fetch / Read Cache ─────────────────────────────────────────────────────
  const load = useCallback(async (dateStr: string) => {
    setLoading(true);
    setError(null);

    try {
      const data = await fetchWordOfTheDay(dateStr);
      setWotd(data);
    } catch {
      setError('Could not load the Word of the Day.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load(viewDate);
  }, [viewDate, load]);

  // ── Midnight auto-refresh ──────────────────────────────────────────────────
  const handleNewDay = useCallback(() => {
    const today = todayKey();
    setViewDate(today);
    load(today);
  }, [load]);

  useMidnightRefresh(handleNewDay);

  // ── Date navigation ────────────────────────────────────────────────────────
  const today = todayKey();
  const canGoNext = viewDate < today;

  function handlePrev() { setViewDate((d) => shiftDate(d, -1)); }
  function handleNext() { if (canGoNext) setViewDate((d) => shiftDate(d, 1)); }
  function handleToday() { setViewDate(today); }

  // ── Add to Library ─────────────────────────────────────────────────────────
  async function handleAddToLibrary() {
    if (!wotd) return;
    const entry: DictionaryEntry = {
      word: wotd.word,
      phonetic: wotd.phonetic,
      phonetics: wotd.audioUrl
        ? [{ text: wotd.phonetic, audio: wotd.audioUrl }]
        : [{ text: wotd.phonetic }],
      meanings: wotd.meanings && wotd.meanings.length > 0
        ? wotd.meanings
        : [
            {
              partOfSpeech: wotd.partOfSpeech || 'word',
              definitions: [
                {
                  definition: wotd.definition,
                  example: wotd.example || undefined,
                  synonyms: wotd.synonyms || [],
                  antonyms: wotd.antonyms || [],
                },
              ],
              synonyms: wotd.synonyms || [],
              antonyms: wotd.antonyms || [],
            },
          ],
      sourceUrls: wotd.sourceUrl ? [wotd.sourceUrl] : undefined,
    };
    await addWord([entry]);
  }

  // ── Manual refresh ─────────────────────────────────────────────────────────
  function handleManualRefresh() {
    clearCacheForDate(viewDate);
    load(viewDate);
  }

  return (
    <div className="space-y-6">
      {/* ── Top Toolbar row ──────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Date navigation */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={handlePrev}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-soft text-ink-muted hover:bg-brass-50 hover:text-brass-600 dark:bg-bgdark-soft dark:text-paper/50 dark:hover:bg-brass-500/15 dark:hover:text-brass-400 transition-colors"
            title="Previous day"
            aria-label="Previous day"
          >
            <ChevronLeft size={15} />
          </button>
          {viewDate !== today && (
            <button
              onClick={handleToday}
              className="h-7 rounded-full bg-brass-50 px-3 text-xs font-medium text-brass-600 hover:bg-brass-100 dark:bg-brass-500/15 dark:text-brass-400 dark:hover:bg-brass-500/25 transition-colors"
            >
              Today
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canGoNext}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-soft text-ink-muted hover:bg-brass-50 hover:text-brass-600 disabled:opacity-40 disabled:pointer-events-none dark:bg-bgdark-soft dark:text-paper/50 dark:hover:bg-brass-500/15 dark:hover:text-brass-400 transition-colors"
            title="Next day"
            aria-label="Next day"
          >
            <ChevronRight size={15} />
          </button>
        </div>

        {/* Right side: Refresh button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            disabled={loading}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-paper-soft text-ink-muted hover:bg-brass-50 hover:text-brass-600 disabled:opacity-40 dark:bg-bgdark-soft dark:text-paper/50 dark:hover:bg-brass-500/15 dark:hover:text-brass-400 transition-colors cursor-pointer shadow-2xs"
            title="Refresh word"
            aria-label="Refresh word"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>

      {/* ── Loading state ─────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <BookLoader size="md" color="brown" />
            <p className="mt-3 text-sm text-ink-muted dark:text-paper/50">
              Checking today's word…
            </p>
          </motion.div>
        )}

        {/* ── Error state ─────────────────────────────────────────────── */}
        {error && !loading && (
          <motion.div
            key="error"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-burgundy-300/30 bg-burgundy-50/50 px-5 py-4 dark:border-burgundy-500/20 dark:bg-burgundy-500/10"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-burgundy-500 dark:text-burgundy-300" />
            <div className="flex-1">
              <p className="text-sm text-burgundy-600 dark:text-burgundy-300">{error}</p>
              <button
                onClick={handleManualRefresh}
                className="mt-2 text-xs font-medium text-burgundy-500 underline hover:text-burgundy-700 dark:text-burgundy-400"
              >
                Try again
              </button>
            </div>
          </motion.div>
        )}

        {/* ── Main Redesigned Card ─────────────────────────────────────── */}
        {wotd && !loading && !error && (
          <motion.div
            key={wotd.rawDate + wotd.word}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="mx-auto w-full max-w-2xl"
          >
            <WordOfTheDayCard
              word={wotd}
              isSaved={isWordSaved(wotd.word)}
              onSave={handleAddToLibrary}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
