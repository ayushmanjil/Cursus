import type { Poem } from '../types/poem';
import { CLASSIC_POEMS } from '../data/classicPoems';

export function getPoemId(author: string, title: string): string {
  const cleanAuthor = author.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  const cleanTitle = title.trim().toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${cleanAuthor}__${cleanTitle}`;
}

// ─── 1. Local Curated Classics Library Search ──────────────────────
function searchCuratedClassics(query: string): Poem[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];

  return CLASSIC_POEMS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.author.toLowerCase().includes(q) ||
      q.includes(p.title.toLowerCase())
  );
}

// ─── 2. PoetryDB API Search ─────────────────────────────────────────
async function searchPoetryDB(
  query: string,
  searchBy: 'title' | 'author' | 'all' = 'all'
): Promise<Poem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  let endpoints: string[] = [];
  if (searchBy === 'title') {
    endpoints = [`https://poetrydb.org/title/${encodeURIComponent(trimmed)}` ];
  } else if (searchBy === 'author') {
    endpoints = [`https://poetrydb.org/author/${encodeURIComponent(trimmed)}` ];
  } else {
    endpoints = [
      `https://poetrydb.org/title/${encodeURIComponent(trimmed)}`,
      `https://poetrydb.org/author/${encodeURIComponent(trimmed)}`,
    ];
  }

  try {
    const responses = await Promise.all(
      endpoints.map(async (url) => {
        try {
          const res = await fetch(url);
          if (!res.ok) return [];
          const data = await res.json();
          return Array.isArray(data) ? data : [];
        } catch {
          return [];
        }
      })
    );

    const merged = responses.flat();
    const seen = new Set<string>();
    const poems: Poem[] = [];

    for (const item of merged) {
      if (item && item.title && item.author) {
        const id = getPoemId(item.author, item.title);
        if (!seen.has(id)) {
          seen.add(id);
          poems.push({
            id,
            title: item.title,
            author: item.author,
            lines: Array.isArray(item.lines) ? item.lines : undefined,
            linecount: item.linecount,
          });
        }
      }
    }

    return poems;
  } catch (err) {
    console.error('Error searching PoetryDB:', err);
    return [];
  }
}

// ─── Search Architecture: Curated Classics -> PoetryDB ─────────────
export async function searchPoems(
  query: string,
  searchBy: 'title' | 'author' | 'all' = 'all'
): Promise<Poem[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  // Step 1: Search Local Curated Library First
  const curatedResults = searchCuratedClassics(trimmed);
  if (curatedResults.length > 0) {
    return curatedResults;
  }

  // Step 2: Search PoetryDB
  const dbResults = await searchPoetryDB(trimmed, searchBy);
  return dbResults;
}

export async function getPoemDetails(author: string, title: string): Promise<Poem | null> {
  const cleanAuthor = author.trim();
  const cleanTitle = title.trim();

  // Check curated dataset first
  const curatedMatch =
    CLASSIC_POEMS.find(
      (p) =>
        p.title.toLowerCase() === cleanTitle.toLowerCase() &&
        p.author.toLowerCase() === cleanAuthor.toLowerCase()
    ) || CLASSIC_POEMS.find((p) => p.title.toLowerCase() === cleanTitle.toLowerCase());

  if (curatedMatch) {
    return curatedMatch;
  }

  // Fetch from PoetryDB API
  try {
    const url = `https://poetrydb.org/author,title/${encodeURIComponent(cleanAuthor)};${encodeURIComponent(cleanTitle)}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0 && data[0].lines) {
        const item = data[0];
        return {
          id: getPoemId(item.author, item.title),
          title: item.title,
          author: item.author,
          lines: item.lines,
          linecount: item.linecount,
        };
      }
    }

    // Fallback search PoetryDB by title
    const fallbackRes = await fetch(`https://poetrydb.org/title/${encodeURIComponent(cleanTitle)}`);
    if (fallbackRes.ok) {
      const data = await fallbackRes.json();
      if (Array.isArray(data)) {
        const match =
          data.find((p: any) => p.author.toLowerCase() === cleanAuthor.toLowerCase() && p.lines) ||
          data[0];
        if (match && match.lines) {
          return {
            id: getPoemId(match.author, match.title),
            title: match.title,
            author: match.author,
            lines: match.lines,
            linecount: match.linecount,
          };
        }
      }
    }

    return null;
  } catch (err) {
    console.error('Error fetching poem details:', err);
    return null;
  }
}

export async function getRandomPoems(count: number = 6): Promise<Poem[]> {
  try {
    const res = await fetch(`https://poetrydb.org/random/${count}`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) {
        const randomFromDB = data.map((item: any) => ({
          id: getPoemId(item.author, item.title),
          title: item.title,
          author: item.author,
          lines: item.lines,
          linecount: item.linecount,
        }));

        const shuffledCurated = [...CLASSIC_POEMS].sort(() => 0.5 - Math.random()).slice(0, 2);
        return [...shuffledCurated, ...randomFromDB].slice(0, count);
      }
    }
  } catch {
    // fallback to curated
  }

  return [...CLASSIC_POEMS].sort(() => 0.5 - Math.random()).slice(0, count);
}
