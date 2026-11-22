import React, { useEffect, useRef, useState } from 'react';

// Set to your portfolio URL, or "about:blank" until provided
export const PORTFOLIO_URL = 'about:blank';

interface BlackHoleWarpButtonProps {
  onWarp: () => void;
  isWarping: boolean;
  portfolioUrl?: string;
  onPositionUpdate?: (x: number, y: number) => void;
}

export const BlackHoleWarpButton: React.FC<BlackHoleWarpButtonProps> = ({
  onWarp,
  isWarping,
  portfolioUrl = PORTFOLIO_URL,
  onPositionUpdate,
}) => {
  const buttonRef = useRef<HTMLAnchorElement | null>(null);
  const [gravityOffset, setGravityOffset] = useState({ x: 0, y: 0, dist: 9999 });

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      onPositionUpdate?.(centerX, centerY);

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const dist = Math.hypot(dx, dy);

      // Gravitational pull of the mini-sun (cursor) on the black hole
      if (dist < 360 && dist > 2) {
        // Smooth gravitational pull towards the mini sun
        const pull = Math.min(18, 1400 / (dist + 50));
        setGravityOffset({
          x: (dx / dist) * pull,
          y: (dy / dist) * pull,
          dist,
        });
      } else {
        setGravityOffset({ x: 0, y: 0, dist });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [onPositionUpdate]);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    onWarp();
    // Allow the link to open portfolio in a new blank tab while launching the warp sequence
    // If portfolioUrl is about:blank, target="_blank" safely opens the clean blank page
  };

  // Close proximity flare factor
  const proximityGlow = Math.max(0, 1 - gravityOffset.dist / 280);

  return (
    <div className="relative flex flex-col items-center justify-center pointer-events-auto select-none">
      {/* Outer Spacetime Gravitational Distortion Ripple Rings */}
      <div
        className="pointer-events-none absolute -inset-16 rounded-full border border-[#D8BD83]/15 transition-transform duration-300"
        style={{
          transform: `scale(${1 + proximityGlow * 0.22}) translate(${gravityOffset.x * 0.4}px, ${gravityOffset.y * 0.4}px)`,
          opacity: 0.35 + proximityGlow * 0.45,
        }}
      />
      <div
        className="pointer-events-none absolute -inset-10 rounded-full border border-[#76618F]/25 transition-transform duration-300"
        style={{
          transform: `scale(${1 + proximityGlow * 0.16}) translate(${gravityOffset.x * 0.6}px, ${gravityOffset.y * 0.6}px)`,
          opacity: 0.4 + proximityGlow * 0.5,
        }}
      />

      {/* Orbiting Starlight Dots around the Black Hole at Keplerian Speeds */}
      <div
        className="pointer-events-none absolute inset-0 -m-14 flex items-center justify-center"
        style={{
          transform: `translate(${gravityOffset.x * 0.7}px, ${gravityOffset.y * 0.7}px)`,
        }}
      >
        {/* Orbit 1: Fast inner relativistic orbit */}
        <div
          className="absolute h-24 w-24 rounded-full"
          style={{ animation: 'blackhole-spin 2.6s linear infinite' }}
        >
          <div className="absolute top-0 left-1/2 -ml-1 h-1.5 w-1.5 rounded-full bg-[#FFFFFF] shadow-[0_0_8px_#FFFFFF]" />
        </div>

        {/* Orbit 2: Champagne gold accretion orbit */}
        <div
          className="absolute h-32 w-32 rounded-full"
          style={{ animation: 'blackhole-reverse-spin 4.2s linear infinite' }}
        >
          <div className="absolute top-1/4 right-0 h-1.5 w-1.5 rounded-full bg-[#D8BD83] shadow-[0_0_8px_#D8BD83]" />
        </div>

        {/* Orbit 3: Muted violet counter-orbit */}
        <div
          className="absolute h-40 w-40 rounded-full"
          style={{ animation: 'blackhole-spin 6.8s linear infinite' }}
        >
          <div className="absolute bottom-1/4 left-0 h-1.5 w-1.5 rounded-full bg-[#76618F] shadow-[0_0_9px_#76618F]" />
        </div>

        {/* Orbit 4: Antique gold tilted orbit */}
        <div
          className="absolute h-48 w-48 rounded-full"
          style={{
            transform: 'rotate(-24deg)',
            animation: 'blackhole-spin 9.5s linear infinite',
          }}
        >
          <div className="absolute bottom-0 right-1/3 h-1.5 w-1.5 rounded-full bg-[#C5A46D] shadow-[0_0_8px_#C5A46D]" />
        </div>

        {/* Orbit 5: Slow outer perimeter star orbit */}
        <div
          className="absolute h-56 w-56 rounded-full"
          style={{ animation: 'blackhole-reverse-spin 14s linear infinite' }}
        >
          <div className="absolute top-0 right-1/4 h-1.5 w-1.5 rounded-full bg-[#F3EFE8] shadow-[0_0_7px_#F3EFE8]" />
        </div>
      </div>

      {/* Miniature Black Hole Anchor Button */}
      <a
        ref={buttonRef}
        href={portfolioUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={handleClick}
        className="group relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-full transition-transform duration-200 ease-out artenos-focus cursor-pointer"
        style={{
          transform: `translate(${gravityOffset.x}px, ${gravityOffset.y}px) scale(${isWarping ? 0.92 : 1 + proximityGlow * 0.06})`,
        }}
        aria-label="Engage Warp to Portfolio"
        title="Warp to Portfolio"
      >
        {/* Accretion Disk Swirling Lensing Glow */}
        <div
          className="pointer-events-none absolute -inset-4 rounded-full opacity-85 blur-md transition-all duration-300 group-hover:opacity-100 group-hover:scale-110"
          style={{
            background:
              'radial-gradient(circle, rgba(216,189,131,0.45) 0%, rgba(197,164,109,0.3) 38%, rgba(118,97,143,0.2) 65%, rgba(8,8,11,0) 80%)',
            boxShadow: `0 0 ${35 + proximityGlow * 30}px rgba(216, 189, 131, ${0.35 + proximityGlow * 0.35})`,
          }}
        />

        {/* Relativistic Accretion Ring (Rotating photon disk) */}
        <div
          className="pointer-events-none absolute -inset-2 rounded-full border border-[#D8BD83]/60 transition-transform duration-300 group-hover:border-[#F3EFE8]"
          style={{
            boxShadow: 'inset 0 0 16px rgba(216,189,131,0.5), 0 0 20px rgba(197,164,109,0.4)',
            animation: 'blackhole-spin 8s linear infinite',
          }}
        />

        {/* Event Horizon (Pure Black Gravitational Void) */}
        <div className="relative flex h-full w-full flex-col items-center justify-center rounded-full bg-[#000002] border border-[#302A34] shadow-[inset_0_0_24px_rgba(0,0,0,1)] transition-colors duration-300 group-hover:border-[#C5A46D]/80">
          {/* Gravitational singularity core depth */}
          <div className="pointer-events-none absolute inset-1 rounded-full bg-gradient-to-b from-[#000000] via-[#050408] to-[#010103] shadow-[inset_0_0_18px_rgba(0,0,0,0.95)]" />

          {/* Central Typography: Clean, Luxurious, NO Icons */}
          <span className="relative z-10 font-display text-xl sm:text-2xl tracking-[0.28em] text-[#F3EFE8] transition-colors duration-300 group-hover:text-[#D8BD83]">
            {isWarping ? 'WARPING' : 'WARP'}
          </span>

          <span className="relative z-10 mt-0.5 text-[9px] font-sans font-medium uppercase tracking-[0.26em] text-[#C5A46D]/90 transition-colors duration-300 group-hover:text-[#F3EFE8]">
            PORTFOLIO
          </span>
        </div>
      </a>

      {/* Relativistic Gravity Lensing Hint */}
      <span className="mt-4 text-[10px] font-light uppercase tracking-[0.22em] text-[#A59BAA]/75">
        Singularity Gate · Click to Enter
      </span>
    </div>
  );
};
