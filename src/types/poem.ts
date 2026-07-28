export interface Poem {
  id: string; // author__title slug
  title: string;
  author: string;
  lines?: string[];
  linecount?: string | number;
}

export interface SavedPoem extends Poem {
  savedAt: string;
}

export interface ReadPoem extends Poem {
  readAt: string;
}
