// 📁 File: src/lib/patternAlgorithms.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { PatternElement } from '@/app/types/pattern';
import { ColorPalette } from '@/app/types/pattern'

/**
 * Audio data for pattern generation
 */
export interface AudioReactivity {
    volume: number;      // 0-255
    bass: number;        // 0-255
    treble: number;      // 0-255
    pitch: number;       // 0-255
}

/**
 * Generate Adire pattern (circular motifs from Nigeria)
 * Adire patterns are characterized by circular, resist-dyed motifs
 */
export const generateAdirePattern = (
    width: number,
    height: number,
    audio: AudioReactivity,
    palette: ColorPalette
): PatternElement[] => {
    const elements: PatternElement[] = [];

    // Map audio to visual parameters
    const baseSpacing = 40 + (audio.bass / 255) * 30;
    const baseRadius = 12 + (audio.treble / 255) * 15;
    const opacity = Math.min(1, audio.volume / 255 + 0.3);
    const rotation = (audio.pitch / 255) * Math.PI * 2;

    // Create grid of circular motifs
    for (let y = 0; y < height; y += baseSpacing) {
        for (let x = 0; x < width; x += baseSpacing) {
            // Offset every other row for staggered effect
            const offsetX = (Math.floor(y / baseSpacing) % 2) * (baseSpacing / 2);

            // Primary circle
            elements.push({
                x: x + offsetX,
                y: y,
                radius: baseRadius,
                color: palette.primary,
                opacity: opacity,
                rotation: rotation,
                type: 'circle',
            });

            // Secondary accent circles (smaller)
            if (audio.volume > 100) {
                elements.push({
                    x: x + offsetX + baseRadius / 2,
                    y: y,
                    radius: baseRadius * 0.4,
                    color: palette.accent,
                    opacity: opacity * 0.6,
                    rotation: rotation,
                    type: 'circle',
                });

                elements.push({
                    x: x + offsetX - baseRadius / 2,
                    y: y,
                    radius: baseRadius * 0.4,
                    color: palette.accent,
                    opacity: opacity * 0.6,
                    rotation: rotation,
                    type: 'circle',
                });
            }
        }
    }

    return elements;
};

/**
 * Generate Kente pattern (repeating blocks from Ghana)
 * Kente patterns are characterized by rectangular blocks of color
 */
export const generateKentePattern = (
    width: number,
    height: number,
    audio: AudioReactivity,
    palette: ColorPalette
): PatternElement[] => {
    const elements: PatternElement[] = [];

    // Map audio to visual parameters
    const blockSize = 40 + (audio.bass / 255) * 40;
    const opacity = Math.min(1, audio.volume / 255 + 0.3);
    const rotation = (audio.treble / 255) * Math.PI * 0.5;

    const colors = [palette.primary, palette.secondary, palette.accent];

    // Create grid of colored blocks
    for (let y = 0; y < height; y += blockSize) {
        for (let x = 0; x < width; x += blockSize) {
            const colorIndex = (Math.floor(x / blockSize) + Math.floor(y / blockSize)) % 3;
            const color = colors[colorIndex];

            // Main block
            elements.push({
                x: x,
                y: y,
                width: blockSize,
                height: blockSize,
                color: color,
                opacity: opacity,
                rotation: rotation,
                type: 'square',
            });

            // Add inner pattern if volume is high
            if (audio.volume > 120) {
                const innerSize = blockSize * 0.3;
                elements.push({
                    x: x + blockSize / 2,
                    y: y + blockSize / 2,
                    width: innerSize,
                    height: innerSize,
                    color: palette.background,
                    opacity: opacity * 0.5,
                    rotation: rotation,
                    type: 'square',
                });
            }
        }
    }

    return elements;
};

/**
 * Generate Aso Oke pattern (parallel stripes from Yoruba)
 * Aso Oke patterns are characterized by parallel stripes
 */
