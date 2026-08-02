import type { DictionaryEntry } from '../types/dictionary';

let activeAudio: HTMLAudioElement | null = null;

/**
 * Normalizes an audio URL by adding https: protocol if missing or upgrading http: to https:.
 */
export function normalizeAudioUrl(url?: string): string | undefined {
  if (!url || typeof url !== 'string') return undefined;
  const trimmed = url.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith('//')) return `https:${trimmed}`;
  if (trimmed.startsWith('http://')) return trimmed.replace('http://', 'https://');
  return trimmed;
}

/**
 * Extracts the best available audio URL from a DictionaryEntry.
 */
export function getAudioUrlFromEntry(entry?: DictionaryEntry): string | undefined {
  if (!entry || !entry.phonetics || !Array.isArray(entry.phonetics)) return undefined;
  const item = entry.phonetics.find(
    (p) => p && typeof p.audio === 'string' && p.audio.trim().length > 0
  );
  return item?.audio;
}

/**
 * Speaks text using the browser's built-in Web Speech API (SpeechSynthesis).
 */
export function speakWithWebSpeech(
  text: string,
  onStart?: () => void,
  onEnd?: () => void
): boolean {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    onEnd?.();
    return false;
  }

  try {
    window.speechSynthesis.cancel(); // Stop any currently playing speech

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = 0.9;

    let hasEnded = false;
    const handleEnd = () => {
      if (hasEnded) return;
      hasEnded = true;
      onEnd?.();
    };

    utterance.onstart = () => {
      onStart?.();
    };

    utterance.onend = () => {
      handleEnd();
    };

    utterance.onerror = (e) => {
      console.warn('SpeechSynthesis error:', e);
      handleEnd();
    };

    window.speechSynthesis.speak(utterance);
    return true;
  } catch (err) {
    console.error('SpeechSynthesis exception:', err);
    onEnd?.();
    return false;
  }
}

/**
 * Main word pronunciation player.
 * Attempts audio playback from URL; falls back to Web Speech API if URL is missing or fails.
 */
export function playPronunciation(
  word: string,
  audioUrl?: string,
  onStart?: () => void,
  onEnd?: () => void
) {
  if (!word || typeof word !== 'string') {
    onEnd?.();
    return;
  }

  // Stop active audio element if any
  if (activeAudio) {
    try {
      activeAudio.pause();
      activeAudio.currentTime = 0;
    } catch (_) {}
    activeAudio = null;
  }

  // Cancel active speech synthesis if any
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
  }

  const cleanUrl = normalizeAudioUrl(audioUrl);

  if (cleanUrl) {
    let fallbackTriggered = false;
    const triggerFallback = () => {
      if (fallbackTriggered) return;
      fallbackTriggered = true;
      activeAudio = null;
      speakWithWebSpeech(word, onStart, onEnd);
    };

    try {
      const audio = new Audio(cleanUrl);
      activeAudio = audio;

      audio.onplay = () => {
        onStart?.();
      };

      audio.onended = () => {
        activeAudio = null;
        onEnd?.();
      };

      audio.onerror = () => {
        triggerFallback();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play failed, using Web Speech fallback:', err);
          triggerFallback();
        });
      }
    } catch (err) {
      console.warn('Audio instantiation failed, using Web Speech fallback:', err);
      triggerFallback();
    }
  } else {
    // Direct Web Speech fallback if no valid audio URL exists
    speakWithWebSpeech(word, onStart, onEnd);
  }
}
