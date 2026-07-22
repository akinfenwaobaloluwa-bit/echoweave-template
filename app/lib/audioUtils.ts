// 📁 File: src/lib/audioUtils.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { AudioFeatures, FrequencyData } from '@/app/types/pattern';

interface AudioSnapshot {
    volume: number;
    bass: number;
    treble: number;
    pitch: number;
    time: number;
    frequencies: number[];
}

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

export const analyzeAudioBuffer = (audioBuffer: AudioBuffer): AudioFeatures => {
    const channel = audioBuffer.getChannelData(0);
    const sampleRate = audioBuffer.sampleRate;
    const duration = audioBuffer.duration;
    const windowSize = 2048;
    const hopSize = 1024;
    const rmsFrames: number[] = [];
    const centroidFrames: number[] = [];
    const spectrumBins = new Array(32).fill(0);
    let zeroCrossings = 0;
    let activeFrames = 0;
    let maxRms = 0;

    for (let start = 0; start < channel.length; start += hopSize) {
        const end = Math.min(start + windowSize, channel.length);
        let sumSquares = 0;
        let frameCrossings = 0;

        for (let i = start; i < end; i++) {
            const sample = channel[i];
            sumSquares += sample * sample;
            if (i > start && Math.sign(sample) !== Math.sign(channel[i - 1])) {
                frameCrossings += 1;
            }
        }

        const frameLength = Math.max(1, end - start);
        const rms = Math.sqrt(sumSquares / frameLength);
        rmsFrames.push(rms);
        maxRms = Math.max(maxRms, rms);
        zeroCrossings += frameCrossings / frameLength;

        let weightedMagnitude = 0;
        let totalMagnitude = 0;
        const binStride = Math.max(1, Math.floor(frameLength / spectrumBins.length));

        for (let bin = 0; bin < spectrumBins.length; bin++) {
            let magnitude = 0;
            const binStart = start + bin * binStride;
            const binEnd = Math.min(binStart + binStride, end);

            for (let i = binStart; i < binEnd; i++) {
                magnitude += Math.abs(channel[i]);
            }

            magnitude /= Math.max(1, binEnd - binStart);
            spectrumBins[bin] += magnitude;
            weightedMagnitude += magnitude * (bin + 1);
            totalMagnitude += magnitude;
        }

        centroidFrames.push(totalMagnitude ? weightedMagnitude / totalMagnitude / spectrumBins.length : 0);
        if (rms > 0.015) activeFrames += 1;
    }

    const normalizedSpectrum = normalizeArray(spectrumBins);
    const loudness = clamp01(average(rmsFrames) * 5);
    const overallEnergy = clamp01(maxRms * 4);
    const silenceRatio = 1 - activeFrames / Math.max(1, rmsFrames.length);
    const beatFrames = findBeatFrames(rmsFrames);
    const beatTimes = beatFrames.map((frame) => (frame * hopSize) / sampleRate);
    const tempo = estimateTempo(beatTimes, duration);
    const beatIntensity = clamp01(beatFrames.length ? average(beatFrames.map((frame) => rmsFrames[frame] / (maxRms || 1))) : loudness);
    const rhythmComplexity = clamp01(calculateIntervalVariation(beatTimes));
    const spectralCentroid = clamp01(average(centroidFrames));
    const harmonicRichness = clamp01((1 - zeroCrossings / Math.max(1, rmsFrames.length)) * 1.6);
    const dynamicChanges = clamp01(calculateFrameDelta(rmsFrames) * 8);
    const pitchRange = clamp01((Math.max(...centroidFrames) - Math.min(...centroidFrames)) * 1.8);

    return {
        tempo,
        loudness,
        beatIntensity,
        rhythmComplexity,
        pitchRange,
        frequencySpectrum: normalizedSpectrum,
        spectralCentroid,
        harmonicRichness,
        dynamicChanges,
        silenceRatio: clamp01(silenceRatio),
        overallEnergy,
        beatTimes,
        duration,
        seed: createFeatureSeed([
            tempo,
            loudness,
            beatIntensity,
            rhythmComplexity,
            pitchRange,
            spectralCentroid,
            harmonicRichness,
            dynamicChanges,
            silenceRatio,
            overallEnergy,
            ...normalizedSpectrum,
        ]),
    };
};

