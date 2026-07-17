import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Key,
  Calendar,
  Clock,
  ArrowLeft,
  BookOpen,
  Sparkles,
  Flame,
  Award,
  Compass,
  Heart,
  Library,
  Trophy,
  Crown,
  Star,
  Scroll,
  Shield,
  Gem,
  Zap,
  Eye,
  EyeOff,
  Camera
} from 'lucide-react';
import { Button } from './ui/Button';
import { auth, db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import type { Book } from '../types/book';
import type { StreakLog } from './StreakManager';
import { calculateStreaks } from '../utils/helpers';
import { AvatarPicker } from './AvatarPicker';
import { AVATARS } from '../data/avatars';
import type { AvatarOption } from '../data/avatars';

interface ProfileProps {
  currentUser: { id: string; name: string; username: string; avatarId?: string };
  onUpdateUser: (updatedUser: { id: string; name: string; username: string; avatarId?: string }) => void;
  books: Book[];
  streakLog: StreakLog;
  acknowledgedBadgeIds: string[];
  onAcknowledgeBadges: (badgeIds: string[]) => void;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'books' | 'pages' | 'streaks';
  icon: string;
  colorClass: string;
  requirementText: string;
  isEarned: (stats: { booksRead: number; pagesRead: number; highestStreak: number }, books: Book[]) => boolean;
  motivationalText: string;
}

const BADGES: Badge[] = [
  {
    id: 'first_chapter',
    title: 'First Chapter',
    description: 'Complete your first book.',
    category: 'books',
    icon: 'BookOpen',
    colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    requirementText: '1 Book',
    isEarned: ({ booksRead }) => booksRead >= 1,
    motivationalText: "First book read! Every legendary library begins with a single completed page."
  },
  {
    id: 'beginners_spark',
    title: "Beginner's Spark",
    description: 'Achieve a 3-day reading streak.',
    category: 'streaks',
    icon: 'Flame',
    colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    requirementText: '3d Streak',
    isEarned: ({ highestStreak }) => highestStreak >= 3,
    motivationalText: "3-day streak! You've kindled the spark of a new reading habit. Keep the flame glowing!"
  },
  {
    id: 'page_turner',
    title: 'Page Turner',
    description: 'Read 500 pages.',
    category: 'pages',
    icon: 'Zap',
    colorClass: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20',
    requirementText: '500 Pgs',
    isEarned: ({ pagesRead }) => pagesRead >= 500,
    motivationalText: "500 pages completed! Your dedication is visible page by page. Keep them turning!"
  },
  {
    id: 'bookworm',
    title: 'Bookworm',
    description: 'Complete 5 books.',
    category: 'books',
    icon: 'Library',
    colorClass: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
    requirementText: '5 Books',
    isEarned: ({ booksRead }) => booksRead >= 5,
    motivationalText: "5 books finished! A true bookworm doesn't crawl; they journey through entire universes."
  },
  {
    id: 'unstoppable',
    title: 'Unstoppable',
    description: 'Achieve a 7-day reading streak.',
    category: 'streaks',
    icon: 'Star',
    colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    requirementText: '7d Streak',
    isEarned: ({ highestStreak }) => highestStreak >= 7,
    motivationalText: "7-day streak! You are Unstoppable. Consistency is now your second nature."
  },
  {
    id: 'literary_scholar',
    title: 'Literary Scholar',
    description: 'Read 1,000 pages.',
    category: 'pages',
    icon: 'Scroll',
    colorClass: 'text-teal-500 bg-teal-500/10 border-teal-500/20',
    requirementText: '1,000 Pgs',
    isEarned: ({ pagesRead }) => pagesRead >= 1000,
    motivationalText: "1,000 pages completed! You have crossed the milestone of a true literary scholar. Keep devouring text!"
  },
  {
    id: 'tome_conqueror',
    title: 'Tome Conqueror',
    description: 'Complete a single book of 500+ pages.',
    category: 'books',
    icon: 'Shield',
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    requirementText: '500+ Pg Book',
    isEarned: (_, books) => books.some(b => b.status === 'read' && (b.totalPages || 0) >= 500),
    motivationalText: "Tome Conqueror! You've completed a book with over 500 pages. Large volumes do not intimidate you; they invite you."
  },
  {
    id: 'book_devotee',
    title: 'Book Devotee',
    description: 'Achieve a 30-day reading streak.',
    category: 'streaks',
    icon: 'Gem',
    colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    requirementText: '30d Streak',
    isEarned: ({ highestStreak }) => highestStreak >= 30,
    motivationalText: "30-day streak! Your devotion to reading is stellar. You've forged a lifelong custom."
  },
  {
    id: 'bibliophile',
    title: 'Bibliophile',
    description: 'Complete 15 books.',
    category: 'books',
    icon: 'Heart',
    colorClass: 'text-pink-500 bg-pink-500/10 border-pink-500/20',
    requirementText: '15 Books',
    isEarned: ({ booksRead }) => booksRead >= 15,
    motivationalText: "15 books read! Your heart beats in stories. You live the lives on the page."
  },
  {
    id: 'epic_voyager',
    title: 'Epic Voyager',
    description: 'Read 5,000 pages.',
    category: 'pages',
    icon: 'Compass',
    colorClass: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
    requirementText: '5k Pgs',
    isEarned: ({ pagesRead }) => pagesRead >= 5000,
    motivationalText: "5,000 pages read! You have traversed prose valleys and summitted literary heights."
  },
  {
    id: 'immortal_reader',
    title: 'Immortal Reader',
    description: 'Achieve a 100-day reading streak.',
    category: 'streaks',
    icon: 'Crown',
    colorClass: 'text-red-500 bg-red-500/10 border-red-500/20',
    requirementText: '100d Streak',
    isEarned: ({ highestStreak }) => highestStreak >= 100,
    motivationalText: "100-day streak! The legend is true: you are an Immortal Reader. Time itself bows to your pages."
  }
];

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Library,
  Heart,
  Sparkles,
  Flame,
  Award,
  Compass,
  Trophy,
  Crown,
  Star,
  Scroll,
  Shield,
  Gem,
  Zap
};

