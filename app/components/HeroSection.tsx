// 📁 File: src/components/HeroSection.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Music, Palette, Download } from 'lucide-react';

interface HeroSectionProps {
    onStartClick: () => void;
}

/**
 * HeroSection component - landing page with project introduction and CTA
 */
export const HeroSection = ({ onStartClick }: HeroSectionProps) => {
    return (
        <section className="relative min-h-screen w-full overflow-hidden from-slate-950 via-slate-900 to-slate-800 dark:from-slate-950 dark:via-slate-900 dark:to-slate-800">
            {/* Animated background pattern */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-blue-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="text-center max-w-4xl"
                >
                    {/* Main Title */}
                    <motion.h1
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-950 dark:text-white mb-6 tracking-tight"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                    >
                        Echo<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-red-600 dark:from-amber-400 dark:to-red-600">Weave</span>
                    </motion.h1>

                    {/* Subtitle */}
                    <motion.p
                        className="text-xl sm:text-2xl text-gray-700 dark:text-gray-300 mb-8 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        Transform Sound into Living African Patterns
                    </motion.p>

                    {/* Description */}
                    <motion.p
                        className="text-lg text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        Experience the magic of sound-reactive textile patterns inspired by Kente, Adire, Aso Oke, and tribal designs. Speak, sing, or play music and watch as your voice transforms into beautiful, animated patterns.
                    </motion.p>

                    {/* Features */}
                    <motion.div
                        className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                            <Music className="w-8 h-8 text-amber-400" />
                            <span className="text-gray-900 dark:text-gray-300 font-semibold">Real-time Audio</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Live microphone or file upload</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                            <Palette className="w-8 h-8 text-amber-400" />
                            <span className="text-gray-900 dark:text-gray-300 font-semibold">Multiple Patterns</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Kente, Adire, Aso Oke & more</span>
                        </div>
                        <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white/80 dark:bg-white/5 border border-gray-200 dark:border-white/10 backdrop-blur-sm">
                            <Download className="w-8 h-8 text-amber-400" />
                            <span className="text-gray-900 dark:text-gray-300 font-semibold">Export Artwork</span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">Download as PNG or SVG</span>
                        </div>
                    </motion.div>

                    {/* CTA Button */}
                    <motion.button
                        onClick={onStartClick}
                        className="group relative inline-flex items-center gap-2 px-8 py-4 text-lg font-semibold text-gray-950 dark:text-white bg-white/90 dark:bg-transparent border border-gray-200 dark:border-transparent from-amber-500 to-red-600 rounded-lg hover:shadow-lg hover:shadow-amber-500/50 transition-all duration-300 transform hover:scale-105"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.5 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Start Creating
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </motion.button>
                </motion.div>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                >
                    <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                        <motion.div
                            className="w-1 h-2 bg-gray-400 rounded-full"
                            animate={{ y: [0, 8, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                    </div>
                </motion.div>
            </div>
        </section>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