export const createAudioFeaturesFromSnapshots = (snapshots: AudioSnapshot[], duration: number): AudioFeatures => {
    if (!snapshots.length) {
        return createFallbackAudioFeatures();
    }

    const volumes = snapshots.map((snapshot) => snapshot.volume / 255);
    const bassValues = snapshots.map((snapshot) => snapshot.bass / 255);
    const trebleValues = snapshots.map((snapshot) => snapshot.treble / 255);
    const pitchValues = snapshots.map((snapshot) => snapshot.pitch / 255);
    const spectrumSize = snapshots[0]?.frequencies.length || 32;
    const spectrum = new Array(spectrumSize).fill(0);

    snapshots.forEach((snapshot) => {
        snapshot.frequencies.forEach((value, index) => {
            spectrum[index] += value / 255;
        });
    });

    const normalizedSpectrum = normalizeArray(spectrum);
    const beatFrames = findBeatFrames(volumes);
    const beatTimes = beatFrames.map((index) => snapshots[index]?.time ?? 0);
    const tempo = estimateTempo(beatTimes, duration);
    const loudness = clamp01(average(volumes));
    const spectralCentroid = clamp01(weightedAverage(normalizedSpectrum));

    return {
        tempo,
        loudness,
        beatIntensity: clamp01(average(bassValues) + calculateFrameDelta(bassValues) * 2),
        rhythmComplexity: clamp01(calculateIntervalVariation(beatTimes)),
        pitchRange: clamp01(Math.max(...pitchValues) - Math.min(...pitchValues)),
        frequencySpectrum: normalizedSpectrum,
        spectralCentroid,
        harmonicRichness: clamp01(average(pitchValues) * 0.5 + average(trebleValues) * 0.7),
        dynamicChanges: clamp01(calculateFrameDelta(volumes) * 5),
        silenceRatio: clamp01(volumes.filter((value) => value < 0.04).length / volumes.length),
        overallEnergy: clamp01(average(volumes) * 0.65 + Math.max(...bassValues) * 0.35),
        beatTimes,
        duration,
        seed: createFeatureSeed([
            tempo,
            loudness,
            average(bassValues),
            average(trebleValues),
            spectralCentroid,
            ...normalizedSpectrum,
        ]),
    };
};

export const createFallbackAudioFeatures = (): AudioFeatures => ({
    tempo: 92,
    loudness: 0.45,
    beatIntensity: 0.38,
    rhythmComplexity: 0.35,
    pitchRange: 0.4,
    frequencySpectrum: new Array(32).fill(0).map((_, index) => 0.25 + ((index % 5) / 20)),
    spectralCentroid: 0.42,
    harmonicRichness: 0.45,
    dynamicChanges: 0.3,
    silenceRatio: 0.12,
    overallEnergy: 0.42,
    beatTimes: [],
    duration: 8,
    seed: 431,
});

const findBeatFrames = (frames: number[]): number[] => {
    if (frames.length < 3) return [];

    const avg = average(frames);
    const delta = calculateFrameDelta(frames);
    const threshold = avg + delta * 0.9;
    const beats: number[] = [];
    let lastBeat = -8;

    for (let i = 1; i < frames.length - 1; i++) {
        const isPeak = frames[i] > frames[i - 1] && frames[i] >= frames[i + 1];
        if (isPeak && frames[i] > threshold && i - lastBeat > 6) {
            beats.push(i);
            lastBeat = i;
        }
    }

    return beats;
};

const estimateTempo = (beatTimes: number[], duration: number): number => {
    if (beatTimes.length > 1) {
        const intervals = [];
        for (let i = 1; i < beatTimes.length; i++) {
            const interval = beatTimes[i] - beatTimes[i - 1];
            if (interval > 0.22 && interval < 2) intervals.push(interval);
        }

        if (intervals.length) {
            let bpm = 60 / average(intervals);
            while (bpm < 70) bpm *= 2;
            while (bpm > 180) bpm /= 2;
            return Math.round(bpm);
        }
    }

    return Math.round(clamp(60 + (beatTimes.length / Math.max(1, duration)) * 42, 60, 150));
};

const normalizeArray = (values: number[]): number[] => {
    const max = Math.max(...values, 0.0001);
    return values.map((value) => clamp01(value / max));
};

const calculateFrameDelta = (frames: number[]): number => {
    if (frames.length < 2) return 0;

    let totalDelta = 0;
    for (let i = 1; i < frames.length; i++) {
        totalDelta += Math.abs(frames[i] - frames[i - 1]);
    }

    return totalDelta / (frames.length - 1);
};

const calculateIntervalVariation = (beatTimes: number[]): number => {
    if (beatTimes.length < 3) return 0.2;

    const intervals = [];
    for (let i = 1; i < beatTimes.length; i++) {
        intervals.push(beatTimes[i] - beatTimes[i - 1]);
    }

    const avg = average(intervals);
    const variance = average(intervals.map((interval) => Math.abs(interval - avg)));
    return avg ? variance / avg : 0.2;
};

const average = (values: number[]): number => (
    values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0
);

const weightedAverage = (values: number[]): number => {
    const total = values.reduce((sum, value) => sum + value, 0);
    if (!total) return 0;

    return values.reduce((sum, value, index) => sum + value * (index + 1), 0) / total / values.length;
};

const createFeatureSeed = (values: number[]): number => (
    values.reduce((seed, value, index) => {
        const next = Math.round(value * 1000) + index * 97;
        return (seed * 31 + next) % 1000003;
    }, 17)
);

const clamp01 = (value: number): number => clamp(value, 0, 1);

const clamp = (value: number, min: number, max: number): number => Math.max(min, Math.min(max, value));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
