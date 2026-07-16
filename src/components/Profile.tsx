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
  Library
} from 'lucide-react';
import { Button } from './ui/Button';
import { auth } from '../firebase';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword, updateProfile } from 'firebase/auth';
import type { Book } from '../types/book';
import type { StreakLog } from './StreakManager';
import { calculateStreaks } from '../utils/helpers';

interface ProfileProps {
  currentUser: { id: string; name: string; username: string };
  onUpdateUser: (updatedUser: { id: string; name: string; username: string }) => void;
  books: Book[];
  streakLog: StreakLog;
}

interface Badge {
  id: string;
  title: string;
  description: string;
  category: 'books' | 'pages' | 'streaks';
  icon: string;
  colorClass: string;
  requirementText: string;
  isEarned: (stats: { booksRead: number; pagesRead: number; highestStreak: number }) => boolean;
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
    id: 'daily_habit',
    title: 'Daily Habit',
    description: 'Achieve a 3-day reading streak.',
    category: 'streaks',
    icon: 'Flame',
    colorClass: 'text-orange-500 bg-orange-500/10 border-orange-500/20',
    requirementText: '3d Streak',
    isEarned: ({ highestStreak }) => highestStreak >= 3,
    motivationalText: "3-day streak! Consistency is the soil where true reading wisdom takes root."
  },
  {
    id: 'page_turner',
    title: 'Page Turner',
    description: 'Read 500 pages.',
    category: 'pages',
    icon: 'Sparkles',
    colorClass: 'text-cyan-500 bg-cyan-500/10 border-cyan-500/20',
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
    icon: 'Award',
    colorClass: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
    requirementText: '7d Streak',
    isEarned: ({ highestStreak }) => highestStreak >= 7,
    motivationalText: "7-day streak! Reading is no longer a task; it's a permanent part of your day."
  },
  {
    id: 'bibliophile',
    title: 'Bibliophile',
    description: 'Complete 15 books.',
    category: 'books',
    icon: 'Heart',
    colorClass: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
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
    colorClass: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    requirementText: '5k Pgs',
    isEarned: ({ pagesRead }) => pagesRead >= 5000,
    motivationalText: "5,000 pages read! You have traversed prose valleys and summitted literary heights."
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
};

