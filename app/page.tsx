// 📁 File: src/app/page.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Navbar } from '@/app/components/navbar';
import { HeroSection } from '@/app/components/HeroSection';
import { PatternCanvas } from '@/app/components/PatternCanvas';
import { PatternSelector } from '@/app/components/PatternSelector';
import { PaletteSelector } from '@/app/components/PaletteSelector';
import { AudioControls } from '@/app/components/AudioControls';
import { ExportPanel } from '@/app/components/ExportPanel';

/**
 * Main page component - orchestrates the entire EchoWeave application
 */
export default function Home() {
  const [showWorkspace, setShowWorkspace] = useState(false);

  const handleStartCreating = () => {
    setShowWorkspace(true);
  };

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
      <Navbar />

      {/* Show hero section or workspace based on state */}
      {!showWorkspace ? (
        <HeroSection onStartClick={handleStartCreating} />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4 sm:p-6 lg:p-8"
        >
          <div className="max-w-7xl mx-auto">
            {/* Workspace header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Create Your Pattern</h2>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Select a pattern type, choose colors, and use your microphone or upload audio to see the magic happen
              </p>
            </div>

            {/* Main workspace grid */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              {/* Left Panel - Pattern & Palette Selection */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-1 space-y-6"
              >
                {/* Pattern Selector Card */}
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-gray-700">
                  <PatternSelector />
                </div>

                {/* Palette Selector Card */}
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-gray-700">
                  <PaletteSelector />
                </div>
              </motion.div>

              {/* Center Panel - Pattern Canvas */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-2"
              >
                <div className="h-96 lg:h-full min-h-96 rounded-lg overflow-hidden shadow-lg">
                  <PatternCanvas />
                </div>
              </motion.div>

              {/* Right Panel - Audio Controls & Export */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-1 space-y-6"
              >
                {/* Audio Controls Card */}
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-gray-700">
                  <AudioControls />
                </div>

                {/* Export Panel Card */}
                <div className="p-6 rounded-lg bg-white dark:bg-slate-800 shadow-md border border-gray-200 dark:border-gray-700">
                  <ExportPanel />
                </div>

                {/* Info Card */}
                <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-300 mb-2">💡 Tip</h4>
                  <p className="text-sm text-blue-800 dark:text-blue-400">
                    Try speaking, singing, or playing music to see the patterns react in real-time!
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Back to Home Button */}
            <motion.button
              onClick={() => setShowWorkspace(false)}
              className="mt-8 px-6 py-2 rounded-lg bg-gray-200 dark:bg-slate-700 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors duration-200 font-semibold"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              ← Back to Home
            </motion.button>
          </div>
        </motion.div>
      )}
    </main>
  );
}

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
