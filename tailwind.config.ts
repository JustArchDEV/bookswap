import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3b82f6',
        secondary: '#8b5cf6',
        destructive: '#ef4444',
        muted: '#6b7280',
        'muted-foreground': '#6b7280',
        ring: '#3b82f6',
        background: '#ffffff',
        foreground: '#000000',
        input: '#e5e7eb',
        accent: '#f3f4f6',
        'accent-foreground': '#000000',
      },
    },
  },
  plugins: [],
};

export default config;