export function Profile({ currentUser, onUpdateUser, books, streakLog }: ProfileProps) {
  const [name, setName] = useState(currentUser.name);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameLoading, setNameLoading] = useState(false);
  const [nameSuccess, setNameSuccess] = useState('');
  const [nameError, setNameError] = useState('');

  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdSuccess, setPwdSuccess] = useState('');
  const [pwdError, setPwdError] = useState('');

  // Interactive layout states
  const [showSecurity, setShowSecurity] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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
    b.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak })
  );
  
  // Calculate highest badge for motivation sidebar
  const highestBadge = earnedBadges.length > 0 ? earnedBadges[earnedBadges.length - 1] : null;

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

  // Determine whether any sidebar/detail panel is expanded
  const isExpanded = showSecurity || showAchievements;

  // Compute layout animation values
  const profileAnimate = isMobile
    ? { x: 0, y: isExpanded ? -165 : 0 }
    : { x: isExpanded ? -220 : 0, y: 0 };

  const securityAnimate = isMobile
    ? {
        x: 0,
        y: showSecurity ? 175 : 0,
        opacity: showSecurity ? 1 : 0,
        scale: showSecurity ? 1 : 0.95,
      }
    : {
        x: showSecurity ? 220 : 0,
        y: 0,
        opacity: showSecurity ? 1 : 0,
        scale: showSecurity ? 1 : 0.95,
      };

  const achievementsAnimate = isMobile
    ? {
        x: 0,
        y: showAchievements ? 175 : 0,
        opacity: showAchievements ? 1 : 0,
        scale: showAchievements ? 1 : 0.95,
      }
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

  return (
    <div className="relative mx-auto max-w-5xl flex flex-col items-center justify-start overflow-hidden py-4">
      
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

      {/* Main cards display section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
        className="relative w-full max-w-4xl flex items-center justify-center min-h-[820px] md:min-h-[530px] overflow-visible z-10"
      >
        
        {/* LEFT LITERARY SIDE-BOARD (Motivation board based on Badge) - Desktop Only */}
        {!isMobile && (
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
        )}

        {/* RIGHT LITERARY SIDE-BOARD (Achievements preview board) - Desktop Only */}
        {!isMobile && (
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

            {/* Micro-row preview of badges */}
            <div className="flex gap-1.5 justify-center items-center">
              {BADGES.slice(0, 4).map((badge) => {
                const earned = badge.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak });
                const IconComponent = iconMap[badge.icon];
                return (
                  <div
                    key={badge.id}
                    className={`w-6 h-6 rounded-full border flex items-center justify-center text-[10px] ${
                      earned 
                        ? 'text-purple-600 border-purple-500/20 bg-purple-500/5' 
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
        )}

        {/* Profile Card Details */}
        <motion.div
          animate={profileAnimate}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="absolute w-[90%] sm:w-[420px] h-[510px] rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),_0_0_40px_rgba(184,134,63,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),_0_0_50px_rgba(184,134,63,0.06)] flex flex-col justify-between p-6 z-10 overflow-hidden"
        >
          <form onSubmit={handleUpdateName} className="h-full flex flex-col justify-between z-10">
            <div className="space-y-4">
              
              {/* Branded Avatar Logo */}
              <div className="relative group w-24 h-24 mx-auto mt-0.5">
                <div className="absolute inset-0 bg-gradient-to-tr from-brass-400 to-purple-500 rounded-full blur opacity-25 group-hover:opacity-35 transition-opacity duration-300" />
                <div className="relative w-full h-full rounded-full bg-paper-soft dark:bg-bgdark-soft border border-brass-500/20 flex items-center justify-center overflow-hidden shadow-sm">
                  <UserIcon className="w-11 h-11 text-brass-500 dark:text-brass-400" strokeWidth={1.5} />
                </div>
              </div>

              {/* Centered Name and Username */}
              <div className="text-center space-y-0.5">
                <h3 className="font-display text-lg font-bold text-ink dark:text-paper leading-snug">
                  {currentUser.name}
                </h3>
                <p className="text-xs text-ink-muted dark:text-paper/50 font-medium font-mono">
                  @{currentUser.username}
                </p>
              </div>

              {/* Account Info Details */}
              <div className="rounded-lg bg-paper-soft/80 dark:bg-bgdark-soft/40 p-2.5 border border-ink/5 dark:border-paper/5 space-y-1.5">
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-ink-muted dark:text-paper/60 font-medium">
                    <Calendar size={13} className="text-brass-500" />
                    <span>Member Since</span>
                  </div>
                  <span className="font-semibold text-ink dark:text-paper">{formattedCreation}</span>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-1.5 text-ink-muted dark:text-paper/60 font-medium">
                    <Clock size={13} className="text-brass-500" />
                    <span>Last Active</span>
                  </div>
                  <span className="font-semibold text-ink dark:text-paper text-right">{formattedLastSignIn}</span>
                </div>
              </div>

              {/* Dynamic Reading Stats Grid */}
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

              {/* Editable Display Name Field */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={nameLoading}
                  placeholder="Enter your name"
                  className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Alerts */}
            {nameError && (
              <div className="p-2 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-[11px] font-semibold text-burgundy-600 dark:text-burgundy-400 flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" />
                {nameError}
              </div>
            )}
            {nameSuccess && (
              <div className="p-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-[11px] font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="shrink-0" />
                {nameSuccess}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col gap-1.5 pt-1.5 items-center">
              <Button
                type="submit"
                variant="primary"
                disabled={nameLoading || name.trim() === currentUser.name}
                className="w-full sm:w-2/3 py-2.5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400"
              >
                {nameLoading ? (
                  <>
                    <Loader2 size={14} className="animate-spin mr-1.5" />
                    Updating...
                  </>
                ) : (
                  'Update Display Name'
                )}
              </Button>
              
              {!isExpanded && (
                <div className="flex w-full justify-center gap-4">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowSecurity(true)}
                    className="py-1 text-xs font-semibold uppercase tracking-wider text-brass-600 dark:text-brass-400 hover:text-brass-500"
                  >
                    Update Password
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setShowAchievements(true)}
                    className="py-1 text-xs font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400 hover:text-purple-500"
                  >
                    Badges
                  </Button>
                </div>
              )}
            </div>
          </form>
        </motion.div>

        {/* Right Card 1: Security Settings */}
        <motion.div
          animate={securityAnimate}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{ pointerEvents: showSecurity ? 'auto' : 'none' }}
          className="absolute w-[90%] sm:w-[420px] h-[510px] rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),_0_0_40px_rgba(184,134,63,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),_0_0_50px_rgba(184,134,63,0.06)] flex flex-col justify-between p-6 z-0 overflow-hidden"
        >
          <form onSubmit={handleUpdatePassword} className="h-full flex flex-col justify-between z-10">
            <div className="space-y-4">
              <div className="flex items-center gap-2.5 border-b border-ink/5 dark:border-paper/5 pb-2.5">
                <button
                  type="button"
                  onClick={() => setShowSecurity(false)}
                  className="rounded-full p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/10 transition-colors"
                  title="Back to Profile"
                >
                  <ArrowLeft size={16} />
                </button>
                <Key size={16} className="text-brass-500" />
                <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                  Update Password
                </h3>
              </div>

              {/* Current Password Field */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                  Current Password
                </label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  disabled={pwdLoading}
                  placeholder="Enter current password"
                  className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200"
                />
              </div>

              {/* New Password Field */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                  New Password
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={pwdLoading}
                  placeholder="Minimum 6 characters"
                  className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200"
                />
              </div>

              {/* Confirm Password Field */}
              <div className="space-y-1">
                <label className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                  Confirm Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={pwdLoading}
                  placeholder="Re-enter new password"
                  className="w-full rounded-lg border border-ink/10 bg-paper dark:bg-bgdark px-3 py-2.5 text-sm text-ink dark:text-paper focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 transition-all duration-200"
                />
              </div>
            </div>

            {/* Alerts */}
            {pwdError && (
              <div className="p-2 rounded-lg bg-burgundy-500/10 border border-burgundy-500/20 text-[11px] font-semibold text-burgundy-600 dark:text-burgundy-400 flex items-center gap-1.5">
                <AlertCircle size={12} className="shrink-0" />
                {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div className="p-2 rounded-lg bg-forest-500/10 border border-forest-500/20 text-[11px] font-semibold text-forest-600 dark:text-forest-400 flex items-center gap-1.5">
                <CheckCircle2 size={12} className="shrink-0" />
                {pwdSuccess}
              </div>
            )}

            {/* Submit Password Button */}
            <div className="flex justify-end pt-1.5">
              <Button
                type="submit"
                disabled={pwdLoading || !currentPassword || !newPassword || !confirmPassword}
                className="w-full sm:w-auto py-2 px-5 text-xs font-bold uppercase tracking-wider bg-brass-500 text-bgdark hover:bg-brass-400"
              >
                {pwdLoading ? (
                  <>
                    <Loader2 size={12} className="animate-spin mr-1.5" />
                    Updating...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </div>
          </form>
        </motion.div>

        {/* Right Card 2: Achievements Badges Card */}
        <motion.div
          animate={achievementsAnimate}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          style={{ pointerEvents: showAchievements ? 'auto' : 'none' }}
          className="absolute w-[90%] sm:w-[420px] h-[510px] rounded-xl2 border border-ink/10 dark:border-paper/10 bg-gradient-to-br from-white via-white/95 to-paper-soft/90 dark:from-[#211C17]/95 dark:via-[#211C17]/90 dark:to-[#1C1712]/80 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15),_0_0_40px_rgba(184,134,63,0.04)] dark:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.55),_0_0_50px_rgba(184,134,63,0.06)] flex flex-col justify-between p-6 z-0 overflow-hidden"
        >
          <div className="h-full flex flex-col justify-between z-10">
            <div className="space-y-4 flex flex-col h-full">
              <div className="flex items-center gap-2.5 border-b border-ink/5 dark:border-paper/5 pb-2.5">
                <button
                  type="button"
                  onClick={() => setShowAchievements(false)}
                  className="rounded-full p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/10 transition-colors"
                  title="Back to Profile"
                >
                  <ArrowLeft size={16} />
                </button>
                <Award size={16} className="text-purple-500" />
                <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                  Unlocked Badges
                </h3>
              </div>

              {/* Scrollable Badges Grid */}
              <div className="flex-1 overflow-y-auto pr-1 space-y-2 max-h-[380px] scrollbar-thin scrollbar-thumb-ink/10">
                {BADGES.map((badge) => {
                  const earned = badge.isEarned({ booksRead: totalBooksRead, pagesRead: totalPagesRead, highestStreak });
                  const IconComponent = iconMap[badge.icon];
                  return (
                    <div
                      key={badge.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg border transition-all duration-300 ${
                        earned 
                          ? 'bg-paper-soft/60 dark:bg-bgdark-soft/30 border-ink/5 dark:border-paper/5' 
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
    </div>
  );
}
