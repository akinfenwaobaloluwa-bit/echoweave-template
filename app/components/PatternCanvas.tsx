'use client';

import { useEffect, useRef } from 'react';
import { useEchoStore } from '@/app/store/useEchoStore';
import { getPalette } from '@/app/lib/palettes';
import { createFallbackAudioFeatures } from '@/app/lib/audioUtils';
import { AudioFeatures, ColorPalette } from '@/app/types/pattern';

type PatternType = 'kente' | 'adire' | 'aso-oke' | 'tribal';

export const PatternCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);
  const transitionRef = useRef({
    current: 'adire' as PatternType,
    previous: null as PatternType | null,
    startedAt: 0,
  });

  const { patternType, palette, audioFeatures, audioData } = useEchoStore();
  const audioFeaturesRef = useRef<AudioFeatures | null>(audioFeatures);
  const audioDataRef = useRef(audioData);
  const paletteRef = useRef(palette);

  useEffect(() => {
    const transition = transitionRef.current;
    if (transition.current !== patternType) {
      transition.previous = transition.current;
      transition.current = patternType;
      transition.startedAt = performance.now();
    }
  }, [patternType]);

  useEffect(() => {
    audioFeaturesRef.current = audioFeatures;
    audioDataRef.current = audioData;
  }, [audioFeatures, audioData]);

  useEffect(() => {
    paletteRef.current = palette;
  }, [palette]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: false });
    if (!ctx) return;

    const resizeCanvas = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.max(1, Math.floor(rect.width * dpr));
      canvas.height = Math.max(1, Math.floor(rect.height * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const render = (time: number) => {
      const rect = canvas.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;
      const colors = getPalette(paletteRef.current);
      const currentAudioData = audioDataRef.current;
      const features = audioFeaturesRef.current ?? featuresFromLiveAudio(currentAudioData);
      const transition = transitionRef.current;
      const progress = Math.min(1, (time - transition.startedAt) / 650);
      const eased = easeInOut(progress);
      const currentVariant = getPatternVariant(features, transition.current);
      const previousVariant = transition.previous ? getPatternVariant(features, transition.previous) : 0;

      ctx.clearRect(0, 0, width, height);
      drawBackdrop(ctx, width, height, colors, features, time);

      if (transition.previous && progress < 1) {
        ctx.save();
        ctx.globalAlpha = 1 - eased;
        drawPattern(ctx, transition.previous, width, height, colors, features, time, 1 - eased, previousVariant);
        ctx.restore();
      }

      ctx.save();
      ctx.globalAlpha = transition.previous ? eased : 1;
      drawPattern(ctx, transition.current, width, height, colors, features, time, eased, currentVariant);
      ctx.restore();

      if (progress >= 1) {
        transition.previous = null;
      }

      animationRef.current = requestAnimationFrame(render);
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    animationRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700">
      <canvas
        ref={canvasRef}
        className="w-full h-full from-gray-50 to-gray-100 dark:from-slate-900 dark:to-slate-800"
      />
    </div>
  );
};

const drawPattern = (
  ctx: CanvasRenderingContext2D,
  type: PatternType,
  width: number,
  height: number,
  colors: ColorPalette,
  features: AudioFeatures,
  time: number,
  transition: number,
  variant: number
) => {
  switch (type) {
    case 'adire':
      drawAdire(ctx, width, height, colors, features, time, transition, variant);
      break;
    case 'aso-oke':
      drawAsoOke(ctx, width, height, colors, features, time, transition, variant);
      break;
    case 'kente':
      drawKente(ctx, width, height, colors, features, time, transition, variant);
      break;
    case 'tribal':
      drawTribal(ctx, width, height, colors, features, time, transition, variant);
      break;
  }
};

const getPatternVariant = (features: AudioFeatures, type: PatternType): number => {
  const typeHash = Array.from(type).reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return Math.abs(Math.round(features.seed * 23 + typeHash * 7)) % 5;
};

const createAudioSeed = (base: number, volume: number, treble: number, bass: number): number => {
  const normalizedVolume = clamp(volume / 255, 0, 1);
  const normalizedTreble = clamp(treble / 255, 0, 1);
  const normalizedBass = clamp(bass / 255, 0, 1);
  return Math.abs(Math.round(base + normalizedVolume * 312 + normalizedTreble * 187 + normalizedBass * 233));
};

const drawBackdrop = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: ColorPalette,
  features: AudioFeatures,
  time: number
) => {
  const pulse = 0.08 * beatPulse(features, time);
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, colors.background);
  gradient.addColorStop(0.45 + pulse, mixColor(colors.background, colors.primary, 0.2 + features.loudness * 0.16));
  gradient.addColorStop(1, mixColor(colors.background, colors.accent, 0.12 + features.overallEnergy * 0.14));
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
};

