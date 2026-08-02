import { useState, useCallback } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import type { SavedWord } from '../types/dictionary';
import { Volume2, Trash2, Plus, X } from 'lucide-react';
import { classNames } from '../utils/helpers';
import { playPronunciation, getAudioUrlFromEntry } from '../utils/speech';

interface WordDetailModalProps {
  word: SavedWord | null;
  onClose: () => void;
  onRemove: (wordId: string) => void;
  onAddExample?: (wordId: string, sentence: string) => void;
  onRemoveExample?: (wordId: string, index: number) => void;
}

export function WordDetailModal({
  word,
  onClose,
  onRemove,
  onAddExample,
  onRemoveExample,
}: WordDetailModalProps) {
  const [playingAudio, setPlayingAudio] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const [isAddingExample, setIsAddingExample] = useState(false);
  const [newExample, setNewExample] = useState('');

  const entry = word?.entries[0];
  const userExamples = word?.userExamples || [];

  const handlePlayAudio = useCallback(() => {
    if (!entry) return;
    const audioUrl = getAudioUrlFromEntry(entry);
    playPronunciation(
      entry.word,
      audioUrl,
      () => setPlayingAudio(true),
      () => setPlayingAudio(false)
    );
  }, [entry]);

  const handleAddExample = (e: React.FormEvent) => {
    e.preventDefault();
    if (!word || !newExample.trim()) return;
    onAddExample?.(word.id, newExample.trim());
    setNewExample('');
    setIsAddingExample(false);
  };

  if (!word || !entry) return null;

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
          <button
            type="button"
            onClick={handlePlayAudio}
            className={classNames(
              'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer',
              playingAudio
                ? 'bg-brass-500 text-white animate-pulse'
                : 'bg-brass-50 text-brass-600 hover:bg-brass-100 dark:bg-brass-500/15 dark:text-brass-400 dark:hover:bg-brass-500/25'
            )}
            title="Play pronunciation"
            aria-label="Play pronunciation"
          >
            <Volume2 size={16} />
          </button>
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

        {/* Custom User Example Sentences Section */}
        <div className="space-y-2 border-t border-ink/5 pt-4 dark:border-paper/5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-brass-700 dark:text-brass-300 inline-flex items-center gap-1.5 rounded-full bg-brass-50 px-2.5 py-0.5 dark:bg-brass-500/15">
              My Example Sentences ({userExamples.length}/5)
            </span>
            {onAddExample && userExamples.length < 5 && (
              <button
                type="button"
                onClick={() => setIsAddingExample((prev) => !prev)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brass-600 hover:text-brass-700 dark:text-brass-400 dark:hover:text-brass-300 transition-colors cursor-pointer"
                title="Add example sentence"
              >
                <Plus size={14} /> Add example
              </button>
            )}
          </div>

          {/* Form to add new example */}
          {isAddingExample && (
            <form onSubmit={handleAddExample} className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="Type an example sentence..."
                maxLength={200}
                autoFocus
                className="flex-1 rounded-lg border border-ink/15 bg-paper-soft/50 px-3 py-1.5 text-xs text-ink dark:border-paper/15 dark:bg-bgdark-soft dark:text-paper focus:outline-none focus:ring-1 focus:ring-brass-400"
              />
              <Button type="submit" variant="primary" size="sm" disabled={!newExample.trim()}>
                Save
              </Button>
              <Button type="button" variant="ghost" size="sm" onClick={() => setIsAddingExample(false)}>
                Cancel
              </Button>
            </form>
          )}

          {/* List of user examples */}
          {userExamples.length > 0 && (
            <div className="space-y-1.5 pt-1">
              {userExamples.map((ex, idx) => (
                <div
                  key={idx}
                  className="group/ex flex items-start justify-between gap-2 text-xs italic text-ink-muted dark:text-paper/50"
                >
                  <p className="flex-1">"{ex}"</p>
                  {onRemoveExample && (
                    <button
                      type="button"
                      onClick={() => onRemoveExample(word.id, idx)}
                      className="opacity-0 group-hover/ex:opacity-100 transition-opacity text-burgundy-500 hover:text-burgundy-600 dark:text-burgundy-400 p-0.5 cursor-pointer shrink-0"
                      title="Delete example"
                    >
                      <X size={13} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

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
