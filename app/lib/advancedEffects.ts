// 📁 File: src/lib/advancedEffects.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { FrequencyData } from '@/app/types/pattern';

/**
 * Particle for particle system effects
 */
export interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    life: number;
    maxLife: number;
    size: number;
    color: string;
    opacity: number;
}

/**
 * Particle system for creating dynamic effects
 */
export class ParticleSystem {
    particles: Particle[] = [];
    maxParticles: number = 200;

    constructor(maxParticles: number = 200) {
        this.maxParticles = maxParticles;
    }

    /**
     * Emit particles from a point
     */
    emit(x: number, y: number, count: number, color: string, intensity: number = 1) {
        for (let i = 0; i < count; i++) {
            if (this.particles.length >= this.maxParticles) break;

            const angle = (Math.random() * Math.PI * 2);
            const speed = (Math.random() + 0.5) * intensity;

            this.particles.push({
                x,
                y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                maxLife: 1 + Math.random() * 0.5,
                size: 2 + Math.random() * 4,
                color,
                opacity: 1,
            });
        }
    }

    /**
     * Update particles
     */
    update(deltaTime: number = 0.016) {
        this.particles = this.particles.filter((p) => {
            p.life -= deltaTime / p.maxLife;
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.1; // Gravity
            p.opacity = p.life;

            return p.life > 0;
        });
    }

    /**
     * Render particles to canvas
     */
    render(ctx: CanvasRenderingContext2D) {
        this.particles.forEach((p) => {
            ctx.save();
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        });
    }

    /**
     * Clear all particles
     */
    clear() {
        this.particles = [];
    }
}

/**
 * Beat detection with history
 */
export class BeatDetector {
    history: number[] = [];
    historySize: number = 30;
    threshold: number = 1.5;

    /**
     * Detect beat based on bass frequency
     */
    detectBeat(bass: number): boolean {
        this.history.push(bass);
        if (this.history.length > this.historySize) {
            this.history.shift();
        }

        if (this.history.length < 10) return false;

        const average = this.history.reduce((a, b) => a + b) / this.history.length;
        const variance = this.history.reduce((sum, val) => sum + Math.pow(val - average, 2), 0) / this.history.length;
        const stdDev = Math.sqrt(variance);

        return bass > average + stdDev * this.threshold && bass > 80;
    }

    /**
     * Get beat intensity (0-1)
     */
    getBeatIntensity(bass: number): number {
        if (this.history.length === 0) return 0;

        const average = this.history.reduce((a, b) => a + b) / this.history.length;
        const intensity = Math.min(1, (bass - average) / 100);

        return Math.max(0, intensity);
    }

    /**
     * Reset detector
     */
    reset() {
        this.history = [];
    }
}

/**
 * Create a glow effect around the canvas
 */
export const createGlowEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    color: string,
    intensity: number
) => {
    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, Math.max(width, height));
    gradient.addColorStop(0, color + Math.round(intensity * 255).toString(16).padStart(2, '0'));
    gradient.addColorStop(1, color + '00');

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
};

/**
 * Create a wave effect
 */
export const createWaveEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    time: number,
    frequency: number,
    amplitude: number,
    color: string
) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.beginPath();

    for (let x = 0; x < width; x += 5) {
        const y = height / 2 + Math.sin((x / width) * frequency + time * 0.01) * amplitude;
        if (x === 0) {
            ctx.moveTo(x, y);
        } else {
            ctx.lineTo(x, y);
        }
    }

    ctx.stroke();
};

/**
 * Create a radial burst effect
 */
export const createRadialBurst = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    radius: number,
    rays: number,
    color: string,
    intensity: number
) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 2 * intensity;
    ctx.globalAlpha = intensity;

    for (let i = 0; i < rays; i++) {
        const angle = (i / rays) * Math.PI * 2;
        const endX = centerX + Math.cos(angle) * radius;
        const endY = centerY + Math.sin(angle) * radius;

        ctx.beginPath();
        ctx.moveTo(centerX, centerY);
        ctx.lineTo(endX, endY);
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
};

/**
 * Create a kaleidoscope effect
 */
export const createKaleidoscopeEffect = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    segments: number,
    rotation: number,
    color: string,
    intensity: number
) => {
    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.sqrt(width * width + height * height) / 2;

    ctx.save();
    ctx.translate(centerX, centerY);
    ctx.rotate(rotation);

    for (let i = 0; i < segments; i++) {
        ctx.save();
        ctx.rotate((i / segments) * Math.PI * 2);

        ctx.fillStyle = color;
        ctx.globalAlpha = intensity / segments;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, maxRadius * intensity, 0, Math.PI / segments);
        ctx.lineTo(0, 0);
        ctx.fill();

        ctx.restore();
    }

    ctx.restore();
};

/**
 * Create a ripple effect
 */
export const createRippleEffect = (
    ctx: CanvasRenderingContext2D,
    centerX: number,
    centerY: number,
    time: number,
    speed: number,
    color: string,
    intensity: number
) => {
    const ripples = 5;

    for (let i = 0; i < ripples; i++) {
        const radius = ((time * speed + i * 20) % 200);
        const alpha = Math.max(0, 1 - radius / 200) * intensity;

        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.globalAlpha = alpha;

        ctx.beginPath();
        ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
        ctx.stroke();
    }

    ctx.globalAlpha = 1;
};

/**
 * Apply frequency-based color shift
 */
export const applyFrequencyColorShift = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    frequencyData: FrequencyData
) => {
    // Create a subtle color overlay based on dominant frequency
    const hue = (frequencyData.peak / 255) * 360;
    const saturation = (frequencyData.volume / 255) * 100;
    const lightness = 50;

    const color = `hsla(${hue}, ${saturation}%, ${lightness}%, 0.1)`;
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, width, height);
};

/**
 * Create a spectrum analyzer visualization
 */
export const drawSpectrumAnalyzer = (
    ctx: CanvasRenderingContext2D,
    frequencyData: FrequencyData,
    x: number,
    y: number,
    width: number,
    height: number,
    color: string
) => {
    const frequencies = [
        frequencyData.bass,
        frequencyData.lowMid,
        frequencyData.mid,
        frequencyData.highMid,
        frequencyData.treble,
    ];

    const barWidth = width / frequencies.length;

    frequencies.forEach((freq, index) => {
        const barHeight = (freq / 255) * height;
        const barX = x + index * barWidth;
        const barY = y + height - barHeight;

        ctx.fillStyle = color;
        ctx.globalAlpha = freq / 255;
        ctx.fillRect(barX, barY, barWidth - 2, barHeight);
    });

    ctx.globalAlpha = 1;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