const drawAdire = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: ColorPalette,
  features: AudioFeatures,
  time: number,
  transition: number,
  variant: number
) => {
  const tempoDensity = normalizeTempo(features.tempo);
  const spacing = lerp(86, 42, tempoDensity);
  const bassWeight = bandAverage(features, 0, 7);
  const treble = bandAverage(features, 22, 32);
  const radius = lerp(12, 34, bassWeight);
  const flow = time * 0.00018 * lerp(0.6, 1.8, features.dynamicChanges);
  const rows = Math.ceil(height / spacing) + 3;
  const cols = Math.ceil(width / spacing) + 3;
  const variantShift = variant * 0.18;

  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  for (let yIndex = -1; yIndex < rows; yIndex++) {
    for (let xIndex = -1; xIndex < cols; xIndex++) {
      const n = noise(features.seed, xIndex, yIndex);
      const x = xIndex * spacing + ((yIndex % 2) * spacing) / 2 + Math.sin(flow * 4 + yIndex + variantShift) * 10;
      const y = yIndex * spacing + Math.cos(flow * 3 + xIndex + variantShift) * 8;
      const breathe = 1 + Math.sin(time * 0.0014 + n * 6.28 + variantShift) * 0.08 + beatPulse(features, time) * 0.1;
      const motifRadius = radius * lerp(0.72, 1.25, n) * breathe * lerp(0.94, 1.04, transition) * lerp(0.9, 1.08, variant);

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.sin(flow + n * 8) * 0.45);
      ctx.strokeStyle = mixColor(colors.primary, colors.secondary, 0.18 + treble * 0.24);
      ctx.fillStyle = rgba(mixColor(colors.primary, colors.accent, n * 0.3), 0.28 + features.loudness * 0.28);
      ctx.lineWidth = 1.5 + bassWeight * 5;

      ctx.beginPath();
      for (let i = 0; i <= 64; i++) {
        const angle = (i / 64) * Math.PI * 2;
        const ripple = 1 + Math.sin(angle * 4 + flow * 20 + n * 10) * (0.07 + treble * 0.08);
        const px = Math.cos(angle) * motifRadius * ripple;
        const py = Math.sin(angle) * motifRadius * ripple;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.strokeStyle = rgba(colors.secondary, 0.26 + features.harmonicRichness * 0.4);
      ctx.lineWidth = 1 + treble * 2.2;
      for (let ring = 0.45; ring <= 0.82; ring += 0.18) {
        ctx.beginPath();
        ctx.arc(0, 0, motifRadius * ring, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }
  }
};

const drawAsoOke = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: ColorPalette,
  features: AudioFeatures,
  time: number,
  transition: number,
  variant: number
) => {
  const bassWeight = bandAverage(features, 0, 7);
  const treble = bandAverage(features, 22, 32);
  const stripeWidth = lerp(28, 58, bassWeight);
  const threadCount = Math.ceil(width / stripeWidth) + 5 + variant;
  const drift = Math.sin(time * 0.0006 + variant * 0.75) * stripeWidth * 0.2;
  const pulse = beatPulse(features, time);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(Math.sin(time * 0.00012) * 0.035 * features.rhythmComplexity);
  ctx.translate(-width / 2, -height / 2);

  for (let i = -2; i < threadCount; i++) {
    const n = noise(features.seed + 11, i, 2);
    const x = i * stripeWidth + drift;
    const stripeColor = i % 3 === 0 ? colors.primary : i % 3 === 1 ? colors.secondary : colors.accent;
    const shade = mixColor(stripeColor, colors.background, 0.16 + n * 0.12);

    ctx.fillStyle = shade;
    ctx.globalAlpha = 0.76 + features.loudness * 0.18;
    ctx.fillRect(x, -height * 0.1, stripeWidth * lerp(0.72, 1.18, n), height * 1.2);

    ctx.strokeStyle = rgba(colors.text, 0.12 + treble * 0.18);
    ctx.lineWidth = 1;
    const fineThreads = Math.max(3, Math.round(lerp(3, 9, treble)));
    for (let t = 1; t < fineThreads; t++) {
      const threadX = x + (stripeWidth / fineThreads) * t + Math.sin(time * 0.001 + t + i) * (0.6 + pulse);
      ctx.beginPath();
      ctx.moveTo(threadX, 0);
      ctx.lineTo(threadX + Math.sin(i + t) * 4, height);
      ctx.stroke();
    }
  }

  ctx.globalAlpha = 0.18 + features.harmonicRichness * 0.24;
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 1 + treble * 2;
  const horizontalGap = lerp(22, 12, normalizeTempo(features.tempo));
  for (let y = 0; y < height; y += horizontalGap) {
    ctx.beginPath();
    ctx.moveTo(0, y + Math.sin(time * 0.001 + y) * 2 * transition);
    ctx.lineTo(width, y + Math.cos(time * 0.001 + y) * 2 * transition);
    ctx.stroke();
  }

  ctx.restore();
};

const drawKente = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: ColorPalette,
  features: AudioFeatures,
  time: number,
  transition: number,
  variant: number
) => {
  const tempoDensity = normalizeTempo(features.tempo);
  const cell = lerp(92, 46, tempoDensity);
  const bassWeight = bandAverage(features, 0, 7);
  const treble = bandAverage(features, 22, 32);
  const pulse = beatPulse(features, time);
  const variantShift = variant * 0.25;
  const colorsList = [colors.primary, colors.secondary, colors.accent, '#111827', '#fbbf24'];

  for (let y = -cell; y < height + cell; y += cell) {
    for (let x = -cell; x < width + cell; x += cell) {
      const xi = Math.floor((x + variantShift * 10) / cell);
      const yi = Math.floor((y + variantShift * 10) / cell);
      const n = noise(features.seed + 23 + variant * 17, xi, yi);
      const color = colorsList[(xi + yi + Math.floor(n * colorsList.length)) % colorsList.length];
      const inset = lerp(4, 12, treble) + pulse * 3;

      ctx.save();
      ctx.translate(x + cell / 2, y + cell / 2);
      ctx.scale(lerp(0.96, 1.02, transition), lerp(0.96, 1.02, transition));
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.82 + features.loudness * 0.16;
      ctx.fillRect(-cell / 2, -cell / 2, cell, cell);

      ctx.fillStyle = mixColor(color, colors.background, 0.38);
      ctx.globalAlpha = 0.52 + features.beatIntensity * 0.22;
      ctx.fillRect(-cell / 2 + inset, -cell / 2 + inset, cell - inset * 2, cell - inset * 2);

      ctx.strokeStyle = rgba(colors.text, 0.18 + features.harmonicRichness * 0.22);
      ctx.lineWidth = 1 + bassWeight * 3;
      const stripeCount = Math.max(2, Math.round(lerp(2, 6, features.rhythmComplexity)));
      for (let i = 1; i < stripeCount; i++) {
        const pos = -cell / 2 + (cell / stripeCount) * i;
        ctx.beginPath();
        ctx.moveTo(pos, -cell / 2);
        ctx.lineTo(pos + Math.sin(time * 0.001 + i) * 2, cell / 2);
        ctx.stroke();
      }

      ctx.restore();
    }
  }
};

