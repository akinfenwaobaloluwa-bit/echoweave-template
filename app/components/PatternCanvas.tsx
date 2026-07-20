// 📁 File: src/components/PatternCanvas.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { useEffect, useRef } from 'react';
import { useEchoStore } from '@/app/store/useEchoStore';
import { getPalette } from '@/app/lib/palettes';

/**
 * PatternCanvas component - renders the animated textile patterns
 * This is the central visual element where patterns are displayed and updated in real-time
 */
export const PatternCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  const { patternType, palette, audioData } = useEchoStore();

  /**
   * Initialize canvas and set up rendering loop
   */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to match container
    const updateCanvasSize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * window.devicePixelRatio;
      canvas.height = rect.height * window.devicePixelRatio;
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    /**
     * Main animation loop - renders pattern based on audio data
     */
    const animate = () => {
      const paletteColors = getPalette(palette);

      // Clear canvas with background color
      ctx.fillStyle = paletteColors.background;
      ctx.fillRect(0, 0, canvas.width / window.devicePixelRatio, canvas.height / window.devicePixelRatio);

      // Draw pattern based on type
      drawPattern(ctx, canvas, paletteColors);

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [patternType, palette]);

  /**
   * Draw pattern based on pattern type and audio data
   */
  const drawPattern = (
    ctx: CanvasRenderingContext2D,
    canvas: HTMLCanvasElement,
    paletteColors: any
  ) => {
    const width = canvas.width / window.devicePixelRatio;
    const height = canvas.height / window.devicePixelRatio;
    const centerX = width / 2;
    const centerY = height / 2;

    // Get audio values (0-255)
    const volume = audioData.volume || 50;
    const bass = audioData.bass || 50;
    const treble = audioData.treble || 50;

    // Map audio values to visual parameters
    const scale = 0.5 + (bass / 255) * 1.5;
    const rotation = (treble / 255) * Math.PI * 2;
    const opacity = Math.min(1, volume / 255 + 0.3);

    ctx.save();
    ctx.globalAlpha = opacity;

    switch (patternType) {
      case 'adire':
        drawAdirePattern(ctx, width, height, paletteColors, scale, rotation);
        break;
      case 'kente':
        drawKentePattern(ctx, width, height, paletteColors, scale, rotation);
        break;
      case 'aso-oke':
        drawAsoOkePattern(ctx, width, height, paletteColors, scale, rotation);
        break;
      case 'tribal':
        drawTribalPattern(ctx, width, height, paletteColors, scale, rotation);
        break;
    }

    ctx.restore();
  };

  /**
   * Draw Adire pattern (circular motifs)
   */
  const drawAdirePattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: any,
    scale: number,
    rotation: number
  ) => {
    const spacing = 40 * scale;
    const radius = 15 * scale;

    ctx.fillStyle = colors.primary;

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        const offsetX = (y / spacing) % 2 === 0 ? 0 : spacing / 2;

        ctx.save();
        ctx.translate(x + offsetX, y);
        ctx.rotate(rotation);

        ctx.beginPath();
        ctx.arc(0, 0, radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }
    }
  };

  /**
   * Draw Kente pattern (repeating blocks)
   */
  const drawKentePattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: any,
    scale: number,
    rotation: number
  ) => {
    const blockSize = 50 * scale;
    const colors_array = [colors.primary, colors.secondary, colors.accent];

    for (let y = 0; y < height; y += blockSize) {
      for (let x = 0; x < width; x += blockSize) {
        const colorIndex = ((Math.floor(x / blockSize) + Math.floor(y / blockSize)) % 3);
        ctx.fillStyle = colors_array[colorIndex];

        ctx.save();
        ctx.translate(x + blockSize / 2, y + blockSize / 2);
        ctx.rotate(rotation);
        ctx.fillRect(-blockSize / 2, -blockSize / 2, blockSize, blockSize);
        ctx.restore();
      }
    }
  };

  /**
   * Draw Aso Oke pattern (parallel stripes)
   */
  const drawAsoOkePattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: any,
    scale: number,
    rotation: number
  ) => {
    const stripeWidth = 20 * scale;
    const colors_array = [colors.primary, colors.secondary];

    ctx.save();
    ctx.translate(width / 2, height / 2);
    ctx.rotate(rotation);

    for (let x = -width; x < width; x += stripeWidth * 2) {
      ctx.fillStyle = colors_array[Math.floor((x / stripeWidth) % 2)];
      ctx.fillRect(x, -height, stripeWidth, height * 2);
    }

    ctx.restore();
  };

  /**
   * Draw Tribal pattern (diamonds)
   */
  const drawTribalPattern = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
    colors: any,
    scale: number,
    rotation: number
  ) => {
    const spacing = 50 * scale;
    const size = 20 * scale;

    ctx.fillStyle = colors.primary;
    ctx.strokeStyle = colors.secondary;
    ctx.lineWidth = 2;

    for (let y = 0; y < height; y += spacing) {
      for (let x = 0; x < width; x += spacing) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(rotation);

        // Draw diamond
        ctx.beginPath();
        ctx.moveTo(0, -size);
        ctx.lineTo(size, 0);
        ctx.lineTo(0, size);
        ctx.lineTo(-size, 0);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
      }
    }
  };

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <canvas
        ref={canvasRef}
        className="w-full h-full from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
      />
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
