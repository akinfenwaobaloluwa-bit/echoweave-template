// 📁 File: src/lib/palettes.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { ColorPalette } from '@/app/types/pattern';

const fallbackPalette: ColorPalette = {
    name: 'Adire Indigo',
    id: 'adire-indigo',
    primary: '#1e3a8a',
    secondary: '#ffffff',
    accent: '#60a5fa',
    background: '#0f172a',
    text: '#f3f4f6',
};

/**
 * Color palettes inspired by African textiles
 * Each palette includes primary, secondary, accent, background, and text colors
 */
export const colorPalettes: Record<string, ColorPalette> = {
    'adire-indigo': {
        name: 'Adire Indigo',
        id: 'adire-indigo',
        primary: '#1e3a8a',      // Deep indigo
        secondary: '#ffffff',     // White
        accent: '#60a5fa',        // Light blue
        background: '#0f172a',    // Very dark blue
        text: '#f3f4f6',          // Light gray
    },
    'kente-gold': {
        name: 'Kente Gold',
        id: 'kente-gold',
        primary: '#d97706',       // Gold
        secondary: '#1e3a8a',     // Deep blue
        accent: '#fbbf24',        // Light gold
        background: '#0f172a',    // Very dark blue
        text: '#fef3c7',          // Cream
    },
    'ankara-vibrant': {
        name: 'Ankara Vibrant',
        id: 'ankara-vibrant',
        primary: '#dc2626',       // Red
        secondary: '#d97706',     // Gold
        accent: '#1e3a8a',        // Navy
        background: '#0f172a',    // Very dark blue
        text: '#fef3c7',          // Cream
    },
    'sunset-earth': {
        name: 'Sunset Earth',
        id: 'sunset-earth',
        primary: '#f97316',       // Orange
        secondary: '#92400e',     // Brown
        accent: '#fbbf24',        // Light gold
        background: '#1f2937',    // Dark gray
        text: '#fef3c7',          // Cream
    },
    'neon-pulse': {
        name: 'Neon Pulse',
        id: 'neon-pulse',
        primary: '#06b6d4',       // Cyan
        secondary: '#ec4899',     // Magenta
        accent: '#10b981',        // Green
        background: '#0f172a',    // Very dark blue
        text: '#f3f4f6',          // Light gray
    },
};

/**
 * Get a specific palette by ID
 * @param paletteId - The ID of the palette to retrieve
 * @returns The color palette object
 */
export const getPalette = (paletteId?: string | null): ColorPalette => {
    const palette = colorPalettes[paletteId ?? ''] ?? colorPalettes['adire-indigo'] ?? fallbackPalette;

    return {
        ...fallbackPalette,
        ...palette,
        primary: palette.primary || fallbackPalette.primary,
        secondary: palette.secondary || fallbackPalette.secondary,
        accent: palette.accent || fallbackPalette.accent,
        background: palette.background || fallbackPalette.background,
        text: palette.text || fallbackPalette.text,
    };
};

/**
 * Get all available palettes
 * @returns Array of all color palettes
 */
export const getAllPalettes = (): ColorPalette[] => {
    return Object.values(colorPalettes);
};

/**
 * Generate a color gradient based on palette colors
 * @param palette - The color palette to use
 * @param steps - Number of gradient steps
 * @returns Array of colors representing the gradient
 */
export const generateGradient = (palette: ColorPalette, steps: number = 10): string[] => {
    const colors: string[] = [];
    const startColor = palette.primary;
    const endColor = palette.secondary;

    // Simple linear interpolation between two colors
    for (let i = 0; i < steps; i++) {
        const ratio = i / (steps - 1);
        const r = Math.round(
            parseInt(startColor.slice(1, 3), 16) * (1 - ratio) +
            parseInt(endColor.slice(1, 3), 16) * ratio
        );
        const g = Math.round(
            parseInt(startColor.slice(3, 5), 16) * (1 - ratio) +
            parseInt(endColor.slice(3, 5), 16) * ratio
        );
        const b = Math.round(
            parseInt(startColor.slice(5, 7), 16) * (1 - ratio) +
            parseInt(endColor.slice(5, 7), 16) * ratio
        );

        colors.push(`rgb(${r}, ${g}, ${b})`);
    }

    return colors;
};

/**
 * Adjust color brightness
 * @param color - Hex color code
 * @param percent - Percentage to adjust (-100 to 100)
 * @returns Adjusted hex color
 */
export const adjustBrightness = (color: string, percent: number): string => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) + amt;
    const G = ((num >> 8) & 0x00ff) + amt;
    const B = (num & 0x0000ff) + amt;

    return (
        '#' +
        (
            0x1000000 +
            (R < 255 ? (R < 1 ? 0 : R) : 255) * 0x10000 +
            (G < 255 ? (G < 1 ? 0 : G) : 255) * 0x100 +
            (B < 255 ? (B < 1 ? 0 : B) : 255)
        )
            .toString(16)
            .slice(1)
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
