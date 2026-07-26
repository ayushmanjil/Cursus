import type { Book } from '../types/book';
import type { RecommendedBook, UmbrellaGenre } from '../types/recommendations';
import { UMBRELLA_GENRES } from '../types/recommendations';

const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const DISMISSED_KEY = 'cursus_dismissed_rec_ids';

/** Rich synopsis lookup database for popular titles with fuzzy matching */
const KNOWN_SYNOPSIS_MAP: Record<string, string> = {
  thesilentpatient: 'Alicia Berenson’s life is seemingly perfect. Then one evening she shoots her husband five times in the face and never speaks another word.',
  gonegirl: 'On a warm summer morning in North Carthage, Missouri, it is Nick and Amy Dunne’s fifth wedding anniversary when Nick’s clever and beautiful wife disappears.',
  thegirlwiththedragontattoo: 'Harriet Vanger, a scion of one of Sweden’s wealthiest families disappeared forty years ago. Her aged uncle remains obsessed with finding out the truth.',
  shutterisland: 'U.S. Marshal Teddy Daniels arrives at Asylum for the Criminally Insane on Shutter Island in 1954 to investigate an impossible disappearance.',
  projecthailmary: 'Ryland Grace is the sole survivor on a desperate, last-chance mission—and if he fails, humanity and the earth itself will perish.',
  dune: 'Set on the desert planet Arrakis, Dune is the story of Paul Atreides, heir to a noble family tasked with ruling an inhospitable world.',
  thenameofthewind: 'Told in Kvothe’s own voice, this is the tale of the magically gifted young man who grows to be the most notorious wizard his world has ever seen.',
  neuromancer: 'Case was the sharpest data-thief in the matrix—until he crossed the wrong people and they crippled his nervous system.',
  atomichabits: 'An easy and proven way to build good habits and break bad ones. Transform your life with tiny 1% changes every day.',
  deepwork: 'Rules for focused success in a distracted world. Deep work is the ability to focus without distraction on a cognitively demanding task.',
  thepsychologyofmoney: 'Timeless lessons on wealth, greed, and happiness. Doing well with money has a little to do with how smart you are and a lot to do with how you behave.',
  essentialism: 'The disciplined pursuit of less. Essentialism is not about how to get more things done; it is about how to get the right things done.',
  thinkingfastandslow: 'Nobel laureate Daniel Kahneman takes us on a groundbreaking tour of the mind and explains the two systems that drive the way we think.',
  manssearchformeaning: 'Psychiatrist Viktor Frankl’s memoir has riveted generations of readers with its descriptions of life in Nazi death camps and its lessons for spiritual survival.',
  influence: 'The classic book on persuasion, explaining the psychology of why people say "yes"—and how to apply these understandings.',
  flow: 'Legendary psychologist Mihaly Csikszentmihalyi’s famous investigations of optimal experience reveal that what makes an experience genuinely satisfying is a state of consciousness called flow.',
  zerotoone: 'Notes on startups, or how to build the future. Peter Thiel shows how we can find singular ways to create new things.',
  shoedog: 'A memoir by the creator of Nike. Phil Knight shares the inside story of the company’s early days as an intrepid start-up.',
  theleanstartup: 'How today’s entrepreneurs use continuous innovation to create radically successful businesses.',
  sapiens: '100,000 years ago, at least six human species inhabited the earth. Today there is just one. Us. Homo sapiens.',
  stevejobs: 'Based on more than forty interviews with Steve Jobs conducted over two years, this is the exclusive biography of the ultimate icon of inventiveness.',
  meditations: 'Writings of the Roman Emperor Marcus Aurelius detailing his personal notes to himself and his thoughts on Stoic philosophy.',
  thedailystoic: '366 meditations on wisdom, perseverance, and the art of living from Marcus Aurelius, Seneca, and Epictetus.',
  '1984': 'Winston Smith toes the Party line, rewriting history to satisfy the Ministry of Truth. With every lie he rewrites, Winston grows to hate the Party.',
  thegreatgatsby: 'The story of the mysteriously wealthy Jay Gatsby and his love for the beautiful Daisy Buchanan.',
  thesevenhusbandsofevelynhugo: 'Aging and reclusive Hollywood movie icon Evelyn Hugo is finally ready to tell the truth about her glamorous and scandalous life.',
  itendswithus: 'Lily hasn’t always had it easy, but that’s never stopped her from working hard for the life she wants. She has come a long way from the small town where she grew up.',
  normalpeople: 'Connell and Marianne grew up in the same small town, but the similarities end there. At school, Connell is popular and well liked, while Marianne is a loner.',
  beachread: 'A romance writer who no longer believes in love and a literary writer stuck in a rut engage in a summer-long challenge that may just overturn everything they believe.',
  somethinginevertoldyou: 'A deeply emotional story of love, heartbreak, and second chances that tests the boundaries of romance and devotion.',
  thefury: 'A tale of murder, betrayal, and dark secrets on a private Greek island involving a reclusive ex-movie star and her friends.',
  themaidens: 'Edward Fosca is a murderer. Of this Mariana is certain. But Fosca is untouchable. A handsome professor of Greek tragedy at Cambridge University, Fosca is adored by staff and students alike.',
  cavebear: 'A prehistoric novel exploring early human civilization, survival, and ancient clan life in ice age Europe.',
  gunahonkadevta: 'A legendary Hindi novel detailing love, morality, and emotional sacrifice in Allahabad.',
};

