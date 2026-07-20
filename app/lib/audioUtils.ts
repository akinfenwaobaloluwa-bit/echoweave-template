// 📁 File: src/lib/audioUtils.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { FrequencyData } from '@/app/types/pattern';

/**
 * Analyze frequency data from audio context
 * Breaks down the frequency spectrum into different bands
 */
export const analyzeFrequencies = (dataArray: Uint8Array): FrequencyData => {
    const length = dataArray.length;

    // Define frequency bands
    // Bass: 0-250 Hz (typically first 1/8 of spectrum)
    const bassEnd = Math.floor(length * 0.125);
    const bass = calculateAverage(dataArray, 0, bassEnd);

    // Low-mid: 250-500 Hz
    const lowMidEnd = Math.floor(length * 0.25);
    const lowMid = calculateAverage(dataArray, bassEnd, lowMidEnd);

    // Mid: 500-2000 Hz
    const midEnd = Math.floor(length * 0.5);
    const mid = calculateAverage(dataArray, lowMidEnd, midEnd);

    // High-mid: 2000-4000 Hz
    const highMidEnd = Math.floor(length * 0.75);
    const highMid = calculateAverage(dataArray, midEnd, highMidEnd);

    // Treble: 4000+ Hz
    const treble = calculateAverage(dataArray, highMidEnd, length);

    // Overall volume
    const volume = calculateAverage(dataArray, 0, length);

    // Peak frequency
    let peak = 0;
    let maxValue = 0;
    for (let i = 0; i < length; i++) {
        if (dataArray[i] > maxValue) {
            maxValue = dataArray[i];
            peak = i;
        }
    }

    return {
        bass: Math.round(bass),
        lowMid: Math.round(lowMid),
        mid: Math.round(mid),
        highMid: Math.round(highMid),
        treble: Math.round(treble),
        volume: Math.round(volume),
        peak: Math.round((peak / length) * 255),
    };
};

/**
 * Calculate average value in a range of array
 */
const calculateAverage = (array: Uint8Array, start: number, end: number): number => {
    let sum = 0;
    for (let i = start; i < end; i++) {
        sum += array[i];
    }
    return sum / (end - start);
};

/**
 * Smooth frequency data over time to reduce jitter
 */
export const smoothFrequencyData = (
    current: FrequencyData,
    previous: FrequencyData | null,
    smoothingFactor: number = 0.7
): FrequencyData => {
    if (!previous) return current;

    return {
        bass: Math.round(current.bass * (1 - smoothingFactor) + previous.bass * smoothingFactor),
        lowMid: Math.round(current.lowMid * (1 - smoothingFactor) + previous.lowMid * smoothingFactor),
        mid: Math.round(current.mid * (1 - smoothingFactor) + previous.mid * smoothingFactor),
        highMid: Math.round(current.highMid * (1 - smoothingFactor) + previous.highMid * smoothingFactor),
        treble: Math.round(current.treble * (1 - smoothingFactor) + previous.treble * smoothingFactor),
        volume: Math.round(current.volume * (1 - smoothingFactor) + previous.volume * smoothingFactor),
        peak: Math.round(current.peak * (1 - smoothingFactor) + previous.peak * smoothingFactor),
    };
};

/**
 * Normalize frequency data to 0-255 range
 */
export const normalizeFrequencyData = (data: FrequencyData, min: number = 0, max: number = 255): FrequencyData => {
    return {
        bass: Math.max(min, Math.min(max, data.bass)),
        lowMid: Math.max(min, Math.min(max, data.lowMid)),
        mid: Math.max(min, Math.min(max, data.mid)),
        highMid: Math.max(min, Math.min(max, data.highMid)),
        treble: Math.max(min, Math.min(max, data.treble)),
        volume: Math.max(min, Math.min(max, data.volume)),
        peak: Math.max(min, Math.min(max, data.peak)),
    };
};

/**
 * Detect if there's a beat in the audio
 * Returns true if there's a sudden increase in bass
 */
export const detectBeat = (
    current: FrequencyData,
    previous: FrequencyData | null,
    threshold: number = 1.5
): boolean => {
    if (!previous) return false;

    const bassIncrease = current.bass / (previous.bass || 1);
    return bassIncrease > threshold && current.bass > 100;
};

/**
 * Calculate energy level (0-100) from frequency data
 */
export const calculateEnergyLevel = (data: FrequencyData): number => {
    const weights = {
        bass: 0.3,
        lowMid: 0.2,
        mid: 0.2,
        highMid: 0.15,
        treble: 0.15,
    };

    const energy =
        data.bass * weights.bass +
        data.lowMid * weights.lowMid +
        data.mid * weights.mid +
        data.highMid * weights.highMid +
        data.treble * weights.treble;

    return Math.round((energy / 255) * 100);
};

/**
 * Map frequency data to color based on dominant frequency
 */
export const frequencyToColor = (data: FrequencyData): string => {
    // Determine which frequency band is dominant
    const frequencies = [data.bass, data.lowMid, data.mid, data.highMid, data.treble];
    const maxIndex = frequencies.indexOf(Math.max(...frequencies));

    // Map to color
    const colors = [
        '#8B0000', // Bass: Dark red
        '#FF6347', // Low-mid: Tomato
        '#FFD700', // Mid: Gold
        '#00CED1', // High-mid: Cyan
        '#FF1493', // Treble: Deep pink
    ];

    return colors[maxIndex];
};

/**
 * Create a visualization-friendly representation of frequency data
 */
export const getFrequencyBars = (data: FrequencyData, barCount: number = 5): number[] => {
    return [
        (data.bass / 255) * 100,
        (data.lowMid / 255) * 100,
        (data.mid / 255) * 100,
        (data.highMid / 255) * 100,
        (data.treble / 255) * 100,
    ];
};

/**
 * Calculate pitch from frequency data
 * Returns a note name (C, D, E, etc.)
 */
export const frequencyToPitch = (data: FrequencyData): string => {
    const notes = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

    // Map peak frequency to note
    const noteIndex = Math.round((data.peak / 255) * 11);
    return notes[noteIndex % 12];
};

/**
 * Calculate rotation angle based on frequency data
 */
export const frequencyToRotation = (data: FrequencyData): number => {
    return ((data.peak / 255) * Math.PI * 2);
};

/**
 * Calculate scale factor based on frequency data
 */
export const frequencyToScale = (data: FrequencyData, minScale: number = 0.5, maxScale: number = 2): number => {
    return minScale + ((data.volume / 255) * (maxScale - minScale));
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
