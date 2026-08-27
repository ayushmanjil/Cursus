import type { DictionaryEntry } from '../types/dictionary';

function parseDatamuseResult(word: string, defs: string[]): DictionaryEntry {
  const meaningsMap: Record<string, { definition: string }[]> = {};

  for (const rawDef of defs) {
    const parts = rawDef.split('\t');
    let pos = 'general';
    let defText = rawDef;

    if (parts.length >= 2) {
      const code = parts[0].trim();
      defText = parts.slice(1).join('\t').trim();

      if (code === 'n') pos = 'noun';
      else if (code === 'v') pos = 'verb';
      else if (code === 'adj') pos = 'adjective';
      else if (code === 'adv') pos = 'adverb';
      else pos = code;
    }

    if (!meaningsMap[pos]) {
      meaningsMap[pos] = [];
    }
    meaningsMap[pos].push({ definition: defText });
  }

  const meanings = Object.entries(meaningsMap).map(([partOfSpeech, definitions]) => ({
    partOfSpeech,
    definitions: definitions.map((d) => ({
      definition: d.definition,
      synonyms: [],
      antonyms: [],
    })),
    synonyms: [],
    antonyms: [],
  }));

  return {
    word: word,
    phonetic: `/${word.toLowerCase()}/`,
    phonetics: [],
    meanings,
    sourceUrls: [`https://en.wiktionary.org/wiki/${encodeURIComponent(word.toLowerCase())}`],
  };
}

async function fetchFromDatamuse(word: string): Promise<DictionaryEntry[] | null> {
  try {
    const res = await fetch(
      `https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=d&max=1`
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (
      Array.isArray(data) &&
      data.length > 0 &&
      Array.isArray(data[0].defs) &&
      data[0].defs.length > 0
    ) {
      const targetWord = data[0].word || word;
      return [parseDatamuseResult(targetWord, data[0].defs)];
    }
  } catch (err) {
    console.warn('Datamuse fallback fetch failed:', err);
  }
  return null;
}

// In-memory runtime cache for in-flight and completed definition requests
const definitionCache = new Map<string, Promise<DictionaryEntry[]>>();

/**
 * Speculatively pre-fetches and caches word definition in memory
 * so when user selects or searches the word, the result is instantaneous.
 */
export function prefetchWordDefinition(word: string): void {
  const key = word.trim().toLowerCase();
  if (!key || definitionCache.has(key)) return;
  definitionCache.set(key, executeFetchWordDefinition(key));
}

async function executeFetchWordDefinition(trimmed: string): Promise<DictionaryEntry[]> {
  // Primary API: dictionaryapi.dev
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000); // 4s timeout

    const res = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(trimmed)}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data: DictionaryEntry[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        return data;
      }
    }

    if (res.status === 404) {
      // Before throwing 404, check Datamuse fallback in case dictionaryapi.dev missed it
      const fallbackData = await fetchFromDatamuse(trimmed);
      if (fallbackData) return fallbackData;
      throw new Error('NOT_FOUND');
    }
  } catch (err: any) {
    if (err.message === 'NOT_FOUND') {
      throw err;
    }
    console.warn('Primary dictionary API error, attempting fallback fetch:', err);
  }

  // Fallback API: Datamuse
  const fallbackData = await fetchFromDatamuse(trimmed);
  if (fallbackData) return fallbackData;

  throw new Error('FETCH_FAILED');
}

/**
 * Fetches dictionary entry for a given word.
 * Uses in-memory promise caching, primary dictionaryapi.dev service,
 * and automatic Datamuse fallback.
 */
export async function fetchWordDefinition(word: string): Promise<DictionaryEntry[]> {
  const trimmed = word.trim();
  if (!trimmed) throw new Error('EMPTY_QUERY');

  const key = trimmed.toLowerCase();

  if (!definitionCache.has(key)) {
    definitionCache.set(key, executeFetchWordDefinition(key));
  }

  try {
    return await definitionCache.get(key)!;
  } catch (err) {
    definitionCache.delete(key);
    throw err;
  }
}