export function getEarnedBadges(books: Book[], streakLog: StreakLog) {
  const totalBooksRead = books.filter(b => b.status === 'read').length;
  const totalPagesRead = books.reduce((sum, b) => {
    if (b.status === 'read') return sum + (b.totalPages || 0);
    if (b.status === 'reading') return sum + (b.currentPage || 0);
    return sum;
  }, 0);
  const { highestStreak } = calculateStreaks(streakLog);
  return BADGES.filter(b => b.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak }, books));
}

const getFilledBadgeColor = (id: string) => {
  switch (id) {
    case 'first_chapter': return 'bg-amber-500 text-[#FAF7F1] border-transparent';
    case 'beginners_spark': return 'bg-orange-500 text-[#FAF7F1] border-transparent';
    case 'page_turner': return 'bg-yellow-500 text-[#FAF7F1] border-transparent';
    case 'bookworm': return 'bg-emerald-500 text-[#FAF7F1] border-transparent';
    case 'unstoppable': return 'bg-purple-500 text-[#FAF7F1] border-transparent';
    case 'literary_scholar': return 'bg-teal-500 text-[#FAF7F1] border-transparent';
    case 'tome_conqueror': return 'bg-indigo-500 text-[#FAF7F1] border-transparent';
    case 'book_devotee': return 'bg-rose-500 text-[#FAF7F1] border-transparent';
    case 'bibliophile': return 'bg-pink-500 text-[#FAF7F1] border-transparent';
    case 'epic_voyager': return 'bg-blue-500 text-[#FAF7F1] border-transparent';
    case 'immortal_reader': return 'bg-red-500 text-[#FAF7F1] border-transparent';
    default: return 'bg-purple-500 text-[#FAF7F1] border-transparent';
  }
};

// Canvas-free lightweight high-performance Confetti Particle System (pop once)
function ConfettiEffect() {
  const [particles, setParticles] = useState<any[]>([]);

  useEffect(() => {
    // Generate a burst of particles starting around the center of the screen
    const arr = Array.from({ length: 90 }).map((_, i) => {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 8;
      return {
        id: i,
        x: window.innerWidth / 2,
        y: window.innerHeight / 2 - 50,
        size: 5 + Math.random() * 7,
        color: ['#B8863F', '#A855F7', '#EC4899', '#3B82F6', '#10B981', '#F59E0B'][Math.floor(Math.random() * 6)],
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 4, // Initial upward velocity burst
        rotation: Math.random() * 360,
        rotationSpeed: -3.5 + Math.random() * 7,
        opacity: 1
      };
    });
    setParticles(arr);

    let frameId: number;
    const update = () => {
      setParticles((prev) => {
        const active = prev.map((p) => {
          const nextX = p.x + p.vx;
          const nextVy = p.vy + 0.18; // Gravity pulls it down
          const nextY = p.y + nextVy;
          const nextOpacity = Math.max(0, p.opacity - 0.012); // Smooth decay opacity
          return {
            ...p,
            x: nextX,
            y: nextY,
            vy: nextVy,
            vx: p.vx * 0.98, // Air drag friction
            opacity: nextOpacity,
            rotation: p.rotation + p.rotationSpeed
          };
        }).filter(p => p.opacity > 0);

        return active;
      });
      frameId = requestAnimationFrame(update);
    };
    frameId = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-40">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm shadow-sm"
          style={{
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size * 1.5,
            backgroundColor: p.color,
            transform: `rotate(${p.rotation}deg)`,
            opacity: p.opacity,
          }}
        />
      ))}
    </div>
  );
}

