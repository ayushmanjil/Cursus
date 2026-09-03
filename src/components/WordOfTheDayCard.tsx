/**
 * WordOfTheDayCard.tsx
 *
 * Redesigned to strictly match the visual style, typography hierarchy,
 * spacing, and composition of the reference dictionary card:
 *   - Clean card container with soft border and rounded corners
 *   - Word heading with phonetic transcription below
 *   - Pronunciation audio button and "Add to Library" button in top-right
 *   - Uppercase part-of-speech badge (e.g. NOUN, VERB, ADJECTIVE)
 *   - Elegantly numbered definitions list (1., 2., 3...)
 *   - Example sentences when available
 *   - Wiktionary / source URL link at the bottom
 */

import { forwardRef, useState, useCallback } from 'react';
import { Volume2, BookPlus, Check, Sparkles, ExternalLink } from 'lucide-react';
import { playPronunciation } from '../utils/speech';
import type { WordOfTheDay } from '../types/wordOfTheDay';

interface WordOfTheDayCardProps {
  word: WordOfTheDay;
  isSaved?: boolean;
  onSave?: () => void;
}

export const WordOfTheDayCard = forwardRef<HTMLDivElement, WordOfTheDayCardProps>(
  ({ word, isSaved = false, onSave }, ref) => {
    const [playingAudio, setPlayingAudio] = useState(false);
    const [justSaved, setJustSaved] = useState(false);

    const phoneticDisplay = word.phonetic
      ? word.phonetic.startsWith('/') && word.phonetic.endsWith('/')
        ? word.phonetic
        : `/${word.phonetic.replace(/^\/|\/$/g, '')}/`
      : undefined;

    const handlePlayAudio = useCallback(() => {
      setPlayingAudio(true);
      playPronunciation(word.word, word.audioUrl, () => setPlayingAudio(false));
    }, [word.word, word.audioUrl]);

    const handleSave = useCallback(() => {
      if (onSave) {
        onSave();
        setJustSaved(true);
        setTimeout(() => setJustSaved(false), 2000);
      }
    }, [onSave]);

    // Build the sections for display:
    // If rich meanings are present, group by part of speech.
    // Otherwise fallback to word.partOfSpeech with word.definitions or word.definition.
    const sections = word.meanings && word.meanings.length > 0
      ? word.meanings.map((m) => ({
          partOfSpeech: m.partOfSpeech || word.partOfSpeech || 'general',
          definitions: m.definitions.map((d) => ({
            text: d.definition,
            example: d.example,
          })),
          synonyms: m.synonyms || [],
        }))
      : [
          {
            partOfSpeech: word.partOfSpeech || 'general',
            definitions: (word.definitions && word.definitions.length > 0
              ? word.definitions
              : [word.definition]
            ).map((d, i) => ({
              text: d,
              example: i === 0 ? word.example : undefined,
            })),
            synonyms: word.synonyms || [],
          },
        ];

    const sourceUrl =
      word.sourceUrl ||
      `https://en.wiktionary.org/wiki/${encodeURIComponent(word.word.toLowerCase())}`;

    return (
      <div
        ref={ref}
        className="w-full rounded-2xl border border-ink/10 bg-white p-6 sm:p-8 shadow-sm transition-all dark:border-paper/10 dark:bg-[#1E1B18]"
        style={{
          fontFamily: '"Inter", ui-sans-serif, system-ui, -apple-system, sans-serif',
        }}
      >
        {/* ── Top Header Row ────────────────────────────────────────────── */}
        <div className="flex items-start justify-between gap-4">
          <div>
            {/* Word of the day label & date */}
            <div className="flex items-center gap-1.5 text-xs text-[#8C7A65] dark:text-[#A89C8B] font-medium mb-1">
              <Sparkles size={13} className="text-[#B88E5E] dark:text-[#C89E6E]" />
              <span>Word of the Day</span>
              <span className="opacity-50">•</span>
              <span>{word.date}</span>
            </div>

            {/* Word Title */}
            <h1
              className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-[#1A1612] dark:text-[#FAF7F1]"
              style={{ fontFamily: '"Fraunces", Georgia, serif' }}
            >
              {word.word}
            </h1>

            {/* Phonetic transcription */}
            {phoneticDisplay && (
              <p className="mt-1 text-sm sm:text-base text-[#7B6E5F] dark:text-[#9E9080] font-normal tracking-wide">
                {phoneticDisplay}
              </p>
            )}
          </div>

          {/* Action buttons (Audio + Add to Library) */}
          <div className="flex items-center gap-2.5 shrink-0 pt-1">
            {/* Audio pronunciation button */}
            <button
              type="button"
              onClick={handlePlayAudio}
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all cursor-pointer ${
                playingAudio
                  ? 'bg-[#B88E5E] text-white shadow-sm scale-105'
                  : 'bg-[#F5EFE6] text-[#7A6B58] hover:bg-[#ECE3D4] hover:text-[#5A4E3E] dark:bg-[#2C241B] dark:text-[#C5B7A0] dark:hover:bg-[#382E22]'
              }`}
              title="Listen to pronunciation"
              aria-label="Listen to pronunciation"
            >
              <Volume2 size={16} />
            </button>

            {/* Add to Library button */}
            {onSave && (
              <button
                type="button"
                onClick={handleSave}
                className={`flex h-9 items-center gap-2 rounded-lg px-3.5 text-xs font-semibold transition-all cursor-pointer shadow-sm ${
                  isSaved || justSaved
                    ? 'bg-[#ECE3D4] text-[#5A4E3E] dark:bg-[#2C241B] dark:text-[#C5B7A0]'
                    : 'bg-[#1E1B18] text-white hover:bg-[#332C24] dark:bg-[#FAF7F1] dark:text-[#1E1B18] dark:hover:bg-[#ECE5D8]'
                }`}
                title={isSaved || justSaved ? 'Saved to library' : 'Add to library'}
              >
                {isSaved || justSaved ? (
                  <>
                    <Check size={14} strokeWidth={2.5} />
                    <span>Saved</span>
                  </>
                ) : (
                  <>
                    <BookPlus size={14} strokeWidth={2.5} />
                    <span>Add to Library</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* ── Divider ───────────────────────────────────────────────────── */}
        <div className="my-6 border-b border-ink/5 dark:border-paper/10" />

        {/* ── Meanings & Definitions by Part of Speech ──────────────────── */}
        <div className="space-y-6">
          {sections.map((sec, secIdx) => (
            <div key={secIdx} className="space-y-3">
              {/* Part of speech badge & optional category tag */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-block rounded-md bg-[#F3EDE3] px-2.5 py-1 text-[11px] font-bold tracking-wider text-[#8C7A65] uppercase dark:bg-[#2C241B] dark:text-[#C5B7A0]">
                  {sec.partOfSpeech}
                </span>
                {word.category && secIdx === 0 && (
                  <span className="inline-block rounded-md bg-brass-50 px-2.5 py-1 text-[11px] font-medium text-brass-700 dark:bg-brass-500/15 dark:text-brass-300">
                    {word.category}
                  </span>
                )}
              </div>

              {/* Numbered definitions list */}
              <ol className="space-y-2.5 pl-0.5">
                {sec.definitions.map((def, defIdx) => (
                  <li key={defIdx} className="flex items-start gap-2.5 text-sm sm:text-base leading-relaxed text-[#2E2822] dark:text-[#E8E1D5]">
                    <span className="font-serif font-semibold text-[#B88E5E] dark:text-[#C89E6E] shrink-0 select-none">
                      {defIdx + 1}.
                    </span>
                    <div className="flex-1">
                      <span>{def.text}</span>
                      {def.example && (
                        <p className="mt-1 pl-3 text-xs sm:text-sm italic text-[#6B5E50] dark:text-[#A89C8B] border-l-2 border-[#D5C5B0] dark:border-[#4A3F31]">
                          "{def.example}"
                        </p>
                      )}
                    </div>
                  </li>
                ))}
              </ol>

              {/* Synonyms (if present for this part of speech) */}
              {sec.synonyms && sec.synonyms.length > 0 && (
                <div className="pt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#7B6E5F] dark:text-[#A89C8B]">
                  <span className="font-semibold text-[10px] uppercase tracking-wider text-[#B88E5E] dark:text-[#C89E6E]">
                    Synonyms:
                  </span>
                  {sec.synonyms.slice(0, 5).map((syn, synIdx) => (
                    <span key={syn} className="inline-flex items-center">
                      <span className="italic">{syn}</span>
                      {synIdx < Math.min(sec.synonyms.length, 5) - 1 && (
                        <span className="mx-1 opacity-50">•</span>
                      )}
                    </span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* ── Footer Source URL ─────────────────────────────────────────── */}
        {sourceUrl && (
          <div className="mt-6 pt-4 border-t border-ink/5 dark:border-paper/10">
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-xs text-[#B88E5E] dark:text-[#C89E6E] hover:underline underline-offset-2 transition-colors"
            >
              <span>{sourceUrl}</span>
              <ExternalLink size={11} className="opacity-70" />
            </a>
          </div>
        )}
      </div>
    );
  }
);

WordOfTheDayCard.displayName = 'WordOfTheDayCard';
