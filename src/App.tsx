import { useEffect, useMemo, useRef, useState, useCallback } from 'react';
import type { Book, BookStatus, FilterState, SortState, ViewKey } from './types/book';
import { emptyFilter } from './types/book';
import { useBooks } from './hooks/useBooks';
import { useTheme } from './hooks/useTheme';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { BookGrid } from './components/BookGrid';
import { Dashboard } from './components/Dashboard';
import { AddBookModal } from './components/AddBookModal';
import { BookDetailsModal } from './components/BookDetailsModal';
import { RatingPromptModal } from './components/RatingPromptModal';
import { Button } from './components/ui/Button';
import { Plus } from 'lucide-react';


import { StreakManager } from './components/StreakManager';
import type { StreakLog } from './components/StreakManager';
import { Login } from './components/Login';
import type { User } from './types/user';
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import { Profile } from './components/Profile';

const viewMeta: Record<ViewKey, { title: string; subtitle: string }> = {
  dashboard: { title: 'Dashboard', subtitle: 'Your library at a glance' },
  'on-shelf': { title: 'On Shelf', subtitle: 'Owned & waiting to be cracked open' },
  wishlist: { title: 'The Hunt List', subtitle: 'Books you\'re dying to get your hands on' },
  reading: { title: 'Reading', subtitle: 'What you have open right now' },
  read: { title: 'Read', subtitle: 'Everything you have finished' },
  favorites: { title: 'Favorites', subtitle: 'The ones you loved most' },
  stats: { title: 'Statistics', subtitle: 'Trends across your whole library' },
  streaks: { title: 'Reading Streaks', subtitle: 'Log reading ticks, pages, and times' },
  profile: { title: 'Profile Settings', subtitle: 'Manage your personal details and credentials' },
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const { books, addBook, updateBook, deleteBook, setStatus, toggleFavorite, importBooks, genres } =
    useBooks(currentUser?.id);
  const { theme, toggleTheme } = useTheme();

  const [streakLog, setStreakLogState] = useState<StreakLog>({});

  // Sync user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      if (firebaseUser) {
        const username = firebaseUser.email?.split('@')[0] || '';
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || username,
          username: username,
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Sync streak log with Firestore
  useEffect(() => {
    if (!currentUser) {
      setStreakLogState({});
      return;
    }
    const docRef = doc(db, 'users', currentUser.id, 'streaks', 'log');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setStreakLogState(docSnap.data().log || {});
      } else {
        setStreakLogState({});
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const setStreakLog = useCallback(
    async (newLog: StreakLog | ((prev: StreakLog) => StreakLog)) => {
      if (!currentUser) return;
      const docRef = doc(db, 'users', currentUser.id, 'streaks', 'log');
      
      let nextLog: StreakLog;
      if (typeof newLog === 'function') {
        nextLog = newLog(streakLog);
      } else {
        nextLog = newLog;
      }
      
      await setDoc(docRef, { log: nextLog });
    },
    [currentUser, streakLog]
  );

  const [view, setView] = useState<ViewKey>('dashboard');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ field: 'title', order: 'asc' });
  const [filter, setFilter] = useState<FilterState>(emptyFilter);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [addOpen, setAddOpen] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null);
  const [ratingPromptBookId, setRatingPromptBookId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedBook = books.find((b) => b.id === selectedBookId) ?? null;
  const ratingPromptBook = books.find((b) => b.id === ratingPromptBookId) ?? null;

  const handleSetStatus = (id: string, status: BookStatus) => {
    setStatus(id, status);
    if (status === 'read') {
      setRatingPromptBookId(id);
    }
  };

  const counts = useMemo(
    () => ({
      dashboard: 0,
      'on-shelf': books.filter((b) => b.status === 'on-shelf').length,
      wishlist: books.filter((b) => b.status === 'wishlist').length,
      reading: books.filter((b) => b.status === 'reading').length,
      read: books.filter((b) => b.status === 'read').length,
      favorites: books.filter((b) => b.favorite).length,
      stats: 0,
      streaks: 0,
      profile: 0,
    }),
    [books]
  );

  const filteredSorted = useMemo(() => {
    let list = books.slice();

    if (view === 'on-shelf' || view === 'wishlist' || view === 'reading' || view === 'read') {
      list = list.filter((b) => b.status === view);
    } else if (view === 'favorites') {
      list = list.filter((b) => b.favorite);
    }

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          b.author.toLowerCase().includes(q) ||
          b.genre.toLowerCase().includes(q)
      );
    }

    if (filter.genre !== 'all') list = list.filter((b) => b.genre === filter.genre);
    if (filter.favoritesOnly) list = list.filter((b) => b.favorite);
    if (filter.minRating > 0) list = list.filter((b) => (b.rating ?? 0) >= filter.minRating);
    if (filter.status !== 'all') list = list.filter((b) => b.status === filter.status);

    list.sort((a, b) => {
      let cmp = 0;
      switch (sort.field) {
        case 'title':
          cmp = a.title.localeCompare(b.title);
          break;
        case 'author':
          cmp = a.author.localeCompare(b.author);
          break;
        case 'dateFinished':
          cmp = (a.dateFinished ?? '').localeCompare(b.dateFinished ?? '');
          break;
        case 'rating':
          cmp = (a.rating ?? 0) - (b.rating ?? 0);
          break;
      }
      return sort.order === 'asc' ? cmp : -cmp;
    });

    return list;
  }, [books, view, search, filter, sort]);

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(books, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `my-library-export-${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleImportFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (!Array.isArray(parsed)) throw new Error('Invalid format');
        const valid: Book[] = parsed.filter(
          (b: any) => b && typeof b.id === 'string' && typeof b.title === 'string'
        );
        if (valid.length === 0) throw new Error('No valid books found');
        importBooks(valid, 'merge');
        alert(`Imported ${valid.length} book(s).`);
      } catch (err) {
        alert('Could not import this file. Please make sure it is a valid Cursus JSON export.');
      }
    };
    reader.readAsText(file);
  };

  const handleLogout = () => {
    auth.signOut();
    setCurrentUser(null);
  };

  const isListView = view === 'on-shelf' || view === 'wishlist' || view === 'reading' || view === 'read' || view === 'favorites';
  const meta = viewMeta[view];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bgdark-soft dark:bg-bgdark">
        <div className="flex flex-col items-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-brass-500 border-t-transparent" />
          <p className="text-sm font-medium text-ink-muted dark:text-paper/60">Syncing library...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex min-h-screen bg-paper text-ink dark:bg-bgdark dark:text-paper">
      <Sidebar
        active={view}
        onSelect={setView}
        counts={counts}
        theme={theme}
        onToggleTheme={toggleTheme}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onLogout={handleLogout}
        userName={currentUser?.name}
      />

      <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
        <TopBar
          title={meta.title}
          subtitle={meta.subtitle}
          search={search}
          onSearch={setSearch}
          sort={sort}
          onSort={setSort}
          filter={filter}
          onFilter={setFilter}
          genres={genres}
          onAddBook={() => setAddOpen(true)}
          onExport={handleExport}
          onImportClick={() => fileInputRef.current?.click()}
          onOpenMobileMenu={() => setMobileMenuOpen(true)}
          showControls={isListView}
        />

        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImportFile(file);
            e.target.value = '';
          }}
        />

        <main className="flex-1 px-4 py-6 sm:px-6">
          {view === 'dashboard' && (
            <Dashboard
              books={books}
              onOpen={(b) => setSelectedBookId(b.id)}
              onSelectView={setView}
              streakLog={streakLog}
              userId={currentUser?.id}
            />
          )}


          {view === 'streaks' && (
            <StreakManager
              log={streakLog}
              onUpdateLog={setStreakLog}
            />
          )}

          {view === 'profile' && currentUser && (
            <Profile
              currentUser={currentUser}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
            />
          )}

          {isListView && (
            <BookGrid
              books={filteredSorted}
              onOpen={(b) => setSelectedBookId(b.id)}
              onToggleFavorite={toggleFavorite}
              onSetStatus={handleSetStatus}
              onDelete={deleteBook}
              emptyTitle={
                view === 'favorites' ? 'No favorites yet' : `Nothing in ${meta.title}`
              }
              emptyDescription={
                search || filter.genre !== 'all' || filter.favoritesOnly || filter.minRating > 0
                  ? 'No books match your search and filters.'
                  : 'Add your first book to get started.'
              }
              emptyAction={
                <Button variant="primary" size="sm" onClick={() => setAddOpen(true)}>
                  <Plus size={14} /> Add Book
                </Button>
              }
            />
          )}
        </main>

        <footer className="py-5 text-center text-xs text-ink-faint dark:text-paper/30 border-t border-ink/5 dark:border-paper/5 mt-auto bg-paper-soft/40 dark:bg-bgdark-soft/40">
          © Ayush Manjil | <a href="mailto:manjilayush@gmail.com" className="hover:text-brass-500 transition-colors">manjilayush@gmail.com</a>
        </footer>
      </div>

      <AddBookModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onAdd={addBook}
        defaultStatus={
          view === 'reading' ? 'reading' : view === 'read' ? 'read' : view === 'wishlist' ? 'wishlist' : 'on-shelf'
        }
      />

      <BookDetailsModal
        book={selectedBook}
        onClose={() => setSelectedBookId(null)}
        onUpdate={updateBook}
        onSetStatus={handleSetStatus}
        onDelete={deleteBook}
      />

      <RatingPromptModal
        open={!!ratingPromptBook}
        bookTitle={ratingPromptBook?.title ?? ''}
        onSubmit={(rating) => {
          if (ratingPromptBookId) updateBook(ratingPromptBookId, { rating });
          setRatingPromptBookId(null);
        }}
        onSkip={() => setRatingPromptBookId(null)}
      />
    </div>
  );
}

export default App;
