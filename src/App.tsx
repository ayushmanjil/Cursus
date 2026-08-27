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
import BookLoader from './components/ui/BookLoader';
import {
  Plus,
  LayoutGrid,
  BookMarked,
  ShoppingBag,
  BookOpen,
  CheckCircle2,
  Heart,
  BarChart3,
  Flame,
  User as UserIcon,
  Target,
  Award,
  BookA,
  Timer,
  Sparkles,
  ScrollText,
} from 'lucide-react';
import { RecommendationsPage } from './components/RecommendationsPage';
import { FavoritesView } from './components/FavoritesView';
import { PoemsPage } from './components/PoemsPage';

import { StreakManager } from './components/StreakManager';
import type { StreakLog } from './components/StreakManager';
import { Login } from './components/Login';
import type { User } from './types/user';
import { auth, db } from './firebase';
import { doc, onSnapshot, setDoc, getDoc } from 'firebase/firestore';
import { Profile, getEarnedBadges } from './components/Profile';
import { DailyGoalsPage } from './components/DailyGoalsPage';
import { YearlyGoalsPage } from './components/YearlyGoalsPage';
import { WordLibraryPage } from './components/WordLibraryPage';
import { ReadingWrappedModal } from './components/ReadingWrappedModal';
import { FocusTimerPage } from './components/FocusTimerPage';
import { DynamicIslandTimerPill } from './components/DynamicIslandTimerPill';
import { useFocusTimer } from './hooks/useFocusTimer';
import { getLocalDateString } from './utils/helpers';
import { useWordLibrary } from './hooks/useWordLibrary';
import { usePoems } from './hooks/usePoems';
import { seedDemoDataIfEmpty } from './utils/demoData';
import { StatsPage } from './components/StatsPage';
import {
  getNavigationStateFromUrl,
  buildUrl,
  VIEW_TO_PATH,
  PATH_TO_VIEW,
  type NavigationState,
} from './utils/navigation';

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
  'daily-goals': { title: 'Daily Reading Goals', subtitle: 'Track and log your daily reading progress' },
  'yearly-goals': { title: 'Yearly Reading Goals', subtitle: 'Review your annual achievements and book targets' },
  'word-library': { title: 'Word Library', subtitle: 'Look up words and build your vocabulary' },
  timer: { title: 'The Reading Nook', subtitle: 'Your quiet space for focus and study' },
  recommendations: { title: 'Discover Books', subtitle: 'Personalized recommendations, genre exploration & discovery' },
  poems: { title: 'Poems', subtitle: 'Search classic poetry, mark as read, and save for later' },
};

