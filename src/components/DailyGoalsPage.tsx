import { useState, useMemo, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Calendar,
  Check,
  Edit2,
  TrendingUp,
  BookOpen,
  Award,
  Plus,
  Target,
  ChevronDown,
} from 'lucide-react';
import type { StreakLog } from './StreakManager';
import { getLocalDateString, classNames } from '../utils/helpers';

interface DailyGoalsPageProps {
  streakLog: StreakLog;
  onUpdateStreakLog: (newLog: StreakLog) => Promise<void> | void;
  dailyGoal: number | null;
  dailyGoalHistory: Record<string, number>;
  onUpdateDailyGoal: (newGoal: number, dateStr?: string) => Promise<void> | void;
  onBack: () => void;
}

export function DailyGoalsPage({
  streakLog,
  onUpdateStreakLog,
  dailyGoal,
  dailyGoalHistory,
  onUpdateDailyGoal,
  onBack,
}: DailyGoalsPageProps) {
  const today = new Date();
  const todayStr = getLocalDateString(today);

  // Derive all unique months in user's history
  const monthsList = useMemo(() => {
    const dates = new Set<string>();
    dates.add(todayStr.slice(0, 7)); // Always include current month

    Object.keys(streakLog).forEach((dStr) => {
      dates.add(dStr.slice(0, 7));
    });

    return Array.from(dates).sort((a, b) => b.localeCompare(a));
  }, [streakLog, todayStr]);

  const [selectedMonth, setSelectedMonth] = useState<string>(todayStr.slice(0, 7));
  const [editingDate, setEditingDate] = useState<string | null>(null);

  // Custom select dropdown menu state
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Editing input states
  const [editGoalInput, setEditGoalInput] = useState<string>('');
  const [editPagesInput, setEditPagesInput] = useState<string>('');

  // Calculate statistics across history
  const stats = useMemo(() => {
    const dates = Object.keys(streakLog).filter((d) => d <= todayStr);
    let totalPages = 0;
    let completedDays = 0;
    let loggedDays = 0;

    dates.forEach((dStr) => {
      const pages = streakLog[dStr]?.pages || 0;
      const target = dailyGoalHistory[dStr] ?? dailyGoal ?? 0;

      if (pages > 0) {
        totalPages += pages;
        loggedDays++;
        if (pages >= target) {
          completedDays++;
        }
      }
    });

    const completionRate = loggedDays > 0 ? Math.round((completedDays / loggedDays) * 100) : 0;

    return {
      totalPages,
      completedDays,
      loggedDays,
      completionRate,
    };
  }, [streakLog, dailyGoalHistory, dailyGoal, todayStr]);

  // List of days for the selected month (reverse order)
  const daysInMonthList = useMemo(() => {
    const [yearStr, monthStr] = selectedMonth.split('-');
    const year = parseInt(yearStr, 10);
    const month = parseInt(monthStr, 10) - 1;

    const lastDay = new Date(year, month + 1, 0).getDate();
    const days: { dateStr: string; dateLabel: string; isToday: boolean; isYesterday: boolean }[] = [];

    // Check if selected month is the current month to avoid future dates
    const currentMonthStr = todayStr.slice(0, 7);
    const maxDay = selectedMonth === currentMonthStr ? today.getDate() : lastDay;

    for (let d = maxDay; d >= 1; d--) {
      const tempDate = new Date(year, month, d);
      const dateStr = getLocalDateString(tempDate);
      
      const isToday = dateStr === todayStr;
      
      const yesterday = new Date(today);
      yesterday.setDate(today.getDate() - 1);
      const isYesterday = dateStr === getLocalDateString(yesterday);

      let dateLabel = tempDate.toLocaleDateString(undefined, {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      if (isToday) dateLabel = 'Today';
      else if (isYesterday) dateLabel = 'Yesterday';

      days.push({
        dateStr,
        dateLabel,
        isToday,
        isYesterday,
      });
    }

    return days;
  }, [selectedMonth, todayStr, today]);

  const handleStartEdit = (dateStr: string, currentPages: number, currentGoal: number | null) => {
    setEditingDate(dateStr);
    setEditPagesInput(String(currentPages));
    setEditGoalInput(currentGoal !== null ? String(currentGoal) : '');
  };

  const handleSave = async (dateStr: string) => {
    const newPages = Math.max(0, parseInt(editPagesInput, 10) || 0);
    const alreadyHasGoal = typeof dailyGoalHistory[dateStr] === 'number';

    // Save Pages Read to streakLog
    const updatedLog = { ...streakLog };
    updatedLog[dateStr] = {
      read: newPages > 0,
      pages: newPages,
    };
    await onUpdateStreakLog(updatedLog);

    // Only save the goal if one hasn't been set for this day yet
    if (!alreadyHasGoal) {
      const newGoal = Math.max(1, parseInt(editGoalInput, 10) || 1);
      await onUpdateDailyGoal(newGoal, dateStr);
    }

    setEditingDate(null);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex items-center justify-between border-b border-ink/5 pb-4 dark:border-paper/5">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-ink-muted hover:text-ink dark:text-paper/60 dark:hover:text-paper transition-colors"
        >
          <ChevronLeft size={14} /> Back to Dashboard
        </button>

        {/* Custom Month Filter dropdown menu */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="inline-flex items-center gap-2 rounded-lg border border-ink/10 bg-surface px-3 py-1.5 text-xs font-semibold text-ink-muted hover:bg-ink/5 dark:border-paper/10 dark:bg-surface-dark dark:text-paper/70 dark:hover:bg-paper/10 transition-colors shadow-sm"
          >
            <Calendar size={13} className="text-ink-faint dark:text-paper/40" />
            <span>
              {(() => {
                const [y, mon] = selectedMonth.split('-');
                const date = new Date(parseInt(y, 10), parseInt(mon, 10) - 1, 1);
                return date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
              })()}
            </span>
            <ChevronDown size={13} className="text-ink-faint dark:text-paper/40" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 z-20 mt-1.5 min-w-[170px] max-h-60 overflow-y-auto rounded-xl border border-ink/10 bg-surface p-1 shadow-modal dark:border-paper/10 dark:bg-surface-dark scrollbar-thin">
              {monthsList.map((m) => {
                const [y, mon] = m.split('-');
                const date = new Date(parseInt(y, 10), parseInt(mon, 10) - 1, 1);
                const label = date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
                const isSelected = m === selectedMonth;

                return (
                  <button
                    key={m}
                    onClick={() => {
                      setSelectedMonth(m);
                      setDropdownOpen(false);
                    }}
                    className={classNames(
                      'group flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs transition-colors font-medium',
                      isSelected
                        ? 'bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300'
                        : 'text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper'
                    )}
                  >
                    {label}
                    {isSelected && <Check size={12} className="text-purple-600 dark:text-purple-400 shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Completion Rate */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-500 text-white">
            <Award size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/30">
              Avg Goal Met Rate
            </p>
            <p className="font-display text-xl font-bold text-ink dark:text-paper">
              {stats.completionRate}%
            </p>
          </div>
        </div>

        {/* Total Pages Logged */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-forest-500 text-white">
            <BookOpen size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/30">
              Total Pages Logged
            </p>
            <p className="font-display text-xl font-bold text-ink dark:text-paper">
              {stats.totalPages.toLocaleString()} pages
            </p>
          </div>
        </div>

        {/* Successful Days */}
        <div className="rounded-xl2 border border-ink/10 bg-surface p-4 shadow-card dark:border-paper/10 dark:bg-surface-dark flex items-center gap-3.5">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brass-500 text-white">
            <TrendingUp size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold tracking-wider text-ink-faint dark:text-paper/30">
              Target Achieved Days
            </p>
            <p className="font-display text-xl font-bold text-ink dark:text-paper">
              {stats.completedDays} / {stats.loggedDays} days
            </p>
          </div>
        </div>
      </div>

      {/* Grid of Daily Log Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {daysInMonthList.map((day) => {
          const pages = streakLog[day.dateStr]?.pages || 0;
          const targetGoal = dailyGoalHistory[day.dateStr] ?? dailyGoal ?? null;
          const isEditing = editingDate === day.dateStr;

          const pct = targetGoal > 0 ? Math.min(100, Math.round((pages / targetGoal) * 100)) : 0;
          
          let cardBorderClass = 'border-ink/10 dark:border-paper/10';
          let cardBgClass = 'bg-surface dark:bg-surface-dark';
          
          if (day.isToday) {
            cardBorderClass = 'border-purple-400 dark:border-purple-500/50 ring-1 ring-purple-400/20';
            cardBgClass = 'bg-surface dark:bg-surface-dark/95';
          } else if (pages > 0 && pct >= 100) {
            cardBorderClass = 'border-forest-200/80 dark:border-forest-900/30';
          }

          const hasGoalForDay = typeof dailyGoalHistory[day.dateStr] === 'number';

          return (
            <div
              key={day.dateStr}
              className={`rounded-xl2 border p-4 shadow-card hover:shadow-cardHover transition-all flex flex-col justify-between min-h-[165px] ${cardBorderClass} ${cardBgClass}`}
            >
              {isEditing ? (
                // Edit Mode
                <div className="flex flex-col justify-between h-full space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                      Logging progress
                    </span>
                    <span className="text-xs font-semibold text-ink-muted dark:text-paper/40 font-mono">
                      {day.dateStr}
                    </span>
                  </div>

                  {/* Reminder note only shown when no goal set yet */}
                  {typeof dailyGoalHistory[day.dateStr] !== 'number' && (
                    <p className="text-[10px] text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded-lg px-2.5 py-1.5 leading-relaxed">
                      ⚠️ Once you set a goal for this day, it cannot be changed later.
                    </p>
                  )}

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="block text-[10px] font-bold text-ink-muted dark:text-paper/40 uppercase tracking-wider mb-1">
                        Pages Read
                      </label>
                      <input
                        type="number"
                        min={0}
                        value={editPagesInput}
                        onChange={(e) => setEditPagesInput(e.target.value)}
                        className="w-full rounded-lg border border-ink/10 bg-paper px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-purple-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper font-semibold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-ink-muted dark:text-paper/40 uppercase tracking-wider mb-1">
                        {typeof dailyGoalHistory[day.dateStr] === 'number' ? 'Goal (locked)' : 'Set Goal'}
                      </label>
                      {typeof dailyGoalHistory[day.dateStr] === 'number' ? (
                        <div className="w-full rounded-lg border border-ink/5 bg-ink/5 px-2.5 py-1.5 text-xs text-ink-faint dark:border-paper/5 dark:bg-paper/5 dark:text-paper/30 font-semibold">
                          {dailyGoalHistory[day.dateStr]} pages
                        </div>
                      ) : (
                        <input
                          type="number"
                          min={1}
                          value={editGoalInput}
                          onChange={(e) => setEditGoalInput(e.target.value)}
                          className="w-full rounded-lg border border-ink/10 bg-paper px-2.5 py-1.5 text-xs text-ink focus:outline-none focus:ring-1 focus:ring-purple-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper font-semibold"
                        />
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end gap-1.5 pt-1">
                    <button
                      onClick={() => setEditingDate(null)}
                      className="rounded-lg border border-ink/10 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-ink/5 dark:border-paper/10 dark:text-paper/80 dark:hover:bg-paper/5 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleSave(day.dateStr)}
                      className="rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-purple-700 transition-all shadow-sm flex items-center gap-1"
                    >
                      <Check size={12} /> Save
                    </button>
                  </div>
                </div>
              ) : (
                // View Mode
                <div className="flex flex-col justify-between h-full">
                  {/* Top Row: Date & Status Badge */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-display text-base font-bold text-ink dark:text-paper">
                          {day.dateLabel}
                        </h4>
                        {day.isToday && (
                          <span className="rounded-full bg-purple-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                            Today
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-ink-faint dark:text-paper/30 font-mono mt-0.5 block">
                        {day.dateStr}
                      </span>
                    </div>

                    {/* Progress Badge */}
                    {pages > 0 ? (
                      <span
                        className={`rounded-lg px-2 py-0.5 text-[11px] font-bold tabular-nums ${
                          pct >= 100
                            ? 'bg-forest-50 text-forest-600 dark:bg-forest-950/20 dark:text-forest-400'
                            : 'bg-brass-50 text-brass-600 dark:bg-brass-950/20 dark:text-brass-400'
                        }`}
                      >
                        {pct}%
                      </span>
                    ) : (
                      <span className="rounded-lg bg-ink/5 px-2 py-0.5 text-[10px] font-medium text-ink-faint dark:bg-paper/5 dark:text-paper/30 italic">
                        Empty
                      </span>
                    )}
                  </div>

                  {/* Middle Row: Progress numbers & Bar */}
                  <div className="my-3">
                    {pages > 0 ? (
                      <div>
                        <div className="flex justify-between items-center text-xs text-ink-muted dark:text-paper/50 mb-1">
                          <span>Progress</span>
                          <span className="font-semibold text-ink dark:text-paper">
                            {pages}{targetGoal !== null ? ` / ${targetGoal} pages` : ' pages read'}
                          </span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-ink/10 dark:bg-paper/10">
                          <div
                            className={`h-full rounded-full transition-all ${
                              pct >= 100 ? 'bg-forest-500' : 'bg-brass-500'
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 py-1 text-xs text-ink-muted/65 dark:text-paper/40 italic">
                        <Target size={13} className="text-ink-faint/60 dark:text-paper/20" />
                        <span>
                          {hasGoalForDay
                            ? `Goal is set to ${targetGoal} pages`
                            : 'Set goal'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Bottom Row: Actions */}
                  <div className="flex items-center justify-between border-t border-ink/5 dark:border-paper/5 pt-2.5">
                    <span className="text-[11px] text-ink-faint dark:text-paper/30">
                      {pages > 0 && pct >= 100 ? "🎉 Completed!" : pages > 0 ? "📖 In progress" : "🎯 No reading yet"}
                    </span>
                    <button
                      onClick={() => handleStartEdit(day.dateStr, pages, targetGoal)}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors"
                    >
                      {pages > 0 ? (
                        <>
                          <Edit2 size={10} /> Edit Log
                        </>
                      ) : (
                        <>
                          <Plus size={11} /> Log Progress
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
