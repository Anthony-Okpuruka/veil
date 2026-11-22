import {
  ParticleEngineCallbacks,
  ParticleEngineConfig,
  Ripple,
  TrailNode,
} from './particle-types';

const PALETTE = [
  '#D8BD83', // Champagne gold starlight
  '#C5A46D', // Antique gold
  '#76618F', // Muted violet nebula star
  '#F3EFE8', // Crisp near-white starlight
  '#A59BAA', // Distant faint star
] as const;

// Cumulative probability weights for balanced interstellar star composition
const COLOR_WEIGHTS = [0.22, 0.34, 0.56, 0.86, 1.0] as const;

const MAX_RIPPLES = 14;
const MAX_TRAIL_NODES = 18;

export class ParticleEngine {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private config: ParticleEngineConfig;
  private callbacks: ParticleEngineCallbacks;

  private width = 0;
  private height = 0;
  private dpr = 1;

  // Active word to spell with starlight
  private currentWord = 'ARTENOS';

  // Structure-of-Arrays for zero-GC particle simulation
  private count = 0;
  private homeX = new Float32Array(0);
  private homeY = new Float32Array(0);
  private x = new Float32Array(0);
  private y = new Float32Array(0);
  private vx = new Float32Array(0);
  private vy = new Float32Array(0);
  private radius = new Float32Array(0);
  private baseAlpha = new Float32Array(0);
  private noiseSeed = new Float32Array(0);
  private returnSpeed = new Float32Array(0);
  private colorIndex = new Uint8Array(0);
  private textParticleCount = 0;

  // Spatial partitioning grid for Boids particle-to-particle interaction
  private boidCellSize = 20;
  private gridCols = 0;
  private gridRows = 0;
  private cellHead = new Int32Array(0);
  private particleNext = new Int32Array(0);
  private boidForceX = new Float32Array(0);
  private boidForceY = new Float32Array(0);

  // Pre-rendered pinpoint star stamps
  private stamps: HTMLCanvasElement[] = [];

  // Pointer & velocity state
  private pointerActive = false;
  private pointerX = -9999;
  private pointerY = -9999;
  private prevPointerX = -9999;
  private prevPointerY = -9999;
  private pointerVX = 0;
  private pointerVY = 0;
  private lastRippleEmitX = -9999;
  private lastRippleEmitY = -9999;

  // Pre-allocated pools
  private ripples: Ripple[] = [];
  private trail: TrailNode[] = [];

  // Global dispersal state (0 = formed word, 1 = dispersed starfield)
  private isDispersed = false;
  private globalDispersal = 0;
  private targetDispersal = 0;

  // Warp speed / hyperspace effect state
  private isWarping = false;
  private warpTime = 0;
  private warpDuration = 2.4;

  // Black hole gravitational singularity state
  private blackHoleActive = false;
  private blackHoleX = -9999;
  private blackHoleY = -9999;
  private lastBhRippleTime = 0;

  // Animation loop state
  private rafId: number | null = null;
  private isPaused = false;
  private lastTime = 0;
  private currentTime = 0;
  private lastProgressReport = 0;
  private reportedProgress = 0;

  constructor(
    canvas: HTMLCanvasElement,
    config?: Partial<ParticleEngineConfig>,
    callbacks?: ParticleEngineCallbacks
  ) {
    this.canvas = canvas;
    const context = canvas.getContext('2d', { alpha: true });
    if (!context) {
      throw new Error('Could not initialize 2D canvas context');
    }
    this.ctx = context;

    this.config = {
      influenceRadius: 115,
      repulsionStrength: 1.2,
      directionalStrength: 0.45,
      springStiffness: 0.046,
      damping: 0.86,
      maxDisplacement: 165,
      reducedMotion: false,
      ...config,
    };

    this.callbacks = callbacks ?? {};

    for (let i = 0; i < MAX_RIPPLES; i++) {
      this.ripples.push({
        active: false,
        x: 0,
        y: 0,
        radius: 0,
        maxRadius: 190,
        speed: 220,
        amplitude: 1,
        wavelength: 44,
        alpha: 0,
      });
    }

    for (let i = 0; i < MAX_TRAIL_NODES; i++) {
      this.trail.push({
        active: false,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        age: 0,
        maxAge: 0.45,
      });
    }

    this.buildStarStamps();

    // Re-sample text once webfont (Bebas Neue) finishes loading
    if (typeof document !== 'undefined' && 'fonts' in document) {
      document.fonts.ready.then(() => {
        if (this.width > 0 && this.height > 0) {
          this.initParticles();
        }
      });
    }
  }

