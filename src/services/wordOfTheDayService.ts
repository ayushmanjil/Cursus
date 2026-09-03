/**
 * wordOfTheDayService.ts
 *
 * Fetches the Wordnik Word of the Day, normalises it into a clean WordOfTheDay
 * object, enriches it with phonetics/audio from dictionaryapi.dev, and manages
 * a day-keyed localStorage cache so the API is never hit more than once per day.
 *
 * Provides the `useMidnightRefresh` hook for auto-refresh when the calendar date
 * changes while the page is open (midnight timer + visibilitychange fallback).
 */

import { useEffect, useRef, useCallback } from 'react';
import type { WordnikWotdResponse, WordOfTheDay } from '../types/wordOfTheDay';
import { CURATED_WORDS } from '../data/curatedWords';

// ─── Constants ────────────────────────────────────────────────────────────────
const CACHE_PREFIX = 'cursus-wotd-';
const API_KEY_STORAGE = 'cursus-wordnik-api-key';

/** Wordnik API key: prefer .env var first, then localStorage. */
function getWordnikApiKey(): string {
  return (
    import.meta.env.VITE_WORDNIK_API_KEY ||
    localStorage.getItem(API_KEY_STORAGE) ||
    ''
  );
}

export function saveWordnikApiKey(key: string) {
  localStorage.setItem(API_KEY_STORAGE, key.trim());
}

export function clearWordnikApiKey() {
  localStorage.removeItem(API_KEY_STORAGE);
}

export function hasWordnikApiKey(): boolean {
  return getWordnikApiKey().length > 0;
}

