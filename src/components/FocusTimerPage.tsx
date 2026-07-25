import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Sparkles,
  Flame,
  Clock,
  Radio,
  CloudRain,
  Waves,
  Timer as TimerIcon,
  CheckCircle2,
  Sliders,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Button } from './ui/Button';
import { Modal } from './ui/Modal';
import { soundController } from '../utils/audio';
import type { AmbientSoundType } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';
import { classNames } from '../utils/helpers';

interface FocusTimerPageProps {
  onNavigateToStreaks: () => void;
}

type TimerMode = 'countdown' | 'stopwatch';

const PRESETS = [
  { label: '15m', minutes: 15 },
  { label: '25m', minutes: 25 },
  { label: '45m', minutes: 45 },
  { label: '60m', minutes: 60 },
];

const SOUND_OPTIONS: { type: AmbientSoundType; label: string; desc: string; icon: React.ElementType }[] = [
  { type: 'off', label: 'Mute / Off', desc: 'No background sound', icon: VolumeX },
  { type: 'ticking', label: 'Clock Ticking', desc: 'Steady rhythm for focus', icon: Clock },
  { type: 'white-noise', label: 'White Noise', desc: 'Blocks out distractions', icon: Radio },
  { type: 'rain', label: 'Soft Rain', desc: 'Soothing rain drops', icon: CloudRain },
  { type: 'waves', label: 'Gentle Waves', desc: 'Ocean tide ambiance', icon: Waves },
];

