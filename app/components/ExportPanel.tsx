// 📁 File: src/components/ExportPanel.tsx
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

'use client';

import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useEchoStore } from '@/app/store/useEchoStore';
import { Download, FileImage, FileCode, Check } from 'lucide-react';

/**
 * ExportPanel component - handles PNG and SVG export of generated patterns
 */
export const ExportPanel = () => {
    const { setIsExporting } = useEchoStore();
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const [exportSuccess, setExportSuccess] = useState<string | null>(null);

    /**
     * Find the canvas element in the DOM
     */
    const getCanvas = (): HTMLCanvasElement | null => {
        return document.querySelector('canvas');
    };

    /**
     * Export pattern as PNG
     */
    const exportAsPNG = async () => {
        try {
            setIsExporting(true);
            const canvas = getCanvas();

            if (!canvas) {
                alert('Canvas not found. Please make sure a pattern is displayed.');
                return;
            }

            // Convert canvas to data URL
            const imageData = canvas.toDataURL('image/png');

            // Create download link
            const link = document.createElement('a');
            link.href = imageData;
            link.download = `echoweave-pattern-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setExportSuccess('PNG');
            setTimeout(() => setExportSuccess(null), 3000);
        } catch (error) {
            alert('Failed to export PNG. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    /**
     * Export pattern as SVG (simplified version)
     * For a full implementation, you would need to recreate the pattern as SVG
     */
    const exportAsSVG = async () => {
        try {
            setIsExporting(true);
            const canvas = getCanvas();

            if (!canvas) {
                alert('Canvas not found. Please make sure a pattern is displayed.');
                return;
            }

            // Get canvas dimensions
            const width = canvas.width;
            const height = canvas.height;

            // Create SVG with embedded image (canvas as data URL)
            const imageData = canvas.toDataURL('image/png');
            const svg = `
        <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <style>
              .pattern-image { image-rendering: pixelated; }
            </style>
          </defs>
          <image class="pattern-image" width="${width}" height="${height}" href="${imageData}" />
        </svg>
      `;

            // Create download link
            const blob = new Blob([svg], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `echoweave-pattern-${Date.now()}.svg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            setExportSuccess('SVG');
            setTimeout(() => setExportSuccess(null), 3000);
        } catch (error) {
            alert('Failed to export SVG. Please try again.');
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Export Artwork</h3>

            {/* Success message */}
            {exportSuccess && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300 text-sm flex items-center gap-2"
                >
                    <Check className="w-4 h-4" />
                    Downloaded as {exportSuccess}!
                </motion.div>
            )}

            {/* PNG Export Button */}
            <motion.button
                onClick={exportAsPNG}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-blue-500 hover:bg-blue-600 text-white transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={exportSuccess !== null}
            >
                <FileImage className="w-5 h-5" />
                Download PNG
            </motion.button>

            {/* SVG Export Button */}
            <motion.button
                onClick={exportAsSVG}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-semibold bg-purple-500 hover:bg-purple-600 text-white transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={exportSuccess !== null}
            >
                <FileCode className="w-5 h-5" />
                Download SVG
            </motion.button>

            {/* Export info */}
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-600 dark:text-gray-400">
                <p>
                    <strong>PNG:</strong> Best for sharing and social media
                </p>
                <p className="mt-1">
                    <strong>SVG:</strong> Scalable vector format for printing and design tools
                </p>
            </div>
        </div>
    );
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
