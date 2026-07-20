// 📁 File: src/store/useEchoStore.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

import { create } from 'zustand';

/**
 * Audio data interface representing frequency analysis results
 */
export interface AudioData {
    volume: number;
    bass: number;
    treble: number;
    pitch: number;
    frequencies: Uint8Array | null;
}

/**
 * Main application state interface
 */
export interface EchoStoreState {
    // Pattern and palette state
    patternType: 'kente' | 'adire' | 'aso-oke' | 'tribal';
    palette: 'adire-indigo' | 'kente-gold' | 'ankara-vibrant' | 'sunset-earth' | 'neon-pulse';

    // Audio state
    audioData: AudioData;
    isRecording: boolean;
    audioContext: AudioContext | null;
    analyser: AnalyserNode | null;

    // UI state
    showWorkspace: boolean;
    isExporting: boolean;

    // Actions
    setPatternType: (type: 'kente' | 'adire' | 'aso-oke' | 'tribal') => void;
    setPalette: (palette: 'adire-indigo' | 'kente-gold' | 'ankara-vibrant' | 'sunset-earth' | 'neon-pulse') => void;
    setAudioData: (data: Partial<AudioData>) => void;
    setIsRecording: (recording: boolean) => void;
    setAudioContext: (context: AudioContext | null) => void;
    setAnalyser: (analyser: AnalyserNode | null) => void;
    setShowWorkspace: (show: boolean) => void;
    setIsExporting: (exporting: boolean) => void;
    resetAudioData: () => void;
}

/**
 * Zustand store for managing EchoWeave application state
 * Provides centralized state management for pattern, palette, and audio data
 */
export const useEchoStore = create<EchoStoreState>((set) => ({
    // Initial state
    patternType: 'adire',
    palette: 'adire-indigo',
    audioData: {
        volume: 0,
        bass: 0,
        treble: 0,
        pitch: 0,
        frequencies: null,
    },
    isRecording: false,
    audioContext: null,
    analyser: null,
    showWorkspace: false,
    isExporting: false,

    // Action: Set pattern type
    setPatternType: (type) => set({ patternType: type }),

    // Action: Set color palette
    setPalette: (palette) => set({ palette }),

    // Action: Update audio data (merges with existing data)
    setAudioData: (data) =>
        set((state) => ({
            audioData: {
                ...state.audioData,
                ...data,
            },
        })),

    // Action: Set recording state
    setIsRecording: (recording) => set({ isRecording: recording }),

    // Action: Set audio context
    setAudioContext: (context) => set({ audioContext: context }),

    // Action: Set analyser node
    setAnalyser: (analyser) => set({ analyser }),

    // Action: Toggle workspace visibility
    setShowWorkspace: (show) => set({ showWorkspace: show }),

    // Action: Set export state
    setIsExporting: (exporting) => set({ isExporting: exporting }),

    // Action: Reset audio data to initial state
    resetAudioData: () =>
        set({
            audioData: {
                volume: 0,
                bass: 0,
                treble: 0,
                pitch: 0,
                frequencies: null,
            },
        }),
}));

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