export function FocusTimerPage({ onNavigateToStreaks }: FocusTimerPageProps) {
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [isExpanded, setIsExpanded] = useState(false);

  // Countdown state
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  // Stopwatch state
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  // Running state
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Ambient sound state
  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('off');
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  // Completion modal state
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Handle ambient sound change
  useEffect(() => {
    if (isRunning && !isPaused) {
      soundController.startAmbient(ambientSound);
    } else {
      soundController.stopAmbient();
    }
  }, [ambientSound, isRunning, isPaused]);

  // Handle volume & mute changes
  useEffect(() => {
    soundController.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    soundController.setMuted(isMuted);
  }, [isMuted]);

  // Cleanup audio & timer on unmount
  useEffect(() => {
    return () => {
      soundController.stopAmbient();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Timer interval effect
  useEffect(() => {
    if (isRunning && !isPaused) {
      timerRef.current = setInterval(() => {
        if (mode === 'countdown') {
          setSecondsLeft((prev) => {
            if (prev <= 1) {
              handleTimerComplete();
              return 0;
            }
            return prev - 1;
          });
        } else {
          setStopwatchSeconds((prev) => prev + 1);
        }
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRunning, isPaused, mode]);

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    soundController.stopAmbient();
    soundController.playCompletionChime();
    triggerConfetti();
    setShowCompletionModal(true);
  }, []);

  const handleStart = () => {
    setIsRunning(true);
    setIsPaused(false);
  };

  const handlePause = () => {
    setIsPaused(true);
  };

  const handleResume = () => {
    setIsPaused(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setIsPaused(false);
    soundController.stopAmbient();
    if (mode === 'countdown') {
      setSecondsLeft(selectedMinutes * 60);
    } else {
      setStopwatchSeconds(0);
    }
  };

  const handleSelectPreset = (mins: number) => {
    setSelectedMinutes(mins);
    setShowCustomInput(false);
    setCustomMinutes('');
    setSecondsLeft(mins * 60);
    if (isRunning) handleReset();
  };

  const handleApplyCustomMinutes = () => {
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0 && val <= 480) {
      setSelectedMinutes(val);
      setSecondsLeft(val * 60);
      if (isRunning) handleReset();
    }
  };

  // Format seconds to MM:SS or HH:MM:SS
  const formatTime = (secs: number) => {
    const hrs = Math.floor(secs / 3600);
    const mins = Math.floor((secs % 3600) / 60);
    const s = secs % 60;

    const pad = (n: number) => String(n).padStart(2, '0');

    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(s)}`;
    }
    return `${pad(mins)}:${pad(s)}`;
  };

  // Calculate ring progress percentage
  const progressPercent =
    mode === 'countdown'
      ? ((selectedMinutes * 60 - secondsLeft) / (selectedMinutes * 60)) * 100
      : (stopwatchSeconds % 3600) / 3600 * 100;

  const radius = isExpanded ? 130 : 100;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progressPercent / 100) * circumference;

  return (
    <div className={classNames('mx-auto space-y-4 py-1 transition-all duration-200 ease-out', isExpanded ? 'max-w-4xl' : 'max-w-4xl')}>
      {/* Top Mode Switcher */}
      <div className="flex justify-center">
        <div className="flex items-center gap-1 rounded-full bg-paper-soft/60 p-1 dark:bg-bgdark-soft/60">
          <button
            onClick={() => {
              setMode('countdown');
              setIsRunning(false);
              setIsPaused(false);
              soundController.stopAmbient();
              setSecondsLeft(selectedMinutes * 60);
            }}
            className={classNames(
              'flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-150',
              mode === 'countdown'
                ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
                : 'text-ink-muted hover:text-ink dark:text-paper/50 dark:hover:text-paper/80'
            )}
          >
            <TimerIcon size={16} />
            Countdown Timer
          </button>
          <button
            onClick={() => {
              setMode('stopwatch');
              setIsRunning(false);
              setIsPaused(false);
              soundController.stopAmbient();
              setStopwatchSeconds(0);
            }}
            className={classNames(
              'flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-150',
              mode === 'stopwatch'
                ? 'bg-surface text-ink shadow-sm dark:bg-surface-dark dark:text-paper'
                : 'text-ink-muted hover:text-ink dark:text-paper/50 dark:hover:text-paper/80'
            )}
          >
            <Clock size={16} />
            Stopwatch
          </button>
        </div>
      </div>

      {/* Grid / Layout Container */}
      <div className={classNames('grid gap-5 items-stretch transition-all duration-200 ease-out', isExpanded ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-5')}>
        {/* Main Timer Card */}
        <div
          className={classNames(
            'relative flex flex-col items-center justify-between rounded-xl2 border border-ink/10 bg-surface p-6 shadow-card dark:border-paper/10 dark:bg-surface-dark transition-all duration-200 ease-out',
            isExpanded ? 'md:col-span-1 py-10 px-8' : 'md:col-span-3'
          )}
        >
          {/* Icon-only Expand/Collapse Button inside top-right of Timer Card */}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="absolute right-4 top-4 rounded-full p-2 text-ink-muted hover:bg-ink/5 hover:text-ink dark:text-paper/60 dark:hover:bg-paper/10 dark:hover:text-paper transition-colors duration-150"
            title={isExpanded ? 'Show sound panel' : 'Expand timer view'}
            aria-label={isExpanded ? 'Collapse timer' : 'Expand timer'}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>

          {/* Presets (Countdown mode only) */}
          {mode === 'countdown' ? (
            <div className="flex flex-wrap items-center justify-center gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.minutes}
                  onClick={() => handleSelectPreset(p.minutes)}
                  disabled={isRunning}
                  className={classNames(
                    'rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-150',
                    selectedMinutes === p.minutes && !showCustomInput
                      ? 'bg-brass-500 text-white shadow-sm dark:bg-brass-500 dark:text-bgdark'
                      : 'bg-paper-soft text-ink-muted hover:bg-brass-50 hover:text-brass-600 dark:bg-paper/5 dark:text-paper/60 dark:hover:bg-brass-500/15 dark:hover:text-brass-300'
                  )}
                >
                  {p.label}
                </button>
              ))}
              <button
                onClick={() => setShowCustomInput(!showCustomInput)}
                disabled={isRunning}
                className={classNames(
                  'rounded-lg px-3.5 py-1.5 text-xs font-semibold tracking-wide transition-colors duration-150',
                  showCustomInput
                    ? 'bg-brass-500 text-white dark:bg-brass-500 dark:text-bgdark'
                    : 'bg-paper-soft text-ink-muted hover:bg-brass-50 dark:bg-paper/5 dark:text-paper/60'
                )}
              >
                Custom
              </button>
            </div>
          ) : (
            <div className="text-xs font-semibold uppercase tracking-wider text-brass-600 dark:text-brass-400">
              Open-Ended Reading Stopwatch
            </div>
          )}

          {/* Custom Minutes Input */}
          {showCustomInput && mode === 'countdown' && !isRunning && (
            <div className="mt-2 flex items-center gap-2">
              <input
                type="number"
                min={1}
                max={480}
                value={customMinutes}
                onChange={(e) => setCustomMinutes(e.target.value)}
                placeholder="Mins (e.g. 30)"
                className="w-32 rounded-lg border border-brass-500/30 bg-paper py-1.5 px-3 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:ring-2 focus:ring-brass-400 dark:border-paper/10 dark:bg-bgdark dark:text-paper"
              />
              <Button variant="primary" size="sm" onClick={handleApplyCustomMinutes}>
                Set
              </Button>
            </div>
          )}

          {/* Subtle Dynamic Ring & Time Display */}
          <div className="relative my-3 flex items-center justify-center">
            <svg className={classNames('-rotate-90 transform transition-all duration-200 ease-out', isExpanded ? 'h-72 w-72' : 'h-60 w-60')}>
              {/* Background Track Ring */}
              <circle
                cx={isExpanded ? '144' : '120'}
                cy={isExpanded ? '144' : '120'}
                r={radius}
                className="stroke-ink/5 dark:stroke-paper/10"
                strokeWidth={isExpanded ? '11' : '10'}
                fill="transparent"
              />
              {/* Progress Stroke Ring */}
              <circle
                cx={isExpanded ? '144' : '120'}
                cy={isExpanded ? '144' : '120'}
                r={radius}
                className="stroke-brass-500 transition-all duration-200 dark:stroke-brass-400"
                strokeWidth={isExpanded ? '11' : '10'}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                fill="transparent"
              />
            </svg>

            {/* Center Time Label */}
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className={classNames('font-display font-bold tracking-tight text-ink dark:text-paper transition-all duration-200 ease-out', isExpanded ? 'text-6xl' : 'text-5xl')}>
                {formatTime(mode === 'countdown' ? secondsLeft : stopwatchSeconds)}
              </span>
              <span className="mt-1 text-xs font-semibold uppercase tracking-wider text-ink-faint dark:text-paper/40">
                {mode === 'countdown' ? (isRunning ? (isPaused ? 'Paused' : 'Reading Focus') : 'Ready') : (isRunning ? (isPaused ? 'Paused' : 'Stopwatch') : 'Stopwatch')}
              </span>
            </div>
          </div>

          {/* Control Buttons */}
          <div className="flex items-center gap-3 mt-2">
            {!isRunning && !isPaused && (
              <Button variant="primary" size="md" onClick={handleStart} className="px-6 py-2.5 text-base">
                <Play size={18} /> Start Session
              </Button>
            )}

            {isRunning && !isPaused && (
              <Button variant="secondary" size="md" onClick={handlePause} className="px-6 py-2.5 text-base">
                <Pause size={18} /> Pause
              </Button>
            )}

            {isRunning && isPaused && (
              <Button variant="primary" size="md" onClick={handleResume} className="px-6 py-2.5 text-base">
                <Play size={18} /> Resume
              </Button>
            )}

            {(isRunning || isPaused || (mode === 'stopwatch' && stopwatchSeconds > 0) || (mode === 'countdown' && secondsLeft !== selectedMinutes * 60)) && (
              <Button variant="ghost" size="md" onClick={handleReset} title="Reset Timer">
                <RotateCcw size={18} /> Reset
              </Button>
            )}
          </div>
        </div>

        {/* Right Column (2 cols): Ambient Sound Atmosphere Panel */}
        {!isExpanded && (
          <div className="md:col-span-2 flex flex-col justify-between rounded-xl2 border border-ink/10 bg-surface p-5 shadow-card dark:border-paper/10 dark:bg-surface-dark space-y-4 transition-opacity duration-200">
            <div className="flex items-center justify-between border-b border-ink/5 dark:border-paper/5 pb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-brass-500" />
                <div>
                  <h4 className="font-display text-base font-semibold text-ink dark:text-paper">
                    Focus Atmosphere
                  </h4>
                  <p className="text-[11px] text-ink-muted dark:text-paper/50">Ambient background audio</p>
                </div>
              </div>

              <button
                onClick={() => setIsMuted(!isMuted)}
                className="flex items-center gap-1.5 rounded-lg border border-ink/10 bg-paper-soft px-2.5 py-1 text-xs font-medium text-ink hover:bg-ink/5 dark:border-paper/10 dark:bg-paper/5 dark:text-paper dark:hover:bg-paper/10 transition-colors"
                title={isMuted ? 'Unmute audio' : 'Mute audio'}
              >
                {isMuted ? <VolumeX size={14} className="text-burgundy-500" /> : <Volume2 size={14} className="text-brass-500" />}
                <span>{isMuted ? 'Muted' : 'On'}</span>
              </button>
            </div>

            {/* Sound Options List */}
            <div className="space-y-2 flex-1 flex flex-col justify-center">
              {SOUND_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isActive = ambientSound === opt.type;
                return (
                  <button
                    key={opt.type}
                    onClick={() => setAmbientSound(opt.type)}
                    className={classNames(
                      'flex w-full items-center justify-between rounded-xl border p-2.5 text-left transition-colors duration-150',
                      isActive
                        ? 'border-brass-400 bg-brass-50/70 dark:border-brass-500/50 dark:bg-brass-500/15 shadow-sm'
                        : 'border-ink/5 bg-paper-soft/40 hover:bg-ink/5 dark:border-paper/5 dark:bg-paper/5 dark:hover:bg-paper/10'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={classNames(
                          'flex h-8 w-8 items-center justify-center rounded-lg transition-colors',
                          isActive
                            ? 'bg-brass-500 text-white dark:bg-brass-500 dark:text-bgdark'
                            : 'bg-ink/5 text-ink-muted dark:bg-paper/10 dark:text-paper/60'
                        )}
                      >
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-ink dark:text-paper">{opt.label}</p>
                        <p className="text-[10px] text-ink-muted dark:text-paper/50">{opt.desc}</p>
                      </div>
                    </div>
                    {isActive && (
                      <span className="h-2 w-2 rounded-full bg-brass-500 dark:bg-brass-400 animate-pulse" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Volume Control Bar */}
            <div className="border-t border-ink/5 dark:border-paper/5 pt-3">
              <div className="mb-1.5 flex items-center justify-between text-xs text-ink-muted dark:text-paper/50">
                <span className="flex items-center gap-1 font-medium">
                  <Sliders size={13} /> Volume
                </span>
                <span className="font-mono text-[11px] font-semibold text-brass-600 dark:text-brass-400">
                  {Math.round(volume * 100)}%
                </span>
              </div>
              <div className="flex items-center gap-2">
                <VolumeX size={14} className="text-ink-faint dark:text-paper/30" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="h-1.5 flex-1 cursor-pointer accent-brass-500"
                />
                <Volume2 size={14} className="text-brass-500" />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Completion Modal */}
      <Modal open={showCompletionModal} onClose={() => setShowCompletionModal(false)} title="Focus Session Complete!">
        <div className="space-y-5 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-brass-50 text-brass-500 dark:bg-brass-500/15 dark:text-brass-400">
            <CheckCircle2 size={32} />
          </div>

          <div className="space-y-1">
            <h3 className="font-display text-xl font-semibold text-ink dark:text-paper">
              Great job reading! 🎉
            </h3>
            <p className="text-sm text-ink-muted dark:text-paper/60">
              You completed a {selectedMinutes}-minute focus session. Would you like to log this reading session in your Reading Streaks?
            </p>
          </div>

          <div className="flex items-center justify-center gap-3 pt-2">
            <Button
              variant="ghost"
              size="md"
              onClick={() => {
                setShowCompletionModal(false);
                handleReset();
              }}
            >
              No, Thanks
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={() => {
                setShowCompletionModal(false);
                handleReset();
                onNavigateToStreaks();
              }}
            >
              <Flame size={16} /> Yes, Log Streak
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
