import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';

interface AboutDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutDialog: React.FC<AboutDialogProps> = ({ isOpen, onClose }) => {
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    closeButtonRef.current?.focus();

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-5"
          role="dialog"
          aria-modal="true"
          aria-labelledby="artenos-about-title"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-[#08080B]/80 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 w-full max-w-md rounded-lg border border-[#302A34] bg-[#17141C] p-7 shadow-2xl sm:p-8"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[11px] font-medium uppercase tracking-[0.22em] text-[#C5A46D]">
                  About
                </p>
                <h2
                  id="artenos-about-title"
                  className="mt-1 font-display text-3xl tracking-[0.1em] text-[#F3EFE8]"
                >
                  Artenos
                </h2>
              </div>

              <button
                ref={closeButtonRef}
                type="button"
                onClick={onClose}
                aria-label="Close About dialog"
                className="inline-flex h-9 w-9 items-center justify-center rounded-md text-[#A59BAA] transition-colors hover:bg-[#211B27] hover:text-[#F3EFE8] artenos-focus cursor-pointer"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <div className="mt-5 space-y-4 text-[15px] font-light leading-[1.75] text-[#F3EFE8]/90">
              <p>
                Some discoveries emerge slowly from the dark. Distribute the surface,
                shape custom words with starlight, and engage the event horizon.
              </p>
              <p className="text-sm text-[#A59BAA]">
                An interactive cosmic playground where living starlight particles form
                words, react to your pointer, and bend around gravitational fields.
              </p>
            </div>

            <div className="mt-7 flex justify-end border-t border-[#302A34]/70 pt-5">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-[#302A34] bg-[#211B27] px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-[#D8BD83] transition-colors hover:border-[#C5A46D] artenos-focus cursor-pointer"
              >
                Return to surface
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
