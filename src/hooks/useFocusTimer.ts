import { useState, useEffect, useRef, useCallback } from 'react';
import { soundController } from '../utils/audio';
import type { AmbientSoundType } from '../utils/audio';
import { triggerConfetti } from '../utils/confetti';

export type TimerMode = 'countdown' | 'stopwatch';

export function useFocusTimer() {
  const [mode, setMode] = useState<TimerMode>('countdown');
  const [selectedMinutes, setSelectedMinutes] = useState(25);
  const [customMinutes, setCustomMinutes] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);

  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);

  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const [ambientSound, setAmbientSound] = useState<AmbientSoundType>('off');
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);

  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

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

  const handleTimerComplete = useCallback(() => {
    setIsRunning(false);
    setIsPaused(false);
    soundController.stopAmbient();
    soundController.playCompletionChime();
    triggerConfetti();
    setShowCompletionModal(true);
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
  }, [isRunning, isPaused, mode, handleTimerComplete]);

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

  const activeFormattedTime = formatTime(mode === 'countdown' ? secondsLeft : stopwatchSeconds);

  return {
    mode,
    setMode,
    selectedMinutes,
    setSelectedMinutes,
    customMinutes,
    setCustomMinutes,
    showCustomInput,
    setShowCustomInput,
    secondsLeft,
    setSecondsLeft,
    stopwatchSeconds,
    setStopwatchSeconds,
    isRunning,
    isPaused,
    ambientSound,
    setAmbientSound,
    volume,
    setVolume,
    isMuted,
    setIsMuted,
    showCompletionModal,
    setShowCompletionModal,
    isExpanded,
    setIsExpanded,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
    handleSelectPreset,
    handleApplyCustomMinutes,
    formatTime,
    activeFormattedTime,
  };
}

export type FocusTimerHook = ReturnType<typeof useFocusTimer>;