export function Profile({
  currentUser,
  onUpdateUser,
  books,
  streakLog,
  acknowledgedBadgeIds,
  onAcknowledgeBadges
}: ProfileProps) {
  const [name, setName] = useState(currentUser.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPwd, setShowCurrentPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [showConfirmPwd, setShowConfirmPwd] = useState(false);

  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Avatar
  const [avatarPickerOpen, setAvatarPickerOpen] = useState(false);
  const [avatarId, setAvatarId] = useState(currentUser.avatarId || '');
  const currentAvatar = AVATARS.find((a) => a.id === avatarId) ?? null;

  // Interactive layout states
  const [showSecurity, setShowSecurity] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Active badge validation state being celebrated
  const [activeCelebrationBadge, setActiveCelebrationBadge] = useState<Badge | null>(null);
  // Badge tapped for detail view in achievement list
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate dynamic reading metrics
  const totalBooksRead = books.filter(b => b.status === 'read').length;
  const totalPagesRead = books.reduce((sum, b) => {
    if (b.status === 'read') {
      return sum + (b.totalPages || 0);
    }
    if (b.status === 'reading') {
      return sum + (b.currentPage || 0);
    }
    return sum;
  }, 0);

  // Extract streaks metrics
  const { highestStreak } = calculateStreaks(streakLog);

  // Filter earned badges
  const earnedBadges = BADGES.filter(b =>
    b.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak }, books)
  );
  
  // Calculate highest badge for motivation sidebar
  const highestBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;

  // Detect and select the first pending unacknowledged badge to celebrate
  useEffect(() => {
    const pending = earnedBadges.filter(b => !acknowledgedBadgeIds.includes(b.id));
    if (pending.length > 0 && !activeCelebrationBadge) {
      setActiveCelebrationBadge(pending[0]);
    }
  }, [earnedBadges, acknowledgedBadgeIds, activeCelebrationBadge]);

  // Extract account metadata from Firebase currentUser
  const userCreationTime = auth.currentUser?.metadata.creationTime;
  const userLastSignIn = auth.currentUser?.metadata.lastSignInTime;

  const formattedCreation = userCreationTime
    ? new Date(userCreationTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Recently';

  const formattedLastSignIn = userLastSignIn
    ? new Date(userLastSignIn).toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    : 'Just now';

  // Check if current user is the shared demo user to prevent lockouts
  const isDemoUser = currentUser.username === 'demo' || auth.currentUser?.email === 'demo@cursus.app';

  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError('');
    setNameSuccess('');

    if (!name.trim()) {
      setNameError('Name cannot be empty.');
      return;
    }

    setNameLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await updateProfile(user, { displayName: name.trim() });
        setNameSuccess('Display name updated successfully.');
        onUpdateUser({
          ...currentUser,
          name: name.trim(),
        });
      } else {
        setNameError('No authenticated user session found.');
      }
    } catch (err: any) {
      console.error(err);
      setNameError(err.message || 'Failed to update display name.');
    } finally {
      setNameLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoUser) return;
    
    setPwdError('');
    setPwdSuccess('');

    if (!currentPassword) {
      setPwdError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPwdError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError('New passwords do not match.');
      return;
    }

    setPwdLoading(true);
    try {
      const user = auth.currentUser;
      if (user && user.email) {
        const credential = EmailAuthProvider.credential(user.email, currentPassword);
        await reauthenticateWithCredential(user, credential);
        await updatePassword(user, newPassword);
        setPwdSuccess('Password updated successfully.');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPwdError('No active user session found.');
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setPwdError('Incorrect current password.');
      } else if (err.code === 'auth/weak-password') {
        setPwdError('Password must be at least 6 characters.');
      } else {
        setPwdError(err.message || 'Failed to update password.');
      }
    } finally {
      setPwdLoading(false);
    }
  };

  // Close celebration modal and acknowledge the badge achievement
  const handleClaimBadge = () => {
    if (activeCelebrationBadge) {
      const nextAck = [...acknowledgedBadgeIds, activeCelebrationBadge.id];
      onAcknowledgeBadges(nextAck);
      setActiveCelebrationBadge(null);
    }
  };

  // Handle avatar selection — persist to Firestore and propagate up
  const handleSelectAvatar = async (avatar: AvatarOption) => {
    setAvatarId(avatar.id);
    setAvatarPickerOpen(false);
    try {
      const docRef = doc(db, 'users', currentUser.id, 'settings', 'profile');
      await setDoc(docRef, { avatarId: avatar.id }, { merge: true });
      onUpdateUser({ ...currentUser, avatarId: avatar.id });
    } catch (err) {
      console.error('Failed to save avatar:', err);
    }
  };

  // Determine whether any sidebar/detail panel is expanded
  const isExpanded = showSecurity || showAchievements;

  // Desktop-only animation values
  const profileAnimate = isMobile
    ? {}
    : { x: isExpanded ? -220 : 0, y: 0 };

  const securityAnimate = isMobile
    ? {}
    : {
        x: showSecurity ? 220 : 0,
        y: 0,
        opacity: showSecurity ? 1 : 0,
        scale: showSecurity ? 1 : 0.95,
      };

  const achievementsAnimate = isMobile
    ? {}
    : {
        x: showAchievements ? 220 : 0,
        y: 0,
        opacity: showAchievements ? 1 : 0,
        scale: showAchievements ? 1 : 0.95,
      };

  // Motivation board content (Left Side-Board)
  const motivationIcon = highestBadge ? highestBadge.icon : 'BookOpen';
  const MotivationIconComponent = iconMap[motivationIcon];
  const motivationTitle = highestBadge ? highestBadge.title : 'Journey Begins';
  const motivationText = highestBadge 
    ? highestBadge.motivationalText 
    : "A single page starts the epic. Read books, complete pages, or log streaks to claim your first badge!";
  const motivationLabel = highestBadge ? `— Highest Badge` : '— Welcome Reader';

  const CelebrationIconComponent = activeCelebrationBadge ? iconMap[activeCelebrationBadge.icon] : null;

  return (
    <>
    <div className="relative mx-auto max-w-5xl flex flex-col items-center justify-start overflow-x-hidden py-4">
      
      {/* Dynamic Confetti & Modals Celebration Overlay */}
      {activeCelebrationBadge && CelebrationIconComponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-bgdark/80 backdrop-blur-md overflow-hidden">
          <ConfettiEffect />

          {/* Rotating Backdrop Gold Flares */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
            className="absolute h-[500px] w-[500px] rounded-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#B8863F]/10 via-[#A855F7]/5 to-transparent blur-3xl pointer-events-none z-0"
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 150, damping: 20 }}
            className="relative w-[90%] sm:w-[400px] rounded-xl2 border border-brass-500/20 bg-gradient-to-br from-white via-white to-paper-soft dark:from-[#211C17] dark:via-[#211C17] dark:to-[#1C1712] p-6 text-center shadow-[0_20px_50px_rgba(0,0,0,0.3),_0_0_40px_rgba(184,134,63,0.06)] z-50 flex flex-col items-center gap-5"
          >
            <div className="space-y-1">
              <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-brass-600 dark:text-brass-400">
                Congratulations!
              </span>
              <h2 className="font-display text-xl font-bold text-ink dark:text-paper">
                New Badge Unlocked
              </h2>
            </div>

            {/* Glowing Large Medal Badge */}
            <div className="relative w-28 h-28 flex items-center justify-center my-2">
              <div className="absolute inset-0 bg-gradient-to-tr from-brass-400 to-purple-500 rounded-full blur-md opacity-25 animate-pulse" />
              <div className={`relative w-24 h-24 rounded-full border-2 flex items-center justify-center ${activeCelebrationBadge.colorClass} shadow-md`}>
                <CelebrationIconComponent size={42} className="animate-bounce" />
              </div>
            </div>

            <div className="space-y-1.5 px-2">
              <h3 className="font-display text-lg font-bold text-ink dark:text-paper leading-snug">
                {activeCelebrationBadge.title}
              </h3>
              <p className="text-xs text-ink-muted dark:text-paper/50">
                {activeCelebrationBadge.description}
              </p>
              <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full bg-forest-500/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400">
                Earned: {activeCelebrationBadge.requirementText}
              </span>
            </div>

            <p className="font-serif italic text-xs text-ink-muted dark:text-paper/60 px-4 leading-relaxed">
              "{activeCelebrationBadge.motivationalText}"
            </p>

            <Button
              onClick={handleClaimBadge}
              className="mt-2 w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400 border-none shadow-[0_4px_12px_rgba(184,134,63,0.15)]"
            >
              Fantastic!
            </Button>
          </motion.div>
        </div>
      )}

      {/* Badge Detail Popup */}
      {selectedBadge && (() => {
        const SelectedIconComponent = iconMap[selectedBadge.icon];
        return (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-bgdark/70 backdrop-blur-sm"
            onClick={() => setSelectedBadge(null)}
          >
            <motion.div
              initial={{ scale: 0.88, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 260, damping: 22 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-[90%] sm:w-[320px] rounded-2xl border border-brass-500/15 bg-gradient-to-br from-white via-white to-paper-soft dark:from-[#211C17] dark:via-[#211C17] dark:to-[#1C1712] p-6 text-center shadow-[0_24px_60px_rgba(0,0,0,0.3),_0_0_40px_rgba(184,134,63,0.05)] flex flex-col items-center gap-4"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedBadge(null)}
                className="absolute top-3 right-3 rounded-full p-1 text-ink-faint dark:text-paper/30 hover:text-ink dark:hover:text-paper hover:bg-ink/5 dark:hover:bg-paper/10 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>

              {/* Badge icon */}
              <div className="relative w-20 h-20 flex items-center justify-center">
                <div className="absolute inset-0 rounded-full blur-lg opacity-30 bg-gradient-to-tr from-brass-400 to-purple-500" />
                <div className={`relative w-16 h-16 rounded-full border-2 flex items-center justify-center shadow-md ${selectedBadge.colorClass}`}>
                  <SelectedIconComponent size={30} />
                </div>
              </div>

              {/* Badge info */}
              <div className="space-y-1.5">
                <span className="inline-block text-[9px] font-bold uppercase tracking-[0.18em] text-brass-600 dark:text-brass-400">
                  Achievement Unlocked
                </span>
                <h3 className="font-display text-base font-bold text-ink dark:text-paper leading-tight">
                  {selectedBadge.title}
                </h3>
                <span className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-forest-500/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400">
                  {selectedBadge.requirementText}
                </span>
              </div>

              <p className="text-[11px] text-ink-muted dark:text-paper/60 leading-relaxed">
                {selectedBadge.description}
              </p>

              <p className="font-serif italic text-[11px] text-ink-muted dark:text-paper/50 px-3 leading-relaxed border-l-2 border-brass-500/30 text-left">
                &ldquo;{selectedBadge.motivationalText}&rdquo;
              </p>
            </motion.div>
          </div>
        );
      })()}

      {/* Subtle Dotted Background Grid overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(184,134,63,0.06)_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none z-0" />

      {/* Floating Background Glow Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -25, 25, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-[5%] left-[15%] h-[320px] w-[320px] rounded-full bg-brass-500/5 dark:bg-brass-500/10 blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -30, 30, 0],
            y: [0, 30, -30, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 3
          }}
          className="absolute bottom-[15%] right-[15%] h-[350px] w-[350px] rounded-full bg-purple-500/5 dark:bg-purple-500/5 blur-[120px]"
        />
      </div>

      {/* Faint Floating Sparkle Vectors */}
      <motion.div
        animate={{
          y: [0, -12, 12, 0],
          x: [0, 8, -8, 0],
          opacity: [0.15, 0.35, 0.15],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-4 right-12 text-brass-500/20 dark:text-brass-400/10 z-0 pointer-events-none"
      >
        <Sparkles size={16} />
      </motion.div>
      <motion.div
        animate={{
          y: [0, 10, -10, 0],
          x: [0, -10, 10, 0],
          opacity: [0.12, 0.28, 0.12],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2
        }}
        className="absolute bottom-16 left-8 text-purple-500/15 dark:text-purple-400/8 z-0 pointer-events-none"
      >
        <Sparkles size={14} />
      </motion.div>

      {/* ======================================================= */}
      {/* MOBILE LAYOUT (flex column, normal document flow)        */}
      {/* ======================================================= */}
      {isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative w-full px-4 flex flex-col gap-4 z-10"
        >
          {/* Mobile: Mini info boards row */}
          {!showSecurity && !showAchievements && (
            <div className="grid grid-cols-2 gap-3">
              {/* Motivation mini card */}
              <div className="rounded-xl border border-ink/5 bg-gradient-to-br from-white/60 to-paper-soft/30 dark:from-[#211C17]/60 dark:to-[#1C1712]/30 backdrop-blur-sm p-3 flex flex-col items-center text-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brass-500/10 text-brass-600 dark:text-brass-400">
                  <MotivationIconComponent size={16} />
                </div>
                <p className="font-display text-[10px] font-bold text-brass-600 dark:text-brass-400 tracking-wide uppercase leading-tight">
                  {motivationTitle}
                </p>
                <p className="font-serif italic text-[10px] text-ink-muted dark:text-paper/50 leading-relaxed line-clamp-3">
                  "{motivationText}"
                </p>
              </div>

              {/* Achievements mini card */}
              <button
                onClick={() => setShowAchievements(true)}
                className="rounded-xl border border-ink/5 bg-gradient-to-br from-white/60 to-paper-soft/30 dark:from-[#211C17]/60 dark:to-[#1C1712]/30 backdrop-blur-sm p-3 flex flex-col items-center text-center gap-2 cursor-pointer group w-full text-left"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform duration-200">
                  <Award size={16} />
                </div>
                <p className="font-display text-[10px] font-bold text-purple-600 dark:text-purple-400 tracking-wide uppercase leading-tight">
                  Achievements
                </p>
                <p className="text-[10px] text-ink-muted dark:text-paper/50 font-medium">
                  <span className="font-bold text-purple-600 dark:text-purple-400">{earnedBadges.length}</span>/{BADGES.length} Badges
                </p>
                <div className="flex gap-1 justify-center flex-wrap">
                  {BADGES.slice(0, 4).map((badge) => {
                    const earned = badge.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak }, books);
                    const IconComponent = iconMap[badge.icon];
                    return (
                      <div
                        key={badge.id}
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          earned
                            ? getFilledBadgeColor(badge.id)
                            : 'text-ink-faint border-ink/5 bg-ink/5 dark:text-paper/10 dark:border-paper/5'
                        }`}
                      >
                        <IconComponent size={10} />
                      </div>
                    );
                  })}
                </div>
                <span className="text-[9px] font-bold text-purple-500 uppercase tracking-widest group-hover:underline">
                  Tap to View All
                </span>
              </button>
            </div>
          )}

          {/* Mobile: Profile Card (always shown unless a panel is open) */}
          {!showSecurity && !showAchievements && (
            <div className="w-full rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] p-5">
              <form onSubmit={handleUpdateName} className="flex flex-col gap-4">
                {/* Avatar + Name */}
                <div className="flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAvatarPickerOpen(true)}
                    className="relative group w-20 h-20 focus:outline-none"
                    title="Change avatar"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-brass-400 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="relative w-full h-full rounded-full bg-paper-soft dark:bg-bgdark-soft border border-brass-500/20 flex items-center justify-center overflow-hidden shadow-sm">
                      {currentAvatar ? (
                        <img src={currentAvatar.src} alt={currentAvatar.label} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <UserIcon className="w-9 h-9 text-brass-500 dark:text-brass-400" strokeWidth={1.5} />
                      )}
                    </div>
                    {/* Camera overlay on hover */}
                    <div className="absolute inset-0 rounded-full bg-bgdark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera size={18} className="text-white" />
                    </div>
                  </button>
                  <div className="text-center">
                    <h3 className="font-display text-base font-bold text-ink dark:text-paper">{currentUser.name}</h3>
                    <p className="text-xs text-ink-muted dark:text-paper/50 font-mono">@{currentUser.username}</p>
                    {currentAvatar && (
                      <p className="text-[10px] font-semibold text-brass-600 dark:text-brass-400 mt-0.5">{currentAvatar.label}</p>
                    )}
                  </div>
                </div>

                {/* Account Info */}
                <div className="rounded-lg bg-paper-soft/80 dark:bg-bgdark-soft/40 p-2.5 border border-ink/5 dark:border-paper/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-ink-muted dark:text-paper/60 font-medium">
                      <Calendar size={12} className="text-brass-500" />
                      <span>Member Since</span>
                    </div>
                    <span className="font-semibold text-ink dark:text-paper text-right">{formattedCreation}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-ink-muted dark:text-paper/60 font-medium">
                      <Clock size={12} className="text-brass-500" />
                      <span>Last Active</span>
                    </div>
                    <span className="font-semibold text-ink dark:text-paper text-right">{formattedLastSignIn}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-2">
                  <div className="rounded-lg bg-paper-soft/60 dark:bg-bgdark-soft/30 p-2 border border-ink/5 dark:border-paper/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-ink-faint dark:text-paper/40 tracking-wider">Books Read</p>
                    <p className="text-lg font-bold text-brass-600 dark:text-brass-400 mt-0.5">{totalBooksRead}</p>
                  </div>
                  <div className="rounded-lg bg-paper-soft/60 dark:bg-bgdark-soft/30 p-2 border border-ink/5 dark:border-paper/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-ink-faint dark:text-paper/40 tracking-wider">Pages Read</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">{totalPagesRead}</p>
                  </div>
                </div>

                {/* Display Name Field */}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">Display Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={nameLoading}
                    placeholder="Enter your name"
                    className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200"
                  />
                </div>

                {nameError && (
                  <div className="p-2 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-[11px] font-semibold text-burgundy-600 dark:text-burgundy-400 flex items-center gap-1.5">
                    <AlertCircle size={12} className="shrink-0" />{nameError}
                  </div>
                )}
                {nameSuccess && (
                  <div className="p-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-[11px] font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="shrink-0" />{nameSuccess}
                  </div>
                )}

                <div className="flex flex-col gap-2">
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={nameLoading || name.trim() === currentUser.name}
                    className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400"
                  >
                    {nameLoading ? <><Loader2 size={14} className="animate-spin mr-1.5" />Updating...</> : 'Update Display Name'}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowSecurity(true)}
                    className="w-full py-2 text-xs font-semibold uppercase tracking-wider text-brass-600 dark:text-brass-400 hover:bg-brass-500/5"
                  >
                    Update Password
                  </Button>
                </div>
              </form>
            </div>
          )}

          {/* Mobile: Security Panel */}
          {showSecurity && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] p-5"
            >
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5 border-b border-ink/5 dark:border-paper/5 pb-3">
                  <button type="button" onClick={() => setShowSecurity(false)} className="rounded-full p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60">
                    <ArrowLeft size={16} />
                  </button>
                  <Key size={16} className="text-brass-500" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-paper">Update Password</h3>
                </div>

                {isDemoUser && (
                  <div className="p-2.5 rounded-lg bg-brass-500/10 border border-brass-500/15 text-[10.5px] font-semibold text-brass-600 dark:text-brass-400 flex items-center gap-2">
                    <AlertCircle size={14} className="shrink-0 text-brass-500" />
                    Password changes are disabled for the shared demo account.
                  </div>
                )}

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPwd ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={pwdLoading || isDemoUser}
                      placeholder={isDemoUser ? "Disabled for demo user" : "Enter current password"}
                      className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 pr-9 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200 disabled:opacity-65" />
                    <button type="button" onClick={() => setShowCurrentPwd(v => !v)} disabled={pwdLoading || isDemoUser}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors disabled:opacity-40" tabIndex={-1}>
                      {showCurrentPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">New Password</label>
                  <div className="relative">
                    <input type={showNewPwd ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={pwdLoading || isDemoUser}
                      placeholder={isDemoUser ? "Disabled for demo user" : "Minimum 6 characters"}
                      className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 pr-9 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200 disabled:opacity-65" />
                    <button type="button" onClick={() => setShowNewPwd(v => !v)} disabled={pwdLoading || isDemoUser}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors disabled:opacity-40" tabIndex={-1}>
                      {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={pwdLoading || isDemoUser}
                      placeholder={isDemoUser ? "Disabled for demo user" : "Re-enter new password"}
                      className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2.5 pr-9 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200 disabled:opacity-65" />
                    <button type="button" onClick={() => setShowConfirmPwd(v => !v)} disabled={pwdLoading || isDemoUser}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors disabled:opacity-40" tabIndex={-1}>
                      {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>

                {pwdError && (
                  <div className="p-2 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-[11px] font-semibold text-burgundy-600 dark:text-burgundy-400 flex items-center gap-1.5">
                    <AlertCircle size={12} className="shrink-0" />{pwdError}
                  </div>
                )}
                {pwdSuccess && (
                  <div className="p-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-[11px] font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1.5">
                    <CheckCircle2 size={12} className="shrink-0" />{pwdSuccess}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={pwdLoading || isDemoUser || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full py-2.5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {pwdLoading ? <><Loader2 size={12} className="animate-spin mr-1.5" />Updating...</> : 'Change Password'}
                </Button>
              </form>
            </motion.div>
          )}

          {/* Mobile: Achievements Panel */}
          {showAchievements && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55)] p-5"
            >
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2.5 border-b border-ink/5 dark:border-paper/5 pb-3">
                  <button type="button" onClick={() => setShowAchievements(false)} className="rounded-full p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60">
                    <ArrowLeft size={16} />
                  </button>
                  <Award size={16} className="text-purple-500" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-paper">Unlocked Badges</h3>
                </div>

                <div className="space-y-2 max-h-[60vh] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-ink/10">
                  {BADGES.map((badge) => {
                    const earned = badge.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak }, books);
                    const IconComponent = iconMap[badge.icon];
                    return (
                      <div
                        key={badge.id}
                        onClick={() => earned ? setSelectedBadge(badge) : undefined}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                          earned
                            ? 'bg-gradient-to-r from-white via-white/95 to-[#B8863F]/5 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#B8863F]/5 border-[#B8863F]/20 dark:border-[#B8863F]/15 shadow-[0_0_12px_rgba(184,134,63,0.05)] cursor-pointer hover:shadow-[0_0_18px_rgba(184,134,63,0.12)] hover:border-[#B8863F]/35 active:scale-[0.98]'
                            : 'bg-paper-soft/10 dark:bg-bgdark-soft/10 border-dashed border-ink/10 dark:border-paper/10 opacity-60'
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          earned ? badge.colorClass : 'text-ink-faint border-ink/10 bg-ink/5 dark:text-paper/20 dark:border-paper/10 dark:bg-paper/5'
                        }`}>
                          <IconComponent size={20} className={earned ? 'animate-pulse' : ''} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-1">
                            <p className={`text-xs font-bold truncate ${earned ? 'text-ink dark:text-paper' : 'text-ink-faint dark:text-paper/40'}`}>
                              {badge.title}
                            </p>
                            <span className={`shrink-0 text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                              earned ? 'bg-forest-500/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400' : 'bg-ink/5 text-ink-faint dark:bg-paper/5 dark:text-paper/30'
                            }`}>
                              {earned ? 'Unlocked' : badge.requirementText}
                            </span>
                          </div>
                          <p className="text-[10px] text-ink-muted dark:text-paper/50 truncate mt-0.5">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      )}

      {/* ======================================================= */}
      {/* DESKTOP LAYOUT (absolute positioned animated panels)    */}
      {/* ======================================================= */}
      {!isMobile && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
          style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
          className="relative w-full max-w-4xl flex items-center justify-center min-h-[530px] overflow-visible z-10"
        >
          {/* LEFT LITERARY SIDE-BOARD (Motivation board) */}
          <motion.div
            initial={{ opacity: 0, x: -360 }}
            animate={{
              opacity: isExpanded ? 0 : 1,
              x: isExpanded ? -270 : -340,
              scale: isExpanded ? 0.95 : 1,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
            className="absolute w-[220px] h-[320px] rounded-xl border border-ink/5 bg-gradient-to-br from-white/45 to-paper-soft/25 dark:from-[#211C17]/45 dark:to-[#1C1712]/25 backdrop-blur-sm shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1),_0_0_20px_rgba(184,134,63,0.02)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.45),_0_0_30px_rgba(184,134,63,0.03)] flex flex-col justify-center items-center text-center gap-3 select-none px-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brass-500/10 text-brass-600 dark:text-brass-400">
              <MotivationIconComponent size={18} />
            </div>
            <p className="font-display text-xs font-bold text-brass-600 dark:text-brass-400 tracking-wide uppercase">
              {motivationTitle}
            </p>
            <p className="font-serif italic text-[11px] text-ink-muted dark:text-paper/50 leading-relaxed px-1">
              "{motivationText}"
            </p>
            <p className="text-[9px] font-semibold text-ink-faint dark:text-paper/30 tracking-wider font-sans uppercase">
              {motivationLabel}
            </p>
          </motion.div>

          {/* RIGHT LITERARY SIDE-BOARD (Achievements preview) */}
          <motion.div
            initial={{ opacity: 0, x: 360 }}
            animate={{
              opacity: isExpanded ? 0 : 1,
              x: isExpanded ? 270 : 340,
              scale: isExpanded ? 0.95 : 1,
            }}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            style={{ pointerEvents: isExpanded ? 'none' : 'auto' }}
            onClick={() => setShowAchievements(true)}
            className="absolute w-[220px] h-[320px] rounded-xl border border-ink/5 bg-gradient-to-br from-white/45 to-paper-soft/25 dark:from-[#211C17]/45 dark:to-[#1C1712]/25 backdrop-blur-sm shadow-[0_10px_30px_-8px_rgba(0,0,0,0.1),_0_0_20px_rgba(184,134,63,0.02)] dark:shadow-[0_15px_35px_-10px_rgba(0,0,0,0.45),_0_0_30px_rgba(184,134,63,0.03)] flex flex-col justify-center items-center text-center gap-4 cursor-pointer select-none group px-4"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-purple-500/10 text-purple-600 dark:text-purple-400 group-hover:scale-105 transition-transform duration-200">
              <Award size={18} />
            </div>
            <div className="space-y-1">
              <p className="font-display text-xs font-bold text-purple-600 dark:text-purple-400 tracking-wide uppercase">
                My Achievements
              </p>
              <p className="text-[11px] text-ink-muted dark:text-paper/50 font-medium">
                Badges Unlocked: <span className="font-bold text-purple-600 dark:text-purple-400">{earnedBadges.length} / {BADGES.length}</span>
              </p>
            </div>
            <div className="flex gap-1.5 justify-center items-center">
              {BADGES.slice(0, 4).map((badge) => {
                const earned = badge.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak }, books);
                const IconComponent = iconMap[badge.icon];
                return (
                  <div
                    key={badge.id}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] transition-all duration-300 ${
                      earned
                        ? getFilledBadgeColor(badge.id)
                        : 'text-ink-faint border-ink/5 bg-ink/5 dark:text-paper/10 dark:border-paper/5'
                    }`}
                    title={badge.title}
                  >
                    <IconComponent size={11} />
                  </div>
                );
              })}
              {BADGES.length > 4 && (
                <div className="w-6 h-6 rounded-full border border-ink/5 bg-ink/5 dark:border-paper/5 flex items-center justify-center text-[9px] font-bold text-ink-faint dark:text-paper/40">
                  +{BADGES.length - 4}
                </div>
              )}
            </div>
            <span className="text-[9px] font-bold text-purple-600 dark:text-purple-400 uppercase tracking-widest mt-2 group-hover:underline">
              View All Badges
            </span>
          </motion.div>

          {/* Profile Card */}
          <motion.div
            animate={profileAnimate}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            className="absolute w-[420px] h-[510px] rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),_0_0_40px_rgba(184,134,63,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),_0_0_50px_rgba(184,134,63,0.06)] flex flex-col justify-between p-6 z-10 overflow-hidden"
          >
            <form onSubmit={handleUpdateName} className="h-full flex flex-col justify-between z-10">
              <div className="space-y-4">
                <div className="flex flex-col items-center gap-1 mx-auto mt-0.5">
                  <button
                    type="button"
                    onClick={() => setAvatarPickerOpen(true)}
                    className="relative group w-24 h-24 focus:outline-none"
                    title="Change avatar"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-brass-400 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-40 transition-opacity duration-300" />
                    <div className="relative w-full h-full rounded-full bg-paper-soft dark:bg-bgdark-soft border border-brass-500/20 flex items-center justify-center overflow-hidden shadow-sm">
                      {currentAvatar ? (
                        <img src={currentAvatar.src} alt={currentAvatar.label} className="w-full h-full object-cover rounded-full" />
                      ) : (
                        <UserIcon className="w-11 h-11 text-brass-500 dark:text-brass-400" strokeWidth={1.5} />
                      )}
                    </div>
                    {/* Camera overlay on hover */}
                    <div className="absolute inset-0 rounded-full bg-bgdark/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Camera size={20} className="text-white" />
                    </div>
                  </button>
                  {currentAvatar && (
                    <span className="text-[10px] font-semibold text-brass-600 dark:text-brass-400">{currentAvatar.label}</span>
                  )}
                </div>
                <div className="text-center space-y-0.5">
                  <h3 className="font-display text-lg font-bold text-ink dark:text-paper leading-snug">{currentUser.name}</h3>
                  <p className="text-xs text-ink-muted dark:text-paper/50 font-medium font-mono">@{currentUser.username}</p>
                </div>
                <div className="rounded-lg bg-paper-soft/80 dark:bg-bgdark-soft/40 p-2.5 border border-ink/5 dark:border-paper/5 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-ink-muted dark:text-paper/60 font-medium">
                      <Calendar size={13} className="text-brass-500" /><span>Member Since</span>
                    </div>
                    <span className="font-semibold text-ink dark:text-paper">{formattedCreation}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <div className="flex items-center gap-1.5 text-ink-muted dark:text-paper/60 font-medium">
                      <Clock size={13} className="text-brass-500" /><span>Last Active</span>
                    </div>
                    <span className="font-semibold text-ink dark:text-paper text-right">{formattedLastSignIn}</span>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-1.5">
                  <div className="rounded-lg bg-paper-soft/60 dark:bg-bgdark-soft/30 p-2 border border-ink/5 dark:border-paper/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-ink-faint dark:text-paper/40 tracking-wider">Books Read</p>
                    <p className="text-lg font-bold text-brass-600 dark:text-brass-400 mt-0.5">{totalBooksRead}</p>
                  </div>
                  <div className="rounded-lg bg-paper-soft/60 dark:bg-bgdark-soft/30 p-2 border border-ink/5 dark:border-paper/5 text-center">
                    <p className="text-[10px] uppercase font-bold text-ink-faint dark:text-paper/40 tracking-wider">Pages Read</p>
                    <p className="text-lg font-bold text-purple-600 dark:text-purple-400 mt-0.5">{totalPagesRead}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">Display Name</label>
                  <input
                    type="text" value={name} onChange={(e) => setName(e.target.value)} disabled={nameLoading} placeholder="Enter your name"
                    className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200"
                  />
                </div>
              </div>
              {nameError && (
                <div className="p-2 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-[11px] font-semibold text-burgundy-600 dark:text-burgundy-400 flex items-center gap-1.5">
                  <AlertCircle size={12} className="shrink-0" />{nameError}
                </div>
              )}
              {nameSuccess && (
                <div className="p-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-[11px] font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="shrink-0" />{nameSuccess}
                </div>
              )}
              <div className="flex flex-col gap-1.5 pt-1.5 items-center w-full">
                <Button type="submit" variant="primary" disabled={nameLoading || name.trim() === currentUser.name}
                  className="w-full sm:w-2/3 py-2.5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400">
                  {nameLoading ? <><Loader2 size={14} className="animate-spin mr-1.5" />Updating...</> : 'Update Display Name'}
                </Button>
                {!isExpanded && (
                  <Button type="button" variant="ghost" onClick={() => setShowSecurity(true)}
                    className="w-full sm:w-2/3 py-1.5 text-xs font-semibold uppercase tracking-wider text-brass-600 dark:text-brass-400 hover:bg-brass-500/5 hover:text-brass-500">
                    Update Password
                  </Button>
                )}
              </div>
            </form>
          </motion.div>

          {/* Security Card */}
          <motion.div
            animate={securityAnimate}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            style={{ pointerEvents: showSecurity ? 'auto' : 'none' }}
            className="absolute w-[420px] h-[510px] rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),_0_0_40px_rgba(184,134,63,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),_0_0_50px_rgba(184,134,63,0.06)] flex flex-col justify-between p-6 z-0 overflow-hidden"
          >
            <form onSubmit={handleUpdatePassword} className="h-full flex flex-col justify-between z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-2.5 border-b border-ink/5 dark:border-paper/5 pb-2.5">
                  <button type="button" onClick={() => setShowSecurity(false)} className="rounded-full p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/10 transition-colors" title="Back to Profile">
                    <ArrowLeft size={16} />
                  </button>
                  <Key size={16} className="text-brass-500" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-paper">Update Password</h3>
                </div>
                {isDemoUser && (
                  <div className="p-2.5 rounded-lg bg-brass-500/10 border border-brass-500/15 text-[10.5px] font-semibold text-brass-600 dark:text-brass-400 flex items-center gap-2 leading-relaxed">
                    <AlertCircle size={14} className="shrink-0 text-brass-500" />
                    Password changes are disabled for the shared demo account.
                  </div>
                )}
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">Current Password</label>
                  <div className="relative">
                    <input type={showCurrentPwd ? 'text' : 'password'} value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} disabled={pwdLoading || isDemoUser}
                      placeholder={isDemoUser ? "Disabled for demo user" : "Enter current password"}
                      className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 pr-9 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200 disabled:opacity-65" />
                    <button type="button" onClick={() => setShowCurrentPwd(v => !v)} disabled={pwdLoading || isDemoUser}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors disabled:opacity-40" tabIndex={-1}>
                      {showCurrentPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">New Password</label>
                  <div className="relative">
                    <input type={showNewPwd ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} disabled={pwdLoading || isDemoUser}
                      placeholder={isDemoUser ? "Disabled for demo user" : "Minimum 6 characters"}
                      className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 pr-9 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200 disabled:opacity-65" />
                    <button type="button" onClick={() => setShowNewPwd(v => !v)} disabled={pwdLoading || isDemoUser}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors disabled:opacity-40" tabIndex={-1}>
                      {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">Confirm Password</label>
                  <div className="relative">
                    <input type={showConfirmPwd ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={pwdLoading || isDemoUser}
                      placeholder={isDemoUser ? "Disabled for demo user" : "Re-enter new password"}
                      className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2.5 pr-9 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200 disabled:opacity-65" />
                    <button type="button" onClick={() => setShowConfirmPwd(v => !v)} disabled={pwdLoading || isDemoUser}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-faint dark:text-paper/40 hover:text-ink dark:hover:text-paper transition-colors disabled:opacity-40" tabIndex={-1}>
                      {showConfirmPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                  </div>
                </div>
              </div>
              {pwdError && (
                <div className="p-2 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-[11px] font-semibold text-burgundy-600 dark:text-burgundy-400 flex items-center gap-1.5">
                  <AlertCircle size={12} className="shrink-0" />{pwdError}
                </div>
              )}
              {pwdSuccess && (
                <div className="p-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-[11px] font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1.5">
                  <CheckCircle2 size={12} className="shrink-0" />{pwdSuccess}
                </div>
              )}
              <div className="flex justify-end pt-1.5">
                <Button type="submit" disabled={pwdLoading || isDemoUser || !currentPassword || !newPassword || !confirmPassword}
                  className="w-full sm:w-auto py-2 px-5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400 disabled:opacity-50 disabled:cursor-not-allowed">
                  {pwdLoading ? <><Loader2 size={12} className="animate-spin mr-1.5" />Updating...</> : 'Change Password'}
                </Button>
              </div>
            </form>
          </motion.div>

          {/* Achievements Card */}
          <motion.div
            animate={achievementsAnimate}
            transition={{ type: 'spring', stiffness: 120, damping: 18 }}
            style={{ pointerEvents: showAchievements ? 'auto' : 'none' }}
            className="absolute w-[420px] h-[510px] rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),_0_0_40px_rgba(184,134,63,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),_0_0_50px_rgba(184,134,63,0.06)] flex flex-col justify-between p-6 z-0 overflow-hidden"
          >
            <div className="h-full flex flex-col justify-between z-10">
              <div className="space-y-4 flex flex-col h-full">
                <div className="flex items-center gap-2.5 border-b border-ink/5 dark:border-paper/5 pb-2.5">
                  <button type="button" onClick={() => setShowAchievements(false)} className="rounded-full p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/10 transition-colors" title="Back to Profile">
                    <ArrowLeft size={16} />
                  </button>
                  <Award size={16} className="text-purple-500" />
                  <h3 className="font-display text-base font-semibold text-ink dark:text-paper">Unlocked Badges</h3>
                </div>
                <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[380px] scrollbar-thin scrollbar-thumb-ink/10">
                  {BADGES.map((badge) => {
                    const earned = badge.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak }, books);
                    const IconComponent = iconMap[badge.icon];
                    return (
                      <div
                        key={badge.id}
                        onClick={() => earned ? setSelectedBadge(badge) : undefined}
                        className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                          earned
                            ? 'bg-gradient-to-r from-white via-white/95 to-[#B8863F]/5 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#B8863F]/5 border-[#B8863F]/20 dark:border-[#B8863F]/15 shadow-[0_0_12px_rgba(184,134,63,0.05)] cursor-pointer hover:shadow-[0_0_18px_rgba(184,134,63,0.12)] hover:border-[#B8863F]/35 active:scale-[0.98]'
                            : 'bg-paper-soft/10 dark:bg-bgdark-soft/10 border-dashed border-ink/10 dark:border-paper/10 opacity-60'
                        }`}
                      >
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border ${
                          earned ? badge.colorClass : 'text-ink-faint border-ink/10 bg-ink/5 dark:text-paper/20 dark:border-paper/10 dark:bg-paper/5'
                        }`}>
                          <IconComponent size={20} className={earned ? 'animate-pulse' : ''} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className={`text-xs font-bold truncate ${earned ? 'text-ink dark:text-paper' : 'text-ink-faint dark:text-paper/40'}`}>
                              {badge.title}
                            </p>
                            <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded-full ${
                              earned ? 'bg-forest-500/10 text-forest-600 dark:bg-forest-500/20 dark:text-forest-400' : 'bg-ink/5 text-ink-faint dark:bg-paper/5 dark:text-paper/30'
                            }`}>
                              {earned ? 'Unlocked' : badge.requirementText}
                            </span>
                          </div>
                          <p className="text-[10px] text-ink-muted dark:text-paper/50 truncate mt-0.5">
                            {badge.description}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>

      {/* Avatar Picker Modal */}
      <AvatarPicker
        open={avatarPickerOpen}
        currentAvatarId={avatarId}
        onSelect={handleSelectAvatar}
        onClose={() => setAvatarPickerOpen(false)}
      />
    </>
  );
}
