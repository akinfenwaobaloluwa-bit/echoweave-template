// 📁 File: src/components/AudioControls.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useEchoStore } from '@/app/store/useEchoStore';
import { Mic, Upload, Play, Pause, Volume2 } from 'lucide-react';

/**
 * AudioControls component - manages microphone and file upload for audio input
 */
export const AudioControls = () => {
  const { isRecording, setIsRecording, setAudioContext, setAnalyser, setAudioData } = useEchoStore();
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [error, setError] = useState<string | null>(null);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /**
   * Request microphone access and start audio analysis
   */
  const handleMicrophoneClick = async () => {
    try {
      setError(null);

      if (isRecording) {
        setIsRecording(false);
        return;
      }

      // Request microphone access
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      // Connect microphone to analyser
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      // Store in Zustand
      setAudioContext(audioContext);
      setAnalyser(analyser);
      setIsRecording(true);

      // Start analyzing audio
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const analyze = () => {
        analyser.getByteFrequencyData(dataArray);

        // Calculate frequency bands
        const bass = dataArray.slice(0, 4).reduce((a, b) => a + b) / 4;
        const mid = dataArray.slice(4, 16).reduce((a, b) => a + b) / 12;
        const treble = dataArray.slice(16, 32).reduce((a, b) => a + b) / 16;
        const volume = dataArray.reduce((a, b) => a + b) / dataArray.length;

        setAudioData({
          bass,
          treble,
          pitch: mid,
          volume,
          frequencies: dataArray,
        });

        if (isRecording) {
          requestAnimationFrame(analyze);
        }
      };

      analyze();
    } catch (err) {
      setError('Microphone access denied. Please allow microphone access in your browser settings.');
      setIsRecording(false);
    }
  };

  /**
   * Handle file upload
   */
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setError(null);
      setAudioFile(file);

      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;

      // Read file and decode
      const arrayBuffer = await file.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

      // Create audio element
      const url = URL.createObjectURL(file);
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.volume = volume / 100;
      }

      // Connect audio element to analyser
      const source = audioContext.createMediaElementSource(audioRef.current!);
      source.connect(analyser);
      analyser.connect(audioContext.destination);

      setAudioContext(audioContext);
      setAnalyser(analyser);

      // Start analyzing audio
      const dataArray = new Uint8Array(analyser.frequencyBinCount);
      const analyze = () => {
        analyser.getByteFrequencyData(dataArray);

        const bass = dataArray.slice(0, 4).reduce((a, b) => a + b) / 4;
        const mid = dataArray.slice(4, 16).reduce((a, b) => a + b) / 12;
        const treble = dataArray.slice(16, 32).reduce((a, b) => a + b) / 16;
        const vol = dataArray.reduce((a, b) => a + b) / dataArray.length;

        setAudioData({
          bass,
          treble,
          pitch: mid,
          volume: vol,
          frequencies: dataArray,
        });

        requestAnimationFrame(analyze);
      };

      analyze();
    } catch (err) {
      setError('Failed to load audio file. Please try another file.');
    }
  };

  /**
   * Toggle audio playback
   */
  const togglePlayback = () => {
    if (!audioRef.current) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Handle volume change
   */
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

      {/* Error message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-lg bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 text-sm"
        >
          {error}
        </motion.div>
      )}

      {/* Microphone button */}
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
        {isRecording ? 'Stop Microphone' : 'Use Microphone'}
      </motion.button>

      {/* File upload */}
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
        >
          <Upload className="w-5 h-5" />
          Upload Audio File
        </motion.button>
      </div>

      {/* Audio player controls (shown when file is uploaded) */}
      {audioFile && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-3 p-4 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
        >
          <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
            {audioFile.name}
          </div>

          {/* Play/Pause button */}
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

          {/* Volume control */}
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

          {/* Hidden audio element */}
          <audio ref={audioRef} onEnded={() => setIsPlaying(false)} />
        </motion.div>
      )}
    </div>
  );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