const drawTribal = (
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  colors: ColorPalette,
  features: AudioFeatures,
  time: number,
  transition: number,
  variant: number
) => {
  const tempoDensity = normalizeTempo(features.tempo);
  const spacing = lerp(88, 42, tempoDensity);
  const bassWeight = bandAverage(features, 0, 7);
  const treble = bandAverage(features, 22, 32);
  const size = lerp(16, 34, bassWeight);
  const variantOffset = variant * 0.2;
  const rotation = Math.sin(time * 0.00035 + variantOffset) * 0.22 * features.dynamicChanges;
  const pulse = beatPulse(features, time);

  ctx.save();
  ctx.translate(width / 2, height / 2);
  ctx.rotate(rotation);
  ctx.translate(-width / 2, -height / 2);

  for (let y = -spacing; y < height + spacing; y += spacing) {
    for (let x = -spacing; x < width + spacing; x += spacing) {
      const xi = Math.floor(x / spacing);
      const yi = Math.floor(y / spacing);
      const n = noise(features.seed + 37, xi, yi);
      const motifSize = size * lerp(0.8, 1.35, n) * (1 + pulse * 0.14);
      const motifColor = n > 0.66 ? colors.accent : n > 0.33 ? colors.primary : colors.secondary;

      ctx.save();
      ctx.translate(x + Math.sin(time * 0.001 + yi + variantOffset) * 3, y + Math.cos(time * 0.001 + xi + variantOffset) * 3);
      ctx.rotate((Math.PI / 4) * Math.round(n * 4) + Math.sin(time * 0.001 + n + variantOffset) * 0.05);
      ctx.fillStyle = motifColor;
      ctx.strokeStyle = rgba(colors.text, 0.2 + treble * 0.26);
      ctx.lineWidth = 1.2 + bassWeight * 2.6;
      ctx.globalAlpha = 0.78 + features.overallEnergy * 0.18;

      const motifScale = 1 + variantOffset * 0.15;
      drawDiamond(ctx, 0, 0, motifSize * motifScale, motifSize * motifScale);
      ctx.fill();
      ctx.stroke();

      if (features.harmonicRichness > 0.25) {
        ctx.globalAlpha = 0.38 + features.harmonicRichness * 0.28;
        drawTriangle(ctx, 0, -motifSize * 0.78, motifSize * lerp(0.42, 0.72, treble) * motifScale);
        ctx.fill();
        drawTriangle(ctx, 0, motifSize * 0.78, motifSize * lerp(0.42, 0.72, treble) * motifScale, Math.PI);
        ctx.fill();
      }

      ctx.restore();
    }
  }

  ctx.restore();
};

