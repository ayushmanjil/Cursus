import { useRef, useCallback, useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { SavedWord } from '../types/dictionary';
import { Volume2, Trash2 } from 'lucide-react';
import { classNames } from '../utils/helpers';

interface WordDetailModalProps {
  word: SavedWord | null;
  onClose: () => void;
  onRemove: (wordId: string) => void;
}

export function WordDetailModal({ word, onClose, onRemove }: WordDetailModalProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [playingAudio, setPlayingAudio] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);

  const handlePlayAudio = useCallback((url: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    const audio = new Audio(url);
    audioRef.current = audio;
    setPlayingAudio(true);
    audio.play();
    audio.onended = () => setPlayingAudio(false);
    audio.onerror = () => setPlayingAudio(false);
  }, []);

  if (!word) return null;

  const entry = word.entries[0];
  if (!entry) return null;

  // Find the best audio URL
  const audioUrl = entry.phonetics?.find((p) => p.audio)?.audio;
  // Find the best phonetic text
  const phoneticText = entry.phonetic || entry.phonetics?.find((p) => p.text)?.text;

  return (
    <Modal open={!!word} onClose={onClose} title={entry.word} maxWidth="max-w-2xl">
      <div className="space-y-5">
        {/* Header: word + phonetic + audio */}
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-display text-2xl font-semibold text-ink dark:text-paper">
              {entry.word}
            </h3>
            {phoneticText && (
              <p className="mt-0.5 text-sm text-ink-muted dark:text-paper/50">{phoneticText}</p>
            )}
          </div>
          {audioUrl && (
            <button
              onClick={() => handlePlayAudio(audioUrl)}
              className={classNames(
                'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors',
                playingAudio
                  ? 'bg-brass-500 text-white'
                  : 'bg-brass-50 text-brass-600 hover:bg-brass-100 dark:bg-brass-500/15 dark:text-brass-400 dark:hover:bg-brass-500/25'
              )}
              title="Play pronunciation"
              aria-label="Play pronunciation"
            >
              <Volume2 size={16} />
            </button>
          )}
        </div>

        {/* Source URLs */}
        {entry.sourceUrls && entry.sourceUrls.length > 0 && (
          <div>
            {entry.sourceUrls.map((url) => (
              <a
                key={url}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-brass-500 hover:text-brass-600 dark:text-brass-400 dark:hover:text-brass-300 underline underline-offset-2"
              >
                {url}
              </a>
            ))}
          </div>
        )}

        {/* Meanings */}
        {entry.meanings.map((meaning, mi) => (
          <div key={mi} className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center rounded-full bg-brass-50 px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
                {meaning.partOfSpeech}
              </span>
              <div className="flex-1 border-b border-ink/5 dark:border-paper/5" />
            </div>

            {/* Definitions */}
            <ol className="list-decimal space-y-2.5 pl-5 marker:text-brass-400 dark:marker:text-brass-500/60">
              {meaning.definitions.map((def, di) => (
                <li key={di} className="text-sm text-ink dark:text-paper/90 pl-1">
                  <p>{def.definition}</p>
                  {def.example && (
                    <p className="mt-1 text-xs italic text-ink-muted dark:text-paper/50">
                      "{def.example}"
                    </p>
                  )}
                  {/* Inline synonyms / antonyms for this definition */}
                  {def.synonyms.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-forest-500 dark:text-forest-300 font-semibold mr-1 self-center">
                        syn
                      </span>
                      {def.synonyms.map((s) => (
                        <span
                          key={s}
                          className="inline-flex rounded-full border border-forest-300/30 bg-forest-50/50 px-2 py-0.5 text-[11px] text-forest-600 dark:border-forest-400/20 dark:bg-forest-500/10 dark:text-forest-300"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                  )}
                  {def.antonyms.length > 0 && (
                    <div className="mt-1.5 flex flex-wrap gap-1">
                      <span className="text-[10px] uppercase tracking-wider text-burgundy-500 dark:text-burgundy-300 font-semibold mr-1 self-center">
                        ant
                      </span>
                      {def.antonyms.map((a) => (
                        <span
                          key={a}
                          className="inline-flex rounded-full border border-burgundy-300/30 bg-burgundy-50/50 px-2 py-0.5 text-[11px] text-burgundy-600 dark:border-burgundy-400/20 dark:bg-burgundy-500/10 dark:text-burgundy-300"
                        >
                          {a}
                        </span>
                      ))}
                    </div>
                  )}
                </li>
              ))}
            </ol>

            {/* Top-level synonyms / antonyms for this meaning */}
            {meaning.synonyms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-forest-500 dark:text-forest-300 font-semibold">
                  Synonyms
                </span>
                {meaning.synonyms.map((s) => (
                  <span
                    key={s}
                    className="inline-flex rounded-full border border-forest-300/30 bg-forest-50/50 px-2 py-0.5 text-[11px] text-forest-600 dark:border-forest-400/20 dark:bg-forest-500/10 dark:text-forest-300"
                  >
                    {s}
                  </span>
                ))}
              </div>
            )}
            {meaning.antonyms.length > 0 && (
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-[10px] uppercase tracking-wider text-burgundy-500 dark:text-burgundy-300 font-semibold">
                  Antonyms
                </span>
                {meaning.antonyms.map((a) => (
                  <span
                    key={a}
                    className="inline-flex rounded-full border border-burgundy-300/30 bg-burgundy-50/50 px-2 py-0.5 text-[11px] text-burgundy-600 dark:border-burgundy-400/20 dark:bg-burgundy-500/10 dark:text-burgundy-300"
                  >
                    {a}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Saved date + Remove */}
        <div className="flex items-center justify-between border-t border-ink/5 pt-4 dark:border-paper/5">
          <p className="text-xs text-ink-faint dark:text-paper/30">
            Saved {new Date(word.savedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
          </p>
          {!confirmRemove ? (
            <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(true)}>
              <Trash2 size={14} /> Remove
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-burgundy-500">Remove this word?</span>
              <Button
                variant="danger"
                size="sm"
                onClick={() => {
                  onRemove(word.id);
                  onClose();
                }}
              >
                Yes, remove
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmRemove(false)}>
                Cancel
              </Button>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}
