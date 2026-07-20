// 📁 File: tailwind.config.js
// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: 'class',
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            colors: {
                // EchoWeave custom colors
                'adire-indigo': '#1e3a8a',
                'kente-gold': '#d97706',
                'ankara-red': '#dc2626',
                'tribal-earth': '#92400e',
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
            animation: {
                blob: 'blob 7s infinite',
            },
            keyframes: {
                blob: {
                    '0%, 100%': {
                        transform: 'translate(0, 0) scale(1)',
                    },
                    '33%': {
                        transform: 'translate(30px, -50px) scale(1.1)',
                    },
                    '66%': {
                        transform: 'translate(-20px, 20px) scale(0.9)',
                    },
                },
            },
            boxShadow: {
                'glow-amber': '0 0 20px rgba(217, 119, 6, 0.5)',
                'glow-red': '0 0 20px rgba(220, 38, 38, 0.5)',
            },
        },
    },
    plugins: [],
};

// ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