const featuresFromLiveAudio = (audioData: ReturnType<typeof useEchoStore.getState>['audioData']): AudioFeatures => {
  const fallback = createFallbackAudioFeatures();
  if (!audioData.frequencies) return fallback;

  const spectrum = Array.from(audioData.frequencies).map((value) => value / 255);
  const bass = audioData.bass / 255;
  const treble = audioData.treble / 255;
  const seedBase = 911 + Math.round(audioData.pitch);

  return {
    ...fallback,
    tempo: Math.round(80 + bass * 70),
    loudness: audioData.volume / 255,
    beatIntensity: bass,
    rhythmComplexity: Math.min(1, Math.abs(treble - bass) + 0.25),
    pitchRange: audioData.pitch / 255,
    frequencySpectrum: spectrum.length >= 32 ? spectrum.slice(0, 32) : fallback.frequencySpectrum,
    spectralCentroid: audioData.pitch / 255,
    harmonicRichness: treble,
    dynamicChanges: Math.min(1, (audioData.volume / 255) * 0.8),
    overallEnergy: Math.min(1, (audioData.volume / 255) * 0.55 + bass * 0.45),
    seed: createAudioSeed(seedBase, audioData.volume, audioData.treble, audioData.bass),
  };
};

const drawDiamond = (ctx: CanvasRenderingContext2D, x: number, y: number, width: number, height: number) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  ctx.moveTo(0, -height / 2);
  ctx.lineTo(width / 2, 0);
  ctx.lineTo(0, height / 2);
  ctx.lineTo(-width / 2, 0);
  ctx.closePath();
  ctx.restore();
};

const drawTriangle = (ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation = 0) => {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  ctx.moveTo(0, -size / 2);
  ctx.lineTo(size / 2, size / 2);
  ctx.lineTo(-size / 2, size / 2);
  ctx.closePath();
  ctx.restore();
};

const bandAverage = (features: AudioFeatures, start: number, end: number): number => {
  const band = features.frequencySpectrum.slice(start, end);
  return band.length ? band.reduce((sum, value) => sum + value, 0) / band.length : 0;
};

const beatPulse = (features: AudioFeatures, time: number): number => {
  const beatLength = 60000 / Math.max(40, features.tempo);
  const phase = (time % beatLength) / beatLength;
  return Math.pow(1 - phase, 3) * features.beatIntensity;
};

const normalizeTempo = (tempo: number): number => clamp((tempo - 60) / 120, 0, 1);

const noise = (seed: number, x: number, y: number): number => {
  const value = Math.sin(seed * 12.9898 + x * 78.233 + y * 37.719) * 43758.5453;
  return value - Math.floor(value);
};

const easeInOut = (value: number): number => value * value * (3 - 2 * value);

const lerp = (start: number, end: number, amount: number): number => start + (end - start) * amount;

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

const rgba = (color: string, alpha: number): string => {
  const { r, g, b } = hexToRgb(color);
  return `rgba(${r}, ${g}, ${b}, ${clamp(alpha, 0, 1)})`;
};

const mixColor = (first: string, second: string, amount: number): string => {
  const a = hexToRgb(first);
  const b = hexToRgb(second);
  return rgbToHex(
    Math.round(lerp(a.r, b.r, amount)),
    Math.round(lerp(a.g, b.g, amount)),
    Math.round(lerp(a.b, b.b, amount))
  );
};

const hexToRgb = (color?: string | null) => {
  const fallbackHex = '#000000';
  const normalized = (color ?? fallbackHex).replace('#', '').trim();
  const compact = normalized.length === 3 ? normalized.split('').map((value) => value + value).join('') : normalized;
  const hex = compact.padStart(6, '0').slice(0, 6);

  return {
    r: parseInt(hex.slice(0, 2), 16) || 0,
    g: parseInt(hex.slice(2, 4), 16) || 0,
    b: parseInt(hex.slice(4, 6), 16) || 0,
  };
};

const rgbToHex = (r: number, g: number, b: number): string => (
  `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`
);
