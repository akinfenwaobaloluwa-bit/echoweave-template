// 📁 File: src/components/Navbar.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

/**
 * Navbar component - displays the application header with logo and theme toggle
 */
export const Navbar = () => {
    const [isDark, setIsDark] = useState<boolean | null>(null);
    const [mounted, setMounted] = useState(false);

    // Initialize dark mode from localStorage and system preference
    useEffect(() => {
        setMounted(true);

        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        const shouldBeDark = savedTheme ? savedTheme === 'dark' : prefersDark;

        setIsDark(shouldBeDark);

        // Apply theme to document
        if (shouldBeDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, []);

    /**
     * Toggle dark mode and save preference
     */
    const toggleTheme = () => {
        if (isDark === null) return;

        const newIsDark = !isDark;
        setIsDark(newIsDark);
        localStorage.setItem('theme', newIsDark ? 'dark' : 'light');

        // Apply theme to document
        if (newIsDark) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    };

    // Prevent hydration mismatch by not rendering until mounted
    if (!mounted || isDark === null) {
        return (
            <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo and Brand */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg from-amber-500 to-red-600 flex items-center justify-center">
                                <span className="text-white font-bold text-lg">E</span>
                            </div>
                            <div className="flex flex-col">
                                <h1 className="text-xl font-bold text-gray-900 dark:text-white">EchoWeave</h1>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Sound to Patterns</p>
                            </div>
                        </div>

                        {/* Placeholder for theme toggle */}
                        <div className="p-2 rounded-lg w-9 h-9" />
                    </div>
                </div>
            </nav>
        );
    }

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-slate-950 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and Brand */}
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg from-amber-500 to-red-600 flex items-center justify-center">
                            <span className="text-white font-bold text-lg">E</span>
                        </div>
                        <div className="flex flex-col">
                            <h1 className="text-xl font-bold text-gray-900 dark:text-white">EchoWeave</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Sound to Patterns</p>
                        </div>
                    </div>

                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                        aria-label="Toggle dark mode"
                        title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                    >
                        {isDark ? (
                            <Sun className="w-5 h-5 text-yellow-400" />
                        ) : (
                            <Moon className="w-5 h-5 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>
        </nav>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
