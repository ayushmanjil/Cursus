export type RecommendationMode = 'activity' | 'explore' | 'genre' | 'search';

export interface RecommendedBook {
  id: string;
  title: string;
  author: string;
  genre: string;
  coverUrl?: string;
  description: string; // empty string if no real description exists
  pageCount?: number;
  averageRating?: number;
  reason: string;
  sourceGenre?: string;
}

export interface UmbrellaGenre {
  id: string;
  label: string;
  description: string;
  searchTerms: string;
}

export const UMBRELLA_GENRES: UmbrellaGenre[] = [
  {
    id: 'thrillers',
    label: 'Thrillers & Crime',
    description: 'Psychological thrillers, mystery, detective & suspense fiction',
    searchTerms: 'subject:thriller OR subject:mystery OR subject:crime',
  },
  {
    id: 'scifi-fantasy',
    label: 'Sci-Fi & Fantasy',
    description: 'Space opera, cyberpunk, epic fantasy & magic realism',
    searchTerms: 'subject:science fiction OR subject:fantasy',
  },
  {
    id: 'self-improvement',
    label: 'Self-Improvement & Habits',
    description: 'Personal development, productivity, mindset & growth',
    searchTerms: 'subject:self-help OR subject:personal growth OR subject:success',
  },
  {
    id: 'psychology-mind',
    label: 'Psychology & Behavioral Science',
    description: 'Human behavior, cognitive neuroscience & mental models',
    searchTerms: 'subject:psychology OR subject:neuroscience OR subject:human behavior',
  },
  {
    id: 'business-finance',
    label: 'Business & Economics',
    description: 'Entrepreneurship, leadership, strategy & investing',
    searchTerms: 'subject:business OR subject:economics OR subject:finance',
  },
  {
    id: 'history-biography',
    label: 'History & Biography',
    description: 'Historical events, memoirs, leaders & biographies',
    searchTerms: 'subject:history OR subject:biography OR subject:memoir',
  },
  {
    id: 'philosophy-ideas',
    label: 'Philosophy & Big Ideas',
    description: 'Stoicism, ethics, modern philosophy & wisdom',
    searchTerms: 'subject:philosophy OR subject:ethics OR subject:thought',
  },
  {
    id: 'fiction-classics',
    label: 'Literary Fiction & Classics',
    description: 'Contemporary literature, modern classics & fiction masterpieces',
    searchTerms: 'subject:fiction OR subject:literature',
  },
];