  private buildStarStamps(): void {
    const size = 20;
    const half = size / 2;

    this.stamps = PALETTE.map((hex) => {
      const off = document.createElement('canvas');
      off.width = size;
      off.height = size;
      const octx = off.getContext('2d');
      if (octx) {
        // Crisp pinpoint star core with delicate astronomical halo
        const grad = octx.createRadialGradient(half, half, 0, half, half, half);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.2, hex);
        grad.addColorStop(0.48, hex);
        grad.addColorStop(1, 'rgba(8, 8, 11, 0)');
        octx.fillStyle = grad;
        octx.beginPath();
        octx.arc(half, half, half, 0, Math.PI * 2);
        octx.fill();
      }
      return off;
    });
  }

  public resize(width: number, height: number): void {
    if (width <= 0 || height <= 0) return;
    if (Math.abs(width - this.width) < 1 && Math.abs(height - this.height) < 1) {
      return;
    }

    this.width = width;
    this.height = height;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);

    this.canvas.width = Math.floor(width * this.dpr);
    this.canvas.height = Math.floor(height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);

    if (width < 640) {
      this.config.influenceRadius = 82;
      this.config.maxDisplacement = 115;
    } else if (width < 1024) {
      this.config.influenceRadius = 100;
      this.config.maxDisplacement = 140;
    } else {
      this.config.influenceRadius = 118;
      this.config.maxDisplacement = 165;
    }

    this.initParticles();
  }

  private computeAdaptiveParticleCount(): number {
    const area = this.width * this.height;
    const cores = typeof navigator !== 'undefined' ? navigator.hardwareConcurrency || 4 : 4;
    const memory =
      typeof navigator !== 'undefined' && 'deviceMemory' in navigator
        ? ((navigator as unknown as { deviceMemory?: number }).deviceMemory ?? 8)
        : 8;

    let areaPerParticle = 155;
    if (this.width < 640) {
      areaPerParticle = 220;
    } else if (cores <= 4 || memory <= 4) {
      areaPerParticle = 195;
    } else if (cores >= 8 && memory >= 8) {
      areaPerParticle = 135;
    }

    const rawCount = Math.floor(area / areaPerParticle);
    return Math.max(2000, Math.min(11500, rawCount));
  }

  public getWord(): string {
    return this.currentWord;
  }

  public setWord(newWord: string): void {
    const sanitized = (newWord || '').trim().toUpperCase() || 'ATERNOS';
    if (sanitized === this.currentWord) return;
    this.currentWord = sanitized;
    this.updateWordGlyphs();
  }

  private updateWordGlyphs(): void {
    if (this.width <= 0 || this.height <= 0 || this.count === 0) return;
    const textPts = this.sampleTextPoints();
    const n = this.count;
    this.textParticleCount = Math.min(textPts.count, Math.floor(n * 0.78));
    const textParticleCount = this.textParticleCount;

    for (let idx = 0; idx < n; idx++) {
      const isTextStar = idx < textParticleCount;
      if (isTextStar) {
        const ptIdx =
          textParticleCount === textPts.count
            ? idx
            : Math.floor((idx / textParticleCount) * textPts.count);
        this.homeX[idx] = textPts.xs[ptIdx];
        this.homeY[idx] = textPts.ys[ptIdx];
        this.baseAlpha[idx] =
          this.colorIndex[idx] === 4
            ? 0.55 + Math.random() * 0.25
            : 0.78 + Math.random() * 0.22;
        this.radius[idx] = 0.55 + Math.random() * 0.65;
      } else {
        this.homeX[idx] = Math.random() * this.width;
        this.homeY[idx] = Math.random() * this.height;
        this.baseAlpha[idx] =
          this.colorIndex[idx] === 4
            ? 0.14 + Math.random() * 0.18
            : 0.22 + Math.random() * 0.35;
        this.radius[idx] = 0.4 + Math.random() * 0.65;
      }

      // Gentle organic swirl impulse to transition stars to the new letters
      const angle = Math.random() * Math.PI * 2;
      const kick = 12 + Math.random() * 28;
      this.vx[idx] += Math.cos(angle) * kick;
      this.vy[idx] += Math.sin(angle) * kick;
    }
  }

  private sampleTextPoints(): { xs: Float32Array; ys: Float32Array; count: number } {
    const off = document.createElement('canvas');
    const w = Math.max(1, Math.floor(this.width));
    const h = Math.max(1, Math.floor(this.height));
    off.width = w;
    off.height = h;
    const octx = off.getContext('2d');
    if (!octx) {
      return { xs: new Float32Array(0), ys: new Float32Array(0), count: 0 };
    }

    const chars = this.currentWord.split('');
    const letterCount = Math.max(1, chars.length);

    // Responsive font sizing based on character count and canvas dimensions
    const maxAvailableWidth = w * (w < 640 ? 0.9 : 0.82);
    const approxWidthPerChar = 0.76;
    const fontSizeFromWidth = maxAvailableWidth / (letterCount * approxWidthPerChar);
    const fontSize = Math.round(
      Math.max(26, Math.min(fontSizeFromWidth, h * 0.24, 154))
    );

    octx.clearRect(0, 0, w, h);
    octx.fillStyle = '#FFFFFF';
    octx.font = `400 ${fontSize}px "Cormorant Garamond", Georgia, serif`;
    octx.textAlign = 'center';
    octx.textBaseline = 'middle';

    const spacing = fontSize * 0.24;
    let totalWidth = 0;
    const charWidths = chars.map((ch) => {
      const m = octx.measureText(ch).width;
      totalWidth += m;
      return m;
    });
    totalWidth += spacing * (chars.length - 1);

    // Scale down if letter string exceeds available width
    let scale = 1;
    if (totalWidth > maxAvailableWidth && totalWidth > 0) {
      scale = maxAvailableWidth / totalWidth;
    }

    const centerY = h * 0.5;
    let cursorX = w * 0.5 - (totalWidth * scale) * 0.5;

    if (scale < 0.98) {
      octx.save();
      octx.translate(w * 0.5, centerY);
      octx.scale(scale, scale);
      octx.translate(-w * 0.5, -centerY);
      cursorX = w * 0.5 - totalWidth * 0.5;
    }

    for (let i = 0; i < chars.length; i++) {
      const cw = charWidths[i];
      octx.fillText(chars[i], cursorX + cw * 0.5, centerY);
      cursorX += cw + spacing;
    }

    if (scale < 0.98) {
      octx.restore();
    }

    const img = octx.getImageData(0, 0, w, h).data;
    const step = 2;
    const maxPts = Math.ceil((w * h) / (step * step));
    const xs = new Float32Array(maxPts);
    const ys = new Float32Array(maxPts);
    let count = 0;

    for (let py = 0; py < h; py += step) {
      const row = py * w;
      for (let px = 0; px < w; px += step) {
        const alpha = img[(row + px) * 4 + 3];
        if (alpha > 90) {
          xs[count] = px + (Math.random() - 0.5) * 0.6;
          ys[count] = py + (Math.random() - 0.5) * 0.6;
          count++;
        }
      }
    }

    return { xs, ys, count };
  }

  private initParticles(): void {
    const textPts = this.sampleTextPoints();
    const baseCount = this.computeAdaptiveParticleCount();
    // Ensure enough stars to densely and cleanly define every letterform + ambient starfield
    const targetCount = Math.max(
      baseCount,
      Math.min(12500, Math.ceil(textPts.count * 1.45))
    );
    this.count = targetCount;

    this.homeX = new Float32Array(targetCount);
    this.homeY = new Float32Array(targetCount);
    this.x = new Float32Array(targetCount);
    this.y = new Float32Array(targetCount);
    this.vx = new Float32Array(targetCount);
    this.vy = new Float32Array(targetCount);
    this.radius = new Float32Array(targetCount);
    this.baseAlpha = new Float32Array(targetCount);
    this.noiseSeed = new Float32Array(targetCount);
    this.returnSpeed = new Float32Array(targetCount);
    this.colorIndex = new Uint8Array(targetCount);
    this.particleNext = new Int32Array(targetCount);
    this.boidForceX = new Float32Array(targetCount);
    this.boidForceY = new Float32Array(targetCount);

    // Assign every sampled glyph point to a star first so there are zero gaps in the letters
    this.textParticleCount = Math.min(textPts.count, Math.floor(targetCount * 0.76));
    const textParticleCount = this.textParticleCount;

    for (let idx = 0; idx < targetCount; idx++) {
      let hx = 0;
      let hy = 0;
      const isTextStar = idx < textParticleCount;

      if (isTextStar) {
        const ptIdx =
          textParticleCount === textPts.count
            ? idx
            : Math.floor((idx / textParticleCount) * textPts.count);
        hx = textPts.xs[ptIdx];
        hy = textPts.ys[ptIdx];
      } else {
        hx = Math.random() * this.width;
        hy = Math.random() * this.height;
      }

      this.homeX[idx] = hx;
      this.homeY[idx] = hy;
      this.x[idx] = hx;
      this.y[idx] = hy;
      this.vx[idx] = 0;
      this.vy[idx] = 0;

      // Crisp star-like sizes
      this.radius[idx] = isTextStar
        ? 0.6 + Math.random() * 0.7
        : 0.4 + Math.random() * 0.7;
      this.noiseSeed[idx] = Math.random() * Math.PI * 2;
      this.returnSpeed[idx] = 0.85 + Math.random() * 0.35;

      const roll = Math.random();
      let cIdx = 0;
      for (let k = 0; k < COLOR_WEIGHTS.length; k++) {
        if (roll <= COLOR_WEIGHTS[k]) {
          cIdx = k;
          break;
        }
      }
      this.colorIndex[idx] = cIdx;

      if (isTextStar) {
        // High-definition starlight on letterforms for instant readability
        this.baseAlpha[idx] =
          cIdx === 4 ? 0.55 + Math.random() * 0.25 : 0.75 + Math.random() * 0.25;
      } else {
        // Quieter ambient interstellar stars
        this.baseAlpha[idx] =
          cIdx === 4 ? 0.14 + Math.random() * 0.18 : 0.22 + Math.random() * 0.35;
      }
    }

    // Spatial hash grid setup for fast O(1) Boids neighbor queries
    this.boidCellSize = 20;
    this.gridCols = Math.max(1, Math.ceil(this.width / this.boidCellSize));
    this.gridRows = Math.max(1, Math.ceil(this.height / this.boidCellSize));
    this.cellHead = new Int32Array(this.gridCols * this.gridRows);
  }

  public setReducedMotion(reduced: boolean): void {
    this.config.reducedMotion = reduced;
    if (reduced) {
      for (const r of this.ripples) r.active = false;
      for (const t of this.trail) t.active = false;
      this.vx.fill(0);
      this.vy.fill(0);
    }
  }

  public setPaused(paused: boolean): void {
    this.isPaused = paused;
    if (!paused && this.rafId === null) {
      this.lastTime = performance.now();
      this.loop(this.lastTime);
    }
  }

  public updatePointer(clientX: number, clientY: number): void {
    const rect = this.canvas.getBoundingClientRect();
    const lx = clientX - rect.left;
    const ly = clientY - rect.top;

    if (!this.pointerActive) {
      this.prevPointerX = lx;
      this.prevPointerY = ly;
      this.lastRippleEmitX = lx;
      this.lastRippleEmitY = ly;
    } else {
      this.prevPointerX = this.pointerX;
      this.prevPointerY = this.pointerY;
    }

    this.pointerX = lx;
    this.pointerY = ly;
    this.pointerActive = true;

    const dx = lx - this.prevPointerX;
    const dy = ly - this.prevPointerY;
    const dist = Math.hypot(dx, dy);

    this.pointerVX = this.pointerVX * 0.55 + dx * 0.45;
    this.pointerVY = this.pointerVY * 0.55 + dy * 0.45;

    if (!this.config.reducedMotion && dist > 3) {
      this.pushTrailNode(lx, ly, dx, dy);

      const distSinceRipple = Math.hypot(
        lx - this.lastRippleEmitX,
        ly - this.lastRippleEmitY
      );
      if (distSinceRipple > 34) {
        this.emitRipple(lx, ly, Math.min(1.6, 0.65 + dist * 0.025));
        this.lastRippleEmitX = lx;
        this.lastRippleEmitY = ly;
      }
    }
  }

  public clearPointer(): void {
    this.pointerActive = false;
    this.pointerVX = 0;
    this.pointerVY = 0;
  }

  private pushTrailNode(x: number, y: number, vx: number, vy: number): void {
    let oldestIdx = 0;
    let maxAgeRatio = -1;
    for (let i = 0; i < MAX_TRAIL_NODES; i++) {
      const node = this.trail[i];
      if (!node.active) {
        oldestIdx = i;
        break;
      }
      const ratio = node.age / node.maxAge;
      if (ratio > maxAgeRatio) {
        maxAgeRatio = ratio;
        oldestIdx = i;
      }
    }

    const target = this.trail[oldestIdx];
    target.active = true;
    target.x = x;
    target.y = y;
    target.vx = vx;
    target.vy = vy;
    target.age = 0;
    target.maxAge = 0.42;
  }

  private emitRipple(x: number, y: number, strength: number): void {
    let slot: Ripple | null = null;
    let lowestAlpha = 2;

    for (let i = 0; i < MAX_RIPPLES; i++) {
      const r = this.ripples[i];
      if (!r.active) {
        slot = r;
        break;
      }
      if (r.alpha < lowestAlpha) {
        lowestAlpha = r.alpha;
        slot = r;
      }
    }

    if (slot) {
      slot.active = true;
      slot.x = x;
      slot.y = y;
      slot.radius = 8;
      slot.maxRadius = this.config.influenceRadius * (1.45 + strength * 0.35);
      slot.speed = 185 + strength * 45;
      slot.amplitude = 0.85 * strength;
      slot.wavelength = 42;
      slot.alpha = 1;
    }
  }

  public revealAll(): void {
    this.isDispersed = true;
    this.targetDispersal = 1;
  }

  public resetSurface(): void {
    this.isDispersed = false;
    this.targetDispersal = 0;
    this.blackHoleActive = false;
  }

  public warp(): void {
    if (this.isWarping || this.width <= 0) return;
    this.isWarping = true;
    this.warpTime = 0;
    this.callbacks.onWarpStart?.();

    const cx = this.width * 0.5;
    const cy = this.height * 0.5;
    const n = this.count;

    for (let i = 0; i < n; i++) {
      const dx = this.x[i] - cx;
      const dy = this.y[i] - cy;
      const len = Math.hypot(dx, dy) || 1;
      const speed = 260 + Math.random() * 560;
      this.vx[i] = (dx / len) * speed;
      this.vy[i] = (dy / len) * speed;
    }
  }

  public getIsWarping(): boolean {
    return this.isWarping;
  }

  public setBlackHole(clientX: number, clientY: number, active: boolean): void {
    if (!active || !this.isDispersed) {
      this.blackHoleActive = false;
      return;
    }
    const rect = this.canvas.getBoundingClientRect();
    this.blackHoleX = clientX - rect.left;
    this.blackHoleY = clientY - rect.top;
    this.blackHoleActive = true;
  }

  public start(): void {
    if (this.rafId !== null) return;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  public destroy(): void {
    if (this.rafId !== null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  private loop = (now: number): void => {
    if (this.isPaused) {
      this.rafId = null;
      return;
    }

    const dt = Math.min(0.05, Math.max(0.001, (now - this.lastTime) / 1000));
    this.lastTime = now;
    this.currentTime = now;

    this.step(dt, now);
    this.render();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private step(dt: number, now: number): void {
    const n = this.count;
    if (n === 0) return;

    const cx = this.width * 0.5;
    const cy = this.height * 0.5;

    // Hyperspace warp speed physics
    if (this.isWarping) {
      this.warpTime += dt;
      const progress = this.warpTime / this.warpDuration;

      if (progress < 0.62) {
        // Hyperspace radial burst & light-speed streaks
        const streamBoost = (1 - progress / 0.62) * 580 * dt;
        for (let i = 0; i < n; i++) {
          const dx = this.x[i] - cx;
          const dy = this.y[i] - cy;
          const len = Math.hypot(dx, dy) || 1;
          this.vx[i] += (dx / len) * streamBoost;
          this.vy[i] += (dy / len) * streamBoost;
          this.x[i] += this.vx[i] * dt;
          this.y[i] += this.vy[i] * dt;

          // Infinite tunnel boundary wrap
          if (this.x[i] < -80) this.x[i] = this.width + 60;
          else if (this.x[i] > this.width + 80) this.x[i] = -60;
          if (this.y[i] < -80) this.y[i] = this.height + 60;
          else if (this.y[i] > this.height + 80) this.y[i] = -60;
        }
      } else {
        // Deceleration and gravitational convergence back into the word
        const decel = Math.min(1, (progress - 0.62) / 0.38);
        const pull = 0.07 + decel * 0.15;
        for (let i = 0; i < n; i++) {
          this.vx[i] += (this.homeX[i] - this.x[i]) * pull;
          this.vy[i] += (this.homeY[i] - this.y[i]) * pull;
          this.vx[i] *= 0.83;
          this.vy[i] *= 0.83;
          this.x[i] += this.vx[i];
          this.y[i] += this.vy[i];
        }
      }

      if (progress >= 1) {
        this.isWarping = false;
        this.warpTime = 0;
        this.isDispersed = false;
        this.targetDispersal = 0;
        this.globalDispersal = 0;
        this.blackHoleActive = false;
        this.callbacks.onWarpEnd?.();
      }
      return;
    }

    const dispersalRate = this.config.reducedMotion ? 6.5 : 2.8;
    this.globalDispersal +=
      (this.targetDispersal - this.globalDispersal) * Math.min(1, dt * dispersalRate);

    // Update ripples
    let activeRipples = 0;
    for (let i = 0; i < MAX_RIPPLES; i++) {
      const r = this.ripples[i];
      if (!r.active) continue;
      r.radius += r.speed * dt;
      r.alpha = Math.max(0, 1 - r.radius / r.maxRadius);
      if (r.radius >= r.maxRadius) {
        r.active = false;
      } else {
        activeRipples++;
      }
    }

    // Update cursor trail nodes
    let activeTrails = 0;
    for (let i = 0; i < MAX_TRAIL_NODES; i++) {
      const t = this.trail[i];
      if (!t.active) continue;
      t.age += dt;
      if (t.age >= t.maxAge) {
        t.active = false;
      } else {
        activeTrails++;
      }
    }

    const infR = this.config.influenceRadius;
    const pointerSpeed = Math.hypot(this.pointerVX, this.pointerVY);
    const dynamicRadius = infR * (1 + Math.min(0.32, pointerSpeed * 0.006));
    const dynamicRadiusSq = dynamicRadius * dynamicRadius;
    const maxDisp = this.config.maxDisplacement;
    const maxDispSq = maxDisp * maxDisp;
    const spring = this.config.springStiffness;
    const damping = this.config.damping;
    const reduced = this.config.reducedMotion;

    // Spatial-hash Boids pass: anti-overlap separation & organic flow alignment
    if (!reduced && this.globalDispersal < 0.25) {
      this.computeBoidsForces();
    } else {
      this.boidForceX.fill(0);
      this.boidForceY.fill(0);
    }

    let displacedCount = 0;

    // Spacetime gravitational waves emitted between cursor Mini-Sun and Black Hole (only when dispersed)
    if (this.blackHoleActive && this.isDispersed && this.pointerActive && !this.isWarping && !reduced) {
      const bhDx = this.pointerX - this.blackHoleX;
      const bhDy = this.pointerY - this.blackHoleY;
      const bhDist = Math.hypot(bhDx, bhDy);

      if (bhDist < 380 && now - this.lastBhRippleTime > 240) {
        this.lastBhRippleTime = now;
        const waveStrength = Math.min(1.8, Math.max(0.55, (380 - bhDist) / 160));
        const ripX = this.blackHoleX + bhDx * 0.45;
        const ripY = this.blackHoleY + bhDy * 0.45;
        this.emitRipple(ripX, ripY, waveStrength);
      }
    }

    for (let i = 0; i < n; i++) {
      let px = this.x[i];
      let py = this.y[i];
      let pvx = this.vx[i] + this.boidForceX[i];
      let pvy = this.vy[i] + this.boidForceY[i];
      const hx = this.homeX[i];
      const hy = this.homeY[i];
      const seed = this.noiseSeed[i];

      if (!reduced) {
        // 1. Primary pointer radial scattering + organic edge + directional wake
        if (this.pointerActive) {
          const dx = px - this.pointerX;
          const dy = py - this.pointerY;
          const distSq = dx * dx + dy * dy;

          if (distSq < dynamicRadiusSq && distSq > 0.0001) {
            const dist = Math.sqrt(distSq);
            const angle = Math.atan2(dy, dx);
            const organicMod =
              1 +
              0.18 * Math.sin(angle * 3 + seed) +
              0.11 * Math.cos(angle * 5 - seed * 1.7);
            const effectiveR = dynamicRadius * organicMod;

            if (dist < effectiveR) {
              const t = 1 - dist / effectiveR;
              const falloff = t * t * (3 - 2 * t);
              const force = falloff * this.config.repulsionStrength * 9.5;

              const nx = dx / dist;
              const ny = dy / dist;

              pvx += nx * force;
              pvy += ny * force;

              pvx += this.pointerVX * falloff * this.config.directionalStrength * 0.28;
              pvy += this.pointerVY * falloff * this.config.directionalStrength * 0.28;
            }
          }
        }

        // 2. Short-lived cursor trail displacement
        if (activeTrails > 0) {
          for (let k = 0; k < MAX_TRAIL_NODES; k++) {
            const node = this.trail[k];
            if (!node.active) continue;
            const life = 1 - node.age / node.maxAge;
            const trailR = infR * 0.62 * life;
            const dx = px - node.x;
            const dy = py - node.y;
            const dSq = dx * dx + dy * dy;
            if (dSq < trailR * trailR && dSq > 0.01) {
              const d = Math.sqrt(dSq);
              const f = (1 - d / trailR) * life * 2.2;
              pvx += (dx / d) * f + node.vx * f * 0.05;
              pvy += (dy / d) * f + node.vy * f * 0.05;
            }
          }
        }

        // 3. Overlapping travelling radial ripples
        if (activeRipples > 0) {
          for (let k = 0; k < MAX_RIPPLES; k++) {
            const r = this.ripples[k];
            if (!r.active) continue;
            const dx = px - r.x;
            const dy = py - r.y;
            const dSq = dx * dx + dy * dy;
            const outer = r.radius + r.wavelength;
            const inner = Math.max(0, r.radius - r.wavelength);
            if (dSq < outer * outer && dSq > inner * inner && dSq > 0.01) {
              const d = Math.sqrt(dSq);
              const band = 1 - Math.abs(d - r.radius) / r.wavelength;
              if (band > 0) {
                const wave =
                  Math.sin((d - r.radius) * 0.14) *
                  band *
                  r.alpha *
                  r.amplitude *
                  3.4;
                pvx += (dx / d) * wave;
                pvy += (dy / d) * wave;
              }
            }
          }
        }

        // 3.5. Black Hole gravitational singularity attraction & relativistic accretion swirl
        // The black hole NEVER affects the name! It only influences ambient stars and only when dispersed!
        if (this.blackHoleActive && this.isDispersed && i >= this.textParticleCount) {
          const bhDx = px - this.blackHoleX;
          const bhDy = py - this.blackHoleY;
          const bhDistSq = bhDx * bhDx + bhDy * bhDy;
          const bhReach = 260;

          if (bhDistSq < bhReach * bhReach && bhDistSq > 16) {
            const bhDist = Math.sqrt(bhDistSq);
            const gravNorm = 1 - bhDist / bhReach;

            // Inward gravitational attraction pulling ambient stars toward the black hole
            const pull = gravNorm * gravNorm * 3.4;
            pvx -= (bhDx / bhDist) * pull;
            pvy -= (bhDy / bhDist) * pull;

            // Relativistic accretion orbital swirl
            const swirl = gravNorm * 2.8;
            pvx += (-bhDy / bhDist) * swirl;
            pvy += (bhDx / bhDist) * swirl;
          }
        }
      }

      // 4. Global dispersal target (scatter "ATERNOS" into open starfield)
      let targetX = hx;
      let targetY = hy;
      if (this.globalDispersal > 0.005) {
        const outX = hx - cx;
        const outY = hy - cy;
        const outLen = Math.hypot(outX, outY) || 1;
        const spread = this.globalDispersal * (180 + (seed % 3.14) * 95);
        targetX = hx + (outX / outLen) * spread + Math.cos(seed * 2.3) * 45 * this.globalDispersal;
        targetY = hy + (outY / outLen) * spread + Math.sin(seed * 2.3) * 45 * this.globalDispersal;
      }

      // 5. Spring return toward target position + damping
      const rSpeed = this.returnSpeed[i];
      pvx += (targetX - px) * spring * rSpeed;
      pvy += (targetY - py) * spring * rSpeed;

      pvx *= damping;
      pvy *= damping;

      px += pvx;
      py += pvy;

      // 6. Clamp maximum displacement from home
      const dispX = px - hx;
      const dispY = py - hy;
      const dispSq = dispX * dispX + dispY * dispY;

      if (dispSq > maxDispSq && this.globalDispersal < 0.2) {
        const disp = Math.sqrt(dispSq);
        px = hx + (dispX / disp) * maxDisp;
        py = hy + (dispY / disp) * maxDisp;
        pvx *= 0.6;
        pvy *= 0.6;
        displacedCount++;
      } else if (dispSq > 144) {
        displacedCount++;
      }

      this.x[i] = px;
      this.y[i] = py;
      this.vx[i] = pvx;
      this.vy[i] = pvy;
    }

    if (now - this.lastProgressReport > 200) {
      this.lastProgressReport = now;
      const pct = this.isDispersed
        ? 100
        : Math.min(100, Math.round((displacedCount / Math.max(1, n * 0.45)) * 100));
      if (pct !== this.reportedProgress) {
        this.reportedProgress = pct;
        this.callbacks.onRevealProgress?.(pct);
      }
    }
  }

  private computeBoidsForces(): void {
    const n = this.count;
    const cols = this.gridCols;
    const rows = this.gridRows;
    const cellSize = this.boidCellSize;

    this.cellHead.fill(-1);
    for (let i = 0; i < n; i++) {
      const gx = Math.min(cols - 1, Math.max(0, (this.x[i] / cellSize) | 0));
      const gy = Math.min(rows - 1, Math.max(0, (this.y[i] / cellSize) | 0));
      const cellIdx = gy * cols + gx;
      this.particleNext[i] = this.cellHead[cellIdx];
      this.cellHead[cellIdx] = i;
    }

    const sepRadius = 9.5;
    const sepRadiusSq = sepRadius * sepRadius;
    const alignRadiusSq = cellSize * cellSize;
    const sepStrength = 0.58;
    const alignStrength = 0.032;

    for (let i = 0; i < n; i++) {
      const px = this.x[i];
      const py = this.y[i];
      const pvx = this.vx[i];
      const pvy = this.vy[i];
      const isMoving = pvx * pvx + pvy * pvy > 0.04;

      const gx = Math.min(cols - 1, Math.max(0, (px / cellSize) | 0));
      const gy = Math.min(rows - 1, Math.max(0, (py / cellSize) | 0));

      const minX = gx > 0 ? gx - 1 : 0;
      const maxX = gx < cols - 1 ? gx + 1 : cols - 1;
      const minY = gy > 0 ? gy - 1 : 0;
      const maxY = gy < rows - 1 ? gy + 1 : rows - 1;

      let fx = 0;
      let fy = 0;
      let alignVX = 0;
      let alignVY = 0;
      let alignCount = 0;

      for (let ny = minY; ny <= maxY; ny++) {
        const rowOffset = ny * cols;
        for (let nx = minX; nx <= maxX; nx++) {
          let j = this.cellHead[rowOffset + nx];
          while (j !== -1) {
            if (j !== i) {
              const dx = px - this.x[j];
              const dy = py - this.y[j];
              const dSq = dx * dx + dy * dy;

              if (dSq < sepRadiusSq && dSq > 0.0001) {
                const d = Math.sqrt(dSq);
                const push = (1 - d / sepRadius) * sepStrength;
                fx += (dx / d) * push;
                fy += (dy / d) * push;
              }

              if (isMoving && dSq < alignRadiusSq) {
                alignVX += this.vx[j];
                alignVY += this.vy[j];
                alignCount++;
              }
            }
            j = this.particleNext[j];
          }
        }
      }

      if (alignCount > 0) {
        fx += (alignVX / alignCount - pvx) * alignStrength;
        fy += (alignVY / alignCount - pvy) * alignStrength;
      }

      this.boidForceX[i] = fx;
      this.boidForceY[i] = fy;
    }
  }

  private render(): void {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.width, this.height);

    const lightActive = this.pointerActive;
    const lightR = this.config.influenceRadius * 2.05;
    const lightRSq = lightR * lightR;
    const lx = this.pointerX;
    const ly = this.pointerY;
    const twinkleTime = this.currentTime * 0.0022;
    const reduced = this.config.reducedMotion;

    const n = this.count;

    // Render light-speed motion streaks during warp
    if (this.isWarping) {
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      const streakRatio = Math.sin((this.warpTime / this.warpDuration) * Math.PI);
      const trailFactor = 0.045 * streakRatio;

      for (let i = 0; i < n; i++) {
        const px = this.x[i];
        const py = this.y[i];
        const tailX = px - this.vx[i] * trailFactor;
        const tailY = py - this.vy[i] * trailFactor;

        ctx.strokeStyle =
          this.colorIndex[i] === 0 || this.colorIndex[i] === 3
            ? '#F3EFE8'
            : '#D8BD83';
        ctx.globalAlpha = 0.35 + streakRatio * 0.45;
        ctx.lineWidth = Math.max(0.8, this.radius[i] * 1.6);
        ctx.beginPath();
        ctx.moveTo(tailX, tailY);
        ctx.lineTo(px, py);
        ctx.stroke();
      }

      // Volumetric central hyperspace bloom
      const cx = this.width * 0.5;
      const cy = this.height * 0.5;
      const maxR = Math.min(this.width, this.height) * 0.65;
      const warpGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, maxR);
      warpGlow.addColorStop(0, `rgba(255, 252, 245, ${0.4 * streakRatio})`);
      warpGlow.addColorStop(0.3, `rgba(216, 189, 131, ${0.22 * streakRatio})`);
      warpGlow.addColorStop(0.7, `rgba(118, 97, 143, ${0.08 * streakRatio})`);
      warpGlow.addColorStop(1, 'rgba(8, 8, 11, 0)');
      ctx.fillStyle = warpGlow;
      ctx.beginPath();
      ctx.arc(cx, cy, maxR, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    }

    for (let i = 0; i < n; i++) {
      const px = this.x[i];
      const py = this.y[i];
      let alpha = this.baseAlpha[i];

      // Subtle interstellar starlight twinkle
      if (!reduced) {
        alpha *= 0.84 + 0.16 * Math.sin(twinkleTime + this.noiseSeed[i] * 3.1);
      }

      // Illuminate nearby stars as they catch the cursor light beam
      if (lightActive && !this.isWarping) {
        const dx = px - lx;
        const dy = py - ly;
        const dSq = dx * dx + dy * dy;
        if (dSq < lightRSq) {
          const falloff = 1 - Math.sqrt(dSq) / lightR;
          alpha = Math.min(1, alpha + falloff * falloff * 0.55);
        }
      }

      const r = this.radius[i] * (this.isWarping ? 1.8 : 2.1);
      const stamp = this.stamps[this.colorIndex[i]];
      ctx.globalAlpha = alpha;
      ctx.drawImage(stamp, px - r, py - r, r * 2, r * 2);
    }
    ctx.globalAlpha = 1;

    // Volumetric deep-space / deep-sea spotlight around the cursor
    if (lightActive && !this.isWarping) {
      this.renderDeepSeaLight(ctx, lx, ly);
    }

    // Relativistic gravitational distortion and lensing bridge between Mini-Sun and Black Hole (only when dispersed)
    if (this.blackHoleActive && this.isDispersed && lightActive && !this.isWarping) {
      this.renderGravitationalInteraction(ctx, lx, ly);
    }
  }

  private renderGravitationalInteraction(
    ctx: CanvasRenderingContext2D,
    lx: number,
    ly: number
  ): void {
    const bhX = this.blackHoleX;
    const bhY = this.blackHoleY;
    const dx = bhX - lx;
    const dy = bhY - ly;
    const dist = Math.hypot(dx, dy);

    if (dist > 450 || dist < 6) return;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const proximity = Math.max(0, 1 - dist / 450);

    // Relativistic curved spacetime plasma stream from Mini Sun toward Black Hole
    const midX = (lx + bhX) * 0.5 + Math.sin(this.currentTime * 0.003) * 14 * proximity;
    const midY = (ly + bhY) * 0.5 + Math.cos(this.currentTime * 0.003) * 14 * proximity;

    const streamGrad = ctx.createLinearGradient(lx, ly, bhX, bhY);
    streamGrad.addColorStop(0, `rgba(255, 252, 245, ${0.45 * proximity})`);
    streamGrad.addColorStop(0.35, `rgba(216, 189, 131, ${0.3 * proximity})`);
    streamGrad.addColorStop(0.75, `rgba(118, 97, 143, ${0.2 * proximity})`);
    streamGrad.addColorStop(1, 'rgba(8, 8, 11, 0)');

    ctx.strokeStyle = streamGrad;
    ctx.lineWidth = 1.4 + proximity * 3.6;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(midX, midY, bhX, bhY);
    ctx.stroke();

    // Curved spacetime gravitational lensing geodesic
    const curveOffset = Math.sin(this.currentTime * 0.004) * 22 * proximity;
    const perpX = (-dy / dist) * curveOffset;
    const perpY = (dx / dist) * curveOffset;

    ctx.strokeStyle = `rgba(216, 189, 131, ${0.22 * proximity})`;
    ctx.lineWidth = 1 + proximity * 1.6;
    ctx.beginPath();
    ctx.moveTo(lx, ly);
    ctx.quadraticCurveTo(midX + perpX, midY + perpY, bhX, bhY);
    ctx.stroke();

    // Subtle Einstein ring photon halo around black hole boundary
    const haloR = 68 + proximity * 26;
    const bhGlow = ctx.createRadialGradient(bhX, bhY, 22, bhX, bhY, haloR);
    bhGlow.addColorStop(0, `rgba(216, 189, 131, ${0.22 * proximity})`);
    bhGlow.addColorStop(0.55, `rgba(118, 97, 143, ${0.12 * proximity})`);
    bhGlow.addColorStop(1, 'rgba(8, 8, 11, 0)');
    ctx.fillStyle = bhGlow;
    ctx.beginPath();
    ctx.arc(bhX, bhY, haloR, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }

  private renderDeepSeaLight(
    ctx: CanvasRenderingContext2D,
    lx: number,
    ly: number
  ): void {
    const infR = this.config.influenceRadius;
    const outerR = infR * 2.2;
    const innerR = infR * 0.68;

    ctx.save();
    ctx.globalCompositeOperation = 'lighter';

    const speed = Math.hypot(this.pointerVX, this.pointerVY);
    if (speed > 1.2) {
      const tailX = lx - this.pointerVX * 2.6;
      const tailY = ly - this.pointerVY * 2.6;
      const wakeGrad = ctx.createRadialGradient(
        tailX,
        tailY,
        2,
        tailX,
        tailY,
        infR * 1.45
      );
      wakeGrad.addColorStop(0, 'rgba(216, 189, 131, 0.08)');
      wakeGrad.addColorStop(0.5, 'rgba(118, 97, 143, 0.04)');
      wakeGrad.addColorStop(1, 'rgba(8, 8, 11, 0)');
      ctx.fillStyle = wakeGrad;
      ctx.beginPath();
      ctx.arc(tailX, tailY, infR * 1.45, 0, Math.PI * 2);
      ctx.fill();
    }

    const outerGrad = ctx.createRadialGradient(lx, ly, 4, lx, ly, outerR);
    outerGrad.addColorStop(0, 'rgba(243, 239, 232, 0.16)');
    outerGrad.addColorStop(0.28, 'rgba(216, 189, 131, 0.09)');
    outerGrad.addColorStop(0.62, 'rgba(118, 97, 143, 0.035)');
    outerGrad.addColorStop(1, 'rgba(8, 8, 11, 0)');
    ctx.fillStyle = outerGrad;
    ctx.beginPath();
    ctx.arc(lx, ly, outerR, 0, Math.PI * 2);
    ctx.fill();

    const innerGrad = ctx.createRadialGradient(lx, ly, 0, lx, ly, innerR);
    innerGrad.addColorStop(0, 'rgba(255, 252, 245, 0.36)');
    innerGrad.addColorStop(0.35, 'rgba(216, 189, 131, 0.15)');
    innerGrad.addColorStop(1, 'rgba(8, 8, 11, 0)');
    ctx.fillStyle = innerGrad;
    ctx.beginPath();
    ctx.arc(lx, ly, innerR, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = 'rgba(255, 252, 245, 0.9)';
    ctx.beginPath();
    ctx.arc(lx, ly, 2.2, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
  }
}
