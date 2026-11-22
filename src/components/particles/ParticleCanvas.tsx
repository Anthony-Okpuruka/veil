import React from 'react';

interface ParticleCanvasProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ canvasRef }) => {
  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-10 h-full w-full select-none"
    />
  );
};
