import { useCallback, useEffect, useRef, useState } from 'react';
import { ParticleEngine } from '../components/particles/particle-engine';

export function useParticleEngine(initialWord = 'ATERNOS') {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<ParticleEngine | null>(null);

  const [revealProgress, setRevealProgress] = useState(0);
  const [isRevealedAll, setIsRevealedAll] = useState(false);
  const [isWarping, setIsWarping] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [word, setWordState] = useState(initialWord);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const coarseQuery = window.matchMedia('(pointer: coarse)');
    setIsTouchDevice(coarseQuery.matches || 'ontouchstart' in window);

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
      engineRef.current?.setReducedMotion(e.matches);
    };

    motionQuery.addEventListener('change', handleMotionChange);
    return () => {
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const engine = new ParticleEngine(
      canvas,
      { reducedMotion },
      {
        onRevealProgress: (pct) => {
          setRevealProgress(pct);
        },
        onWarpStart: () => {
          setIsWarping(true);
        },
        onWarpEnd: () => {
          setIsWarping(false);
          setIsRevealedAll(false);
        },
      }
    );
    engineRef.current = engine;
    engine.setWord(word);

    const rect = container.getBoundingClientRect();
    engine.resize(rect.width, rect.height);
    engine.start();

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        engine.resize(width, height);
      }
    });
    resizeObserver.observe(container);

    const handleVisibility = () => {
      engine.setPaused(document.hidden);
    };
    document.addEventListener('visibilitychange', handleVisibility);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const bounds = container.getBoundingClientRect();
      if (
        e.clientX >= bounds.left - 40 &&
        e.clientX <= bounds.right + 40 &&
        e.clientY >= bounds.top - 40 &&
        e.clientY <= bounds.bottom + 40
      ) {
        engine.updatePointer(e.clientX, e.clientY);
      } else {
        engine.clearPointer();
      }
    };

    const handlePointerLeave = () => {
      engine.clearPointer();
    };

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        engine.updatePointer(t.clientX, t.clientY);
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        const t = e.touches[0];
        engine.updatePointer(t.clientX, t.clientY);
      }
    };

    const handleTouchEnd = () => {
      engine.clearPointer();
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('mouseleave', handlePointerLeave);
    container.addEventListener('touchstart', handleTouchStart, { passive: true });
    container.addEventListener('touchmove', handleTouchMove, { passive: true });
    container.addEventListener('touchend', handleTouchEnd, { passive: true });
    container.addEventListener('touchcancel', handleTouchEnd, { passive: true });

    return () => {
      resizeObserver.disconnect();
      document.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('mouseleave', handlePointerLeave);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleTouchEnd);
      container.removeEventListener('touchcancel', handleTouchEnd);
      engine.destroy();
      engineRef.current = null;
    };
  }, []);

  const revealAll = useCallback(() => {
    setIsRevealedAll(true);
    engineRef.current?.revealAll();
  }, []);

  const resetSurface = useCallback(() => {
    setIsRevealedAll(false);
    engineRef.current?.resetSurface();
  }, []);

  const warp = useCallback(() => {
    setIsWarping(true);
    engineRef.current?.warp();
  }, []);

  const setWord = useCallback((newWord: string) => {
    const formatted = (newWord || '').trim().toUpperCase() || 'ATERNOS';
    setWordState(formatted);
    engineRef.current?.setWord(formatted);
  }, []);

  const setBlackHole = useCallback(
    (clientX: number, clientY: number, active: boolean) => {
      engineRef.current?.setBlackHole(clientX, clientY, active);
    },
    []
  );

  return {
    containerRef,
    canvasRef,
    revealProgress,
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
  };
}
