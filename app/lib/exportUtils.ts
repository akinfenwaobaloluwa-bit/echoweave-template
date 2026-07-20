// 📁 File: src/utils/exportUtils.ts
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/**
 * Export canvas as PNG image
 */
export const exportCanvasAsPNG = (
    canvas: HTMLCanvasElement,
    filename: string = `echoweave-pattern-${Date.now()}.png`
): void => {
    try {
        // Convert canvas to data URL
        const imageData = canvas.toDataURL('image/png');

        // Create download link
        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;

        // Trigger download
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to export PNG:', error);
        throw new Error('Failed to export PNG image');
    }
};

/**
 * Export canvas as SVG (embedded image)
 */
export const exportCanvasAsSVG = (
    canvas: HTMLCanvasElement,
    filename: string = `echoweave-pattern-${Date.now()}.svg`
): void => {
    try {
        const width = canvas.width;
        const height = canvas.height;
        const imageData = canvas.toDataURL('image/png');

        // Create SVG with embedded image
        const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <style>
      .pattern-image { image-rendering: pixelated; }
    </style>
  </defs>
  <rect width="${width}" height="${height}" fill="#0f172a"/>
  <image class="pattern-image" width="${width}" height="${height}" xlink:href="${imageData}" />
</svg>`;

        // Create blob and download
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        URL.revokeObjectURL(url);
    } catch (error) {
        console.error('Failed to export SVG:', error);
        throw new Error('Failed to export SVG image');
    }
};

/**
 * Export canvas as JPEG image
 */
export const exportCanvasAsJPEG = (
    canvas: HTMLCanvasElement,
    filename: string = `echoweave-pattern-${Date.now()}.jpg`,
    quality: number = 0.95
): void => {
    try {
        const imageData = canvas.toDataURL('image/jpeg', quality);

        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to export JPEG:', error);
        throw new Error('Failed to export JPEG image');
    }
};

/**
 * Copy canvas image to clipboard
 */
export const copyCanvasToClipboard = async (canvas: HTMLCanvasElement): Promise<void> => {
    try {
        canvas.toBlob(async (blob) => {
            if (!blob) throw new Error('Failed to create blob');

            const item = new ClipboardItem({ 'image/png': blob });
            await navigator.clipboard.write([item]);
        });
    } catch (error) {
        console.error('Failed to copy to clipboard:', error);
        throw new Error('Failed to copy image to clipboard');
    }
};

/**
 * Share canvas image (if supported)
 */
export const shareCanvasImage = async (
    canvas: HTMLCanvasElement,
    title: string = 'EchoWeave Pattern',
    text: string = 'Check out this beautiful pattern I created with EchoWeave!'
): Promise<void> => {
    try {
        if (!navigator.share) {
            throw new Error('Web Share API not supported');
        }

        canvas.toBlob(async (blob) => {
            if (!blob) throw new Error('Failed to create blob');

            const file = new File([blob], `echoweave-pattern-${Date.now()}.png`, { type: 'image/png' });

            await navigator.share({
                title,
                text,
                files: [file],
            });
        });
    } catch (error) {
        console.error('Failed to share image:', error);
        throw new Error('Failed to share image');
    }
};

/**
 * Generate a data URL from canvas
 */
export const getCanvasDataURL = (canvas: HTMLCanvasElement, type: string = 'image/png'): string => {
    return canvas.toDataURL(type);
};

/**
 * Download canvas as WebP (modern format)
 */
export const exportCanvasAsWebP = (
    canvas: HTMLCanvasElement,
    filename: string = `echoweave-pattern-${Date.now()}.webp`,
    quality: number = 0.95
): void => {
    try {
        const imageData = canvas.toDataURL('image/webp', quality);

        const link = document.createElement('a');
        link.href = imageData;
        link.download = filename;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Failed to export WebP:', error);
        throw new Error('Failed to export WebP image');
    }
};

/**
 * Create a thumbnail from canvas
 */
export const createThumbnail = (
    canvas: HTMLCanvasElement,
    width: number = 200,
    height: number = 200
): HTMLCanvasElement => {
    const thumbnail = document.createElement('canvas');
    thumbnail.width = width;
    thumbnail.height = height;

    const ctx = thumbnail.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, width, height);

    return thumbnail;
};

/**
 * Export multiple frames as animated GIF (requires gif.js library)
 * This is a placeholder - actual implementation would require gif.js
 */
export const exportAsAnimatedGIF = async (
    frames: HTMLCanvasElement[],
    filename: string = `echoweave-animation-${Date.now()}.gif`,
    delay: number = 100
): Promise<void> => {
    console.warn('Animated GIF export requires gif.js library');
    throw new Error('Animated GIF export not yet implemented');
};

/**
 * Get file size estimate
 */
export const estimateFileSize = (canvas: HTMLCanvasElement, format: string = 'image/png'): string => {
    const dataURL = canvas.toDataURL(format);
    const bytes = Math.ceil((dataURL.length - 'data:image/png;base64,'.length) * 0.75);

    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

/**
 * Create a composite image with metadata
 */
export const createCompositeWithMetadata = (
    canvas: HTMLCanvasElement,
    metadata: {
        patternType: string;
        palette: string;
        timestamp: string;
    }
): HTMLCanvasElement => {
    const composite = document.createElement('canvas');
    const padding = 40;
    composite.width = canvas.width + padding * 2;
    composite.height = canvas.height + padding * 2 + 60;

    const ctx = composite.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    // Background
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(0, 0, composite.width, composite.height);

    // Draw original canvas
    ctx.drawImage(canvas, padding, padding);

    // Draw metadata
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Inter, sans-serif';
    ctx.fillText(`Pattern: ${metadata.patternType}`, padding, canvas.height + padding + 30);
    ctx.fillText(`Palette: ${metadata.palette}`, padding, canvas.height + padding + 50);
    ctx.fillText(`Created: ${metadata.timestamp}`, canvas.width - 200, canvas.height + padding + 50);

    return composite;
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