// ─── Date helpers ─────────────────────────────────────────────────────────────
/** Returns today's date as "YYYY-MM-DD" in local time. */
export function todayKey(): string {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Returns milliseconds until the next local midnight. */
export function msUntilMidnight(): number {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(24, 0, 0, 0); // next midnight
  return midnight.getTime() - now.getTime();
}

/** Format an ISO date string for display, e.g. "September 3, 2026". */
export function formatDisplayDate(isoDate: string): string {
  try {
    // Parse as local date to avoid timezone drift
    const [y, m, d] = isoDate.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

// ─── LocalStorage cache ───────────────────────────────────────────────────────
function cacheKey(dateStr: string) {
  return `${CACHE_PREFIX}${dateStr}`;
}

function readCache(dateStr: string): WordOfTheDay | null {
  try {
    const raw = localStorage.getItem(cacheKey(dateStr));
    if (!raw) return null;
    return JSON.parse(raw) as WordOfTheDay;
  } catch {
    return null;
  }
}

function writeCache(data: WordOfTheDay) {
  try {
    localStorage.setItem(cacheKey(data.rawDate), JSON.stringify(data));
    // Purge any old cache entries (keep only last 7 days)
    const keys = Object.keys(localStorage).filter((k) => k.startsWith(CACHE_PREFIX));
    keys.sort().slice(0, Math.max(0, keys.length - 7)).forEach((k) => localStorage.removeItem(k));
  } catch {
    // storage quota issues — silently skip
  }
}

export function clearCacheForDate(dateStr: string) {
  try {
    localStorage.removeItem(cacheKey(dateStr));
  } catch {}
}

// ─── Normaliser ───────────────────────────────────────────────────────────────
export function normalise(raw: WordnikWotdResponse, dateStr: string): WordOfTheDay | null {
  const word = raw.word?.trim();
  if (!word) return null;

  const def =
    raw.definitions?.find((d) => d.text?.trim())?.text?.trim() ||
    'No definition available.';
  const partOfSpeech =
    raw.definitions?.find((d) => d.partOfSpeech?.trim())?.partOfSpeech?.trim() || '';
  const example =
    raw.examples?.find((e) => e.text?.trim())?.text?.trim() || '';
  const note = raw.note?.trim() || '';

  return {
    word,
    date: formatDisplayDate(dateStr),
    rawDate: dateStr,
    partOfSpeech,
    phonetic: `/${word.toLowerCase()}/`,
    definition: def,
    example,
    note,
    purl: raw.purl,
    sourceUrl: raw.wordnikUrl,
  };
}

// ─── Phonetic enrichment ──────────────────────────────────────────────────────
async function enrichWithPhonetics(data: WordOfTheDay): Promise<WordOfTheDay> {
  // If data ALREADY has a detailed phonetic (not just fallback /word/), return immediately!
  if (data.phonetic && data.phonetic !== `/${data.word.toLowerCase()}/`) {
    return data;
  }

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 1500); // 1.5s strict timeout

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(data.word)}`,
      { signal: controller.signal }
    );
    clearTimeout(timer);

    if (!res.ok) return data;
    const entries = await res.json();
    if (!Array.isArray(entries) || entries.length === 0) return data;

    const entry = entries[0];
    const phonetic =
      entry.phonetic ||
      entry.phonetics?.find((p: { text?: string }) => p.text)?.text ||
      data.phonetic;
    const audioUrl =
      entry.phonetics?.find((p: { audio?: string }) => p.audio?.trim())?.audio?.trim() ||
      undefined;

    return { ...data, phonetic, audioUrl };
  } catch {
    return data;
  }
}

// ─── Convert DictionaryEntry to WordOfTheDay ───────────────────────────────────
import type { DictionaryEntry } from '../types/dictionary';

export function entryToWordOfTheDay(entry: DictionaryEntry, dateStr?: string): WordOfTheDay {
  const date = dateStr || todayKey();
  const primaryMeaning = entry.meanings?.[0];

  // Extract up to 2 definitions across meanings
  const allDefs = (entry.meanings || [])
    .flatMap((m) => m.definitions.map((d) => d.definition))
    .filter((d) => Boolean(d && d.trim()))
    .map((d) => d.trim());
  const definitions = allDefs.slice(0, 2);
  const definition = definitions[0] || '';

  // Find the first valid example sentence across all meanings & definitions
  const example =
    entry.meanings
      ?.flatMap((m) => m.definitions)
      ?.find((d) => d.example && d.example.trim().length > 0)?.example?.trim() || '';

  // Collect up to 5 unique synonyms
  const rawSynonyms = [
    ...(entry.meanings?.flatMap((m) => m.synonyms || []) || []),
    ...(entry.meanings?.flatMap((m) => m.definitions.flatMap((d) => d.synonyms || [])) || []),
  ];
  const uniqueSynonyms = Array.from(
    new Set(
      rawSynonyms
        .map((s) => s.trim())
        .filter((s) => Boolean(s) && s.toLowerCase() !== entry.word.toLowerCase())
    )
  ).slice(0, 5);

  // Collect up to 4 unique antonyms
  const rawAntonyms = [
    ...(entry.meanings?.flatMap((m) => m.antonyms || []) || []),
    ...(entry.meanings?.flatMap((m) => m.definitions.flatMap((d) => d.antonyms || [])) || []),
  ];
  const uniqueAntonyms = Array.from(
    new Set(
      rawAntonyms
        .map((a) => a.trim())
        .filter((a) => Boolean(a) && a.toLowerCase() !== entry.word.toLowerCase())
    )
  ).slice(0, 4);

  const phonetic =
    entry.phonetic ||
    entry.phonetics?.find((p) => p.text?.trim())?.text ||
    `/${entry.word.toLowerCase()}/`;

  const audioUrl =
    entry.phonetics?.find((p) => p.audio?.trim())?.audio?.trim() || undefined;

  return {
    word: entry.word,
    date: formatDisplayDate(date),
    rawDate: date,
    partOfSpeech: primaryMeaning?.partOfSpeech || 'word',
    phonetic,
    audioUrl,
    definition,
    definitions: definitions.length > 1 ? definitions : undefined,
    meanings: entry.meanings,
    example,
    synonyms: uniqueSynonyms.length > 0 ? uniqueSynonyms : undefined,
    antonyms: uniqueAntonyms.length > 0 ? uniqueAntonyms : undefined,
    note: '',
    sourceUrl: entry.sourceUrls?.[0],
  };
}

/**
 * Saves a manually added Word of the Day into localStorage for the given calendar date.
 */
export function saveManualWordOfTheDay(word: WordOfTheDay): void {
  writeCache(word);
}

// ─── Curated Word Deterministic Indexing ──────────────────────────────────────
/**
 * Picks a deterministic, non-repeating word from CURATED_WORDS based on the calendar date.
 * Guarantees consecutive calendar days get consecutive distinct words across ~2.74 years (1,000 words).
 */
export function getCuratedWordForDate(dateStr: string): WordOfTheDay {
  const [y, m, d] = dateStr.split('-').map(Number);
  const targetDate = new Date(Date.UTC(y, m - 1, d));
  const epoch = new Date(Date.UTC(2025, 0, 1));
  const diffDays = Math.floor((targetDate.getTime() - epoch.getTime()) / 86_400_000);

  const index = ((diffDays % CURATED_WORDS.length) + CURATED_WORDS.length) % CURATED_WORDS.length;
  const curated = CURATED_WORDS[index];

  return {
    word: curated.word,
    date: formatDisplayDate(dateStr),
    rawDate: dateStr,
    partOfSpeech: curated.partOfSpeech,
    phonetic: curated.phonetic,
    definition: curated.definition,
    example: curated.example,
    category: curated.category,
    note: '',
    sourceUrl: `https://en.wiktionary.org/wiki/${encodeURIComponent(curated.word.toLowerCase())}`,
  };
}

