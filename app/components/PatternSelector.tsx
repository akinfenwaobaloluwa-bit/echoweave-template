// 📁 File: src/components/PatternSelector.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { motion } from 'framer-motion';
import { useEchoStore } from '@/app/store/useEchoStore';
import { Check } from 'lucide-react';

interface PatternOption {
    id: 'kente' | 'adire' | 'aso-oke' | 'tribal';
    name: string;
    description: string;
    icon: string;
}

const patterns: PatternOption[] = [
    {
        id: 'kente',
        name: 'Kente',
        description: 'Repeating block patterns from Ghana',
        icon: '⬜',
    },
    {
        id: 'adire',
        name: 'Adire',
        description: 'Circular motifs from Nigeria',
        icon: '●',
    },
    {
        id: 'aso-oke',
        name: 'Aso Oke',
        description: 'Parallel stripes from Yoruba',
        icon: '▮',
    },
    {
        id: 'tribal',
        name: 'Tribal',
        description: 'Diamond geometric patterns',
        icon: '◇',
    },
];

/**
 * PatternSelector component - allows users to select textile pattern type
 */
export const PatternSelector = () => {
    const { patternType, setPatternType } = useEchoStore();

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Pattern Type</h3>

            <div className="grid grid-cols-1 gap-3">
                {patterns.map((pattern) => (
                    <motion.button
                        key={pattern.id}
                        onClick={() => setPatternType(pattern.id)}
                        className={`relative p-4 rounded-lg border-2 transition-all duration-200 text-left ${patternType === pattern.id
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/30'
                                : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-slate-800 hover:border-amber-300 dark:hover:border-amber-700'
                            }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{pattern.icon}</span>
                                    <h4 className="font-semibold text-gray-900 dark:text-white">{pattern.name}</h4>
                                </div>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{pattern.description}</p>
                            </div>

                            {patternType === pattern.id && (
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
