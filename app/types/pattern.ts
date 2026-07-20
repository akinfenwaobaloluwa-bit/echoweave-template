// 📁 File: src/types/pattern.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Represents a single pattern element to be rendered on canvas
 */
export interface PatternElement {
    x: number;
    y: number;
    width?: number;
    height?: number;
    radius?: number;
    color: string;
    opacity: number;
    rotation?: number;
    type: 'circle' | 'square' | 'diamond' | 'stripe' | 'block';
}

/**
 * Represents pattern data for a specific textile type
 */
export interface PatternData {
    elements: PatternElement[];
    type: 'kente' | 'adire' | 'aso-oke' | 'tribal';
    timestamp: number;
}

/**
 * Color palette definition
 */
export interface ColorPalette {
    name: string;
    id: 'adire-indigo' | 'kente-gold' | 'ankara-vibrant' | 'sunset-earth' | 'neon-pulse';
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
}

/**
 * Pattern type definition
 */
export interface PatternType {
    name: string;
    id: 'kente' | 'adire' | 'aso-oke' | 'tribal';
    description: string;
    icon: string;
}

/**
 * Audio frequency data
 */
export interface FrequencyData {
    bass: number;      // 0-255: Low frequencies (60-250 Hz)
    lowMid: number;    // 0-255: Low-mid frequencies (250-500 Hz)
    mid: number;       // 0-255: Mid frequencies (500-2000 Hz)
    highMid: number;   // 0-255: High-mid frequencies (2000-4000 Hz)
    treble: number;    // 0-255: High frequencies (4000+ Hz)
    volume: number;    // 0-255: Overall volume
    peak: number;      // 0-255: Peak frequency
}

/**
 * Canvas rendering context
 */
export interface CanvasRenderContext {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    width: number;
    height: number;
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