/**
 * Synchronously returns the Word of the Day for a date (from cache or curated list).
 * Useful for widgets and fast UI rendering with 0 loading delay.
 */
export function getWordOfTheDaySync(dateStr?: string): WordOfTheDay {
  const date = dateStr || todayKey();
  const cached = readCache(date);
  if (cached) return cached;
  return getCuratedWordForDate(date);
}

// ─── Main fetch function ──────────────────────────────────────────────────────
/**
 * Fetches the Word of the Day for a given ISO date string (defaults to today).
 * Checks localStorage cache first; if a cache hit exists returns it immediately.
 * Otherwise retrieves the curated word, attempts background phonetic/audio enrichment,
 * caches the result, and returns it.
 */
export async function fetchWordOfTheDay(dateStr?: string): Promise<WordOfTheDay> {
  const date = dateStr || todayKey();

  // 1. Cache hit (either manually added or previously fetched/enriched)
  const cached = readCache(date);
  if (cached) return cached;

  // 2. Get the deterministic curated word for this calendar date
  const curated = getCuratedWordForDate(date);

  // 3. Attempt to enrich with authentic pronunciation audio in the background
  try {
    const enriched = await enrichWithPhonetics(curated);
    writeCache(enriched);
    return enriched;
  } catch {
    writeCache(curated);
    return curated;
  }
}

// ─── Midnight auto-refresh hook ───────────────────────────────────────────────
/**
 * useMidnightRefresh
 *
 * Sets a single-shot timer for the next local midnight. When it fires:
 *  1. Clears the cache for the new day.
 *  2. Calls `onNewDay()` so the component re-fetches.
 *  3. Re-schedules itself for the following midnight.
 *
 * Also listens to `visibilitychange` — if the tab is hidden and then brought
 * back on a different calendar day, the refresh fires immediately.
 */
export function useMidnightRefresh(onNewDay: () => void) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastKnownDateRef = useRef<string>(todayKey());

  const schedule = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const ms = msUntilMidnight() + 500; // 500 ms buffer after midnight
    timerRef.current = setTimeout(() => {
      const newDate = todayKey();
      clearCacheForDate(newDate); // ensure fresh API call
      onNewDay();
      lastKnownDateRef.current = newDate;
      schedule(); // recurse for the next midnight
    }, ms);
  }, [onNewDay]);

  useEffect(() => {
    schedule();

    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const currentDate = todayKey();
        if (currentDate !== lastKnownDateRef.current) {
          lastKnownDateRef.current = currentDate;
          clearCacheForDate(currentDate);
          onNewDay();
          // Re-schedule the midnight timer from the new day's perspective
          schedule();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibility);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [schedule, onNewDay]);
}

// ─── Exponential-backoff retry ────────────────────────────────────────────────
const RETRY_DELAYS = [5_000, 15_000, 30_000, 60_000, 120_000, 300_000]; // up to 5 min

/**
 * Retries `fetchWordOfTheDay` with exponential backoff after a date change,
 * in case Wordnik hasn't published the new word yet at midnight.
 *
 * Stops retrying once a fresh word (with rawDate matching `targetDate`) is returned.
 */
export async function fetchWithRetry(
  targetDate: string,
  onSuccess: (word: WordOfTheDay) => void,
  signal?: AbortSignal
): Promise<void> {
  for (let attempt = 0; attempt <= RETRY_DELAYS.length; attempt++) {
    if (signal?.aborted) return;
    try {
      // Always bypass cache on retry
      clearCacheForDate(targetDate);
      const result = await fetchWordOfTheDay(targetDate);
      if (result.rawDate === targetDate || !import.meta.env.VITE_WORDNIK_API_KEY) {
        onSuccess(result);
        return;
      }
    } catch {
      // swallow — will retry
    }

    if (attempt < RETRY_DELAYS.length) {
      const delay = RETRY_DELAYS[attempt];
      await new Promise<void>((resolve, reject) => {
        const t = setTimeout(resolve, delay);
        signal?.addEventListener('abort', () => {
          clearTimeout(t);
          reject(new Error('aborted'));
        });
      }).catch(() => { return; });
    }
    if (signal?.aborted) return;
  }
}