/** Curated high-quality fallback books for reliable, genre-accurate recommendations */
const FALLBACK_CATALOG: Record<string, { title: string; author: string; genre: string; desc: string; coverId?: number }[]> = {
  romance: [
    { title: 'The Seven Husbands of Evelyn Hugo', author: 'Taylor Jenkins Reid', genre: 'Romance / Drama', desc: KNOWN_SYNOPSIS_MAP['thesevenhusbandsofevelynhugo'], coverId: 8352000 },
    { title: 'It Ends with Us', author: 'Colleen Hoover', genre: 'Romance / Contemporary', desc: KNOWN_SYNOPSIS_MAP['itendswithus'], coverId: 8235700 },
    { title: 'Normal People', author: 'Sally Rooney', genre: 'Romance / Fiction', desc: KNOWN_SYNOPSIS_MAP['normalpeople'], coverId: 8235600 },
    { title: 'Beach Read', author: 'Emily Henry', genre: 'Romance / Comedy', desc: KNOWN_SYNOPSIS_MAP['beachread'], coverId: 8355000 },
  ],
  thrillers: [
    { title: 'The Silent Patient', author: 'Alex Michaelides', genre: 'Psychological Thriller', desc: KNOWN_SYNOPSIS_MAP['thesilentpatient'], coverId: 8856353 },
    { title: 'Gone Girl', author: 'Gillian Flynn', genre: 'Mystery / Thriller', desc: KNOWN_SYNOPSIS_MAP['gonegirl'], coverId: 8235282 },
    { title: 'The Girl with the Dragon Tattoo', author: 'Stieg Larsson', genre: 'Crime / Suspense', desc: KNOWN_SYNOPSIS_MAP['thegirlwiththedragontattoo'], coverId: 8231872 },
    { title: 'Shutter Island', author: 'Dennis Lehane', genre: 'Psychological Thriller', desc: KNOWN_SYNOPSIS_MAP['shutterisland'], coverId: 8272990 },
  ],
  'scifi-fantasy': [
    { title: 'Project Hail Mary', author: 'Andy Weir', genre: 'Sci-Fi / Space Opera', desc: KNOWN_SYNOPSIS_MAP['projecthailmary'], coverId: 10522194 },
    { title: 'Dune', author: 'Frank Herbert', genre: 'Sci-Fi Epic', desc: KNOWN_SYNOPSIS_MAP['dune'], coverId: 9251896 },
    { title: 'The Name of the Wind', author: 'Patrick Rothfuss', genre: 'Epic Fantasy', desc: KNOWN_SYNOPSIS_MAP['thenameofthewind'], coverId: 8235070 },
    { title: 'Neuromancer', author: 'William Gibson', genre: 'Cyberpunk', desc: KNOWN_SYNOPSIS_MAP['neuromancer'], coverId: 8232984 },
  ],
  'self-improvement': [
    { title: 'Atomic Habits', author: 'James Clear', genre: 'Self-Improvement', desc: KNOWN_SYNOPSIS_MAP['atomichabits'], coverId: 10427847 },
    { title: 'Deep Work', author: 'Cal Newport', genre: 'Productivity & Focus', desc: KNOWN_SYNOPSIS_MAP['deepwork'], coverId: 8314154 },
    { title: 'The Psychology of Money', author: 'Morgan Housel', genre: 'Personal Finance', desc: KNOWN_SYNOPSIS_MAP['thepsychologyofmoney'], coverId: 10265261 },
    { title: 'Essentialism', author: 'Greg McKeown', genre: 'Mindset & Growth', desc: KNOWN_SYNOPSIS_MAP['essentialism'], coverId: 8231900 },
  ],
  'psychology-mind': [
    { title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', genre: 'Behavioral Psychology', desc: KNOWN_SYNOPSIS_MAP['thinkingfastandslow'], coverId: 8235675 },
    { title: 'Man’s Search for Meaning', author: 'Viktor Frankl', genre: 'Psychology / Philosophy', desc: KNOWN_SYNOPSIS_MAP['manssearchformeaning'], coverId: 8232810 },
    { title: 'Influence: The Psychology of Persuasion', author: 'Robert B. Cialdini', genre: 'Psychology', desc: KNOWN_SYNOPSIS_MAP['influence'], coverId: 8234850 },
    { title: 'Flow: The Psychology of Optimal Experience', author: 'Mihaly Csikszentmihalyi', genre: 'Psychology', desc: KNOWN_SYNOPSIS_MAP['flow'], coverId: 8233300 },
  ],
  'business-finance': [
    { title: 'Zero to One', author: 'Peter Thiel', genre: 'Entrepreneurship & Strategy', desc: KNOWN_SYNOPSIS_MAP['zerotoone'], coverId: 8235888 },
    { title: 'Shoe Dog', author: 'Phil Knight', genre: 'Business Memoir', desc: KNOWN_SYNOPSIS_MAP['shoedog'], coverId: 8235450 },
    { title: 'The Lean Startup', author: 'Eric Ries', genre: 'Business Strategy', desc: KNOWN_SYNOPSIS_MAP['theleanstartup'], coverId: 8235120 },
  ],
  'history-biography': [
    { title: 'Sapiens: A Brief History of Humankind', author: 'Yuval Noah Harari', genre: 'History / Anthropology', desc: KNOWN_SYNOPSIS_MAP['sapiens'], coverId: 8235330 },
    { title: 'Steve Jobs', author: 'Walter Isaacson', genre: 'Biography', desc: KNOWN_SYNOPSIS_MAP['stevejobs'], coverId: 8235550 },
  ],
  'philosophy-ideas': [
    { title: 'Meditations', author: 'Marcus Aurelius', genre: 'Stoic Philosophy', desc: KNOWN_SYNOPSIS_MAP['meditations'], coverId: 8234000 },
    { title: 'The Daily Stoic', author: 'Ryan Holiday', genre: 'Modern Philosophy', desc: KNOWN_SYNOPSIS_MAP['thedailystoic'], coverId: 8350000 },
  ],
  'fiction-classics': [
    { title: '1984', author: 'George Orwell', genre: 'Literary Dystopia', desc: KNOWN_SYNOPSIS_MAP['1984'], coverId: 8225266 },
    { title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', genre: 'Classic Fiction', desc: KNOWN_SYNOPSIS_MAP['thegreatgatsby'], coverId: 8225500 },
  ]
};

export function getDismissedBookIds(): string[] {
  try {
    const raw = localStorage.getItem(DISMISSED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function dismissBook(bookId: string): void {
  try {
    const current = getDismissedBookIds();
    if (!current.includes(bookId)) {
      current.push(bookId);
      localStorage.setItem(DISMISSED_KEY, JSON.stringify(current));
    }
  } catch (e) {
    console.error('Error saving dismissed book', e);
  }
}

interface CacheItem {
  timestamp: number;
  data: RecommendedBook[];
}

function getCache(key: string): RecommendedBook[] | null {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed: CacheItem = JSON.parse(raw);
    if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
      // Invalidate cache if any cached book has an empty description so we re-fetch with full descriptions!
      const hasEmptyDescriptions = parsed.data.some((b) => !b.description || b.description.trim().length === 0);
      if (!hasEmptyDescriptions) {
        return parsed.data;
      }
    }
  } catch {
    // Ignore invalid cache
  }
  return null;
}

function setCache(key: string, data: RecommendedBook[]): void {
  try {
    const item: CacheItem = { timestamp: Date.now(), data };
    localStorage.setItem(key, JSON.stringify(item));
  } catch (e) {
    console.error('Error setting cache', e);
  }
}

function normalizeStr(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function findKnownSynopsis(title: string): string {
  const norm = normalizeStr(title);
  if (KNOWN_SYNOPSIS_MAP[norm]) return KNOWN_SYNOPSIS_MAP[norm];
  
  for (const [key, syn] of Object.entries(KNOWN_SYNOPSIS_MAP)) {
    if (norm.includes(key) || key.includes(norm)) {
      return syn;
    }
  }
  return '';
}

function isAlreadyInLibrary(candidateTitle: string, candidateAuthor: string, userBooks: Book[]): boolean {
  const normTitle = normalizeStr(candidateTitle);
  const normAuthor = normalizeStr(candidateAuthor);

  return userBooks.some((b) => {
    const bTitle = normalizeStr(b.title);
    const bAuthor = normalizeStr(b.author);
    return normTitle.includes(bTitle) || bTitle.includes(normTitle) || (normTitle === bTitle && normAuthor === bAuthor);
  });
}

function shuffleArray<T>(arr: T[]): T[] {
  const shallow = [...arr];
  for (let i = shallow.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shallow[i], shallow[j]] = [shallow[j], shallow[i]];
  }
  return shallow;
}

function getFallbackBooks(
  genreKey: string,
  reasonTemplate: string,
  sourceGenre?: string
): RecommendedBook[] {
  const dismissed = getDismissedBookIds();
  const list = FALLBACK_CATALOG[genreKey] || FALLBACK_CATALOG['fiction-classics'] || [];

  return shuffleArray(list)
    .filter((item) => !dismissed.includes(`fb_${normalizeStr(item.title)}`))
    .map((item) => ({
      id: `fb_${normalizeStr(item.title)}`,
      title: item.title,
      author: item.author,
      genre: item.genre,
      coverUrl: item.coverId ? `https://covers.openlibrary.org/b/id/${item.coverId}-M.jpg` : undefined,
      description: item.desc,
      pageCount: 320,
      averageRating: 4.8,
      reason: reasonTemplate,
      sourceGenre: sourceGenre || item.genre,
    }));
}

/**
 * Directly fetch work description from Open Library API if search record lacks synopsis
 */
async function fetchWorkDescription(workKey: string, signal?: AbortSignal): Promise<string> {
  if (!workKey || !workKey.startsWith('/works/')) return '';
  try {
    const url = `https://openlibrary.org${workKey}.json`;
    const res = await fetch(url, { signal });
    if (res.ok) {
      const data = await res.json();
      if (typeof data.description === 'string' && data.description.trim()) {
        return data.description.trim();
      }
      if (data.description && typeof data.description.value === 'string' && data.description.value.trim()) {
        return data.description.value.trim();
      }
      if (typeof data.subtitle === 'string' && data.subtitle.trim()) {
        return data.subtitle.trim();
      }
    }
  } catch (_) {}
  return '';
}

/**
 * Fetch candidate books from Open Library API with genre precision and live work detail synopsis enrichment
 */
async function fetchCandidateBooks(
  queryStr: string,
  genreKey: string,
  signal?: AbortSignal,
  reasonTemplate: string = 'Recommended based on reading trends',
  sourceGenre?: string
): Promise<RecommendedBook[]> {
  const dismissed = getDismissedBookIds();
  const rawCandidates: { book: RecommendedBook; workKey?: string }[] = [];

  try {
    const pageOffset = Math.floor(Math.random() * 2) + 1;
    const url = `https://openlibrary.org/search.json?q=${encodeURIComponent(queryStr)}&page=${pageOffset}&limit=12`;
    const response = await fetch(url, { signal });

    if (response.ok) {
      const data = await response.json();
      if (data.docs && Array.isArray(data.docs) && data.docs.length > 0) {
        for (const item of data.docs) {
          const id = item.key ? item.key.replace('/works/', '') : `ol_${normalizeStr(item.title || '')}`;
          if (dismissed.includes(id)) continue;

          const title = item.title;
          const authors = Array.isArray(item.author_name) ? item.author_name.join(', ') : item.author_name || 'Unknown Author';

          // Check fuzzy known synopsis database
          let description = findKnownSynopsis(title || '');

          if (!description) {
            if (typeof item.description === 'string' && item.description.trim()) {
              description = item.description.trim();
            } else if (item.description && typeof item.description.value === 'string') {
              description = item.description.value.trim();
            } else if (Array.isArray(item.first_sentence) && item.first_sentence[0]?.trim()) {
              description = item.first_sentence[0].trim();
            } else if (typeof item.first_sentence === 'string' && item.first_sentence.trim()) {
              description = item.first_sentence.trim();
            } else if (typeof item.subtitle === 'string' && item.subtitle.trim()) {
              description = item.subtitle.trim();
            }
          }

          let coverUrl: string | undefined;
          if (item.cover_i) {
            coverUrl = `https://covers.openlibrary.org/b/id/${item.cover_i}-M.jpg`;
          }

          const categories = Array.isArray(item.subject) ? item.subject[0] : sourceGenre || 'General';
          const pageCount = item.number_of_pages_median || undefined;
          const averageRating = item.ratings_average ? Math.round(item.ratings_average * 10) / 10 : 4.5;

          if (title && authors) {
            rawCandidates.push({
              book: {
                id,
                title,
                author: authors,
                genre: categories,
                coverUrl,
                description,
                pageCount,
                averageRating,
                reason: reasonTemplate,
                sourceGenre: sourceGenre || categories,
              },
              workKey: item.key,
            });
          }
        }
      }
    }
  } catch (err: any) {
    if (err.name === 'AbortError') throw err;
    console.warn('Open Library API warning, using curated fallback catalog:', err);
  }

  // Fetch missing work descriptions in parallel for top candidates!
  const targetCandidates = rawCandidates.slice(0, 6);
  await Promise.all(
    targetCandidates.map(async (cand) => {
      if (!cand.book.description && cand.workKey) {
        const liveDesc = await fetchWorkDescription(cand.workKey, signal);
        if (liveDesc) {
          cand.book.description = liveDesc;
        }
      }
    })
  );

  const results: RecommendedBook[] = targetCandidates.map((c) => c.book);

  // If API returned fewer than 2 books, merge with curated fallbacks for this specific genre
  if (results.length < 2) {
    const fallbacks = getFallbackBooks(genreKey, reasonTemplate, sourceGenre);
    const existingTitles = results.map((r) => normalizeStr(r.title));
    for (const fb of fallbacks) {
      if (!existingTitles.includes(normalizeStr(fb.title))) {
        results.push(fb);
      }
    }
  }

  return shuffleArray(results);
}

/**
 * Accurately detect which umbrella genres the user HAS explored by inspecting book titles, authors, and genre tags.
 */
function getExploredUmbrellaGenreIds(userBooks: Book[]): Set<string> {
  const explored = new Set<string>();

  for (const book of userBooks) {
    const text = `${book.title} ${book.genre} ${book.author}`.toLowerCase();

    if (
      text.includes('thriller') ||
      text.includes('crime') ||
      text.includes('mystery') ||
      text.includes('murder') ||
      text.includes('detective') ||
      text.includes('silent patient') ||
      text.includes('fury') ||
      text.includes('suspense')
    ) {
      explored.add('thrillers');
    }

    if (
      text.includes('scifi') ||
      text.includes('science fiction') ||
      text.includes('fantasy') ||
      text.includes('space') ||
      text.includes('cyberpunk') ||
      text.includes('dune')
    ) {
      explored.add('scifi-fantasy');
    }

    if (
      text.includes('self') ||
      text.includes('habit') ||
      text.includes('atomic') ||
      text.includes('productivity') ||
      text.includes('deep work') ||
      text.includes('growth')
    ) {
      explored.add('self-improvement');
    }

    if (
      text.includes('psycholog') ||
      text.includes('brain') ||
      text.includes('neuro') ||
      text.includes('mind') ||
      text.includes('kahneman')
    ) {
      explored.add('psychology-mind');
    }

    if (
      text.includes('business') ||
      text.includes('finance') ||
      text.includes('money') ||
      text.includes('startup') ||
      text.includes('econ')
    ) {
      explored.add('business-finance');
    }

    if (
      text.includes('history') ||
      text.includes('biography') ||
      text.includes('memoir') ||
      text.includes('sapiens')
    ) {
      explored.add('history-biography');
    }

    if (
      text.includes('philosophy') ||
      text.includes('stoic') ||
      text.includes('meditations') ||
      text.includes('ethics')
    ) {
      explored.add('philosophy-ideas');
    }

    if (
      text.includes('fiction') ||
      text.includes('classic') ||
      text.includes('gunahon') ||
      text.includes('orwell')
    ) {
      explored.add('fiction-classics');
    }
  }

  return explored;
}

/**
 * Mode 1: Strict Genre-Matched Multi-Book Recommendations based on User's Library
 */
export async function getRecommendationsByActivity(
  userBooks: Book[],
  signal?: AbortSignal,
  userId: string = 'guest'
): Promise<RecommendedBook[]> {
  const cacheKey = `cursus_rec_act_${userId}`;
  const cached = getCache(cacheKey);
  if (cached) {
    const dismissed = getDismissedBookIds();
    const filteredCache = cached.filter(
      (b) => !dismissed.includes(b.id) && !isAlreadyInLibrary(b.title, b.author, userBooks)
    );
    if (filteredCache.length >= 3) return filteredCache;
  }

  const highlyRated = userBooks.filter((b) => (b.rating && b.rating >= 4) || b.favorite || b.status === 'read');
  const pool = highlyRated.length > 0 ? highlyRated : userBooks;

  const combinedResults: RecommendedBook[] = [];
  const addedTitles = new Set<string>();

  if (pool.length > 0) {
    const sortedPool = shuffleArray([...pool]).sort((a, b) => (b.rating || 0) - (a.rating || 0));
    
    const seedBooks: Book[] = [];
    const seenTitles = new Set<string>();
    
    for (const book of sortedPool) {
      const tNorm = normalizeStr(book.title);
      if (!seenTitles.has(tNorm)) {
        seedBooks.push(book);
        seenTitles.add(tNorm);
      }
    }

    for (const seed of seedBooks) {
      const gNorm = normalizeStr(seed.genre || '');
      let genreKey = 'fiction-classics';
      let searchSubject = 'subject:fiction';

      if (gNorm.includes('romance') || normalizeStr(seed.title).includes('somethinginevertoldyou')) {
        genreKey = 'romance';
        searchSubject = 'subject:romance';
      } else if (gNorm.includes('thriller') || gNorm.includes('mystery') || gNorm.includes('crime') || normalizeStr(seed.title).includes('silentpatient') || normalizeStr(seed.title).includes('fury')) {
        genreKey = 'thrillers';
        searchSubject = 'subject:thriller OR subject:mystery';
      } else if (gNorm.includes('scifi') || gNorm.includes('fantasy') || gNorm.includes('space')) {
        genreKey = 'scifi-fantasy';
        searchSubject = 'subject:science fiction OR subject:fantasy';
      } else if (gNorm.includes('self') || gNorm.includes('habit') || gNorm.includes('productiv')) {
        genreKey = 'self-improvement';
        searchSubject = 'subject:self-help OR subject:personal growth';
      } else if (gNorm.includes('psycholog') || gNorm.includes('mind')) {
        genreKey = 'psychology-mind';
        searchSubject = 'subject:psychology';
      } else if (gNorm.includes('business') || gNorm.includes('finance')) {
        genreKey = 'business-finance';
        searchSubject = 'subject:business';
      } else if (gNorm.includes('history') || gNorm.includes('biography')) {
        genreKey = 'history-biography';
        searchSubject = 'subject:history';
      } else if (gNorm.includes('philosophy') || gNorm.includes('stoic')) {
        genreKey = 'philosophy-ideas';
        searchSubject = 'subject:philosophy';
      }

      const reasonText = seed.rating && seed.rating >= 4
        ? `Because you gave ${seed.rating}★ to "${seed.title}"`
        : `Matches your interest in ${seed.genre || seed.title}`;

      try {
        const candidates = await fetchCandidateBooks(searchSubject, genreKey, signal, reasonText, seed.genre);
        let addedCountForSeed = 0;
        for (const c of candidates) {
          const cNorm = normalizeStr(c.title);
          if (!addedTitles.has(cNorm) && !isAlreadyInLibrary(c.title, c.author, userBooks)) {
            addedTitles.add(cNorm);
            combinedResults.push(c);
            addedCountForSeed++;
            if (addedCountForSeed >= 2) break;
          }
        }
      } catch (e: any) {
        if (e.name === 'AbortError') throw e;
      }
    }
  }

  if (combinedResults.length < 4) {
    const defaultCandidates = await fetchCandidateBooks('subject:fiction', 'fiction-classics', signal, 'Popular reading choice');
    for (const c of defaultCandidates) {
      const cNorm = normalizeStr(c.title);
      if (!addedTitles.has(cNorm) && !isAlreadyInLibrary(c.title, c.author, userBooks)) {
        addedTitles.add(cNorm);
        combinedResults.push(c);
      }
    }
  }

  setCache(cacheKey, combinedResults);
  return combinedResults;
}

/**
 * Mode 2: Truly Unexplored Genres (with Dynamic Rotation on Refresh)
 */
export async function getRecommendationsForUnexplored(
  userBooks: Book[],
  signal?: AbortSignal,
  userId: string = 'guest'
): Promise<{ genre: UmbrellaGenre; books: RecommendedBook[] }[]> {
  const cacheKey = `cursus_rec_unexplored_${userId}`;
  const cachedStr = localStorage.getItem(cacheKey);
  if (cachedStr) {
    try {
      const parsed = JSON.parse(cachedStr);
      if (Date.now() - parsed.timestamp < CACHE_TTL_MS) {
        const dismissed = getDismissedBookIds();
        const validItems = parsed.data.map((item: any) => ({
          ...item,
          books: item.books.filter((b: RecommendedBook) => !dismissed.includes(b.id) && !isAlreadyInLibrary(b.title, b.author, userBooks)),
        })).filter((item: any) => item.books.length > 0);
        
        // Invalidate if any item in unexplored sections lacks a synopsis
        const hasEmptyDesc = validItems.some((sec: any) => sec.books.some((b: RecommendedBook) => !b.description));
        if (validItems.length > 0 && !hasEmptyDesc) return validItems;
      }
    } catch {
      // Ignore invalid cache
    }
  }

  const exploredGenreIds = getExploredUmbrellaGenreIds(userBooks);
  let unexplored = UMBRELLA_GENRES.filter((ug) => !exploredGenreIds.has(ug.id));

  if (unexplored.length === 0) {
    unexplored = [...UMBRELLA_GENRES];
  }

  const targetGenres = shuffleArray(unexplored).slice(0, 3);
  const results: { genre: UmbrellaGenre; books: RecommendedBook[] }[] = [];

  for (const ug of targetGenres) {
    try {
      const books = await fetchCandidateBooks(
        ug.searchTerms,
        ug.id,
        signal,
        `Explore ${ug.label}`,
        ug.label
      );
      const filtered = books.filter((b) => !isAlreadyInLibrary(b.title, b.author, userBooks)).slice(0, 4);
      if (filtered.length > 0) {
        results.push({ genre: ug, books: filtered });
      }
    } catch (e: any) {
      if (e.name === 'AbortError') throw e;
      console.error(`Error fetching unexplored genre ${ug.label}:`, e);
    }
  }

  try {
    localStorage.setItem(cacheKey, JSON.stringify({ timestamp: Date.now(), data: results }));
  } catch (_) {}

  return results;
}

/**
 * Mode 3: Recommendations by specific selected Umbrella Genre
 */
export async function getRecommendationsByGenre(
  umbrellaGenre: UmbrellaGenre,
  userBooks: Book[],
  signal?: AbortSignal,
  userId: string = 'guest'
): Promise<RecommendedBook[]> {
  const cacheKey = `cursus_rec_genre_${userId}_${umbrellaGenre.id}`;
  const cached = getCache(cacheKey);
  if (cached) {
    const dismissed = getDismissedBookIds();
    const filteredCache = cached.filter(
      (b) => !dismissed.includes(b.id) && !isAlreadyInLibrary(b.title, b.author, userBooks)
    );
    if (filteredCache.length >= 3) return filteredCache;
  }

  const rawBooks = await fetchCandidateBooks(
    umbrellaGenre.searchTerms,
    umbrellaGenre.id,
    signal,
    `Top pick in ${umbrellaGenre.label}`,
    umbrellaGenre.label
  );
  const filtered = rawBooks.filter((b) => !isAlreadyInLibrary(b.title, b.author, userBooks));
  
  setCache(cacheKey, filtered);
  return filtered;
}

/**
 * Mode 4: Freeform Custom Keyword / Author / Genre Recommendation Engine Search
 */
export async function getRecommendationsBySearch(
  queryStr: string,
  userBooks: Book[],
  signal?: AbortSignal
): Promise<RecommendedBook[]> {
  if (!queryStr.trim()) return [];

  const rawBooks = await fetchCandidateBooks(
    queryStr,
    'fiction-classics',
    signal,
    `Matches search "${queryStr}"`,
    'Custom Search'
  );

  return rawBooks.filter((b) => !isAlreadyInLibrary(b.title, b.author, userBooks));
}
