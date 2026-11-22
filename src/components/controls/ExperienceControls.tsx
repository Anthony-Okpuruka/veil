import React from 'react';
import { Eye, RotateCcw, Shuffle } from 'lucide-react';
import { RevealProgress } from './RevealProgress';

interface ExperienceControlsProps {
  revealProgress: number;
  isRevealedAll: boolean;
  isTouchDevice: boolean;
  reducedMotion: boolean;
  isTransitioning: boolean;
  onRevealAll: () => void;
  onResetSurface: () => void;
  onDiscoverAnother: () => void;
}

export const ExperienceControls: React.FC<ExperienceControlsProps> = ({
  revealProgress,
  isRevealedAll,
  isTouchDevice,
  reducedMotion,
  isTransitioning,
  onRevealAll,
  onResetSurface,
  onDiscoverAnother,
}) => {
  const hintText = reducedMotion
    ? 'Reduced motion active — use Reveal all to read'
    : isTouchDevice
      ? 'Touch and drag to uncover'
      : 'Move to uncover';

  return (
    <footer className="relative z-20 border-t border-[#302A34]/70 bg-[#08080B]/90 backdrop-blur-sm">
      <div className="mx-auto max-w-5xl px-5 py-6 sm:px-8 sm:py-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* Left: Quiet interaction hint & approximate progress */}
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="text-xs tracking-[0.12em] text-[#A59BAA]">
              {hintText}
            </span>
            <RevealProgress percentage={revealProgress} />
          </div>

          {/* Right: Compact, functional discovery controls */}
          <div className="flex flex-wrap items-center gap-2.5">
            {!isRevealedAll ? (
              <button
                type="button"
                onClick={onRevealAll}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#302A34] bg-[#17141C] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#F3EFE8] transition-colors hover:border-[#C5A46D]/60 hover:text-[#D8BD83] whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
              >
                <Eye className="h-3.5 w-3.5 text-[#C5A46D]" aria-hidden="true" />
                <span>Reveal all</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onResetSurface}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#302A34] bg-[#17141C] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#F3EFE8] transition-colors hover:border-[#C5A46D]/60 hover:text-[#D8BD83] whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[#C5A46D]" aria-hidden="true" />
                <span>Reset surface</span>
              </button>
            )}

            {!isRevealedAll && revealProgress > 4 && (
              <button
                type="button"
                onClick={onResetSurface}
                className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-transparent px-3 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#A59BAA] transition-colors hover:text-[#F3EFE8] whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reset surface</span>
              </button>
            )}

            <button
              type="button"
              onClick={onDiscoverAnother}
              disabled={isTransitioning}
              className="inline-flex min-h-[40px] items-center gap-2 rounded-md border border-[#C5A46D]/45 bg-[#211B27] px-4 py-2 text-xs font-medium uppercase tracking-[0.14em] text-[#D8BD83] transition-colors hover:border-[#D8BD83] hover:bg-[#40304F]/40 disabled:opacity-50 whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
            >
              <Shuffle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Discover another</span>
            </button>
          </div>
        </div>

        {/* Quiet closing signature line */}
        <div className="mt-7 border-t border-[#302A34]/40 pt-5 text-center">
          <p className="text-xs font-light italic tracking-[0.08em] text-[#C5A46D]/80">
            Not everything reveals itself at once.
          </p>
        </div>
      </div>
    </footer>
  );
};
