/** Shape returned by https://api.dictionaryapi.dev/api/v2/entries/en/<word> */

export interface Phonetic {
  text?: string;
  audio?: string;
  sourceUrl?: string;
  license?: { name: string; url: string };
}

export interface Definition {
  definition: string;
  example?: string;
  synonyms: string[];
  antonyms: string[];
}

export interface Meaning {
  partOfSpeech: string;
  definitions: Definition[];
  synonyms: string[];
  antonyms: string[];
}

export interface DictionaryEntry {
  word: string;
  phonetic?: string;
  phonetics: Phonetic[];
  meanings: Meaning[];
  license?: { name: string; url: string };
  sourceUrls?: string[];
}

/** A word saved to the user's personal library. */
export interface SavedWord {
  /** Normalised word (lowercased) — used as the unique key. */
  id: string;
  /** Full API response stored for offline viewing. */
  entries: DictionaryEntry[];
  /** ISO timestamp of when the word was saved. */
  savedAt: string;
}
