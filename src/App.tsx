import { useEffect, useState } from 'react';
import { RotateCcw } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { BlackHoleWarpButton } from './components/controls/BlackHoleWarpButton';
import { Header } from './components/navigation/Header';
import { AboutDialog } from './components/overlays/AboutDialog';
import { ParticleCanvas } from './components/particles/ParticleCanvas';
import { useParticleEngine } from './hooks/useParticleEngine';

export default function App() {
  const [isAboutOpen, setIsAboutOpen] = useState(false);

  const {
    containerRef,
    canvasRef,
    isRevealedAll,
    isWarping,
    isTouchDevice,
    reducedMotion,
    word,
    setWord,
    revealAll,
    resetSurface,
    warp,
    setBlackHole,
  } = useParticleEngine('ATERNOS');

  // Ensure the black hole effect is strictly inactive whenever not dispersed
  useEffect(() => {
    if (!isRevealedAll) {
      setBlackHole(0, 0, false);
    }
  }, [isRevealedAll, setBlackHole]);

  const handleWordChange = (newWord: string) => {
    if (isRevealedAll) {
      resetSurface();
      setBlackHole(0, 0, false);
    }
    setWord(newWord);
  };

  const hintText = isWarping
    ? 'Hyperspace acceleration engaged'
    : reducedMotion
      ? 'Reduced motion active — use Disperse to scatter'
      : isTouchDevice
        ? 'Touch and drag to disturb the starfield'
        : 'Move to disturb the starfield';

  return (
    <div
      id="top"
      className="flex h-dvh flex-col overflow-hidden bg-[#08080B] text-[#F3EFE8] artenos-ambient-glow"
    >
      <Header
        onOpenAbout={() => setIsAboutOpen(true)}
        currentWord={word}
        onWordChange={handleWordChange}
      />

      <main
        ref={containerRef}
        aria-label={`${word} interactive starfield hero`}
        className={`relative flex flex-1 items-center justify-center overflow-hidden ${
          !isTouchDevice && !isRevealedAll ? 'cursor-none' : ''
        }`}
      >
        <h1 className="sr-only">{word}</h1>

        {/* Interstellar starfield forming and blending into the active word */}
        <ParticleCanvas canvasRef={canvasRef} />

        {/* Revealed Miniature Black Hole Warp Portal when dispersed */}
        <AnimatePresence>
          {isRevealedAll && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 12 }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="relative z-20 flex flex-col items-center gap-3 pointer-events-auto"
            >
              <BlackHoleWarpButton
                onWarp={warp}
                isWarping={isWarping}
                onPositionUpdate={(x, y) => {
                  setBlackHole(x, y, true);
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="relative z-20 border-t border-[#302A34]/60 bg-[#08080B]/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-5 py-3.5 sm:flex-row sm:px-8">
          <span className="text-xs tracking-[0.14em] text-[#A59BAA]">
            {hintText}
          </span>

          <p className="order-last text-xs font-light italic tracking-[0.08em] text-[#C5A46D]/80 sm:order-none">
            Not everything reveals itself at once.
          </p>

          <div className="flex items-center gap-2.5">
            {!isRevealedAll ? (
              <button
                type="button"
                onClick={revealAll}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-[#302A34] bg-[#17141C] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#F3EFE8] transition-colors hover:border-[#C5A46D]/60 hover:text-[#D8BD83] whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
              >
                <span>Disperse</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setBlackHole(0, 0, false);
                  resetSurface();
                }}
                disabled={isWarping}
                className="inline-flex min-h-[38px] items-center gap-2 rounded-md border border-[#302A34] bg-[#211B27] px-4 py-1.5 text-xs font-medium uppercase tracking-[0.14em] text-[#A59BAA] transition-colors hover:border-[#C5A46D]/50 hover:text-[#D8BD83] disabled:opacity-50 whitespace-nowrap shrink-0 artenos-focus cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Reform</span>
              </button>
            )}
          </div>
        </div>
      </footer>

      <AboutDialog
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
      />
    </div>
  );
}
