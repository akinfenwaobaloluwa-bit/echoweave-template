// 📁 File: src/components/PaletteSelector.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { motion } from 'framer-motion';
import { useEchoStore } from '@/app/store/useEchoStore';
import { getAllPalettes } from '@/app/lib/palettes';
import { Check } from 'lucide-react';

/**
 * PaletteSelector component - allows users to select color themes
 */
export const PaletteSelector = () => {
    const { palette, setPalette } = useEchoStore();
    const palettes = getAllPalettes();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Color Palette</h3>

            <div className="grid grid-cols-1 gap-3">
                {palettes.map((pal) => (
                    <motion.button
                        key={pal.id}
                        onClick={() => setPalette(pal.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 ${palette === pal.id
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex-1">
                                <h4 className="font-semibold text-gray-900 dark:text-white">{pal.name}</h4>

                                {/* Color swatches */}
                                <div className="flex gap-2 mt-2">
                                    <div
                                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                                        style={{ backgroundColor: pal.primary }}
                                        title="Primary"
                                    />
                                    <div
                                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                                        style={{ backgroundColor: pal.secondary }}
                                        title="Secondary"
                                    />
                                    <div
                                        className="w-8 h-8 rounded border border-gray-300 dark:border-gray-600"
                                        style={{ backgroundColor: pal.accent }}
                                        title="Accent"
                                    />
                                </div>
                            </div>

                            {palette === pal.id && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute top-2 right-2"
                                >
                                    <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center">
                                        <Check className="w-4 h-4 text-white" />
                                    </div>
                                </motion.div>
                            )}
                        </div>
                    </motion.button>
                ))}
            </div>
        </div>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
