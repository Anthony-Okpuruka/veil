export interface ParticleEngineConfig {
  /** Base influence radius in CSS pixels (adapted to viewport) */
  influenceRadius: number;
  /** Repulsion strength */
  repulsionStrength: number;
  /** Directional velocity influence factor */
  directionalStrength: number;
  /** Spring return stiffness toward home position */
  springStiffness: number;
  /** Velocity damping (0..1) */
  damping: number;
  /** Maximum displacement distance in CSS pixels */
  maxDisplacement: number;
  /** Whether reduced motion is preferred */
  reducedMotion: boolean;
}

export interface Ripple {
  active: boolean;
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  speed: number;
  amplitude: number;
  wavelength: number;
  alpha: number;
}

export interface TrailNode {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  age: number;
  maxAge: number;
}

export interface ParticleEngineCallbacks {
  onRevealProgress?: (percentage: number) => void;
  onWarpStart?: () => void;
  onWarpEnd?: () => void;
}