export const generateAsoOkePattern = (
    width: number,
    height: number,
    audio: AudioReactivity,
    palette: ColorPalette
): PatternElement[] => {
    const elements: PatternElement[] = [];

    // Map audio to visual parameters
    const stripeWidth = 15 + (audio.bass / 255) * 20;
    const opacity = Math.min(1, audio.volume / 255 + 0.3);
    const rotation = (audio.treble / 255) * Math.PI * 2;

    const colors = [palette.primary, palette.secondary];

    // Create parallel stripes
    for (let x = -width; x < width * 2; x += stripeWidth * 2) {
        for (let colorIdx = 0; colorIdx < 2; colorIdx++) {
            elements.push({
                x: x + colorIdx * stripeWidth,
                y: -height,
                width: stripeWidth,
                height: height * 3,
                color: colors[colorIdx],
                opacity: opacity,
                rotation: rotation,
                type: 'square',
            });
        }
    }

    return elements;
};

/**
 * Generate Tribal pattern (geometric diamonds)
 * Tribal patterns are characterized by geometric shapes like diamonds
 */
export const generateTribalPattern = (
    width: number,
    height: number,
    audio: AudioReactivity,
    palette: ColorPalette
): PatternElement[] => {
    const elements: PatternElement[] = [];

    // Map audio to visual parameters
    const spacing = 50 + (audio.bass / 255) * 30;
    const size = 15 + (audio.treble / 255) * 20;
    const opacity = Math.min(1, audio.volume / 255 + 0.3);
    const rotation = (audio.pitch / 255) * Math.PI * 2;

    const colors = [palette.primary, palette.accent, palette.secondary];

    // Create grid of diamonds
    for (let y = 0; y < height; y += spacing) {
        for (let x = 0; x < width; x += spacing) {
            const colorIndex = (Math.floor(x / spacing) + Math.floor(y / spacing)) % 3;

            // Main diamond
            elements.push({
                x: x,
                y: y,
                width: size,
                height: size,
                color: colors[colorIndex],
                opacity: opacity,
                rotation: rotation,
                type: 'diamond',
            });

            // Inner diamond (if volume high)
            if (audio.volume > 100) {
                elements.push({
                    x: x,
                    y: y,
                    width: size * 0.5,
                    height: size * 0.5,
                    color: palette.background,
                    opacity: opacity * 0.4,
                    rotation: rotation,
                    type: 'diamond',
                });
            }
        }
    }

    return elements;
};

/**
 * Render pattern elements to canvas
 */
export const renderPatternElements = (
    ctx: CanvasRenderingContext2D,
    elements: PatternElement[],
    canvasWidth: number,
    canvasHeight: number
) => {
    elements.forEach((element) => {
        ctx.save();

        // Apply transformations
        ctx.translate(element.x, element.y);
        if (element.rotation) {
            ctx.rotate(element.rotation);
        }

        // Set style
        ctx.fillStyle = element.color;
        ctx.globalAlpha = element.opacity;

        // Draw based on type
        switch (element.type) {
            case 'circle':
                if (element.radius) {
                    ctx.beginPath();
                    ctx.arc(0, 0, element.radius, 0, Math.PI * 2);
                    ctx.fill();
                }
                break;

            case 'square':
                if (element.width && element.height) {
                    ctx.fillRect(-element.width / 2, -element.height / 2, element.width, element.height);
                }
                break;

            case 'diamond':
                if (element.width && element.height) {
                    ctx.beginPath();
                    ctx.moveTo(0, -element.height / 2);
                    ctx.lineTo(element.width / 2, 0);
                    ctx.lineTo(0, element.height / 2);
                    ctx.lineTo(-element.width / 2, 0);
                    ctx.closePath();
                    ctx.fill();
                }
                break;

            case 'stripe':
                if (element.width && element.height) {
                    ctx.fillRect(0, 0, element.width, element.height);
                }
                break;

            case 'block':
                if (element.width && element.height) {
                    ctx.fillRect(0, 0, element.width, element.height);
                }
                break;
        }

        ctx.restore();
    });
};

/**
 * Animate pattern elements based on time
 */
export const animatePatternElements = (
    elements: PatternElement[],
    time: number,
    intensity: number = 1
): PatternElement[] => {
    return elements.map((element) => ({
        ...element,
        opacity: element.opacity * (0.7 + Math.sin(time * 0.01 + element.x) * 0.3 * intensity),
        rotation: (element.rotation || 0) + Math.sin(time * 0.001) * 0.1 * intensity,
    }));
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
