'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useEchoStore } from '@/app/store/useEchoStore';
import { analyzeAudioBuffer, createAudioFeaturesFromSnapshots } from '@/app/lib/audioUtils';
import { Mic, Upload, Play, Pause, Volume2 } from 'lucide-react';

interface RecordingSnapshot {
  volume: number;
  bass: number;
  treble: number;
  pitch: number;
  time: number;
  frequencies: number[];
}

export const AudioControls = () => {
  const {
    isRecording,
    isAnalyzingAudio,
    setIsRecording,
    setIsAnalyzingAudio,
    setAudioContext,
    setAnalyser,
    setAudioData,
    setAudioFeatures,
  } = useEchoStore();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [error, setError] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const animationRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordingStartedAtRef = useRef(0);
  const recordingSnapshotsRef = useRef<RecordingSnapshot[]>([]);

  const stopRecording = () => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
      animationRef.current = null;
    }

    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;

    const duration = (performance.now() - recordingStartedAtRef.current) / 1000;
    const features = createAudioFeaturesFromSnapshots(recordingSnapshotsRef.current, duration);

    setAudioFeatures(features);
    setIsRecording(false);
    setAnalyser(null);
    setAudioContext(null);
  };

  const handleMicrophoneClick = async () => {
    try {
      setError(null);

      if (isRecording) {
        stopRecording();
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 512;
      analyser.smoothingTimeConstant = 0.7;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      streamRef.current = stream;
      recordingStartedAtRef.current = performance.now();
      recordingSnapshotsRef.current = [];

      setAudioContext(audioContext);
      setAnalyser(analyser);
      setAudioFeatures(null);
      setIsRecording(true);

      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const analyzeLiveFrame = () => {
        analyser.getByteFrequencyData(dataArray);

        const bass = averageBytes(dataArray, 0, 8);
        const pitch = averageBytes(dataArray, 8, 40);
        const treble = averageBytes(dataArray, 40, dataArray.length);
        const currentVolume = averageBytes(dataArray, 0, dataArray.length);
        const elapsed = (performance.now() - recordingStartedAtRef.current) / 1000;
        const compactSpectrum = compactFrequencies(dataArray, 32);

        setAudioData({
          bass,
          treble,
          pitch,
          volume: currentVolume,
          frequencies: new Uint8Array(dataArray),
        });

        recordingSnapshotsRef.current.push({
          bass,
          treble,
          pitch,
          volume: currentVolume,
          time: elapsed,
          frequencies: compactSpectrum,
        });

        animationRef.current = requestAnimationFrame(analyzeLiveFrame);
      };

      analyzeLiveFrame();
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      setIsRecording(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setAudioFile(file);
      setIsAnalyzingAudio(true);
      setAudioFeatures(null);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0));
      const features = analyzeAudioBuffer(audioBuffer);
      const spectrum = Uint8Array.from(features.frequencySpectrum.map((value) => Math.round(value * 255)));

      setAudioFeatures(features);
      setAudioData({
        volume: features.loudness * 255,
        bass: (features.frequencySpectrum.slice(0, 6).reduce((sum, value) => sum + value, 0) / 6) * 255,
        treble: (features.frequencySpectrum.slice(-8).reduce((sum, value) => sum + value, 0) / 8) * 255,
        pitch: features.spectralCentroid * 255,
        frequencies: spectrum,
      });

      await audioContext.close();
      setAudioContext(null);
      setAnalyser(null);

      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        if (audioRef.current.src) URL.revokeObjectURL(audioRef.current.src);
        audioRef.current.src = url;
        audioRef.current.volume = volume / 100;
      }
    } catch (err) {
      setError('Failed to analyze audio file. Please try another file.');
    } finally {
      setIsAnalyzingAudio(false);
    }
  };

  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume / 100;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Audio Input</h3>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.button
        onClick={handleMicrophoneClick}
        className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold transition-all duration-200 ${
          isRecording
            ? 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/50'
            : 'bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700'
        }`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
      >
        <Mic className={`w-5 h-5 ${isRecording ? 'animate-pulse' : ''}`} />
        {isRecording ? 'Stop & Analyze Recording' : 'Use Microphone'}
      </motion.button>

      <div>
        <input
          ref={fileInputRef}
          type="file"
          accept="audio/*"
          onChange={handleFileUpload}
          className="hidden"
        />
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-gray-100 dark:bg-slate-800 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-slate-700 transition-all duration-200"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={isAnalyzingAudio}
        >
          <Upload className="w-5 h-5" />
          {isAnalyzingAudio ? 'Analyzing Audio...' : 'Upload Audio File'}
        </motion.button>
      </div>

      {audioFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {audioFile.name}
          </div>

          <motion.button
            onClick={togglePlayback}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-semibold transition-all duration-200"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                Play
              </>
            )}
          </motion.button>

          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4 text-gray-600 dark:text-gray-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={handleVolumeChange}
              className="flex-1 h-2 bg-gray-300 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
            />
            <span className="text-sm text-gray-600 dark:text-gray-400 w-8 text-right">{volume}%</span>
          </div>

          <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </motion.div>
      )}
    </div>
  );
};

const averageBytes = (array: Uint8Array, start: number, end: number): number => {
  let total = 0;
  const safeEnd = Math.min(array.length, end);

  for (let i = start; i < safeEnd; i++) {
    total += array[i];
  }

  return total / Math.max(1, safeEnd - start);
};

const compactFrequencies = (array: Uint8Array, bins: number): number[] => {
  const result: number[] = [];
  const stride = Math.max(1, Math.floor(array.length / bins));

  for (let bin = 0; bin < bins; bin++) {
    result.push(averageBytes(array, bin * stride, (bin + 1) * stride));
  }

  return result;
};
