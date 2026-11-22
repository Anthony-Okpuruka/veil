import React from 'react';

interface RevealProgressProps {
  percentage: number;
}

export const RevealProgress: React.FC<RevealProgressProps> = ({ percentage }) => {
  const clamped = Math.max(0, Math.min(100, percentage));

  return (
    <div
      className="flex items-center gap-3"
      aria-label={`Approximately ${clamped} percent of the surface uncovered`}
    >
      <div className="h-[2px] w-20 overflow-hidden rounded-full bg-[#302A34]">
        <div
          className="h-full bg-[#C5A46D] transition-all duration-300 ease-out"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <span className="text-[11px] font-normal tracking-[0.12em] text-[#A59BAA] tabular-nums whitespace-nowrap">
        ~{clamped}% uncovered
      </span>
    </div>
  );
};
