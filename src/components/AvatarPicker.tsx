import { motion, AnimatePresence } from 'framer-motion';
import { AVATARS } from '../data/avatars';
import type { AvatarOption } from '../data/avatars';
import { Check, X } from 'lucide-react';

interface AvatarPickerProps {
  open: boolean;
  currentAvatarId?: string;
  onSelect: (avatar: AvatarOption) => void;
  onClose: () => void;
}

export function AvatarPicker({ open, currentAvatarId, onSelect, onClose }: AvatarPickerProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-bgdark/80 backdrop-blur-md p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 260, damping: 22 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-[500px] rounded-2xl border border-ink/10 dark:border-brass-500/20 bg-gradient-to-br from-white via-white to-paper-soft dark:from-[#1C1712] dark:via-[#1E1B16] dark:to-[#15120E] shadow-[0_30px_80px_-10px_rgba(33,28,23,0.15),_0_0_60px_rgba(184,134,63,0.03)] dark:shadow-[0_30px_80px_-10px_rgba(0,0,0,0.7),_0_0_60px_rgba(184,134,63,0.08)] p-6 text-ink dark:text-[#FAF7F1]"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-5">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-brass-600 dark:text-brass-400">
                  Choose Your Identity
                </span>
                <h2 className="font-display text-lg font-bold text-ink dark:text-white mt-0.5 leading-tight">
                  Pick Your Avatar
                </h2>
              </div>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-ink-muted/60 hover:text-ink hover:bg-ink/5 dark:text-[#FAF7F1]/40 dark:hover:text-white dark:hover:bg-[#FAF7F1]/10 transition-colors"
              >
                <X size={16} />
              </button>
            </div>

            {/* Avatars Grid */}
            <div className="mb-4">
              <div className="grid grid-cols-5 gap-2">
                {AVATARS.map((avatar) => {
                  const isSelected = currentAvatarId === avatar.id;
                  return (
                    <button
                      key={avatar.id}
                      onClick={() => onSelect(avatar)}
                      className={`group relative flex flex-col items-center gap-1.5 p-1.5 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brass-400 ${
                        isSelected
                          ? 'border-brass-500 bg-brass-500/10 shadow-[0_0_16px_rgba(184,134,63,0.15)]'
                          : 'border-ink/5 dark:border-[#FAF7F1]/8 bg-paper-soft/40 dark:bg-[#FAF7F1]/3 hover:border-brass-500/40 dark:hover:border-brass-500/40 hover:bg-paper-soft dark:hover:bg-[#FAF7F1]/6'
                      }`}
                    >
                      {/* Selection ring */}
                      <div className={`relative w-14 h-14 rounded-full transition-all duration-200 ${
                        isSelected ? 'ring-2 ring-brass-500 ring-offset-2 ring-offset-white dark:ring-offset-[#1C1712]' : ''
                      }`}>
                        <img
                          src={avatar.src}
                          alt={avatar.label}
                          className="w-full h-full rounded-full object-cover"
                          draggable={false}
                        />
                        {isSelected && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute -top-1 -right-1 w-4.5 h-4.5 rounded-full bg-brass-500 flex items-center justify-center shadow-md"
                          >
                            <Check size={10} className="text-white dark:text-bgdark stroke-[3]" />
                          </motion.div>
                        )}
                      </div>
                      <span className={`text-[9px] font-semibold text-center leading-tight transition-colors line-clamp-1 ${
                        isSelected ? 'text-brass-600 dark:text-brass-300 font-bold' : 'text-ink-muted dark:text-[#FAF7F1]/60 group-hover:text-ink dark:group-hover:text-[#FAF7F1]/80'
                      }`}>
                        {avatar.label.replace('The ', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Description of selected avatar */}
            <AnimatePresence mode="wait">
              {currentAvatarId && (() => {
                const sel = AVATARS.find((a) => a.id === currentAvatarId);
                return sel ? (
                  <motion.p
                    key={sel.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{ duration: 0.25 }}
                    className="mt-4 text-center text-[11px] italic font-serif text-ink-muted/60 dark:text-[#FAF7F1]/40 border-t border-ink/5 dark:border-[#FAF7F1]/5 pt-3"
                  >
                    "{sel.description}"
                  </motion.p>
                ) : null;
              })()}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
