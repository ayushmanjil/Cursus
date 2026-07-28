import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Timer,
  Pause,
  Play,
  RotateCcw,
} from 'lucide-react';
import type { FocusTimerHook } from '../hooks/useFocusTimer';

interface DynamicIslandTimerPillProps {
  timerHook: FocusTimerHook;
  onNavigateToTimer: () => void;
  visible: boolean;
}

export function DynamicIslandTimerPill({
  timerHook,
  onNavigateToTimer,
  visible,
}: DynamicIslandTimerPillProps) {
  const [expanded, setExpanded] = useState(false);
  const pillRef = useRef<HTMLDivElement>(null);

  // Close expanded island when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pillRef.current && !pillRef.current.contains(e.target as Node)) {
        setExpanded(false);
      }
    };
    if (expanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);

  if (!visible) return null;

  const handleSingleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded((prev) => !prev);
  };

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setExpanded(false);
    onNavigateToTimer();
  };

  return (
    <div
      ref={pillRef}
      className="fixed top-3 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none"
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: -14, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -14, scale: 0.9 }}
        transition={{ type: 'spring', stiffness: 450, damping: 30 }}
        className={`overflow-hidden rounded-full border-2 transition-all duration-200 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.18)] ${
          expanded
            ? 'border-white/80 dark:border-white/20 bg-[#fcfbfa]/70 dark:bg-[#1a1411]/70 px-5 py-2.5 h-[70px] sm:h-[74px] w-[330px] sm:w-[385px] ring-1 ring-white/60 dark:ring-white/10'
            : 'border-white/80 dark:border-white/20 bg-[#fcfbfa]/70 dark:bg-[#1a1411]/70 px-4 py-1.5 cursor-pointer hover:scale-105 ring-1 ring-white/60 dark:ring-white/10'
        }`}
        onClick={!expanded ? handleSingleClick : undefined}
        onDoubleClick={handleDoubleClick}
      >
        {!expanded ? (
          /* Collapsed Glassmorphic Pill State */
          <div className="flex h-full items-center gap-2.5 text-xs font-bold text-ink dark:text-paper">
            <span className="relative flex h-2.5 w-2.5 shrink-0">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${timerHook.isPaused ? 'bg-amber-400' : 'bg-brass-400'}`} />
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${timerHook.isPaused ? 'bg-amber-500' : 'bg-brass-500'}`} />
            </span>
            <Timer size={15} className="text-brass-600 dark:text-brass-400 stroke-[2.5] shrink-0" />
            <span className="font-mono text-sm font-bold tracking-tight text-ink dark:text-paper">{timerHook.activeFormattedTime}</span>
            <span className="text-[10px] font-semibold uppercase tracking-wider text-brass-700 dark:text-brass-300 hidden sm:inline">
              {timerHook.isPaused ? 'Paused' : timerHook.mode === 'stopwatch' ? 'Stopwatch' : 'Focusing'}
            </span>
          </div>
        ) : (
          /* Expanded Glassmorphic Stadium Pill Island */
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex h-full items-center justify-between w-full"
          >
            {/* Left Side: Frosted Control Buttons */}
            <div className="flex items-center gap-2.5">
              {/* Pause / Resume Circular Button */}
              {timerHook.isPaused ? (
                <button
                  type="button"
                  onClick={timerHook.handleResume}
                  title="Resume Session"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-500/90 text-white hover:bg-brass-500 border border-brass-300/60 hover:scale-105 active:scale-95 transition-all shadow-md backdrop-blur-md"
                >
                  <Play size={18} className="fill-current ml-0.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={timerHook.handlePause}
                  title="Pause Session"
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brass-500/90 text-white hover:bg-brass-500 border border-brass-300/60 hover:scale-105 active:scale-95 transition-all shadow-md backdrop-blur-md"
                >
                  <Pause size={18} className="fill-current" />
                </button>
              )}

              {/* Reset Circular Button */}
              <button
                type="button"
                onClick={() => {
                  setExpanded(false);
                  timerHook.handleReset();
                }}
                title="Reset & End Session"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/60 dark:bg-white/10 text-ink dark:text-paper hover:bg-white/90 dark:hover:bg-white/20 border border-white/50 dark:border-white/15 hover:scale-105 active:scale-95 transition-all shadow-sm backdrop-blur-md"
              >
                <RotateCcw size={17} />
              </button>
            </div>

            {/* Right Side: Mode Label & Large Live Clock Display */}
            <div className="text-right cursor-pointer" onClick={() => setExpanded(false)}>
              <div className="text-[10px] font-extrabold uppercase tracking-widest text-brass-600 dark:text-brass-400">
                {timerHook.isPaused ? 'PAUSED' : timerHook.mode === 'stopwatch' ? 'STOPWATCH' : 'NOOK TIMER'}
              </div>
              <div className="font-mono text-2xl sm:text-3xl font-extrabold text-ink dark:text-paper tracking-tight leading-none mt-0.5">
                {timerHook.activeFormattedTime}
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}
