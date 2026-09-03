import type { Meaning } from './dictionary';

/** Raw shape returned by Wordnik Word of the Day API. */
export interface WordnikWotdResponse {
  wordnikUrl?: string;
  purl?: string;
  publishDate?: string;
  word?: string;
  definitions?: {
    source?: string;
    text?: string;
    note?: string;
    partOfSpeech?: string;
  }[];
  examples?: {
    url?: string;
    title?: string;
    text?: string;
    id?: number;
  }[];
  note?: string;
}

/** Normalised Word of the Day data used throughout the UI. */
export interface WordOfTheDay {
  word: string;
  date: string;          // Display string e.g. "September 3, 2026"
  rawDate: string;       // ISO date key e.g. "2026-09-03"
  partOfSpeech: string;
  phonetic: string;
  audioUrl?: string;
  definition: string;
  definitions?: string[];
  meanings?: Meaning[];
  example: string;
  synonyms?: string[];
  antonyms?: string[];
  note: string;
  category?: string;
  sourceUrl?: string;
  purl?: string;
}