const TAB_EXPLANATIONS: Record<ViewKey, { title: string; description: string; icon: React.ElementType }> = {
  dashboard: {
    title: 'Dashboard Overview',
    description: 'Welcome to your reading command center! View your active reading shelf, yearly book goals, daily reading targets, streak progress, and quick stats at a glance.',
    icon: LayoutGrid,
  },
  'on-shelf': {
    title: 'On Shelf Books',
    description: 'Books you own that are waiting to be read. Click any book card to view details, update status, or start reading.',
    icon: BookMarked,
  },
  wishlist: {
    title: 'The Hunt List (Wishlist)',
    description: 'Your personal book wishlist. Add titles you want to buy or borrow next and track books on your reading radar.',
    icon: ShoppingBag,
  },
  reading: {
    title: 'Currently Reading',
    description: 'Books you are actively reading right now. Track page numbers, log reading progress, write reviews, and mark as completed.',
    icon: BookOpen,
  },
  read: {
    title: 'Finished Books',
    description: 'Your completed reading archive. Review past ratings, notes, finishing dates, and total page accomplishments.',
    icon: CheckCircle2,
  },
  favorites: {
    title: 'Favorite Books',
    description: 'Your curated collection of top-rated and most cherished books in your library.',
    icon: Heart,
  },
  stats: {
    title: 'Library Statistics',
    description: 'Analytical charts and insights about your reading habits, favorite genres, top authors, and page progress over time.',
    icon: BarChart3,
  },
  streaks: {
    title: 'Reading Streaks',
    description: 'Build a daily reading habit! Log the days you read, track your active & longest reading streaks, and view your monthly reading calendar.',
    icon: Flame,
  },
  profile: {
    title: 'Profile & Account Settings',
    description: 'Customize your reader avatar, display name, view earned reader badges, and manage your account credentials.',
    icon: UserIcon,
  },
  'daily-goals': {
    title: 'Daily Reading Goals',
    description: 'Set your target daily reading pages or minutes, view historic daily goal completion, and track your daily streak history.',
    icon: Target,
  },
  'yearly-goals': {
    title: 'Yearly Reading Goals',
    description: 'Set your annual book reading target, track progress toward your annual goal, and review past yearly reading achievements.',
    icon: Award,
  },
  'word-library': {
    title: 'Word Library & Dictionary',
    description: 'Search English words, look up definitions, listen to pronunciations, and save vocabulary words to your personal library.',
    icon: BookA,
  },
  timer: {
    title: 'The Reading Nook (Focus Timer)',
    description: 'A quiet, distraction-free space for focus reading & study sessions. Features countdown Pomodoro presets, stopwatch, ambient background audio, and streak logging.',
    icon: Timer,
  },
  recommendations: {
    title: 'Book Discovery & Recommendation Hub',
    description: 'Discover your next favorite read through personalized activity scoring, unexplored genre exploration, and custom category browsing.',
    icon: Sparkles,
  },
  poems: {
    title: 'Poetry Library',
    description: 'Explore timeless poetry using PoetryDB. Search classic poems by title or author, read full verses, track completed poems, and save favorites for later.',
    icon: ScrollText,
  },
};

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const focusTimer = useFocusTimer();
  const { books, addBook, updateBook, deleteBook, setStatus, toggleFavorite, importBooks, genres } =
    useBooks(currentUser?.id);
  const { theme, toggleTheme } = useTheme();
  const { savedWords, addWord, removeWord, isWordSaved, addUserExample, removeUserExample } =
    useWordLibrary(currentUser?.id);
  const poems = usePoems(currentUser?.id);

  const [streakLog, setStreakLogState] = useState<StreakLog>({});

  // Daily Goal state
  const [dailyGoal, setDailyGoalState] = useState<number | null>(null);
  const [dailyGoalDate, setDailyGoalDate] = useState<string | null>(null);
  const [dailyGoalHistory, setDailyGoalHistory] = useState<Record<string, number>>({});

  // Yearly Goal state
  const [yearlyGoal, setYearlyGoalState] = useState<number | null>(null);
  const [yearlyGoalHistory, setYearlyGoalHistory] = useState<Record<string, number>>({});

  // Reset Account Data Modal State
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // Sync daily goal with Firestore
  useEffect(() => {
    if (!currentUser) {
      setDailyGoalState(null);
      setDailyGoalDate(null);
      setDailyGoalHistory({});
      return;
    }
    const docRef = doc(db, 'users', currentUser.id, 'settings', 'dailyGoal');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setDailyGoalState(typeof data.dailyGoal === 'number' ? data.dailyGoal : null);
        setDailyGoalDate(data.dailyGoalDate || null);
        setDailyGoalHistory(data.history || {});
      } else {
        setDailyGoalState(null);
        setDailyGoalDate(null);
        setDailyGoalHistory({});
      }
    });
    return unsubscribe;
  }, [currentUser]);

  // Sync yearly goal with Firestore
  useEffect(() => {
    if (!currentUser) {
      setYearlyGoalState(null);
      setYearlyGoalHistory({});
      return;
    }
    const docRef = doc(db, 'users', currentUser.id, 'settings', 'goal');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setYearlyGoalState(typeof data.yearlyGoal === 'number' ? data.yearlyGoal : null);
        setYearlyGoalHistory(data.history || {});
      } else {
        setYearlyGoalState(null);
        setYearlyGoalHistory({});
      }
    });
    return unsubscribe;
  }, [currentUser]);

  const handleUpdateDailyGoal = useCallback(
    async (newGoal: number, dateStr?: string) => {
      if (!currentUser) return;
      const todayStr = getLocalDateString(new Date());
      const targetDate = dateStr || todayStr;
      const docRef = doc(db, 'users', currentUser.id, 'settings', 'dailyGoal');
      const nextHistory = { ...dailyGoalHistory, [targetDate]: newGoal };
      await setDoc(docRef, {
        dailyGoal: newGoal,
        dailyGoalDate: targetDate,
        history: nextHistory,
      }, { merge: true });
    },
    [currentUser, dailyGoalHistory]
  );

  const handleUpdateYearlyGoal = useCallback(
    async (newGoal: number, yearVal?: number) => {
      if (!currentUser) return;
      const currentYear = new Date().getFullYear();
      const targetYear = yearVal || currentYear;
      const docRef = doc(db, 'users', currentUser.id, 'settings', 'goal');
      const nextHistory = { ...yearlyGoalHistory, [String(targetYear)]: newGoal };
      await setDoc(docRef, {
        yearlyGoal: newGoal,
        yearlyGoalYear: targetYear,
        history: nextHistory,
      }, { merge: true });
    },
    [currentUser, yearlyGoalHistory]
  );

  // Sync user authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        const username = firebaseUser.email?.split('@')[0] || '';
        // Load avatar from Firestore profile settings
        let avatarId: string | undefined;
        try {
          const profileDoc = await getDoc(doc(db, 'users', firebaseUser.uid, 'settings', 'profile'));
          if (profileDoc.exists()) {
            avatarId = profileDoc.data().avatarId || undefined;
          }
        } catch (_) {
          // ignore — avatar is optional
        }
        setCurrentUser({
          id: firebaseUser.uid,
          name: firebaseUser.displayName || username,
          username: username,
          avatarId,
        });
      } else {
        setCurrentUser(null);
      }
      setAuthLoading(false);
    });
    return unsubscribe;
  }, []);

  // Seed demo data if demo account is active
  useEffect(() => {
    if (currentUser?.username === 'demo' && currentUser?.id) {
      seedDemoDataIfEmpty(currentUser.id);
    }
  }, [currentUser]);

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

  // Sync acknowledged badge IDs with Firestore (cross-device)
  const [acknowledgedBadgeIds, setAcknowledgedBadgeIds] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setAcknowledgedBadgeIds([]);
      return;
    }
    const docRef = doc(db, 'users', currentUser.id, 'settings', 'acknowledgedBadges');
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setAcknowledgedBadgeIds(Array.isArray(data.ids) ? data.ids : []);
      } else {
        setAcknowledgedBadgeIds([]);
      }
    });
    return unsubscribe;
  }, [currentUser]);

  // Calculate earned badges
  const earnedBadges = useMemo(() => {
    if (!currentUser) return [];
    return getEarnedBadges(books, streakLog);
  }, [books, streakLog, currentUser]);

  const hasPendingBadge = useMemo(() => {
    return earnedBadges.some((b) => !acknowledgedBadgeIds.includes(b.id));
  }, [earnedBadges, acknowledgedBadgeIds]);

  const handleAcknowledgeBadges = useCallback(async (badgeIds: string[]) => {
    if (!currentUser) return;
    setAcknowledgedBadgeIds(badgeIds);
    const docRef = doc(db, 'users', currentUser.id, 'settings', 'acknowledgedBadges');
    await setDoc(docRef, { ids: badgeIds }, { merge: true });
  }, [currentUser]);

  const initialNavState = useMemo(() => getNavigationStateFromUrl(), []);
  const [view, setViewState] = useState<ViewKey>(initialNavState.view);
  const [addOpen, setAddOpenState] = useState<boolean>(initialNavState.addOpen);
  const [selectedBookId, setSelectedBookIdState] = useState<string | null>(initialNavState.selectedBookId);
  const [ratingPromptBookId, setRatingPromptBookId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [sort, setSort] = useState<SortState>({ field: 'title', order: 'asc' });
  const [filter, setFilter] = useState<FilterState>(emptyFilter);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showWrappedModal, setShowWrappedModal] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const isDec31 = (now.getMonth() === 11 && now.getDate() === 31) || currentUser?.username === 'demo';

  const [seenWrappedYears, setSeenWrappedYears] = useState<number[]>(() => {
    try {
      const stored = localStorage.getItem('cursus_seen_wrapped_years');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const showWrappedPill = isDec31 && !seenWrappedYears.includes(currentYear);

  const markWrappedAsSeen = useCallback(() => {
    setSeenWrappedYears((prev) => {
      if (prev.includes(currentYear)) return prev;
      const updated = [...prev, currentYear];
      try {
        localStorage.setItem('cursus_seen_wrapped_years', JSON.stringify(updated));
      } catch (_) {}
      return updated;
    });
  }, [currentYear]);

  // Sync document title to always display Cursus
  useEffect(() => {
    document.title = 'Cursus';
  }, []);

  // Navigate to new view using History API pushState
  const setView = useCallback(
    (nextView: ViewKey) => {
      setViewState((prevView) => {
        if (prevView === nextView && !selectedBookId && !addOpen) return prevView;
        const nextUrl = buildUrl(nextView, null, false);
        const nextState = { view: nextView, selectedBookId: null, addOpen: false };
        window.history.pushState(nextState, '', nextUrl);
        setSelectedBookIdState(null);
        setAddOpenState(false);
        return nextView;
      });
    },
    [selectedBookId, addOpen]
  );

  const handleOpenWrappedFromPill = useCallback(() => {
    setView('yearly-goals');
    setShowWrappedModal(true);
    markWrappedAsSeen();
  }, [setView, markWrappedAsSeen]);

  // Open / Close Book Modal with History state
  const setSelectedBookId = useCallback(
    (id: string | null) => {
      if (id) {
        const nextUrl = buildUrl(view, id, false);
        const nextState = { view, selectedBookId: id, addOpen: false };
        window.history.pushState(nextState, '', nextUrl);
        setSelectedBookIdState(id);
        setAddOpenState(false);
      } else {
        if (window.history.state?.selectedBookId) {
          window.history.back();
        } else {
          const nextUrl = buildUrl(view, null, false);
          window.history.replaceState({ view, selectedBookId: null, addOpen: false }, '', nextUrl);
          setSelectedBookIdState(null);
        }
      }
    },
    [view]
  );

  // Open / Close Add Book Modal with History state
  const setAddOpen = useCallback(
    (open: boolean) => {
      if (open) {
        const nextUrl = buildUrl(view, null, true);
        const nextState = { view, selectedBookId: null, addOpen: true };
        window.history.pushState(nextState, '', nextUrl);
        setAddOpenState(true);
        setSelectedBookIdState(null);
      } else {
        if (window.history.state?.addOpen) {
          window.history.back();
        } else {
          const nextUrl = buildUrl(view, null, false);
          window.history.replaceState({ view, selectedBookId: null, addOpen: false }, '', nextUrl);
          setAddOpenState(false);
        }
      }
    },
    [view]
  );

  // Sync initial state and handle popstate for browser Back / Forward buttons
  useEffect(() => {
    const currentNav = getNavigationStateFromUrl();
    const currentUrl = buildUrl(currentNav.view, currentNav.selectedBookId, currentNav.addOpen);
    window.history.replaceState(
      {
        view: currentNav.view,
        selectedBookId: currentNav.selectedBookId,
        addOpen: currentNav.addOpen,
      },
      '',
      currentUrl
    );

    const handlePopState = (event: PopStateEvent) => {
      let navState: NavigationState;
      if (event.state && event.state.view && PATH_TO_VIEW[VIEW_TO_PATH[event.state.view as ViewKey]]) {
        navState = {
          view: event.state.view as ViewKey,
          selectedBookId: event.state.selectedBookId || null,
          addOpen: !!event.state.addOpen,
        };
      } else {
        navState = getNavigationStateFromUrl();
      }

      setViewState(navState.view);
      setSelectedBookIdState(navState.selectedBookId);
      setAddOpenState(navState.addOpen);
      setMobileMenuOpen(false);
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);


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
      favorites: books.filter((b) => b.favorite).length + poems.favoritePoems.length,
      stats: 0,
      streaks: 0,
      profile: 0,
      'daily-goals': 0,
      'yearly-goals': 0,
      'word-library': 0,
      timer: 0,
      recommendations: 0,
      poems: poems.readPoems.length,
    }),
    [books, poems.readPoems.length, poems.favoritePoems.length]
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

  const isListView = view === 'on-shelf' || view === 'wishlist' || view === 'reading' || view === 'read';
  const showTopBarControls = isListView;
  const meta = viewMeta[view];

  if (authLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bgdark-soft dark:bg-bgdark">
        <div className="flex flex-col items-center gap-4">
          <BookLoader size="lg" color="brass" />
          <p className="text-sm font-medium text-ink-muted dark:text-paper/60">Syncing library...</p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return <Login onLoginSuccess={(user) => setCurrentUser(user)} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-paper text-ink dark:bg-bgdark dark:text-paper">
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
        userAvatarId={currentUser?.avatarId}
        hasPendingBadge={hasPendingBadge}
      />

      <div className="flex h-screen flex-1 flex-col lg:pl-0 overflow-x-hidden overflow-y-auto">
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
          showControls={showTopBarControls}
          showImportExport={view === 'profile'}
          showResetData={view === 'profile'}
          onResetData={() => setResetModalOpen(true)}
        />

        {/* Top Floating Hover Pills Container (Demo Mode & Active Timer) */}
        <div className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 pointer-events-auto">
          {/* Active Focus Session Dynamic Island Floating Pill */}
          <DynamicIslandTimerPill
            timerHook={focusTimer}
            onNavigateToTimer={() => setView('timer')}
            visible={focusTimer.isRunning && view !== 'timer'}
          />

          {/* Reading Wrapped Floating Pill */}
          {showWrappedPill && (
            <button
              onClick={handleOpenWrappedFromPill}
              className="group relative flex items-center gap-2 rounded-full border-2 border-brass-500/40 bg-brass-500/20 px-4 py-1.5 text-sm font-bold text-brass-900 shadow-md backdrop-blur-md dark:border-brass-500/40 dark:bg-brass-500/25 dark:text-brass-300 transition-all duration-200 hover:scale-105"
            >
              <Sparkles size={16} className="text-brass-500 animate-pulse" />
              <span>View Reading Wrapped {currentYear}</span>
              <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden w-64 rounded-lg border border-ink/10 bg-surface p-2.5 text-xs font-normal text-center text-ink-muted shadow-xl dark:border-paper/10 dark:bg-surface-dark dark:text-paper/70 group-hover:block transition-all z-50">
                Your annual reading summary is ready! Tap to view your {currentYear} Reading Wrapped card.
              </div>
            </button>
          )}

          {/* Demo Mode Pill */}
          {currentUser?.username === 'demo' && (
            <div className="group relative flex items-center gap-2 rounded-full border-2 border-amber-500/40 bg-amber-500/20 px-4 py-1.5 text-sm font-bold text-amber-900 shadow-md backdrop-blur-md dark:border-amber-500/40 dark:bg-amber-500/25 dark:text-amber-300 transition-all duration-200 hover:scale-105">
              <span className="h-2.5 w-2.5 rounded-full bg-amber-500 animate-pulse" />
              <span>Demo Mode</span>
              <div className="pointer-events-none absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden w-60 rounded-lg border border-ink/10 bg-surface p-3 text-xs font-normal text-center text-ink-muted shadow-xl dark:border-paper/10 dark:bg-surface-dark dark:text-paper/70 group-hover:block transition-all z-50">
                You are exploring in Demo Mode. Changes made won't be saved permanently.
              </div>
            </div>
          )}
        </div>

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
          {/* Tab Purpose & Feature Explanation Banner (Demo Mode Only) */}
          {currentUser?.username === 'demo' && (() => {
            const exp = TAB_EXPLANATIONS[view];
            if (!exp) return null;
            const ExpIcon = exp.icon;
            return (
              <div className="mb-6 rounded-xl border border-brass-500/20 bg-brass-50/50 p-3.5 dark:border-brass-500/10 dark:bg-brass-500/5">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-brass-500/15 text-brass-700 dark:bg-brass-500/20 dark:text-brass-300">
                    <ExpIcon size={16} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xs font-bold uppercase tracking-wider text-brass-700 dark:text-brass-400">
                      {exp.title}
                    </h3>
                    <p className="mt-0.5 text-xs text-ink-muted dark:text-paper/70 leading-relaxed">
                      {exp.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}
          {view === 'dashboard' && (() => {
            const todayStr = getLocalDateString(new Date());
            const effectiveDailyGoal = dailyGoalDate === todayStr ? dailyGoal : null;
            return (
              <Dashboard
                books={books}
                onOpen={(b) => setSelectedBookId(b.id)}
                onSelectView={setView}
                streakLog={streakLog}
                dailyGoal={effectiveDailyGoal}
                setDailyGoal={handleUpdateDailyGoal}
                yearlyGoal={yearlyGoal}
                setYearlyGoal={handleUpdateYearlyGoal}
                readPoemsCount={poems.readPoems.length}
                savedPoemsCount={poems.savedPoems.length}
                favoritePoemsCount={poems.favoritePoems.length}
                favoritePoems={poems.favoritePoems}
                savedWordsCount={savedWords.length}
                savedWords={savedWords}
                isFavoritePoem={poems.isFavorite}
                isReadPoem={poems.isRead}
                isSavedPoem={poems.isSaved}
                onToggleFavoritePoem={poems.toggleFavorite}
                onToggleReadPoem={poems.toggleRead}
                onToggleSavedPoem={poems.toggleSaved}
                onRemoveWord={removeWord}
                onAddWordExample={addUserExample}
                onRemoveWordExample={removeUserExample}
                onUpdateBook={updateBook}
              />
            );
          })()}

          {view === 'daily-goals' && currentUser && (
            <DailyGoalsPage
              streakLog={streakLog}
              onUpdateStreakLog={setStreakLog}
              dailyGoalHistory={dailyGoalHistory}
              onUpdateDailyGoal={handleUpdateDailyGoal}
              onBack={() => setView('dashboard')}
            />
          )}

          {view === 'yearly-goals' && currentUser && (
            <YearlyGoalsPage
              books={books}
              yearlyGoal={yearlyGoal}
              yearlyGoalHistory={yearlyGoalHistory}
              onUpdateYearlyGoal={handleUpdateYearlyGoal}
              onBack={() => setView('dashboard')}
              onOpenBook={(b) => setSelectedBookId(b.id)}
              onOpenWrapped={() => {
                setShowWrappedModal(true);
                markWrappedAsSeen();
              }}
            />
          )}

          {view === 'streaks' && (
            <StreakManager
              log={streakLog}
              onUpdateLog={setStreakLog}
            />
          )}

          {view === 'timer' && (
            <FocusTimerPage timerHook={focusTimer} onNavigateToStreaks={() => setView('streaks')} />
          )}

          {view === 'stats' && <StatsPage books={books} onOpenBook={(b) => setSelectedBookId(b.id)} />}

          {view === 'recommendations' && (
            <RecommendationsPage
              userBooks={books}
              userId={currentUser?.id}
              onAddToHuntList={addBook}
            />
          )}

          {view === 'word-library' && currentUser && (
            <WordLibraryPage
              savedWords={savedWords}
              addWord={addWord}
              removeWord={removeWord}
              isWordSaved={isWordSaved}
              addUserExample={addUserExample}
              removeUserExample={removeUserExample}
            />
          )}

          {view === 'poems' && (
            <PoemsPage
              readPoems={poems.readPoems}
              savedPoems={poems.savedPoems}
              favoritePoems={poems.favoritePoems}
              onMarkAsRead={poems.markAsRead}
              onRemoveFromRead={poems.removeFromRead}
              isRead={poems.isRead}
              onSaveForLater={poems.saveForLater}
              onRemoveFromSaved={poems.removeFromSaved}
              isSaved={poems.isSaved}
              isFavorite={poems.isFavorite}
              onToggleRead={poems.toggleRead}
              onToggleSaved={poems.toggleSaved}
              onToggleFavorite={poems.toggleFavorite}
            />
          )}

          {view === 'profile' && currentUser && (
            <Profile
              currentUser={currentUser}
              onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
              books={books}
              streakLog={streakLog}
              acknowledgedBadgeIds={acknowledgedBadgeIds}
              onAcknowledgeBadges={handleAcknowledgeBadges}
              resetModalOpen={resetModalOpen}
              onCloseResetModal={() => setResetModalOpen(false)}
            />
          )}

          {view === 'favorites' && (
            <FavoritesView
              books={books}
              onOpenBook={(b) => setSelectedBookId(b.id)}
              onToggleFavoriteBook={toggleFavorite}
              onSetStatus={handleSetStatus}
              onDeleteBook={deleteBook}
              onOpenAddBook={() => setAddOpen(true)}
              favoritePoems={poems.favoritePoems}
              isFavoritePoem={poems.isFavorite}
              isReadPoem={poems.isRead}
              isSavedPoem={poems.isSaved}
              onToggleFavoritePoem={poems.toggleFavorite}
              onToggleReadPoem={poems.toggleRead}
              onToggleSavedPoem={poems.toggleSaved}
              onNavigateToPoems={() => setView('poems')}
            />
          )}

          {isListView && (
            <BookGrid
              books={filteredSorted}
              onOpen={(b) => setSelectedBookId(b.id)}
              onToggleFavorite={toggleFavorite}
              onSetStatus={handleSetStatus}
              onDelete={deleteBook}
              emptyTitle={`Nothing in ${meta.title}`}
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

      <ReadingWrappedModal
        open={showWrappedModal}
        onClose={() => setShowWrappedModal(false)}
        books={books}
        streakLog={streakLog}
        userName={currentUser?.name}
        earnedBadgesCount={earnedBadges.length}
      />
    </div>
  );
}

export default App;
