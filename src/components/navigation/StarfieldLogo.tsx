import React from 'react';

interface StarfieldLogoProps {
  className?: string;
  size?: number;
}

export const StarfieldLogo: React.FC<StarfieldLogoProps> = ({
  className = '',
  size = 32,
}) => {
  return (
    <div
      className={`group relative flex items-center gap-2.5 ${className}`}
      title="Artenos — Interstellar Reveal"
    >
      <div className="relative flex items-center justify-center">
        {/* Subtle ambient breathing glow behind logo */}
        <div className="absolute inset-0 -m-1 rounded-full bg-[#D8BD83]/15 blur-sm transition-all duration-300 group-hover:bg-[#D8BD83]/30" />

        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 64 64"
          width={size}
          height={size}
          className="relative z-10 transition-transform duration-500 ease-out group-hover:scale-105"
          aria-hidden="true"
        >
          <defs>
            <radialGradient id="navStarfieldAura" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F3EFE8" stopOpacity="0.95" />
              <stop offset="40%" stopColor="#D8BD83" stopOpacity="0.75" />
              <stop offset="75%" stopColor="#76618F" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#08080B" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="navOrbitGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#D8BD83" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#76618F" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#C5A46D" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Deep space disc */}
          <circle
            cx="32"
            cy="32"
            r="30"
            fill="#111015"
            stroke="#302A34"
            strokeWidth="1.2"
          />

          {/* Concentric aperture rings */}
          <circle
            cx="32"
            cy="32"
            r="23"
            fill="none"
            stroke="#302A34"
            strokeWidth="1"
            className="transition-colors duration-300 group-hover:stroke-[#C5A46D]/40"
          />
          <circle
            cx="32"
            cy="32"
            r="17"
            fill="none"
            stroke="url(#navOrbitGrad)"
            strokeWidth="1.2"
            strokeDasharray="3 3.5"
            className="transition-transform duration-700 ease-out group-hover:rotate-45"
            style={{ transformOrigin: '32px 32px' }}
          />
          <circle
            cx="32"
            cy="32"
            r="11"
            fill="none"
            stroke="#D8BD83"
            strokeWidth="1.4"
            opacity="0.85"
            className="transition-colors duration-300 group-hover:stroke-[#F3EFE8]"
          />

          {/* Outer constellation starlight nodes */}
          <circle cx="32" cy="9" r="1.5" fill="#F3EFE8" />
          <circle cx="48" cy="19" r="1.2" fill="#D8BD83" />
          <circle cx="53" cy="34" r="1.4" fill="#F3EFE8" />
          <circle cx="45" cy="49" r="1.3" fill="#D8BD83" />
          <circle cx="32" cy="55" r="1.5" fill="#C5A46D" />
          <circle cx="17" cy="48" r="1.3" fill="#76618F" />
          <circle cx="11" cy="32" r="1.4" fill="#F3EFE8" />
          <circle cx="19" cy="18" r="1.2" fill="#D8BD83" />

          {/* Inner orbital starlight nodes */}
          <circle cx="32" cy="15" r="1.8" fill="#F3EFE8" />
          <circle cx="44" cy="24" r="1.5" fill="#D8BD83" />
          <circle cx="47" cy="37" r="1.4" fill="#F3EFE8" />
          <circle cx="38" cy="48" r="1.5" fill="#C5A46D" />
          <circle cx="23" cy="45" r="1.4" fill="#76618F" />
          <circle cx="17" cy="32" r="1.8" fill="#D8BD83" />
          <circle cx="24" cy="21" r="1.4" fill="#F3EFE8" />

          {/* Central starlight aperture glow & singularity pin */}
          <circle cx="32" cy="32" r="8" fill="url(#navStarfieldAura)" />
          <circle
            cx="32"
            cy="32"
            r="3.2"
            fill="#08080B"
            stroke="#D8BD83"
            strokeWidth="1.2"
            className="transition-colors duration-300 group-hover:stroke-[#F3EFE8]"
          />
          <circle cx="32" cy="32" r="1.5" fill="#FFFFFF" />
        </svg>
      </div>

      <span className="font-display text-xl tracking-[0.18em] text-[#F3EFE8] transition-colors duration-300 group-hover:text-[#D8BD83] hidden min-[380px]:inline-block">
        ARTENOS
      </span>
    </div>
  );
};
