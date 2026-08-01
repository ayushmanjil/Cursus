import { useState, useEffect } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Flame,
  BookOpen,
  Sparkles,
  Calendar as CalendarIcon,
  Zap,
  Award,
  Bookmark,
  ScrollText,
  Trophy,
  Shield,
  Crown,
  Gem,
  Compass,
  Sun,
  Globe,
  Lock,
} from 'lucide-react';
import { classNames, getLocalDateString, calculateStreaks, getHighestPagesRecord, formatDate } from '../utils/helpers';

export interface StreakDay {
  read: boolean;
  pages?: number;
}

export type StreakLog = Record<string, StreakDay>;

interface StreakManagerProps {
  log: StreakLog;
  onUpdateLog: (newLog: StreakLog) => void;
}

interface Milestone {
  days: number;
  title: string;
  icon: React.ElementType;
  colorClass: string;
}

const STREAK_MILESTONES: Milestone[] = [
  { days: 3, title: 'Page Starter', icon: Zap, colorClass: 'text-amber-500 bg-amber-500/10 border-amber-500/30' },
  { days: 5, title: 'Page Turner', icon: BookOpen, colorClass: 'text-yellow-600 bg-yellow-500/10 border-yellow-500/30' },
  { days: 7, title: 'Weekly Scholar', icon: Award, colorClass: 'text-brass-500 bg-brass-500/15 border-brass-500/40' },
  { days: 14, title: 'Fortnight Master', icon: Bookmark, colorClass: 'text-forest-500 bg-forest-500/15 border-forest-500/40' },
  { days: 30, title: 'Monthly Bard', icon: ScrollText, colorClass: 'text-purple-500 bg-purple-500/15 border-purple-500/40' },
  { days: 50, title: 'Hall of Fame', icon: Trophy, colorClass: 'text-amber-600 bg-amber-500/20 border-amber-500/50' },
  { days: 100, title: 'Invincible', icon: Shield, colorClass: 'text-brass-600 bg-brass-500/20 border-brass-500/60' },
  { days: 150, title: 'Grand Legend', icon: Crown, colorClass: 'text-purple-600 bg-purple-500/20 border-purple-500/60' },
  { days: 200, title: 'Gilded Scholar', icon: Gem, colorClass: 'text-amber-500 bg-amber-400/20 border-amber-400/60' },
  { days: 250, title: 'Visionary', icon: Compass, colorClass: 'text-forest-600 bg-forest-500/20 border-forest-500/60' },
  { days: 300, title: 'Supreme Luminary', icon: Sun, colorClass: 'text-yellow-500 bg-yellow-400/25 border-yellow-400/70' },
  { days: 365, title: 'Yearly Titan', icon: Sparkles, colorClass: 'text-brass-400 bg-brass-400/25 border-brass-400/80' },
  { days: 500, title: 'Omniscient', icon: Globe, colorClass: 'text-purple-400 bg-purple-400/25 border-purple-400/80' },
];

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function StreakManager({ log, onUpdateLog }: StreakManagerProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDateStr, setSelectedDateStr] = useState(getLocalDateString(today));
  const [milestonePage, setMilestonePage] = useState(0);

  // Local editing states
  const [editRead, setEditRead] = useState(false);
  const [editPages, setEditPages] = useState<number>(0);

  // Sync edits when selectedDateStr or log changes
  useEffect(() => {
    const dayData = log[selectedDateStr] || { read: false, pages: 0 };
    setEditRead(dayData.read);
    setEditPages(dayData.pages || 0);
  }, [selectedDateStr, log]);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get start day of month (0-6 for Sun-Sat)
  const firstDayIndex = new Date(year, month, 1).getDay();
  // Get total days in month
  const totalDays = new Date(year, month + 1, 0).getDate();

  // Generate calendar days including empty padding at start
  const calendarCells: (Date | null)[] = [];
  for (let i = 0; i < firstDayIndex; i++) {
    calendarCells.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    calendarCells.push(new Date(year, month, d));
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(
      new Date(year, direction === 'prev' ? month - 1 : month + 1, 1)
    );
  };

  const selectedDayLog = { read: editRead, pages: editPages };
  const originalDayData = log[selectedDateStr] || { read: false, pages: 0 };
  const isDirty = editRead !== originalDayData.read || editPages !== (originalDayData.pages || 0);

  const { currentStreak, highestStreak } = calculateStreaks(log);
  const { maxPages, recordDate } = getHighestPagesRecord(log);

  const handleToggleRead = (checked: boolean) => {
    setEditRead(checked);
    if (!checked) {
      setEditPages(0);
    }
  };

  const handleUpdateNumber = (_field: 'pages', val: number) => {
    setEditPages(val);
    if (val > 0) {
      setEditRead(true);
    }
  };

  const handleCommit = () => {
    if (selectedDateStr > getLocalDateString(today)) {
      alert("Cannot log reading activity for future dates.");
      return;
    }
    const updated = { ...log };
    updated[selectedDateStr] = {
      read: editRead,
      pages: editPages,
    };
    onUpdateLog(updated);
  };

  const itemsPerPage = 4;
  const totalMilestonePages = Math.ceil(STREAK_MILESTONES.length / itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Header Widget Panel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Current Streak */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brass-500 text-white">
            <Flame size={22} className="animate-pulse" />
          </div>
          <div>
            <p className="text-xs text-ink-muted dark:text-paper/50 font-semibold uppercase tracking-wide">
              Current Streak
            </p>
            <p className="font-display text-2xl font-bold text-ink dark:text-paper">
              {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
            </p>
          </div>
        </div>

        {/* Highest Streak */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-500 text-white">
            <Sparkles size={22} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs text-ink-muted dark:text-paper/50 font-semibold uppercase tracking-wide">
              Personal Record
            </p>
            <p className="font-display text-2xl font-bold text-ink dark:text-paper">
              {highestStreak} {highestStreak === 1 ? 'day' : 'days'}
            </p>
            {maxPages > 0 && (
              <p className="text-[11px] text-ink-muted dark:text-paper/50 mt-1 truncate">
                Max read in a day: <span className="font-semibold text-forest-500 dark:text-forest-400">{maxPages} pages</span> on {formatDate(recordDate)}
              </p>
            )}
          </div>
        </div>
      </div>

      <hr className="border-ink/10 dark:border-paper/10" />

      {/* Sheet Layout: Calendar vs Log Detail & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Left Side: Monthly Calendar Sheet */}
        <div className="lg:col-span-3 w-full rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-1.5 font-display text-base font-medium text-ink dark:text-paper">
              <CalendarIcon size={16} className="text-brass-500" />
              {MONTHS[month]} {year}
            </h3>
            <div className="flex gap-1.5">
              <button
                onClick={() => navigateMonth('prev')}
                className="rounded-lg border border-ink/10 p-1.5 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 transition-colors"
                aria-label="Previous month"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={() => navigateMonth('next')}
                className="rounded-lg border border-ink/10 p-1.5 hover:bg-ink/5 dark:border-paper/10 dark:hover:bg-paper/5 transition-colors"
                aria-label="Next month"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1 text-center text-[11px] font-semibold text-ink-muted dark:text-paper/40 mb-2">
            <div>Sun</div>
            <div>Mon</div>
            <div>Tue</div>
            <div>Wed</div>
            <div>Thu</div>
            <div>Fri</div>
            <div>Sat</div>
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarCells.map((dateObj, i) => {
              if (!dateObj) {
                return <div key={`empty-${i}`} className="aspect-square" />;
              }

              const dateStr = getLocalDateString(dateObj);
              const isSelected = dateStr === selectedDateStr;
              const isToday = dateStr === getLocalDateString(today);
              const dayData = log[dateStr];
              const isRead = dayData?.read;
              const isFuture = dateStr > getLocalDateString(today);

              return (
                <button
                  key={dateStr}
                  disabled={isFuture}
                  onClick={() => setSelectedDateStr(dateStr)}
                  className={classNames(
                    'aspect-square flex flex-col items-center justify-between rounded-lg p-1 sm:p-2 border transition-all text-xs relative group',
                    isSelected
                      ? 'border-brass-500 ring-2 ring-brass-400 dark:border-brass-400'
                      : 'border-ink/5 dark:border-paper/5',
                    isRead
                      ? 'bg-forest-500 text-white font-semibold shadow-sm'
                      : isFuture
                        ? 'bg-ink/5 text-ink-muted/30 cursor-not-allowed dark:bg-paper/5 dark:text-paper/20'
                        : 'bg-paper-soft hover:bg-ink/5 dark:bg-bgdark-soft dark:hover:bg-paper/5 text-ink-muted dark:text-paper/60',
                    isToday && !isRead && 'border-brass-500/60 dark:border-brass-400/50'
                  )}
                >
                  <span className="self-start text-[10px] sm:text-[11px]">{dateObj.getDate()}</span>
                  {/* Indicators for entered data */}
                  {isRead && (
                    <div className="w-full mt-auto">
                      {dayData.pages && dayData.pages > 0 ? (
                        <span className="bg-white/20 px-0.5 sm:px-1 py-0.5 rounded text-[9px] sm:text-[11px] font-bold text-white leading-tight block text-center shadow-sm tracking-tight">
                          <span className="hidden sm:inline">{dayData.pages} pages</span>
                          <span className="inline sm:hidden">{dayData.pages}p</span>
                        </span>
                      ) : (
                        <span className="text-[9px] sm:text-[11px] font-bold opacity-80 leading-none block text-center">
                          read
                        </span>
                      )}
                    </div>
                  )}
                  {isToday && (
                    <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-brass-500" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side Column */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Daily Reading Log Editor */}
          <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex flex-col justify-between">
            <div className="space-y-5">
              <div>
                <h3 className="font-display text-base font-semibold text-ink dark:text-paper">
                  Daily Reading Log
                </h3>
                <p className="text-xs text-ink-faint dark:text-paper/40 mt-0.5">
                  {new Date(selectedDateStr + 'T12:00:00').toLocaleDateString(undefined, {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>

              {/* Radio Buttons for Reading Status */}
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-ink/5 bg-paper-soft p-3 dark:border-paper/5 dark:bg-bgdark-soft hover:bg-ink/5 dark:hover:bg-paper/5 transition-all">
                  <input
                    type="radio"
                    name="readStatus"
                    checked={selectedDayLog.read}
                    onChange={() => handleToggleRead(true)}
                    className="h-4 w-4 border-ink/20 text-forest-500 focus:ring-forest-400 accent-forest-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-paper">
                      I read today
                    </p>
                    <p className="text-[10px] text-ink-faint dark:text-paper/40">
                      Adds this day to your reading streak
                    </p>
                  </div>
                </label>

                <label className="flex items-center gap-3 cursor-pointer rounded-lg border border-ink/5 bg-paper-soft p-3 dark:border-paper/5 dark:bg-bgdark-soft hover:bg-ink/5 dark:hover:bg-paper/5 transition-all">
                  <input
                    type="radio"
                    name="readStatus"
                    checked={!selectedDayLog.read}
                    onChange={() => handleToggleRead(false)}
                    className="h-4 w-4 border-ink/20 text-burgundy-500 focus:ring-burgundy-400 accent-burgundy-500"
                  />
                  <div>
                    <p className="text-sm font-medium text-ink dark:text-paper">
                      I did not read today
                    </p>
                    <p className="text-[10px] text-ink-faint dark:text-paper/40">
                      Breaks/excludes this day from your streak
                    </p>
                  </div>
                </label>
              </div>

              {/* Sub-input: Pages */}
              {editRead && (
                <div className="space-y-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                      <BookOpen size={13} className="text-forest-500" />
                      Pages Read
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="1"
                      value={selectedDayLog.pages || ''}
                      onChange={(e) => {
                        const val = parseInt(e.target.value.replace(/[^0-9]/g, ''), 10);
                        handleUpdateNumber('pages', isNaN(val) ? 0 : val);
                      }}
                      placeholder="e.g. 25 pages"
                      className="w-full rounded-lg border border-ink/10 bg-paper px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
                    />
                  </div>
                </div>
              )}

              {/* Commit / Save Button */}
              <div className="pt-3">
                <button
                  type="button"
                  onClick={handleCommit}
                  disabled={!isDirty}
                  className={classNames(
                    'w-full py-2.5 px-4 rounded-lg text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center gap-1.5',
                    isDirty
                      ? 'bg-forest-500 text-white hover:bg-forest-600 active:scale-[0.98]'
                      : 'bg-ink/5 text-ink-faint cursor-not-allowed dark:bg-paper/5 dark:text-paper/30'
                  )}
                >
                  {isDirty ? 'Commit Log Data' : 'Log Saved ✓'}
                </button>
              </div>
            </div>

            {/* Quick Metrics display */}
            <div className="pt-4 border-t border-ink/5 dark:border-paper/5 mt-6 text-xs text-ink-muted dark:text-paper/50 space-y-1 font-medium">
              <p>Logged in {MONTHS[month]}:</p>
              <div className="flex justify-between text-ink dark:text-paper font-semibold">
                <span>Total Pages:</span>
                <span>
                  {Object.keys(log)
                    .filter((d) => d.startsWith(`${year}-${String(month + 1).padStart(2, '0')}`))
                    .reduce((sum, d) => sum + (log[d]?.pages || 0), 0)}{' '}
                  pages
                </span>
              </div>
            </div>
          </div>

          {/* Streak Milestones Showcase */}
          <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark space-y-4">
            <div className="flex items-center justify-between border-b border-ink/5 pb-2.5 dark:border-paper/5">
              <div>
                <h3 className="font-display text-sm font-semibold text-ink dark:text-paper flex items-center gap-1.5">
                  <Flame size={15} className="text-brass-500" />
                  Streak Milestones
                </h3>
                <p className="text-[10.5px] text-ink-faint dark:text-paper/40">
                  Unlocked via highest streak record ({highestStreak}d)
                </p>
              </div>
            </div>

            {/* Milestones Grid (4 items) */}
            <div className="grid grid-cols-4 gap-2 pt-1 min-h-[110px]">
              {STREAK_MILESTONES.slice(milestonePage * itemsPerPage, (milestonePage + 1) * itemsPerPage).map((m) => {
                const isUnlocked = highestStreak >= m.days;
                const IconComp = m.icon;
                return (
                  <div
                    key={m.days}
                    className="flex flex-col items-center text-center gap-1.5 group select-none"
                  >
                    <div
                      className={classNames(
                        'w-11 h-11 rounded-full border flex items-center justify-center transition-all duration-300 relative',
                        isUnlocked
                          ? classNames(m.colorClass, 'shadow-sm group-hover:scale-105')
                          : 'border-ink/10 bg-ink/5 text-ink-faint/30 dark:border-paper/10 dark:bg-paper/5 dark:text-paper/20 opacity-60'
                      )}
                      title={`${m.days} Days: ${m.title} ${isUnlocked ? '(Unlocked)' : '(Locked)'}`}
                    >
                      <IconComp size={20} className={isUnlocked ? 'animate-pulse' : ''} />
                      {!isUnlocked && (
                        <div className="absolute -bottom-1 -right-1 bg-surface dark:bg-surface-dark rounded-full p-0.5 border border-ink/10 dark:border-paper/10 text-ink-faint dark:text-paper/40">
                          <Lock size={9} />
                        </div>
                      )}
                    </div>
                    <div className="space-y-0.5 min-w-0 w-full">
                      <p className={classNames('text-xs font-bold leading-tight truncate', isUnlocked ? 'text-ink dark:text-paper' : 'text-ink-faint dark:text-paper/40')}>
                        {m.days} days
                      </p>
                      <p className="text-[10px] text-ink-muted dark:text-paper/50 font-medium truncate">
                        {m.title}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center justify-between pt-2 border-t border-ink/5 dark:border-paper/5">
              <button
                onClick={() => setMilestonePage((p) => Math.max(0, p - 1))}
                disabled={milestonePage === 0}
                className="rounded-lg p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Previous milestones"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalMilestonePages }).map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setMilestonePage(idx)}
                    className={classNames(
                      'h-1.5 rounded-full transition-all duration-200',
                      milestonePage === idx
                        ? 'w-4 bg-brass-500 dark:bg-brass-400'
                        : 'w-1.5 bg-ink/15 dark:bg-paper/20 hover:bg-ink/30 dark:hover:bg-paper/40'
                    )}
                    aria-label={`Go to page ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setMilestonePage((p) => Math.min(totalMilestonePages - 1, p + 1))}
                disabled={milestonePage >= totalMilestonePages - 1}
                className="rounded-lg p-1 text-ink-muted hover:bg-ink/5 dark:text-paper/60 dark:hover:bg-paper/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                aria-label="Next milestones"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
